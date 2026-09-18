'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAcademy } from '@/context/academy-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, AlertCircle, Clock } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { MockExamEvent } from '@/types';
import { toast } from '@/components/ui/use-toast';

export default function MockExamLandingPage() {
  const { academy } = useAcademy();
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [exam, setExam] = useState<MockExamEvent | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!academy || !eventId) return;

    const unsubscribe = onSnapshot(doc(db, 'academies', academy.id, 'mockExams', eventId), (snapshot) => {
      if (snapshot.exists()) {
        const data = { id: snapshot.id, ...snapshot.data() } as MockExamEvent;
        setExam(data);
      } else {
        toast({ title: 'Error', description: 'Exam not found', variant: 'destructive' });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [academy, eventId]);

  useEffect(() => {
    if (!exam || exam.status !== 'pending') return;
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = exam.startTime - now;

      if (distance < 0) {
        setTimeLeft('Starting soon...');
        clearInterval(interval);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [exam]);

  const handleStart = () => {
    if (!studentName.trim() || !studentEmail.trim()) {
      toast({ title: 'Required', description: 'Please enter your name and email.', variant: 'destructive' });
      return;
    }

    if (exam?.bannedEmails?.includes(studentEmail.trim())) {
      toast({ title: 'Access Denied', description: 'You are not permitted to take this exam.', variant: 'destructive' });
      return;
    }

    // Save student details to sessionStorage for the /take page
    sessionStorage.setItem(`mock_exam_${eventId}_student`, JSON.stringify({ name: studentName, email: studentEmail }));
    router.push(`/mock-exam/${eventId}/take`);
  };

  if (loading) {
    return <div className="flex justify-center py-32"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  if (!exam) {
    return <div className="text-center py-32 text-xl font-semibold">Exam not found or invalid link.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-muted/30">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold">{exam.title}</CardTitle>
          <CardDescription>Pinnacle Academia CBT Center</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          
          {exam.status === 'completed' && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-center justify-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">This exam has concluded.</span>
            </div>
          )}

          {exam.status === 'pending' && (
            <div className="bg-blue-50 text-blue-800 p-6 rounded-md flex flex-col items-center justify-center text-center">
              <Clock className="h-8 w-8 mb-2 opacity-80" />
              <h3 className="font-semibold text-lg mb-1">Exam starts in</h3>
              <p className="text-3xl font-bold tabular-nums tracking-tighter">{timeLeft || 'Loading...'}</p>
              <p className="text-sm mt-2 opacity-80">Please wait on this page.</p>
            </div>
          )}

          {exam.status === 'active' && (
            <>
              <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-md text-sm text-center font-medium">
                The exam is currently active.
              </div>
              <div className="space-y-4 mt-4 text-left">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    placeholder="Enter your full name" 
                    value={studentName} 
                    onChange={e => setStudentName(e.target.value)} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address / Registration Number</Label>
                  <Input 
                    placeholder="e.g. student@example.com" 
                    value={studentEmail} 
                    onChange={e => setStudentEmail(e.target.value)} 
                  />
                </div>
                <div className="space-y-2 pb-4">
                  <Label>Exam Category</Label>
                  <div className="flex gap-4">
                    {['Art', 'Science', 'Commercial'].map((cat) => (
                      <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="radio" 
                          name="category" 
                          value={cat} 
                          className="h-4 w-4 text-primary"
                          onChange={(e) => sessionStorage.setItem(`mock_exam_${eventId}_category`, e.target.value)}
                        />
                        <span className="text-sm">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button className="w-full text-lg h-12" onClick={() => {
                  if (!sessionStorage.getItem(`mock_exam_${eventId}_category`)) {
                    toast({ title: 'Category Required', description: 'Please select an exam category.', variant: 'destructive' });
                    return;
                  }
                  handleStart();
                }}>
                  Start Exam
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  By starting, you agree to strict monitoring. Do not leave the browser tab.
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
