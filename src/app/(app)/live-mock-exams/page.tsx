'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAcademy } from '@/context/academy-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { MockExamEvent } from '@/types';

export default function LiveMockExamsPage() {
  const { academy } = useAcademy();
  const [exams, setExams] = useState<MockExamEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!academy) return;

    // Get all mock exams to avoid missing index errors, filter in memory
    const q = query(collection(db, 'academies', academy.id, 'mockExams'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let examsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MockExamEvent[];
      
      // Filter for pending or active
      examsData = examsData.filter(exam => exam.status === 'pending' || exam.status === 'active' || !exam.status);

      
      // Sort by startTime descending in memory (Firestore requires composite index for where + orderBy)
      examsData.sort((a, b) => b.startTime - a.startTime);
      
      setExams(examsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [academy]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8 mt-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Mock Contests</h1>
        <p className="text-muted-foreground">Join scheduled live CBT exams and compete with peers.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : exams.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No active mock exams</h3>
            <p className="text-muted-foreground">Check back later for scheduled contests.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map(exam => (
            <Card key={exam.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{exam.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Clock className="h-4 w-4" />
                  {new Date(exam.startTime).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <div className="mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    exam.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {exam.status === 'active' ? 'Active Now' : 'Starts Soon'}
                  </span>
                </div>
                <Button asChild className="w-full">
                  <Link href={`/mock-exam/${exam.id}`}>
                    Join Exam <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
