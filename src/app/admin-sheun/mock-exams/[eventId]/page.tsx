'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAcademy } from '@/context/academy-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Save, Trash2, Plus, Ban } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MockExamEvent, MockExamSubject, MockExamQuestion } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function ManageMockExamPage() {
  const { academy } = useAcademy();
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [exam, setExam] = useState<MockExamEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [startTimeStr, setStartTimeStr] = useState('');
  const [duration, setDuration] = useState(60);
  const [status, setStatus] = useState<'pending' | 'active' | 'completed'>('pending');
  const [showResults, setShowResults] = useState(false);
  const [banEmail, setBanEmail] = useState('');

  useEffect(() => {
    if (!academy || !eventId) return;

    const unsubscribe = onSnapshot(doc(db, 'academies', academy.id, 'mockExams', eventId), (snapshot) => {
      if (snapshot.exists()) {
        const data = { id: snapshot.id, ...snapshot.data() } as MockExamEvent;
        setExam(data);
        setTitle(data.title || '');
        setDuration(data.durationMinutes || 60);
        setStatus(data.status || 'pending');
        setShowResults(data.showResults || false);
        
        // Format for datetime-local input
        if (data.startTime) {
          const date = new Date(data.startTime);
          // adjust for local timezone offset for input
          const offset = date.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0,16);
          setStartTimeStr(localISOTime);
        }
      } else {
        toast({ title: 'Error', description: 'Exam not found', variant: 'destructive' });
        router.push('/admin-sheun/mock-exams');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [academy, eventId, router]);

  const handleSave = async () => {
    if (!academy || !exam) return;
    setSaving(true);
    try {
      const newStartTime = new Date(startTimeStr).getTime();
      await updateDoc(doc(db, 'academies', academy.id, 'mockExams', exam.id), {
        title,
        startTime: newStartTime,
        durationMinutes: duration,
        status,
        showResults,
      });
      toast({ title: 'Success', description: 'Exam updated successfully.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to update exam.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleBanEmail = async () => {
    if (!academy || !exam || !banEmail.trim()) return;
    try {
      const newBanned = [...(exam.bannedEmails || []), banEmail.trim()];
      await updateDoc(doc(db, 'academies', academy.id, 'mockExams', exam.id), {
        bannedEmails: newBanned
      });
      setBanEmail('');
      toast({ title: 'Success', description: `Banned ${banEmail.trim()}` });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveBan = async (emailToRemove: string) => {
    if (!academy || !exam) return;
    try {
      const newBanned = exam.bannedEmails.filter(email => email !== emailToRemove);
      await updateDoc(doc(db, 'academies', academy.id, 'mockExams', exam.id), {
        bannedEmails: newBanned
      });
      toast({ title: 'Success', description: `Unbanned ${emailToRemove}` });
    } catch (error) {
      console.error(error);
    }
  };

  const seed1030MockQuestions = async () => {
     if (!academy || !exam) return;
     try {
       const { aptitudeQuestions } = await import('@/app/(app)/cbt-simulator/data/aptitude');
       const { mathematicsQuestions } = await import('@/app/(app)/cbt-simulator/data/mathematics');
       const { physicsQuestions } = await import('@/app/(app)/cbt-simulator/data/physics');
       const { chemistryQuestions } = await import('@/app/(app)/cbt-simulator/data/chemistry');

       const questionsData = [
         {
           id: 'aptitude',
           name: 'Aptitude Test',
           questions: aptitudeQuestions.slice(0, 10)
         },
         {
           id: 'maths',
           name: 'Mathematics',
           questions: mathematicsQuestions.slice(0, 10)
         },
         {
           id: 'physics',
           name: 'Physics',
           questions: physicsQuestions.slice(0, 10)
         },
         {
           id: 'chemistry',
           name: 'Chemistry',
           questions: chemistryQuestions.slice(0, 10)
         }
       ];

       await updateDoc(doc(db, 'academies', academy.id, 'mockExams', exam.id), {
          subjects: questionsData
       });
       toast({ title: 'Success', description: 'OAU Engineering Mock Questions Seeded!' });
     } catch(e) {
       console.error(e);
     }
  };


  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!exam) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin-sheun/mock-exams">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Manage Event: {exam.title}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Event Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Input type="datetime-local" value={startTimeStr} onChange={e => setStartTimeStr(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Duration (Minutes)</Label>
              <Input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={status} 
                onChange={e => setStatus(e.target.value as any)}
              >
                <option value="pending">Pending (Not Started)</option>
                <option value="active">Active (Running)</option>
                <option value="completed">Completed (Closed)</option>
              </select>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label className="text-base">Release Results</Label>
                <p className="text-sm text-muted-foreground">
                  Allow students to view their scores after submitting.
                </p>
              </div>
              <input 
                type="checkbox" 
                checked={showResults} 
                onChange={(e) => setShowResults(e.target.checked)} 
                className="h-5 w-5" 
              />
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full mt-4">
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Settings
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Link</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Share this direct link with your students for this specific exam event. It is hidden from the main site.
              </p>
              <div className="flex gap-2">
                <Input readOnly value={`https://pinnacleacademia.com/mock-exam/${exam.id}`} className="bg-muted" />
                <Button variant="secondary" onClick={() => {
                  navigator.clipboard.writeText(`https://pinnacleacademia.com/mock-exam/${exam.id}`);
                  toast({ title: 'Copied!' });
                }}>Copy</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Control (Banned Users)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input placeholder="student@example.com" value={banEmail} onChange={e => setBanEmail(e.target.value)} />
                <Button variant="destructive" onClick={handleBanEmail}>
                  <Ban className="h-4 w-4 mr-2" /> Ban
                </Button>
              </div>
              
              {exam.bannedEmails?.length > 0 ? (
                <ul className="space-y-2">
                  {exam.bannedEmails.map(email => (
                    <li key={email} className="flex justify-between items-center text-sm p-2 bg-muted rounded-md">
                      <span>{email}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveBan(email)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No banned users.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Exam Subjects & Questions</CardTitle>
          <Button variant="outline" onClick={seed1030MockQuestions}>Seed 10:30 AM Mock Questions (Quick Load)</Button>
        </CardHeader>
        <CardContent>
          {exam.subjects?.length > 0 ? (
            <div className="space-y-4">
              {exam.subjects.map(subject => (
                <div key={subject.id} className="border p-4 rounded-md">
                  <h3 className="font-semibold text-lg">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground">{subject.questions.length} Questions</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-8 text-center border rounded-md border-dashed">
              No subjects added yet. Click "Seed 10:30 AM Mock Questions" to add the provided questions.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
