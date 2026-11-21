'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAcademy } from '@/context/academy-context';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Calculator from '@/components/shared/calculator';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  RotateCcw,
  Home,
  Award,
  BookOpen,
  FileText,
  History,
  X,
  Calculator as CalculatorIcon,
  Keyboard,
  User,
  Lock,
  Crown,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function ActiveTestPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { currentUserProfile, academy, parkActiveExamSession } = useAcademy();
  const firestore = useFirestore();

  const [sessionData, setSessionData] = React.useState<any>(null);
  const [timeLeft, setTimeLeft] = React.useState(0);
  const [currentSubjectIndex, setCurrentSubjectIndex] = React.useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

  // Answers format: Record<subjectName, Record<questionIndex, answerLetter>>
  const [answers, setAnswers] = React.useState<Record<string, Record<number, string>>>({});
  // Flags format: Record<subjectName, number[]>
  const [flags, setFlags] = React.useState<Record<string, number[]>>({});

  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [scoreSummary, setScoreSummary] = React.useState<any>(null);

  const [isQuitDialogOpen, setIsQuitDialogOpen] = React.useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = React.useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = React.useState(false);
  const [showShortcuts, setShowShortcuts] = React.useState(false);
  const isLoadedRef = React.useRef(false);

  // Load active session from sessionStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('active_exam_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        const hydratedSubjects = (parsed.subjects || []).map((sub: any) => ({
          ...sub,
          questions: sub.questions || [],
        }));
        parsed.subjects = hydratedSubjects;
        setSessionData(parsed);

        if (parsed.isParked) {
          setTimeLeft(parsed.timeLeft);
          setCurrentSubjectIndex(parsed.currentSubjectIndex || 0);
          setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
          setAnswers(parsed.answers || {});
          setFlags(parsed.flags || {});
          parsed.isParked = false;
          sessionStorage.setItem('active_exam_session', JSON.stringify(parsed));
        } else {
          const progressStored = sessionStorage.getItem('active_exam_progress');
          if (progressStored) {
            try {
              const progress = JSON.parse(progressStored);
              setTimeLeft(progress.timeLeft);
              setCurrentSubjectIndex(progress.currentSubjectIndex || 0);
              setCurrentQuestionIndex(progress.currentQuestionIndex || 0);
              setAnswers(progress.answers || {});
              setFlags(progress.flags || {});
            } catch {
              setTimeLeft((parsed.timeLimit || 120) * 60);
              const initialAnswers: Record<string, Record<number, string>> = {};
              const initialFlags: Record<string, number[]> = {};
              parsed.subjects.forEach((sub: any) => {
                initialAnswers[sub.name] = {};
                initialFlags[sub.name] = [];
              });
              setAnswers(initialAnswers);
              setFlags(initialFlags);
            }
          } else {
            setTimeLeft((parsed.timeLimit || 120) * 60);
            const initialAnswers: Record<string, Record<number, string>> = {};
            const initialFlags: Record<string, number[]> = {};
            parsed.subjects.forEach((sub: any) => {
              initialAnswers[sub.name] = {};
              initialFlags[sub.name] = [];
            });
            setAnswers(initialAnswers);
            setFlags(initialFlags);
          }
        }
        isLoadedRef.current = true;
      } else {
        toast({
          variant: 'destructive',
          title: 'No Session Found',
          description: 'Could not load active exam state. Returning to JAMB CBT setup.',
        });
        router.push('/cbt-simulator/select-subjects');
      }
    }
  }, [router, toast]);

  // Save progress to sessionStorage on changes
  React.useEffect(() => {
    if (isLoadedRef.current && sessionData && !isSubmitted) {
      const progress = {
        timeLeft,
        currentSubjectIndex,
        currentQuestionIndex,
        answers,
        flags,
      };
      sessionStorage.setItem('active_exam_progress', JSON.stringify(progress));
    }
  }, [timeLeft, currentSubjectIndex, currentQuestionIndex, answers, flags, sessionData, isSubmitted]);

  // Countdown timer
  React.useEffect(() => {
    if (timeLeft <= 0 || isSubmitted || !sessionData) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, sessionData]);

  // Standard JAMB CBT Keyboard Shortcuts (A, B, C, D, N, P, S, F)
  React.useEffect(() => {
    if (!sessionData || isSubmitted || isCalculatorOpen || isSubmitDialogOpen || isQuitDialogOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      const key = e.key.toUpperCase();
      const sub = sessionData.subjects[currentSubjectIndex];
      if (!sub) return;

      if (key === 'A' || key === 'B' || key === 'C' || key === 'D') {
        setAnswers((prev) => ({
          ...prev,
          [sub.name]: {
            ...prev[sub.name],
            [currentQuestionIndex]: key,
          },
        }));
      } else if (key === 'N' || e.key === 'ArrowRight') {
        if (currentQuestionIndex < sub.questions.length - 1) {
          setCurrentQuestionIndex((p) => p + 1);
        } else if (currentSubjectIndex < sessionData.subjects.length - 1) {
          setCurrentSubjectIndex((p) => p + 1);
          setCurrentQuestionIndex(0);
        }
      } else if (key === 'P' || e.key === 'ArrowLeft') {
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex((p) => p - 1);
        } else if (currentSubjectIndex > 0) {
          const prevSub = sessionData.subjects[currentSubjectIndex - 1];
          setCurrentSubjectIndex((p) => p - 1);
          setCurrentQuestionIndex(Math.max(0, prevSub.questions.length - 1));
        }
      } else if (key === 'F' || key === 'R') {
        setFlags((prev) => {
          const list = prev[sub.name] || [];
          const updated = list.includes(currentQuestionIndex)
            ? list.filter((i) => i !== currentQuestionIndex)
            : [...list, currentQuestionIndex];
          return { ...prev, [sub.name]: updated };
        });
      } else if (key === 'S') {
        setIsSubmitDialogOpen(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [sessionData, isSubmitted, isCalculatorOpen, isSubmitDialogOpen, isQuitDialogOpen, currentSubjectIndex, currentQuestionIndex]);

  if (!sessionData) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <Clock className="h-10 w-10 animate-spin text-primary" />
          <span>Loading JAMB UTME CBT Interface...</span>
        </div>
      </div>
    );
  }

  const currentSubject = sessionData.subjects[currentSubjectIndex];
  const currentQuestion = currentSubject?.questions[currentQuestionIndex];
  const totalSubjects = sessionData.subjects.length;
  const totalSubjectQuestions = currentSubject?.questions.length || 0;

  const formattedTime = () => {
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const totalExamQuestions = sessionData.subjects.reduce((sum: number, s: any) => sum + s.questions.length, 0);
  const totalAnswered = sessionData.subjects.reduce(
    (sum: number, s: any) => sum + Object.keys(answers[s.name] || {}).length,
    0
  );

  const handleAnswerSelection = (optionLetter: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentSubject.name]: {
        ...prev[currentSubject.name],
        [currentQuestionIndex]: optionLetter,
      },
    }));
  };

  const toggleFlagQuestion = () => {
    setFlags((prev) => {
      const list = prev[currentSubject.name] || [];
      const updated = list.includes(currentQuestionIndex)
        ? list.filter((i) => i !== currentQuestionIndex)
        : [...list, currentQuestionIndex];
      return {
        ...prev,
        [currentSubject.name]: updated,
      };
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalSubjectQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentSubjectIndex < totalSubjects - 1) {
      setCurrentSubjectIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentSubjectIndex > 0) {
      const prevSub = sessionData.subjects[currentSubjectIndex - 1];
      setCurrentSubjectIndex((prev) => prev - 1);
      setCurrentQuestionIndex(Math.max(0, prevSub.questions.length - 1));
    }
  };

  const handleSubmitExam = async (auto = false) => {
    setIsSubmitDialogOpen(false);

    let totalAggregate = 0;
    let totalQuestionsCount = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const subjectBreakdown = sessionData.subjects.map((sub: any) => {
      const subAnswers = answers[sub.name] || {};
      let subCorrect = 0;
      let subIncorrect = 0;
      let subUnanswered = 0;

      sub.questions.forEach((q: any, idx: number) => {
        const answer = subAnswers[idx];
        if (!answer) {
          subUnanswered++;
        } else if (answer === q.correctAnswer) {
          subCorrect++;
        } else {
          subIncorrect++;
        }
      });

      const subQuestionsCount = sub.questions.length;
      totalQuestionsCount += subQuestionsCount;
      correctCount += subCorrect;
      incorrectCount += subIncorrect;
      unansweredCount += subUnanswered;

      // Standard JAMB UTME: each of the 4 subjects is scaled to 100 marks (Total 400)
      const scaledScore = subQuestionsCount > 0 ? Math.round((subCorrect / subQuestionsCount) * 100) : 0;
      totalAggregate += scaledScore;

      return {
        name: sub.name,
        correct: subCorrect,
        incorrect: subIncorrect,
        unanswered: subUnanswered,
        total: subQuestionsCount,
        score: scaledScore,
      };
    });

    const maxScoreScale = sessionData.subjects.length * 100; // 400 for 4 JAMB subjects
    const finalPercentage = totalQuestionsCount > 0 ? Math.round((correctCount / totalQuestionsCount) * 100) : 0;

    const summary = {
      finalScore: totalAggregate,
      finalPercentage,
      correctCount,
      incorrectCount,
      unansweredCount,
      totalQuestionsCount,
      subjectBreakdown,
      maxScoreScale,
    };

    setScoreSummary(summary);
    setIsSubmitted(true);

    if (firestore && currentUserProfile?.id) {
      try {
        await addDoc(collection(firestore, `users/${currentUserProfile.id}/examResults`), {
          receiptNumber: sessionData.receiptNumber,
          examType: 'JAMB UTME',
          mode: sessionData.mode,
          score: totalAggregate,
          maxScore: maxScoreScale,
          university: sessionData.university || 'JAMB UTME',
          percentage: finalPercentage,
          correct: correctCount,
          incorrect: incorrectCount,
          unanswered: unansweredCount,
          totalQuestions: totalQuestionsCount,
          timeRemaining: timeLeft,
          timeLimit: sessionData.timeLimit,
          breakdown: subjectBreakdown,
          isLimitedPreview: !!sessionData.isLimitedPreview,
          createdAt: serverTimestamp(),
        });

        const prefixes = ['Scholar', 'Mastermind', 'Genius', 'Prodigy', 'Ace', 'Brainiac', 'Maverick', 'Champion'];
        const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);

        await addDoc(collection(firestore, 'cbt_leaderboards'), {
          userId: currentUserProfile.id,
          alias: `${randomPrefix}_${randomSuffix}`,
          score: totalAggregate,
          maxScore: maxScoreScale,
          percentage: finalPercentage,
          university: 'JAMB UTME',
          mode: sessionData.mode,
          academyId: academy?.id || 'none',
          submittedAt: serverTimestamp(),
        });
      } catch (e) {
        console.error('Could not persist exam result to Firestore:', e);
      }
    }

    sessionStorage.removeItem('active_exam_progress');
    sessionStorage.removeItem('active_exam_session');

    toast({
      variant: 'success',
      title: auto ? 'Time Expired — Exam Submitted!' : 'JAMB UTME Exam Submitted!',
      description: `Aggregate Score: ${totalAggregate} / ${maxScoreScale} (${finalPercentage}%)`,
    });
  };

  const handleParkTest = () => {
    if (!sessionData) return;
    const sessionToPark = {
      ...sessionData,
      timeLeft,
      currentSubjectIndex,
      currentQuestionIndex,
      answers,
      flags,
      isParked: true,
    };
    parkActiveExamSession(sessionToPark);
    sessionStorage.removeItem('active_exam_session');
    sessionStorage.removeItem('active_exam_progress');
    toast({
      variant: 'success',
      title: 'Test Parked',
      description: 'Your exam progress has been saved. You can resume later.',
    });
    router.push('/cbt-simulator/select-subjects');
  };

  const confirmQuitExam = () => {
    sessionStorage.removeItem('active_exam_session');
    sessionStorage.removeItem('active_exam_progress');
    toast({
      title: 'Exam Ended',
      description: 'You exited the JAMB CBT session.',
    });
    router.push('/cbt-simulator/select-subjects');
  };

  const isPracticeMode = sessionData.mode === 'Bank Transfer' || sessionData.mode === 'Practice Mode';
  const isLowTime = timeLeft <= 300; // <= 5 minutes

  // ── RESULTS VIEW ─────────────────────────────────────────────────────────────
  if (isSubmitted && scoreSummary) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-16 px-4">
        {sessionData.isLimitedPreview && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-amber-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-foreground">You completed the Free 20-Question Preview!</p>
                <p className="text-xs text-muted-foreground">
                  Subscribe now to unlock full 180-question JAMB UTME CBT simulations (60 English + 40 × 3 subjects).
                </p>
              </div>
            </div>
            <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0">
              <Link href="/billing">Upgrade Subscription</Link>
            </Button>
          </div>
        )}

        <Card className="border-[0.5px] border-border/40 bg-card/50 backdrop-blur-md shadow-xl rounded-2xl p-6 text-center">
          <CardHeader className="items-center pb-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-2 border border-primary/20">
              <Award className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl font-extrabold">JAMB UTME Result Slip</CardTitle>
            <CardDescription>
              Candidate: <span className="font-semibold text-foreground">{sessionData.studentName}</span> • Reg Ref:{' '}
              <span className="font-mono font-bold text-foreground">{sessionData.receiptNumber}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="flex justify-center gap-8 flex-wrap">
              <div className="p-5 bg-muted/30 border rounded-2xl min-w-[180px] shadow-sm">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                  UTME Aggregate Score
                </span>
                <span className="text-4xl font-extrabold text-primary mt-1 block">
                  {scoreSummary.finalScore}{' '}
                  <span className="text-lg text-muted-foreground">/ {scoreSummary.maxScoreScale}</span>
                </span>
              </div>
              <div className="p-5 bg-muted/30 border rounded-2xl min-w-[180px] shadow-sm">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider block">
                  Accuracy
                </span>
                <span className="text-4xl font-extrabold text-foreground mt-1 block">
                  {scoreSummary.finalPercentage}%
                </span>
              </div>
            </div>

            <Progress value={scoreSummary.finalPercentage} className="h-3 w-full max-w-md mx-auto rounded-full bg-muted" />

            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto text-sm pt-2">
              <div className="text-center p-2.5 border rounded-xl bg-green-500/10 border-green-500/20 text-green-600">
                <span className="block font-bold text-lg">{scoreSummary.correctCount}</span>
                <span className="text-[10px] uppercase font-semibold">Correct</span>
              </div>
              <div className="text-center p-2.5 border rounded-xl bg-red-500/10 border-red-500/20 text-red-600">
                <span className="block font-bold text-lg">{scoreSummary.incorrectCount}</span>
                <span className="text-[10px] uppercase font-semibold">Wrong</span>
              </div>
              <div className="text-center p-2.5 border rounded-xl bg-slate-500/10 border-slate-500/20 text-slate-600">
                <span className="block font-bold text-lg">{scoreSummary.unansweredCount}</span>
                <span className="text-[10px] uppercase font-semibold">Unanswered</span>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-left flex items-center gap-2">
                <FileText className="text-primary h-5 w-5" /> Subject Breakdown (100 Marks Each)
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {scoreSummary.subjectBreakdown.map((sub: any) => (
                  <div
                    key={sub.name}
                    className="flex justify-between items-center p-4 border rounded-xl bg-background/60 shadow-sm"
                  >
                    <div className="text-left">
                      <span className="font-bold text-sm">{sub.name}</span>
                      <span className="text-xs text-muted-foreground block mt-0.5">
                        Correct: {sub.correct}/{sub.total} | Wrong: {sub.incorrect} | Skipped: {sub.unanswered}
                      </span>
                    </div>
                    <Badge className="text-sm font-bold h-8 px-3 bg-primary/15 text-primary border-primary/30" variant="outline">
                      {sub.score} / 100
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4 pt-6 flex-wrap">
            <Button variant="outline" onClick={() => router.push('/dashboard')} className="min-w-[150px]">
              <Home className="mr-2 h-4 w-4" /> Dashboard
            </Button>
            <Button
              onClick={() => router.push('/cbt-simulator/select-subjects')}
              className="min-w-[150px]"
            >
              <RotateCcw className="mr-2 h-4 w-4" /> Take Another CBT
            </Button>
          </CardFooter>
        </Card>

        {/* Solutions Review */}
        <Card className="border-[0.5px] border-border/40 bg-card/50 backdrop-blur-md shadow-xl rounded-2xl p-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="text-primary h-5 w-5" /> Review Answers & Explanations
            </CardTitle>
            <CardDescription>Review every question, your selection, and the correct solution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-4">
            {sessionData.subjects.map((sub: any) => (
              <div key={sub.name} className="space-y-4">
                <h3 className="text-md font-bold uppercase tracking-wider text-primary border-b pb-1 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" /> {sub.name} ({sub.questions.length} Questions)
                </h3>
                {sub.questions.map((q: any, idx: number) => {
                  const userAnswer = answers[sub.name]?.[idx];
                  const isCorrect = userAnswer === q.correctAnswer;
                  return (
                    <div key={q.id || idx} className="p-4 rounded-xl border bg-background/40 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-semibold text-sm">Question {idx + 1}</span>
                        {userAnswer ? (
                          isCorrect ? (
                            <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-600 text-[10px]">
                              Correct
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-500/10 border-red-500/20 text-red-600 text-[10px]">
                              Incorrect (You chose {userAnswer})
                            </Badge>
                          )
                        ) : (
                          <Badge variant="outline" className="bg-slate-500/10 border-slate-500/20 text-slate-600 text-[10px]">
                            Unanswered
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: q.questionText }} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt: string, optIdx: number) => {
                          const letter = String.fromCharCode(65 + optIdx);
                          const isOptCorrect = letter === q.correctAnswer;
                          const isOptChosen = letter === userAnswer;
                          return (
                            <div
                              key={letter}
                              className={cn(
                                'p-2.5 rounded-lg border',
                                isOptCorrect && 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400 font-medium',
                                isOptChosen && !isOptCorrect && 'bg-red-500/10 border-red-500/30 text-red-600'
                              )}
                            >
                              <strong className="mr-1.5">{letter}.</strong>
                              <span dangerouslySetInnerHTML={{ __html: opt }} />
                            </div>
                          );
                        })}
                      </div>
                      {q.explanation && (
                        <div className="text-xs p-3 bg-muted/40 rounded-lg border border-border/50 text-muted-foreground mt-2 leading-relaxed">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── STANDARD JAMB CBT INTERFACE ──────────────────────────────────────────────
  const currentAnswer = answers[currentSubject.name]?.[currentQuestionIndex] || '';
  const isQuestionFlagged = flags[currentSubject.name]?.includes(currentQuestionIndex);

  return (
    <div className="max-w-[1480px] mx-auto space-y-4 pb-12 px-2 sm:px-4">
      {/* Free Preview Mini-Bar */}
      {sessionData.isLimitedPreview && (
        <div className="flex items-center justify-between gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-amber-700 dark:text-amber-400">
            <Lock className="h-3.5 w-3.5" /> Free Preview Mode ({totalExamQuestions} of 180 JAMB Questions)
          </span>
          <Link href="/billing" className="font-bold text-amber-700 dark:text-amber-300 underline hover:opacity-80">
            Upgrade for Full 180 Qs
          </Link>
        </div>
      )}

      {/* Official JAMB Top Exam Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-card border-2 border-primary/20 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
            <User className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">{sessionData.studentName}</span>
              <Badge variant="outline" className="text-[10px] font-mono bg-primary/5 text-primary border-primary/20">
                {sessionData.receiptNumber}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              JAMB UTME CBT • Attempted: <strong className="text-foreground">{totalAnswered}</strong> / {totalExamQuestions}
            </p>
          </div>
        </div>

        {/* Center/Right Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCalculatorOpen(true)}
            className="h-9 rounded-xl text-xs font-bold gap-1.5"
            title="Open JAMB Calculator"
          >
            <CalculatorIcon className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Calculator</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShortcuts((s) => !s)}
            className="h-9 rounded-xl text-xs font-bold gap-1.5 hidden md:inline-flex"
            title="Keyboard Shortcuts"
          >
            <Keyboard className="h-4 w-4 text-muted-foreground" />
            Keys
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleParkTest}
            className="h-9 rounded-xl text-xs font-bold gap-1.5 border-primary/20 text-primary hover:bg-primary/10"
          >
            <History className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Park</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsQuitDialogOpen(true)}
            className="h-9 rounded-xl text-xs font-bold gap-1.5 border-red-500/20 text-red-600 hover:bg-red-500/10"
          >
            <X className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Quit</span>
          </Button>

          {/* Prominent JAMB Countdown Timer */}
          <div
            className={cn(
              'flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-base font-extrabold font-mono border',
              isLowTime
                ? 'bg-red-600 text-white border-red-700 animate-pulse'
                : 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border-emerald-600/30'
            )}
          >
            <Clock className="h-4 w-4" />
            <span>{formattedTime()}</span>
          </div>

          <Button
            size="sm"
            onClick={() => setIsSubmitDialogOpen(true)}
            className="h-9 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            Submit
          </Button>
        </div>
      </div>

      {/* Keyboard Shortcuts Strip */}
      {showShortcuts && (
        <div className="flex flex-wrap items-center gap-3 px-4 py-2 rounded-xl bg-muted/50 border text-[11px] text-muted-foreground">
          <span className="font-bold text-foreground">JAMB CBT Shortcuts:</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-background border font-mono">A</kbd>–<kbd className="px-1.5 py-0.5 rounded bg-background border font-mono">D</kbd> Select Option</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-background border font-mono">N</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-background border font-mono">→</kbd> Next</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-background border font-mono">P</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-background border font-mono">←</kbd> Previous</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-background border font-mono">F</kbd> Flag Question</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-background border font-mono">S</kbd> Submit Exam</span>
        </div>
      )}

      {/* 4 Subject Tabs Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1.5 bg-muted/40 border rounded-2xl">
        {sessionData.subjects.map((sub: any, idx: number) => {
          const subAnswered = Object.keys(answers[sub.name] || {}).length;
          const isActive = currentSubjectIndex === idx;
          return (
            <button
              key={sub.name}
              onClick={() => {
                setCurrentSubjectIndex(idx);
                setCurrentQuestionIndex(0);
              }}
              className={cn(
                'flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-background/60 text-muted-foreground hover:text-foreground hover:bg-background'
              )}
            >
              <span className="truncate">{sub.name}</span>
              <span
                className={cn(
                  'text-[10px] font-mono px-1.5 py-0.5 rounded-md shrink-0',
                  isActive ? 'bg-white/20 text-white' : 'bg-muted text-foreground'
                )}
              >
                {subAnswered}/{sub.questions.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main CBT Workspace */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Question & Options Panel */}
        <Card className="lg:col-span-8 border-[0.5px] border-border/50 bg-card shadow-md rounded-2xl flex flex-col justify-between min-h-[520px]">
          <CardHeader className="pb-3 border-b flex flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground font-mono text-xs">
                  Question {currentQuestionIndex + 1} of {totalSubjectQuestions}
                </Badge>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {currentSubject.name}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFlagQuestion}
              className={cn(
                'h-8 rounded-xl text-xs',
                isQuestionFlagged && 'text-amber-700 bg-amber-500/15 border-amber-500/40'
              )}
            >
              <Flag className="h-3.5 w-3.5 mr-1.5" />
              {isQuestionFlagged ? 'Flagged' : 'Flag'}
            </Button>
          </CardHeader>

          <CardContent className="flex-1 py-6 space-y-6">
            <div
              className="text-base sm:text-lg font-medium leading-relaxed text-foreground"
              dangerouslySetInnerHTML={{
                __html: currentQuestion ? currentQuestion.questionText : 'No question available.',
              }}
            />

            <div className="space-y-3">
              {currentQuestion?.options.map((opt: string, optIdx: number) => {
                const letter = String.fromCharCode(65 + optIdx);
                const isSelected = letter === currentAnswer;
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => handleAnswerSelection(letter)}
                    className={cn(
                      'w-full text-left p-3.5 sm:p-4 rounded-xl border text-sm transition-all flex items-center gap-3.5 group',
                      isSelected
                        ? 'bg-emerald-600/10 border-emerald-600 ring-1 ring-emerald-600/30 text-foreground font-semibold'
                        : 'bg-background/60 border-border/60 text-foreground/85 hover:bg-muted/40 hover:border-primary/40'
                    )}
                  >
                    <span
                      className={cn(
                        'h-8 w-8 rounded-full border-2 text-xs font-extrabold flex items-center justify-center shrink-0 transition-colors',
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-background border-border text-muted-foreground group-hover:border-primary'
                      )}
                    >
                      {letter}
                    </span>
                    <span className="flex-1 leading-snug" dangerouslySetInnerHTML={{ __html: opt }} />
                  </button>
                );
              })}
            </div>

            {/* Instant Explanation in Practice Mode */}
            {isPracticeMode && currentAnswer && currentQuestion?.explanation && (
              <div className="p-4 rounded-xl border border-primary/25 bg-primary/5">
                <div className="flex items-center gap-2 text-xs font-bold text-primary mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Correct Answer: {currentQuestion.correctAnswer}</span>
                  {currentAnswer === currentQuestion.correctAnswer ? (
                    <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-600 text-[10px]">
                      Correct
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-500/10 border-red-500/30 text-red-600 text-[10px]">
                      Incorrect
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-4 border-t flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentSubjectIndex === 0 && currentQuestionIndex === 0}
              className="rounded-xl px-5 h-11 font-bold"
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous (P)
            </Button>

            {currentSubjectIndex === totalSubjects - 1 && currentQuestionIndex === totalSubjectQuestions - 1 ? (
              <Button
                onClick={() => setIsSubmitDialogOpen(true)}
                className="rounded-xl px-6 h-11 font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Submit Exam (S) <CheckCircle2 className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="rounded-xl px-6 h-11 font-bold">
                Next (N) <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Right: JAMB Numbered Question Navigator */}
        <Card className="lg:col-span-4 border-[0.5px] border-border/50 bg-card shadow-md rounded-2xl flex flex-col justify-between p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-bold text-foreground">{currentSubject.name} Grid</h3>
                <p className="text-[11px] text-muted-foreground">
                  {Object.keys(answers[currentSubject.name] || {}).length} of {totalSubjectQuestions} answered
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {totalAnswered}/{totalExamQuestions} Total
              </Badge>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-6 gap-1.5 max-h-[360px] overflow-y-auto pr-1">
              {currentSubject.questions.map((_: any, idx: number) => {
                const isAnswered = answers[currentSubject.name]?.[idx] !== undefined;
                const isFlagged = flags[currentSubject.name]?.includes(idx);
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={cn(
                      'h-9 rounded-lg text-xs font-bold border transition-all flex items-center justify-center',
                      isCurrent
                        ? 'bg-primary text-primary-foreground border-primary ring-2 ring-primary/30'
                        : isFlagged
                        ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-400'
                        : isAnswered
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-muted/40 border-border/60 text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-emerald-600 inline-block" /> Answered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-muted border inline-block" /> Unanswered
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-primary inline-block" /> Current
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded bg-amber-500/30 border border-amber-500 inline-block" /> Flagged
              </div>
            </div>

            <Button
              onClick={() => setIsSubmitDialogOpen(true)}
              className="w-full rounded-xl h-11 font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Submit Examination
            </Button>
          </div>
        </Card>
      </div>

      {/* Built-in JAMB Calculator */}
      <Calculator isOpen={isCalculatorOpen} onOpenChange={setIsCalculatorOpen} />

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Submit JAMB UTME Exam?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 text-sm text-muted-foreground pt-2">
                <p>
                  You have answered <strong className="text-foreground">{totalAnswered}</strong> out of{' '}
                  <strong className="text-foreground">{totalExamQuestions}</strong> total questions.
                </p>
                <div className="space-y-1.5 bg-muted/40 p-3 rounded-xl border">
                  {sessionData.subjects.map((sub: any) => {
                    const ansCount = Object.keys(answers[sub.name] || {}).length;
                    return (
                      <div key={sub.name} className="flex justify-between text-xs">
                        <span className="font-medium text-foreground">{sub.name}</span>
                        <span className="font-mono">
                          {ansCount} / {sub.questions.length} answered
                        </span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs">Once submitted, your score out of 400 will be calculated immediately.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl">Continue Exam</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleSubmitExam(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              Yes, Submit Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quit Exam Dialog */}
      <AlertDialog open={isQuitDialogOpen} onOpenChange={setIsQuitDialogOpen}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-destructive">Quit Examination Session?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Any unsaved progress will be lost. Use <strong>Park</strong> if you want to resume later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmQuitExam}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl"
            >
              Yes, Quit Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
