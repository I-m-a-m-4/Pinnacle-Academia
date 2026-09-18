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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const strikesRef = useRef(0);

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

        const category = sessionStorage.getItem(`mock_exam_${eventId}_category`) || 'Science';
        
        // Standard JAMB-style combinations for different categories
        const standardSubjects: Record<string, string[]> = {
           Science: ['Use of English', 'Mathematics', 'Aptitude Test', 'Physics', 'Chemistry', 'Biology', 'Geography', 'Agricultural Science'],
           Art: ['Use of English', 'Mathematics', 'Aptitude Test', 'Government', 'Literature in English', 'Christian Religious Studies', 'Islamic Religious Studies', 'History', 'Civic Education'],
           Commercial: ['Use of English', 'Mathematics', 'Aptitude Test', 'Financial Accounting', 'Commerce', 'Economics', 'Insurance']
        };

        const allowedSubjectNames = standardSubjects[category] || standardSubjects.Science;
        
        // Filter the available subjects to only show the ones meant for their category
        data.subjects = (data.subjects || []).filter(s => allowedSubjectNames.includes(s.name));

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
    if (loading || !exam || timeLeft <= 0 || submitting || !isFullscreen) return;

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
  }, [loading, exam, timeLeft, submitting, isFullscreen]);

  // Anti-Cheat Features
  useEffect(() => {
    if (loading || !exam || submitting) return;

    // 1. Disable Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      toast({ title: 'Action Blocked', description: 'Right-click is disabled during the exam.', variant: 'destructive' });
    };

    // 2. Disable Copying
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      toast({ title: 'Action Blocked', description: 'Copying text is disabled during the exam.', variant: 'destructive' });
    };

    // 3. Page Visibility (Tab Switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        strikesRef.current += 1;
        if (strikesRef.current >= 3) {
          toast({ title: 'Exam Terminated', description: 'You have left the exam tab too many times. Your exam is being submitted.', variant: 'destructive' });
          submitExam();
        } else {
          toast({ 
            title: 'Warning!', 
            description: `You left the exam tab. This is strike ${strikesRef.current}/3. Your exam will be submitted automatically on the 3rd strike.`, 
            variant: 'destructive',
            duration: 10000 
          });
        }
      }
    };

    // 4. Fullscreen Tracking
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        toast({ title: 'Warning', description: 'You have exited full-screen mode. Enter full-screen to continue your exam.', variant: 'destructive' });
      } else {
        setIsFullscreen(true);
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [loading, exam, submitting]);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen().catch(e => {
      console.log(e);
      // Fallback if unsupported
    });
    setIsFullscreen(true);
  };

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

  if (!isFullscreen && !loading) {
     return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 bg-muted/30">
          <Card className="max-w-md w-full text-center p-6 shadow-xl border-t-4 border-t-yellow-500">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Strict Exam Environment</h2>
            <p className="text-muted-foreground mb-6">
              This exam requires full-screen mode. Leaving the tab or exiting full-screen may result in automatic submission. Do not attempt to copy text or open other applications.
            </p>
            <Button size="lg" className="w-full text-lg h-14 bg-primary text-white hover:bg-primary/90" onClick={enterFullscreen}>
              Enter Fullscreen & Continue
            </Button>
          </Card>
        </div>
     );
  }

  const activeSubject = exam.subjects?.find(s => s.id === activeSubjectId);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden select-none">
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
            <div key={subject.id} className="mb-2">
              <button
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
                    {subject.questions.filter((q: any) => answers[q.id]).length}/{subject.questions.length}
                  </span>
                </div>
              </button>

              {/* Question Navigator Grid for Active Subject */}
              {activeSubjectId === subject.id && (
                <div className="grid grid-cols-5 gap-1 mt-2 p-1">
                   {subject.questions.map((q: any, idx: number) => {
                      const isAnswered = !!answers[q.id];
                      return (
                         <Button
                           key={q.id}
                           variant={isAnswered ? 'default' : 'outline'}
                           size="sm"
                           className={`h-8 w-8 p-0 text-xs font-semibold ${isAnswered ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/80 border-dashed'}`}
                           onClick={() => {
                             document.getElementById(`question-${q.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                           }}
                         >
                           {idx + 1}
                         </Button>
                      )
                   })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white" 
            onClick={() => {
              submitExam();
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
            <Card key={q.id} id={`question-${q.id}`} className="p-6 scroll-m-24 shadow-sm border-t-4 border-t-primary/20">
              <div className="flex gap-4">
                <div className="font-bold text-lg text-primary">{index + 1}.</div>
                <div className="flex-1 space-y-4">
                  <div className="text-lg font-medium" dangerouslySetInnerHTML={{ __html: q.questionText }} />
                  
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
                                <span className="font-semibold mr-2">{letter}.</span> <span dangerouslySetInnerHTML={{ __html: opt }} />
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
