'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAcademy } from '@/context/academy-context';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  GraduationCap,
  Play,
  Settings,
  RefreshCw,
  Trophy,
  Lock,
  CheckCircle2,
  Crown,
  Clock,
  ShieldCheck,
  Sparkles,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  hasFullCbtAccess,
  getQuestionCountForSubject,
  JAMB_ENGLISH_SUBJECT,
  JAMB_FULL_DURATION_MINUTES,
  FREE_PREVIEW_DURATION_MINUTES,
  JAMB_TOTAL_SUBJECTS,
} from '@/lib/cbt-access';

// Dynamic question loader to ensure lightweight client bundles
async function fetchSubjectQuestions(subName: string): Promise<any[]> {
  try {
    switch (subName) {
      case 'Use of English':
      case 'English Language':
        return (await import('../data/use-of-english')).englishQuestions;
      case 'Mathematics':
        return (await import('../data/mathematics')).mathematicsQuestions;
      case 'Physics':
        return (await import('../data/physics')).physicsQuestions;
      case 'Chemistry':
        return (await import('../data/chemistry')).chemistryQuestions;
      case 'Biology':
        return (await import('../data/biology')).biologyQuestions;
      case 'Government':
        return (await import('../data/government')).governmentQuestions;
      case 'Literature in English':
        return (await import('../data/literature')).literatureQuestions;
      case 'Economics':
        return (await import('../data/economics')).economicsQuestions;
      case 'Financial Accounting':
        return (await import('../data/accounting')).accountingQuestions;
      case 'Christian Religious Studies':
        return (await import('../data/crs')).crsQuestions;
      case 'Geography':
        return (await import('../data/geography')).geographyQuestions;
      case 'Agricultural Science':
        return (await import('../data/agric-science')).agricScienceQuestions;
      case 'Commerce':
        return (await import('../data/commerce')).commerceQuestions;
      case 'Islamic Religious Studies':
        return (await import('../data/irk')).irkQuestions;
      case 'Civic Education':
        return (await import('../data/civic-education')).civicEducationQuestions;
      case 'Insurance':
        return (await import('../data/insurance')).insuranceQuestions;
      case 'History':
        return (await import('../data/history')).historyQuestions;
      default:
        return (await import('../data/use-of-english')).englishQuestions;
    }
  } catch (e) {
    console.error('Error dynamically loading questions for', subName, e);
    return [];
  }
}

const JAMB_SUBJECTS = [
  { id: 'sub-eng', name: 'Use of English', category: 'Compulsory', compulsory: true },
  { id: 'sub-math', name: 'Mathematics', category: 'Science' },
  { id: 'sub-phys', name: 'Physics', category: 'Science' },
  { id: 'sub-chem', name: 'Chemistry', category: 'Science' },
  { id: 'sub-bio', name: 'Biology', category: 'Science' },
  { id: 'sub-lit', name: 'Literature in English', category: 'Arts' },
  { id: 'sub-gov', name: 'Government', category: 'Arts' },
  { id: 'sub-eco', name: 'Economics', category: 'Social Sciences' },
  { id: 'sub-acc', name: 'Financial Accounting', category: 'Commercial' },
  { id: 'sub-com', name: 'Commerce', category: 'Commercial' },
  { id: 'sub-crs', name: 'Christian Religious Studies', category: 'Arts' },
  { id: 'sub-irk', name: 'Islamic Religious Studies', category: 'Arts' },
  { id: 'sub-geo', name: 'Geography', category: 'Science' },
  { id: 'sub-agr', name: 'Agricultural Science', category: 'Science' },
  { id: 'sub-his', name: 'History', category: 'Arts' },
  { id: 'sub-civ', name: 'Civic Education', category: 'Arts' },
  { id: 'sub-ins', name: 'Insurance', category: 'Commercial' },
];

const COURSE_PRESETS: { label: string; subjects: string[] }[] = [
  { label: 'Medicine / Nursing / Pharmacy', subjects: ['Use of English', 'Biology', 'Chemistry', 'Physics'] },
  { label: 'Engineering / Computer Science', subjects: ['Use of English', 'Mathematics', 'Physics', 'Chemistry'] },
  { label: 'Law / Mass Comm / Arts', subjects: ['Use of English', 'Literature in English', 'Government', 'Christian Religious Studies'] },
  { label: 'Accounting / Banking / Finance', subjects: ['Use of English', 'Mathematics', 'Economics', 'Financial Accounting'] },
  { label: 'Economics / Business Admin', subjects: ['Use of English', 'Mathematics', 'Economics', 'Commerce'] },
  { label: 'Political Science / Sociology', subjects: ['Use of English', 'Government', 'Economics', 'Literature in English'] },
];

function normalizeSubjectName(name: string): string {
  if (name.toLowerCase() === 'english language') return JAMB_ENGLISH_SUBJECT;
  return name;
}

