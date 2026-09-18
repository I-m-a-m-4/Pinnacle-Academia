'use client';

import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, collection, addDoc, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAcademy } from '@/context/academy-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Clock, AlertTriangle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { MockExamEvent } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function TakeMockExamPage() {
  const { academy } = useAcademy();
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [exam, setExam] = useState<MockExamEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<{name: string, email: string} | null>(null);
  
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Load exam and student data
  useEffect(() => {
    if (!academy || !eventId) return;

    const studentDataStr = sessionStorage.getItem(`mock_exam_${eventId}_student`);
    if (!studentDataStr) {
      router.replace(`/mock-exam/${eventId}`);
      return;
    }
    const studentData = JSON.parse(studentDataStr);
    setStudent(studentData);

    const fetchExam = async () => {
      const docRef = doc(db, 'academies', academy.id, 'mockExams', eventId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() } as MockExamEvent;
        
        if (data.status !== 'active') {
          toast({ title: 'Exam not active', description: 'This exam is not currently active.', variant: 'destructive' });
          router.replace(`/mock-exam/${eventId}`);
          return;
        }

        if (data.bannedEmails?.includes(studentData.email)) {
          toast({ title: 'Banned', description: 'You are banned from this exam.', variant: 'destructive' });
          router.replace(`/mock-exam/${eventId}`);
          return;
        }

        if (data.completedEmails?.includes(studentData.email)) {
          toast({ title: 'Already Completed', description: 'You have already submitted this exam and cannot retake it.', variant: 'destructive' });
          router.replace(`/mock-exam/${eventId}`);
          return;
        }

        setExam(data);
        if (data.subjects && data.subjects.length > 0) {
          setActiveSubjectId(data.subjects[0].id);
        }

        // Initialize Timer (Check if they already started previously by saving start time in session)
        const sessionStartTimeStr = sessionStorage.getItem(`mock_exam_${eventId}_start`);
        let startTime = Date.now();
        if (sessionStartTimeStr) {
           startTime = parseInt(sessionStartTimeStr, 10);
        } else {
           sessionStorage.setItem(`mock_exam_${eventId}_start`, startTime.toString());
        }

        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const totalSeconds = (data.durationMinutes || 60) * 60;
        const remaining = Math.max(totalSeconds - elapsedSeconds, 0);
        setTimeLeft(remaining);

      } else {
        router.replace(`/mock-exam/${eventId}`);
      }
      setLoading(false);
    };

    fetchExam();
  }, [academy, eventId, router]);

  // Timer Countdown Effect
  useEffect(() => {
    if (loading || !exam || timeLeft <= 0 || submitting) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [loading, exam, timeLeft, submitting]);

  const handleAutoSubmit = () => {
    toast({ title: 'Time Up!', description: 'Your exam is automatically being submitted.' });
    submitExam();
  };

  const submitExam = async () => {
    if (!exam || !student || !academy) return;
    setSubmitting(true);
    
    // Calculate Score
    let totalScore = 0;
    let totalQuestions = 0;
    const scorePerSubject: Record<string, {score: number, total: number}> = {};

    exam.subjects?.forEach(subject => {
      let subjScore = 0;
      subject.questions.forEach(q => {
        totalQuestions++;
        if (answers[q.id] === q.correctAnswer) {
          subjScore++;
          totalScore++;
        }
      });
      scorePerSubject[subject.id] = { score: subjScore, total: subject.questions.length };
    });
    const category = sessionStorage.getItem(`mock_exam_${eventId}_category`) || 'Unspecified';

    const submissionData = {
      eventId: exam.id,
      studentName: student.name,
      studentEmail: student.email,
      category,
      answers,
      scorePerSubject,
      totalScore,
      totalQuestions,
      submittedAt: serverTimestamp()
    };

    try {
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'academies', academy.id, 'mockExams', exam.id, 'submissions'), submissionData);
      
      // Record that they completed it
      await updateDoc(doc(db, 'academies', academy.id, 'mockExams', exam.id), {
        completedEmails: arrayUnion(student.email)
      });
      
      // Save results to session for immediate viewing
      sessionStorage.setItem(`mock_exam_${eventId}_result`, JSON.stringify({
        ...submissionData,
        submittedAt: Date.now() // local timestamp for UI
      }));

      // Cleanup start time so they can't resume
      sessionStorage.removeItem(`mock_exam_${eventId}_start`);
      
      router.replace(`/mock-exam/${eventId}/result`);
    } catch(e) {
      console.error(e);
      toast({ title: 'Submission Error', description: 'Failed to submit exam', variant: 'destructive'});
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-[50vh]"><Loader2 className="h-8 w-8 animate-spin mb-4" /> <p>Loading strict exam environment...</p></div>;
  }

  if (!exam) return null;

  const activeSubject = exam.subjects?.find(s => s.id === activeSubjectId);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-900 border-r flex flex-col shrink-0">
        <div className="p-4 border-b flex flex-col items-center bg-gray-50 dark:bg-gray-800">
          <Clock className="h-6 w-6 mb-2 text-primary" />
          <div className="text-2xl font-mono font-bold tabular-nums tracking-tighter">
            {formatTime(timeLeft)}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Time Remaining</div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider p-2">Subjects</div>
          {exam.subjects?.map(subject => (
            <button
              key={subject.id}
              onClick={() => setActiveSubjectId(subject.id)}
              className={`w-full text-left px-3 py-3 rounded-md text-sm font-medium transition-colors ${
                activeSubjectId === subject.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{subject.name}</span>
                {/* Visual indicator of answered questions */}
                <span className="text-xs opacity-70">
                  {subject.questions.filter(q => answers[q.id]).length}/{subject.questions.length}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white" 
            onClick={() => {
              if (confirm('Are you sure you want to submit? You cannot return to the exam.')) {
                submitExam();
              }
            }}
            disabled={submitting}
          >
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Submit Final Exam
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-black p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6 pb-20">
          <div className="flex justify-between items-end border-b pb-4">
            <div>
              <h2 className="text-2xl font-bold">{activeSubject?.name}</h2>
              <p className="text-muted-foreground">{activeSubject?.questions.length || 0} Questions</p>
            </div>
          </div>

          {activeSubject?.questions.map((q, index) => (
            <Card key={q.id} className="p-6">
              <div className="flex gap-4">
                <div className="font-bold text-lg text-primary">{index + 1}.</div>
                <div className="flex-1 space-y-4">
                  <p className="text-lg font-medium">{q.questionText}</p>
                  
                  <RadioGroup 
                    value={answers[q.id] || ''} 
                    onValueChange={(val) => setAnswers(prev => ({...prev, [q.id]: val}))}
                  >
                    <div className="space-y-3 mt-4">
                      {q.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                        return (
                          <div key={optIdx} className="flex items-start space-x-3 bg-muted/30 p-3 rounded-md hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value={letter} id={`${q.id}-${letter}`} className="mt-1" />
                            <Label htmlFor={`${q.id}-${letter}`} className="text-base cursor-pointer leading-normal flex-1 font-normal">
                              <span className="font-semibold mr-2">{letter}.</span> {opt}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </Card>
          ))}
          
          {activeSubject?.questions?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No questions found for this subject.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
