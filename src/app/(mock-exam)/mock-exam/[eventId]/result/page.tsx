'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Trophy, ArrowRight, BarChart } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { MockExamSubmission } from '@/types';
import Link from 'next/link';
import Confetti from '@/components/shared/confetti';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAcademy } from '@/context/academy-context';

export default function MockExamResultPage() {
  const { academy } = useAcademy();
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [result, setResult] = useState<MockExamSubmission | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId || !academy) return;

    const fetchResult = async () => {
      const resultStr = sessionStorage.getItem(`mock_exam_${eventId}_result`);
      if (!resultStr) {
        router.replace(`/mock-exam/${eventId}`);
        return;
      }
      setResult(JSON.parse(resultStr));

      try {
        const examSnap = await getDoc(doc(db, 'academies', academy.id, 'mockExams', eventId));
        if (examSnap.exists()) {
          setShowResults(examSnap.data().showResults === true);
        }
      } catch(e) {
        console.error(e);
      }

      setLoading(false);
    };

    fetchResult();
  }, [eventId, academy, router]);


  if (loading) return null;
  if (!result) return null;

  const percentage = Math.round((result.totalScore / (result.totalQuestions || 1)) * 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-muted/30 pb-20">
      <Confetti trigger={true} />
      
      <Card className="w-full max-w-2xl shadow-xl border-t-8 border-t-green-500">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold">Exam Submitted!</CardTitle>
          <p className="text-muted-foreground mt-2">Thank you, {result.studentName}. Your mock exam has been securely recorded.</p>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          
          {showResults ? (
            <>
              <div className="bg-primary/5 rounded-xl p-8 text-center">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Overall Score</h3>
                <div className="flex items-end justify-center gap-2">
                  <span className="text-6xl font-bold text-primary">{result.totalScore}</span>
                  <span className="text-2xl text-muted-foreground mb-1">/ {result.totalQuestions}</span>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full font-semibold">
                  <Trophy className="h-4 w-4" />
                  {percentage}% Accuracy
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <BarChart className="h-5 w-5 text-primary" />
                  Subject Breakdown
                </h3>
                <div className="space-y-3">
                  {Object.entries(result.scorePerSubject || {}).map(([subjectId, data]) => {
                    const subPercentage = Math.round((data.score / (data.total || 1)) * 100);
                    return (
                      <div key={subjectId} className="flex flex-col gap-2 p-4 bg-muted/50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium capitalize">{subjectId}</span>
                          <span className="font-bold">{data.score} / {data.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
                          <div 
                            className={`h-2.5 rounded-full ${subPercentage > 70 ? 'bg-green-500' : subPercentage > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${subPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-blue-50 text-blue-800 p-6 rounded-xl text-center">
              <h3 className="font-semibold text-lg mb-2">Results Pending</h3>
              <p>Your results are hidden and will be released by the administrator shortly.</p>
            </div>
          )}

          <div className="pt-4 border-t flex flex-col gap-4">
            <p className="text-center text-sm text-muted-foreground">
              You can now safely close this window. Your results will be reviewed by the admin.
            </p>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full h-12 text-lg">
                Return to Home <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
