'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  GraduationCap,
  ListChecks,
  Play,
  Search,
  BarChart2,
  Trophy,
  Flame,
  CheckSquare,
  Square,
  FileText,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAcademy } from '@/context/academy-context';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { JAMB_SYLLABUS, type JambSyllabusSubject } from '@/data/jamb-syllabus';

const getProgressColor = (p: number) => {
  if (p === 100) return { bar: 'bg-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30' };
  if (p >= 60) return { bar: 'bg-blue-500', text: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/30' };
  if (p >= 20) return { bar: 'bg-amber-500', text: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30' };
  return { bar: 'bg-slate-400', text: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' };
};

const getStatusLabel = (p: number) => {
  if (p === 100) return 'Completed';
  if (p > 0) return 'In Progress';
  return 'Not Started';
};

const getSubjectAccent = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('english')) return 'from-violet-600/60';
  if (n.includes('math')) return 'from-blue-600/60';
  if (n.includes('phys')) return 'from-cyan-600/60';
  if (n.includes('chem')) return 'from-green-600/60';
  if (n.includes('biol')) return 'from-emerald-600/60';
  if (n.includes('geog')) return 'from-teal-600/60';
  if (n.includes('agric')) return 'from-lime-600/60';
  if (n.includes('govern')) return 'from-red-600/60';
  if (n.includes('econ')) return 'from-orange-600/60';
  if (n.includes('liter')) return 'from-pink-600/60';
  if (n.includes('account')) return 'from-yellow-600/60';
  if (n.includes('commer')) return 'from-amber-600/60';
  if (n.includes('relig') || n.includes('crs') || n.includes('irk')) return 'from-purple-600/60';
  return 'from-primary/60';
};

function getTotalTopics(subject: JambSyllabusSubject): number {
  return subject.sections.reduce((acc, s) => acc + s.topics.length, 0);
}

function loadCompletedTopicIds(subjectId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`pinnacle_jamb_syllabus_${subjectId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function SyllabusTrackerPage() {
  const router = useRouter();
  const { currentUserProfile } = useAcademy();

  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState<string>('all');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'not-started' | 'in-progress' | 'completed'>('all');
  const [completedMap, setCompletedMap] = React.useState<Record<string, string[]>>({});
  const [activeSyllabus, setActiveSyllabus] = React.useState<JambSyllabusSubject | null>(null);

  // Hydrate topic progress from localStorage
  React.useEffect(() => {
    const initial: Record<string, string[]> = {};
    JAMB_SYLLABUS.forEach((sub) => {
      initial[sub.id] = loadCompletedTopicIds(sub.id);
    });
    setCompletedMap(initial);
  }, []);

  const toggleTopic = (subjectId: string, topicId: string) => {
    setCompletedMap((prev) => {
      const current = prev[subjectId] || [];
      const updated = current.includes(topicId)
        ? current.filter((id) => id !== topicId)
        : [...current, topicId];
      if (typeof window !== 'undefined') {
        localStorage.setItem(`pinnacle_jamb_syllabus_${subjectId}`, JSON.stringify(updated));
      }
      return { ...prev, [subjectId]: updated };
    });
  };

  const getSubjectProgress = (sub: JambSyllabusSubject): number => {
    const total = getTotalTopics(sub);
    if (total === 0) return 0;
    const done = (completedMap[sub.id] || []).length;
    return Math.round((done / total) * 100);
  };

  const studentSubjectsLower = React.useMemo(() => {
    return (currentUserProfile?.utmeSubjects || []).map((s) =>
      s.toLowerCase() === 'english language' ? 'use of english' : s.toLowerCase()
    );
  }, [currentUserProfile]);

  const stats = React.useMemo(() => {
    const total = JAMB_SYLLABUS.length;
    const progresses = JAMB_SYLLABUS.map((s) => getSubjectProgress(s));
    const completed = progresses.filter((p) => p === 100).length;
    const inProgress = progresses.filter((p) => p > 0 && p < 100).length;
    const avgProgress = total > 0 ? Math.round(progresses.reduce((a, b) => a + b, 0) / total) : 0;
    return { total, completed, inProgress, avgProgress };
  }, [completedMap]);

  const filteredSubjects = React.useMemo(() => {
    return JAMB_SYLLABUS.filter((sub) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = sub.name.toLowerCase().includes(q) || sub.description.toLowerCase().includes(q);
        const matchesTopic = sub.sections.some((sec) =>
          sec.topics.some((t) => t.title.toLowerCase().includes(q))
        );
        if (!matchesName && !matchesTopic) return false;
      }

      if (filterCategory === 'my-subjects') {
        if (!studentSubjectsLower.includes(sub.name.toLowerCase())) return false;
      } else if (filterCategory !== 'all') {
        if (sub.category !== filterCategory) return false;
      }

      if (filterStatus !== 'all') {
        const p = getSubjectProgress(sub);
        if (filterStatus === 'completed' && p !== 100) return false;
        if (filterStatus === 'in-progress' && !(p > 0 && p < 100)) return false;
        if (filterStatus === 'not-started' && p !== 0) return false;
      }

      return true;
    });
  }, [searchTerm, filterCategory, filterStatus, completedMap, studentSubjectsLower]);

  return (
    <div className="max-w-6xl mx-auto py-6 px-2 sm:px-4 space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
              <GraduationCap className="h-8 w-8 text-primary" />
              Official JAMB UTME Syllabus
            </h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 font-bold">
              {JAMB_SYLLABUS.length} UTME Subjects
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Explore the official JAMB UTME syllabus topics & objectives, tick off completed topics, and launch CBT practice.
          </p>
        </div>
        <Button asChild className="gap-2 font-bold shrink-0">
          <Link href="/cbt-simulator/select-subjects">
            <Play className="h-4 w-4 fill-current" /> Launch JAMB CBT
          </Link>
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'JAMB Subjects', value: stats.total, icon: BookOpen, color: 'text-primary' },
          { label: 'Completed', value: stats.completed, icon: Trophy, color: 'text-emerald-500' },
          { label: 'In Progress', value: stats.inProgress, icon: Flame, color: 'text-amber-500' },
          { label: 'Overall Mastery', value: `${stats.avgProgress}%`, icon: BarChart2, color: 'text-blue-500' },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card/50 border-border/40">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn('p-2 rounded-lg bg-muted/50', stat.color)}>
                <stat.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-2xl font-black">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search JAMB subjects or topics (e.g. Stoichiometry, Vectors, Concord)…"
            className="pl-9 h-10 bg-background/80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="h-10 w-full sm:w-48 bg-background/80">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {studentSubjectsLower.length > 0 && (
              <SelectItem value="my-subjects">My 4 UTME Subjects</SelectItem>
            )}
            <SelectItem value="Compulsory">Compulsory (English)</SelectItem>
            <SelectItem value="Science">Science</SelectItem>
            <SelectItem value="Arts">Arts</SelectItem>
            <SelectItem value="Commercial & Social Sciences">Commercial & Social</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
          <SelectTrigger className="h-10 w-full sm:w-44 bg-background/80">
            <ListChecks className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Subject Cards Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[260px] text-center p-10 border rounded-2xl bg-muted/10">
          <BookOpen className="h-14 w-14 text-muted-foreground/30 mb-3" />
          <h3 className="text-lg font-semibold">No JAMB subjects match your search</h3>
          <p className="text-muted-foreground text-sm mt-1">Try clearing the search bar or switching categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredSubjects.map((subject) => {
            const progress = getSubjectProgress(subject);
            const colors = getProgressColor(progress);
            const totalTopics = getTotalTopics(subject);
            const doneCount = (completedMap[subject.id] || []).length;
            const isStudentSubject = studentSubjectsLower.includes(subject.name.toLowerCase());

            return (
              <Card
                key={subject.id}
                className="relative overflow-hidden flex flex-col border transition-all duration-200 hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5 bg-card/60"
              >
                <div className={cn('h-1.5 w-full bg-gradient-to-r to-transparent', getSubjectAccent(subject.name))} />

                <CardHeader className="p-4 pb-2 space-y-2">
                  <div className="flex items-center justify-between gap-1">
                    <Badge
                      variant="outline"
                      className={cn('text-[9px] h-4 px-1.5 py-0 rounded-full font-bold', colors.bg, colors.text)}
                    >
                      {progress === 100 ? (
                        <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                      ) : progress > 0 ? (
                        <Clock className="h-2.5 w-2.5 mr-0.5" />
                      ) : (
                        <Circle className="h-2.5 w-2.5 mr-0.5" />
                      )}
                      {getStatusLabel(progress)}
                    </Badge>
                    <Badge variant="secondary" className="text-[9px] h-4 px-1.5 font-mono">
                      {subject.questionCount} Qs
                    </Badge>
                  </div>

                  <div className="flex items-start justify-between gap-1">
                    <CardTitle
                      className="text-base font-bold leading-tight cursor-pointer hover:text-primary transition-colors"
                      onClick={() => setActiveSyllabus(subject)}
                    >
                      {subject.name}
                    </CardTitle>
                    {isStudentSubject && (
                      <span title="In your UTME combination" className="shrink-0 mt-0.5">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {subject.description}
                  </p>
                </CardHeader>

                <CardContent className="px-4 pb-3 space-y-2 flex-1">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                      <span>{doneCount}/{totalTopics} Topics</span>
                      <span className={cn('font-mono', colors.text)}>{progress}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all duration-500', colors.bar)}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="px-4 pb-4 pt-0 flex gap-2">
                  <Button
                    className="flex-1 h-8 text-xs font-semibold gap-1.5"
                    onClick={() => setActiveSyllabus(subject)}
                  >
                    <FileText className="h-3.5 w-3.5" />
                    View Syllabus
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1"
                    onClick={() => router.push('/cbt-simulator/select-subjects')}
                  >
                    <Play className="h-3 w-3" /> CBT
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Interactive JAMB Syllabus Viewer & Checklist Dialog */}
      <Dialog open={!!activeSyllabus} onOpenChange={(open) => !open && setActiveSyllabus(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          {activeSyllabus && (
            <>
              <DialogHeader className="pb-3 border-b">
                <div className="flex items-center justify-between gap-2 pr-6">
                  <div>
                    <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {activeSyllabus.name} — JAMB UTME Syllabus
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                      {activeSyllabus.description} ({activeSyllabus.questionCount} questions in UTME)
                    </DialogDescription>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs shrink-0">
                    {getSubjectProgress(activeSyllabus)}% Mastered
                  </Badge>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 pr-4 py-4">
                <div className="space-y-6">
                  {activeSyllabus.sections.map((section, sIdx) => (
                    <div key={sIdx} className="space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-primary border-b pb-1">
                        {section.title}
                      </h3>
                      <div className="space-y-2.5">
                        {section.topics.map((topic) => {
                          const isChecked = (completedMap[activeSyllabus.id] || []).includes(topic.id);
                          return (
                            <div
                              key={topic.id}
                              onClick={() => toggleTopic(activeSyllabus.id, topic.id)}
                              className={cn(
                                'p-3.5 rounded-xl border cursor-pointer transition-all',
                                isChecked
                                  ? 'bg-emerald-500/10 border-emerald-500/30'
                                  : 'bg-background/60 border-border/60 hover:border-primary/40'
                              )}
                            >
                              <div className="flex items-start gap-3">
                                {isChecked ? (
                                  <CheckSquare className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                ) : (
                                  <Square className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                )}
                                <div className="space-y-1 flex-1">
                                  <p className={cn('text-sm font-bold', isChecked && 'line-through text-muted-foreground')}>
                                    {topic.title}
                                  </p>
                                  {topic.objectives && topic.objectives.length > 0 && (
                                    <ul className="list-disc pl-4 space-y-0.5 text-xs text-muted-foreground">
                                      {topic.objectives.map((obj, oIdx) => (
                                        <li key={oIdx}>{obj}</li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="pt-3 border-t flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  Click any topic to mark it as studied. Progress is saved automatically.
                </p>
                <Button asChild size="sm" className="gap-1.5 font-bold">
                  <Link href="/cbt-simulator/select-subjects">
                    <Play className="h-3.5 w-3.5 fill-current" /> Practise in CBT
                  </Link>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
