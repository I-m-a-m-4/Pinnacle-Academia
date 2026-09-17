'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAcademy } from '@/context/academy-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Loader2, Plus, Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { MockExamEvent } from '@/types';
import { useUser } from '@/firebase';

export default function MockExamsPage() {
  const { academy } = useAcademy();
  const { user } = useUser();
  const [exams, setExams] = useState<MockExamEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!academy) return;

    const q = query(
      collection(db, 'academies', academy.id, 'mockExams'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const examsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MockExamEvent[];
      setExams(examsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [academy]);

  const handleCreateMockExam = async () => {
    if (!academy || !user) return;
    setCreating(true);
    try {
      // Create a default event
      const defaultStartTime = new Date();
      defaultStartTime.setHours(8, 0, 0, 0);
      defaultStartTime.setDate(defaultStartTime.getDate() + 1); // Tomorrow at 8 AM

      await addDoc(collection(db, 'academies', academy.id, 'mockExams'), {
        academyId: academy.id,
        title: 'Final Mock CBT Exam',
        startTime: defaultStartTime.getTime(),
        durationMinutes: 60,
        status: 'pending',
        subjects: [],
        bannedEmails: [],
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });
    } catch (error) {
      console.error("Error creating mock exam:", error);
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mock Exams</h1>
          <p className="text-muted-foreground">Host specialized scheduled mock exams.</p>
        </div>
        <Button onClick={handleCreateMockExam} disabled={creating}>
          {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Create New Event
        </Button>
      </div>

      {exams.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Mock Exams yet</h3>
            <p className="text-muted-foreground mb-4">Create your first mock exam event to get started.</p>
            <Button onClick={handleCreateMockExam} disabled={creating}>
              Create Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exams.map(exam => (
            <Card key={exam.id} className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    exam.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    exam.status === 'completed' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {exam.status.toUpperCase()}
                  </span>
                </div>
                <CardTitle>{exam.title}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(exam.startTime).toLocaleDateString()}
                  <Clock className="h-3 w-3 ml-2" />
                  {new Date(exam.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center justify-between">
                    <span>Duration:</span>
                    <span className="font-medium text-foreground">{exam.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Subjects:</span>
                    <span className="font-medium text-foreground">{exam.subjects?.length || 0}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin-sheun/mock-exams/${exam.id}`} className="flex-1">
                    <Button variant="default" className="w-full">Manage Event</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