export default function SelectSubjectsPage() {
  const { currentUserProfile, academy, clearCart } = useAcademy();
  const router = useRouter();
  const { toast } = useToast();

  const [selectedSubjects, setSelectedSubjects] = React.useState<string[]>([
    JAMB_ENGLISH_SUBJECT,
    'Mathematics',
    'Physics',
    'Chemistry',
  ]);
  const [selectedYear, setSelectedYear] = React.useState('All');
  const [examMode, setExamMode] = React.useState<'Full Exam' | 'Practice Mode'>('Full Exam');
  const [isNavigating, setIsNavigating] = React.useState(false);

  const isSubscribed = React.useMemo(
    () => hasFullCbtAccess(academy, currentUserProfile),
    [academy, currentUserProfile]
  );

  // Redirect if there is already an active exam session
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const activeSession = sessionStorage.getItem('active_exam_session');
      if (activeSession) {
        router.push('/cbt-simulator/active-test');
      }
    }
  }, [router]);

  // Pre-fill from student profile's saved UTME subjects if available
  React.useEffect(() => {
    if (currentUserProfile?.utmeSubjects && currentUserProfile.utmeSubjects.length > 0) {
      const normalized = currentUserProfile.utmeSubjects
        .map(normalizeSubjectName)
        .filter((s) => JAMB_SUBJECTS.some((js) => js.name === s));
      const others = normalized.filter((s) => s !== JAMB_ENGLISH_SUBJECT).slice(0, 3);
      if (others.length > 0) {
        setSelectedSubjects([JAMB_ENGLISH_SUBJECT, ...others]);
      }
    }
  }, [currentUserProfile]);

  const toggleSubject = (subName: string) => {
    if (subName === JAMB_ENGLISH_SUBJECT) {
      toast({
        title: 'Compulsory Subject',
        description: 'Use of English (60 questions) is compulsory for all JAMB UTME candidates.',
      });
      return;
    }

    setSelectedSubjects((prev) => {
      if (prev.includes(subName)) {
        return prev.filter((s) => s !== subName);
      }
      if (prev.length >= JAMB_TOTAL_SUBJECTS) {
        toast({
          variant: 'destructive',
          title: 'Maximum 4 Subjects',
          description: 'JAMB UTME requires exactly 4 subjects (Use of English + 3 others). Deselect one first.',
        });
        return prev;
      }
      return [...prev, subName];
    });
  };

  const applyPreset = (subjects: string[]) => {
    setSelectedSubjects(subjects);
  };

  const totalQuestions = React.useMemo(() => {
    return selectedSubjects.reduce(
      (sum, sub) => sum + getQuestionCountForSubject(sub, isSubscribed),
      0
    );
  }, [selectedSubjects, isSubscribed]);

  const durationMinutes = isSubscribed ? JAMB_FULL_DURATION_MINUTES : FREE_PREVIEW_DURATION_MINUTES;

  const handleStartExam = async () => {
    if (selectedSubjects.length !== JAMB_TOTAL_SUBJECTS) {
      toast({
        variant: 'destructive',
        title: 'Select Exactly 4 Subjects',
        description: `Every JAMB UTME candidate must pick 4 subjects (Use of English + 3 others). Currently selected: ${selectedSubjects.length}/4.`,
      });
      return;
    }

    if (!selectedSubjects.includes(JAMB_ENGLISH_SUBJECT)) {
      toast({
        variant: 'destructive',
        title: 'Use of English Required',
        description: 'Use of English is compulsory for all JAMB UTME exams.',
      });
      return;
    }

    setIsNavigating(true);
    clearCart();

    // Ensure Use of English is always first
    const orderedSubjects = [
      JAMB_ENGLISH_SUBJECT,
      ...selectedSubjects.filter((s) => s !== JAMB_ENGLISH_SUBJECT),
    ];

    const examSubjects = await Promise.all(
      orderedSubjects.map(async (subName) => {
        const subMeta = JAMB_SUBJECTS.find((s) => s.name === subName);
        const questions = await fetchSubjectQuestions(subName);

        let filteredQuestions = questions;
        if (selectedYear !== 'All') {
          filteredQuestions = questions.filter((q) => {
            const yearMatch = q.questionText?.match(/\b(20\d{2})\b/);
            return yearMatch && yearMatch[1] === selectedYear;
          });
          if (filteredQuestions.length < 10) {
            filteredQuestions = questions;
          }
        }

        const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
        const targetCount = getQuestionCountForSubject(subName, isSubscribed);

        return {
          id: subMeta?.id || subName.toLowerCase().replace(/\s+/g, '-'),
          name: subName,
          fullQuota: subName === JAMB_ENGLISH_SUBJECT ? 60 : 40,
          questions: shuffled.slice(0, targetCount),
        };
      })
    );

    const activeSession = {
      receiptNumber: `JAMB-${Math.floor(100000 + Math.random() * 900000)}`,
      examType: 'JAMB UTME',
      subjects: examSubjects,
      mode: examMode,
      timeLimit: durationMinutes,
      targetScore: currentUserProfile?.targetUTMEScore || 300,
      studentName: currentUserProfile?.name || 'JAMB Candidate',
      studentEmail: currentUserProfile?.email || '',
      university: currentUserProfile?.targetInstitution || 'JAMB UTME Standard',
      isLimitedPreview: !isSubscribed,
    };

    sessionStorage.setItem('active_exam_session', JSON.stringify(activeSession));
    sessionStorage.removeItem('active_exam_progress');

    toast({
      variant: 'success',
      title: isSubscribed ? 'JAMB UTME CBT Ready' : 'Free Preview Session Ready',
      description: isSubscribed
        ? `Starting JAMB UTME CBT: ${totalQuestions} Questions across 4 subjects (${durationMinutes} mins).`
        : `Starting limited preview (${totalQuestions} questions). Subscribe for full 180-question JAMB CBT access.`,
    });

    router.push('/cbt-simulator/active-test');
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-6 py-4 px-2 md:px-8 xl:px-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              JAMB UTME CBT Simulator
            </h1>
            <Badge className="bg-emerald-600/15 text-emerald-600 border-emerald-500/30 font-bold" variant="outline">
              Official 180-Question Standard
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Standard JAMB CBT practice: Use of English (60 Questions — Compulsory) + 3 Subjects (40 Questions each).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/syllabus-tracker">
              <FileText className="h-4 w-4" /> JAMB Syllabus
            </Link>
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10 hover:text-yellow-700"
            onClick={() => router.push('/cbt-simulator/leaderboard')}
          >
            <Trophy className="h-4 w-4" /> Leaderboard
          </Button>
        </div>
      </div>

      {/* Subscription Access Banner */}
      {!isSubscribed ? (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 shrink-0 mt-0.5">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                Limited Free Access Active
                <Badge variant="outline" className="text-[10px] border-amber-500/40 text-amber-700 bg-amber-500/10">
                  20 Questions Preview
                </Badge>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Non-subscribers can practice a limited 20-question preview (5 questions per subject, 15 mins). Subscribe to unlock the full 180-question JAMB UTME CBT (60 Use of English + 40 × 3 subjects, 2 hours) and complete past question bank.
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="shrink-0 gap-1.5 font-bold bg-amber-600 hover:bg-amber-700 text-white">
            <Link href="/billing">
              <Crown className="h-4 w-4" /> Subscribe for Full Access
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/5">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span>
              <strong>Full CBT Subscription Active:</strong> Unlimited access to standard 180-question JAMB UTME simulations (60 Use of English + 40 × 3 subjects).
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Subject Selection & Config */}
        <Card className="lg:col-span-8 border-[0.5px] border-border/40 bg-card/50 backdrop-blur-md shadow-lg rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Select Your 4 JAMB UTME Subjects
                </CardTitle>
                <CardDescription>
                  Use of English is compulsory (60 questions). Pick exactly 3 other subjects (40 questions each).
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  'text-xs font-bold px-3 py-1',
                  selectedSubjects.length === JAMB_TOTAL_SUBJECTS
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                )}
              >
                {selectedSubjects.length} / {JAMB_TOTAL_SUBJECTS} Subjects Selected
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Quick Course Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Quick Subject Combinations
              </label>
              <div className="flex flex-wrap gap-2">
                {COURSE_PRESETS.map((preset) => {
                  const isActive =
                    preset.subjects.length === selectedSubjects.length &&
                    preset.subjects.every((s) => selectedSubjects.includes(s));
                  return (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyPreset(preset.subjects)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all',
                        isActive
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-background/60 border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/40'
                      )}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {JAMB_SUBJECTS.map((sub) => {
                const isSelected = selectedSubjects.includes(sub.name);
                const isCompulsory = !!sub.compulsory;
                const qCount = getQuestionCountForSubject(sub.name, isSubscribed);

                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => toggleSubject(sub.name)}
                    className={cn(
                      'p-3 rounded-xl border text-left transition-all duration-150 flex items-center justify-between gap-2',
                      isSelected
                        ? 'bg-primary/10 border-primary text-foreground shadow-sm'
                        : 'bg-background/50 border-border/50 text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2
                        className={cn(
                          'h-4 w-4 shrink-0',
                          isSelected ? 'text-primary fill-primary/15' : 'text-muted-foreground/30'
                        )}
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate">{sub.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {isCompulsory ? 'Compulsory • 60 Qs' : `${sub.category} • 40 Qs`}
                        </span>
                      </div>
                    </div>
                    {isCompulsory ? (
                      <Badge className="text-[9px] px-1.5 py-0 h-4 bg-primary text-primary-foreground shrink-0">
                        Required
                      </Badge>
                    ) : isSelected ? (
                      <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border-primary/40 text-primary shrink-0">
                        {qCount} Qs
                      </Badge>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Exam Mode & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/40">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">CBT Mode</label>
                <Select value={examMode} onValueChange={(v) => setExamMode(v as 'Full Exam' | 'Practice Mode')}>
                  <SelectTrigger className="bg-background/80 h-11 border-border/60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full Exam">Standard JAMB Exam (Timed — 2 Hours)</SelectItem>
                    <SelectItem value="Practice Mode">Study / Practice Mode (Instant Explanations)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Past Question Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="bg-background/80 h-11 border-border/60">
                    <SelectValue placeholder="Select Exam Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Years (Randomized JAMB Mix)</SelectItem>
                    <SelectItem value="2022">2022 JAMB Past Questions</SelectItem>
                    <SelectItem value="2021">2021 JAMB Past Questions</SelectItem>
                    <SelectItem value="2020">2020 JAMB Past Questions</SelectItem>
                    <SelectItem value="2019">2019 JAMB Past Questions</SelectItem>
                    <SelectItem value="2018">2018 JAMB Past Questions</SelectItem>
                    <SelectItem value="2017">2017 JAMB Past Questions</SelectItem>
                    <SelectItem value="2016">2016 JAMB Past Questions</SelectItem>
                    <SelectItem value="2015">2015 JAMB Past Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right: JAMB Exam Slip Summary */}
        <Card className="lg:col-span-4 border-[0.5px] border-border/40 bg-card/50 backdrop-blur-md shadow-lg rounded-2xl flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold text-primary flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              JAMB CBT Exam Slip
            </CardTitle>
            <CardDescription>Review your 4-subject UTME configuration before launching.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 flex-1">
            <div className="p-4 rounded-xl bg-background/60 border space-y-3">
              <div>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">
                  Candidate
                </span>
                <span className="text-sm font-bold text-foreground">
                  {currentUserProfile?.name || 'JAMB Candidate'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block mb-1.5">
                  Selected Subjects ({selectedSubjects.length}/4)
                </span>
                <div className="space-y-1.5">
                  {selectedSubjects.map((sub, idx) => {
                    const qCount = getQuestionCountForSubject(sub, isSubscribed);
                    const fullQuota = sub === JAMB_ENGLISH_SUBJECT ? 60 : 40;
                    return (
                      <div
                        key={sub}
                        className="flex items-center justify-between text-xs p-2 rounded-lg bg-muted/40 border border-border/40"
                      >
                        <span className="font-semibold truncate">
                          {idx + 1}. {sub}
                        </span>
                        <Badge variant="secondary" className="text-[10px] font-mono shrink-0">
                          {isSubscribed ? `${fullQuota} Qs` : `${qCount}/${fullQuota} Qs`}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/15">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                    Total Questions
                  </span>
                  <span className="text-lg font-extrabold text-primary">{totalQuestions}</span>
                  {!isSubscribed && (
                    <span className="text-[10px] text-amber-600 block font-medium">of 180 (Free Preview)</span>
                  )}
                </div>
                <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/15">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold block">
                    Duration
                  </span>
                  <span className="text-lg font-extrabold text-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4 text-primary" />
                    {durationMinutes}m
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    {isSubscribed ? '2 Hours Standard' : 'Preview Timer'}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-muted-foreground pt-1 space-y-1">
                <p>• Scoring: Official <strong>400-Point</strong> JAMB Aggregate (100 per subject)</p>
                <p>• Shortcuts: Keys <strong>A, B, C, D</strong> to answer • <strong>N/P</strong> Next/Prev • <strong>S</strong> Submit</p>
                <p>• Built-in <strong>JAMB Calculator</strong> included in exam screen</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-4 border-t border-border/40 flex flex-col gap-2">
            <Button
              onClick={handleStartExam}
              disabled={isNavigating || selectedSubjects.length !== JAMB_TOTAL_SUBJECTS}
              className="w-full h-12 rounded-xl text-md font-bold shadow-md hover:scale-[1.01] transition-all bg-primary hover:bg-primary/95 text-primary-foreground flex items-center justify-center gap-2"
            >
              {isNavigating ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current" />
                  {isSubscribed ? 'Start JAMB UTME CBT' : 'Start Free Preview (20 Qs)'}
                </>
              )}
            </Button>
            {!isSubscribed && (
              <Button variant="outline" asChild className="w-full h-10 rounded-xl text-xs font-bold border-amber-500/40 text-amber-700 hover:bg-amber-500/10">
                <Link href="/billing">
                  <Crown className="h-3.5 w-3.5 mr-1.5" /> Unlock Full 180 Questions
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
