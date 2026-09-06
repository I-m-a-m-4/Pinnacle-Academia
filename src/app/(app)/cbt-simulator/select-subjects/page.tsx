'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAcademy } from "@/context/academy-context";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Play, Settings, RefreshCw, Layers, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamic question loader to ensure lightweight client bundles
async function fetchSubjectQuestions(subName: string): Promise<any[]> {
    try {
        switch (subName) {
            case 'Use of English':
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
            case 'Aptitude Test':
                return (await import('../data/aptitude')).aptitudeQuestions;
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
            case 'Current Affairs':
                return (await import('../data/current-affairs')).currentAffairsQuestions;
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

const DEFAULT_MAPPINGS = [
    {
        university: 'Obafemi Awolowo University (OAU)',
        course: 'Medicine and Surgery',
        subjects: ['Aptitude Test', 'Biology', 'Chemistry', 'Physics']
    },
    {
        university: 'Obafemi Awolowo University (OAU)',
        course: 'Engineering Courses',
        subjects: ['Aptitude Test', 'Mathematics', 'Physics', 'Chemistry']
    },
    {
        university: 'Obafemi Awolowo University (OAU)',
        course: 'Computer Science',
        subjects: ['Aptitude Test', 'Mathematics', 'Physics', 'Chemistry']
    },
    {
        university: 'Obafemi Awolowo University (OAU)',
        course: 'Agricultural Science / Forestry / Food Science',
        subjects: ['Aptitude Test', 'Biology', 'Chemistry', 'Agricultural Science']
    },
    {
        university: 'Obafemi Awolowo University (OAU)',
        course: 'Geography / Environmental Design',
        subjects: ['Aptitude Test', 'Geography', 'Mathematics', 'Physics']
    },
    {
        university: 'Obafemi Awolowo University (OAU)',
        course: 'Agric. Science / Pure & Applied Biology',
        subjects: ['Aptitude Test', 'Agricultural Science', 'Biology', 'Chemistry']
    },
    {
        university: 'Obafemi Awolowo University (OAU)',
        course: 'Arts / Literature / Law',
        subjects: ['Aptitude Test', 'Literature in English', 'Government', 'Christian Religious Studies']
    },
    {
        university: 'Obafemi Awolowo University (OAU)',
        course: 'Accounting / Finance / Social Sciences',
        subjects: ['Aptitude Test', 'Mathematics', 'Economics', 'Financial Accounting']
    },
    {
        university: 'University of Ilorin (UNILORIN)',
        course: 'Medicine and Surgery',
        subjects: ['Use of English', 'Biology', 'Chemistry', 'Aptitude Test']
    },
    {
        university: 'University of Ilorin (UNILORIN)',
        course: 'Computer Science',
        subjects: ['Use of English', 'Mathematics', 'Physics', 'Aptitude Test']
    },
    {
        university: 'University of Ilorin (UNILORIN)',
        course: 'Engineering Courses',
        subjects: ['Use of English', 'Mathematics', 'Physics', 'Aptitude Test']
    },
    {
        university: 'University of Ilorin (UNILORIN)',
        course: 'Agricultural Science / Forestry / Food Science',
        subjects: ['Use of English', 'Biology', 'Chemistry', 'Aptitude Test']
    },
    {
        university: 'University of Ilorin (UNILORIN)',
        course: 'Arts / Literature / Law',
        subjects: ['Use of English', 'Literature in English', 'Government', 'Aptitude Test']
    },
    {
        university: 'University of Ilorin (UNILORIN)',
        course: 'Accounting / Finance / Social Sciences',
        subjects: ['Use of English', 'Mathematics', 'Economics', 'Aptitude Test']
    },
    {
        university: 'University of Lagos (UNILAG)',
        course: 'Computer Science',
        subjects: ['Use of English', 'Mathematics', 'Physics', 'Aptitude Test']
    },
    {
        university: 'University of Lagos (UNILAG)',
        course: 'Medicine and Surgery',
        subjects: ['Use of English', 'Biology', 'Chemistry', 'Aptitude Test']
    },
    {
        university: 'University of Lagos (UNILAG)',
        course: 'Engineering Courses',
        subjects: ['Use of English', 'Mathematics', 'Physics', 'Aptitude Test']
    },
    {
        university: 'University of Lagos (UNILAG)',
        course: 'Agricultural Science / Forestry / Food Science',
        subjects: ['Use of English', 'Biology', 'Chemistry', 'Aptitude Test']
    },
    {
        university: 'University of Lagos (UNILAG)',
        course: 'Arts / Literature / Law',
        subjects: ['Use of English', 'Literature in English', 'Government', 'Aptitude Test']
    },
    {
        university: 'University of Lagos (UNILAG)',
        course: 'Accounting / Finance / Social Sciences',
        subjects: ['Use of English', 'Mathematics', 'Economics', 'Aptitude Test']
    }
];

const DEFAULT_SUBJECTS = [
    { id: 'sub-eng', name: 'Use of English', price: 50, category: 'General', stock: 100, imageUrl: '' },
    { id: 'sub-math', name: 'Mathematics', price: 50, category: 'Science', stock: 100, imageUrl: '' },
    { id: 'sub-phys', name: 'Physics', price: 50, category: 'Science', stock: 100, imageUrl: '' },
    { id: 'sub-chem', name: 'Chemistry', price: 50, category: 'Science', stock: 100, imageUrl: '' },
    { id: 'sub-bio', name: 'Biology', price: 50, category: 'Science', stock: 100, imageUrl: '' },
    { id: 'sub-lit', name: 'Literature in English', price: 50, category: 'Arts', stock: 100, imageUrl: '' },
    { id: 'sub-gov', name: 'Government', price: 50, category: 'Arts', stock: 100, imageUrl: '' },
    { id: 'sub-eco', name: 'Economics', price: 50, category: 'Social Sciences', stock: 100, imageUrl: '' },
    { id: 'sub-acc', name: 'Financial Accounting', price: 50, category: 'Social Sciences', stock: 100, imageUrl: '' },
    { id: 'sub-crs', name: 'Christian Religious Studies', price: 50, category: 'Arts', stock: 100, imageUrl: '' },
    { id: 'sub-apt', name: 'Aptitude Test', price: 50, category: 'General', stock: 100, imageUrl: '' },
    { id: 'sub-geo', name: 'Geography', price: 50, category: 'Science', stock: 100, imageUrl: '' },
    { id: 'sub-agr', name: 'Agricultural Science', price: 50, category: 'Science', stock: 100, imageUrl: '' },
    { id: 'sub-com', name: 'Commerce', price: 50, category: 'Social Sciences', stock: 100, imageUrl: '' },
    { id: 'sub-irk', name: 'Islamic Religious Studies', price: 50, category: 'Arts', stock: 100, imageUrl: '' },
    { id: 'sub-civ', name: 'Civic Education', price: 50, category: 'General', stock: 100, imageUrl: '' },
    { id: 'sub-ins', name: 'Insurance', price: 50, category: 'Commercial', stock: 100, imageUrl: '' },
    { id: 'sub-cur', name: 'Current Affairs', price: 50, category: 'General', stock: 100, imageUrl: '' },
    { id: 'sub-his', name: 'History', price: 50, category: 'Arts', stock: 100, imageUrl: '' }
];


export default function SelectProductsPage() {
    const { currentUserProfile, clearCart } = useAcademy();
    const router = useRouter();
    const { toast } = useToast();

    const [activeUni, setActiveUni] = React.useState('Obafemi Awolowo University (OAU)');
    const [activeCourse, setActiveCourse] = React.useState('Medicine and Surgery');
    const [selectedYear, setSelectedYear] = React.useState('All');
    const [isNavigating, setIsNavigating] = React.useState(false);
    const [customSubjects, setCustomSubjects] = React.useState<string[]>([]);

    // If there is an active exam session, redirect to the active test page directly
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const activeSession = sessionStorage.getItem('active_exam_session');
            if (activeSession) {
                router.push('/cbt-simulator/active-test');
            }
        }
    }, [router]);

    // Sync user target profile
    React.useEffect(() => {
        if (currentUserProfile?.targetInstitution) {
            setActiveUni(currentUserProfile.targetInstitution);
        }
        if (currentUserProfile?.targetCourse) {
            setActiveCourse(currentUserProfile.targetCourse);
        }
    }, [currentUserProfile]);

    const allMappings = DEFAULT_MAPPINGS;

    const availableUniversities = React.useMemo(() => {
        const unis = new Set<string>();
        allMappings.forEach(m => unis.add(m.university));
        return Array.from(unis);
    }, []);

    const availableCoursesForSelectedUni = React.useMemo(() => {
        const courses = new Set<string>();
        allMappings.filter(m => m.university.toLowerCase() === activeUni.toLowerCase()).forEach(m => courses.add(m.course));
        return Array.from(courses);
    }, [activeUni]);

    // Update course selection when university changes
    React.useEffect(() => {
        const courses = availableCoursesForSelectedUni;
        if (courses.length > 0 && !courses.includes(activeCourse)) {
            setActiveCourse(courses[0]);
        }
    }, [activeUni, availableCoursesForSelectedUni, activeCourse]);

    const activeMapping = React.useMemo(() => {
        return allMappings.find(m => 
            m.university.toLowerCase() === activeUni.toLowerCase() && 
            m.course.toLowerCase() === activeCourse.toLowerCase()
        ) || null;
    }, [activeUni, activeCourse]);

    const handleStartExam = async () => {
        setIsNavigating(true);
        clearCart(); // Clear old selection

        // Load based on selected subjects
        const subjectsToUse = customSubjects.length > 0
            ? DEFAULT_SUBJECTS.filter(s => customSubjects.includes(s.name))
            : DEFAULT_SUBJECTS.filter(sub => {
                if (activeMapping) {
                    return activeMapping.subjects.some((s: string) => s.toLowerCase() === sub.name.toLowerCase());
                }
                return true;
            });

        if (subjectsToUse.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Configuration Error',
                description: 'Please select at least one subject to begin.'
            });
            setIsNavigating(false);
            return;
        }

        const isOAU = activeUni.toLowerCase().includes('oau') || activeUni.toLowerCase().includes('obafemi');

        const examSubjects = await Promise.all(subjectsToUse.map(async sub => {
            const questions = await fetchSubjectQuestions(sub.name);

            let filteredQuestions = questions;
            if (selectedYear !== 'All') {
                filteredQuestions = questions.filter(q => {
                    const yearMatch = q.questionText.match(/\b(20\d{2})\b/);
                    return yearMatch && yearMatch[1] === selectedYear;
                });
                if (filteredQuestions.length === 0) {
                    filteredQuestions = questions;
                }
            }

            // Shuffle questions to ensure variety
            let shuffledQuestions = [...filteredQuestions].sort(() => 0.5 - Math.random());

            return {
                id: sub.id,
                name: sub.name,
                questions: shuffledQuestions.slice(0, isOAU ? 10 : 40) // 10 questions per subject for OAU, 40 for others
            };
        }));

        const activeSession = {
            receiptNumber: `slip-${Math.floor(100000 + Math.random() * 900000)}`,
            subjects: examSubjects,
            mode: 'Full Exam',
            timeLimit: isOAU ? 40 : examSubjects.length * 30, // 40 mins for OAU, 30 mins per subject for others
            targetScore: 70,
            studentName: currentUserProfile?.name || 'Student',
            university: activeUni
        };

        sessionStorage.setItem('active_exam_session', JSON.stringify(activeSession));

        toast({
            variant: 'success',
            title: 'Exam Slip Generated',
            description: `Starting Post-UTME Exam with ${examSubjects.length} subjects.`
        });

        router.push('/cbt-simulator/active-test');
    };

    const toggleCustomSubject = (subName: string) => {
        setCustomSubjects(prev => 
            prev.includes(subName) ? prev.filter(s => s !== subName) : [...prev, subName]
        );
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto space-y-8 py-6 px-4 md:px-10 xl:px-16">
            {/* Header section with brand colors */}
            <div className="flex items-center justify-between pb-6 border-b border-border/40">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                        <GraduationCap className="h-8 w-8 text-primary" />
                        Post-UTME CBT Simulator
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Configure your target institution requirements and launch your exam workspace immediately.
                    </p>
                </div>
                <Button variant="outline" className="gap-2 border-yellow-500/30 text-yellow-600 hover:bg-yellow-500/10 hover:text-yellow-700" onClick={() => router.push('/cbt-simulator/leaderboard')}>
                    <Trophy className="h-4 w-4" /> Global Leaderboard
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-12 gap-8">
                {/* Configuration Panel */}
                <Card className="md:col-span-3 lg:col-span-8 border-[0.5px] border-border/40 bg-card/40 backdrop-blur-md shadow-lg rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Settings className="h-5 w-5 text-primary" />
                            Simulation Configuration
                        </CardTitle>
                        <CardDescription>Configure target institution preferences or construct a custom set.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground">Target University</label>
                                <Select value={activeUni} onValueChange={(val) => {
                                    setActiveUni(val);
                                    setCustomSubjects([]);
                                }}>
                                    <SelectTrigger className="bg-background/80 h-11 border-border/60">
                                        <SelectValue placeholder="Select University" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableUniversities.map(uni => (
                                            <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground">Course of Study / Option</label>
                                <Select value={activeCourse} onValueChange={(val) => {
                                    setActiveCourse(val);
                                    setCustomSubjects([]);
                                }}>
                                    <SelectTrigger className="bg-background/80 h-11 border-border/60">
                                        <SelectValue placeholder="Select Course" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableCoursesForSelectedUni.map(course => (
                                            <SelectItem key={course} value={course}>{course}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-muted-foreground">Exam Year</label>
                                <Select value={selectedYear} onValueChange={setSelectedYear}>
                                    <SelectTrigger className="bg-background/80 h-11 border-border/60">
                                        <SelectValue placeholder="Select Exam Year" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Years (Randomized Mix)</SelectItem>
                                        <SelectItem value="2022">2022 Past Questions</SelectItem>
                                        <SelectItem value="2021">2021 Past Questions</SelectItem>
                                        <SelectItem value="2020">2020 Past Questions</SelectItem>
                                        <SelectItem value="2019">2019 Past Questions</SelectItem>
                                        <SelectItem value="2018">2018 Past Questions</SelectItem>
                                        <SelectItem value="2017">2017 Past Questions</SelectItem>
                                        <SelectItem value="2016">2016 Past Questions</SelectItem>
                                        <SelectItem value="2015">2015 Past Questions</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Subject Customizer Catalog */}
                        <div className="pt-4 border-t border-border/40 space-y-3">
                            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                                <Layers className="h-3.5 w-3.5" /> Adjust Target Subjects (Optional Override)
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {DEFAULT_SUBJECTS.map(sub => {
                                    const isSelected = customSubjects.length > 0 
                                        ? customSubjects.includes(sub.name)
                                        : activeMapping?.subjects.includes(sub.name);
                                    
                                    return (
                                        <button
                                            key={sub.id}
                                            onClick={() => toggleCustomSubject(sub.name)}
                                            className={cn(
                                                "p-3 rounded-xl border text-xs font-bold transition-all duration-200 text-left flex items-center gap-2",
                                                isSelected 
                                                    ? "bg-primary/10 border-primary text-foreground"
                                                    : "bg-background/40 border-border/40 text-muted-foreground hover:bg-muted/30"
                                            )}
                                        >
                                            <BookOpen className="h-3.5 w-3.5 shrink-0" />
                                            <span className="line-clamp-1">{sub.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Slip Summary & Play CTA */}
                <Card className="md:col-span-2 lg:col-span-4 border-[0.5px] border-border/40 bg-card/40 backdrop-blur-md shadow-lg rounded-2xl flex flex-col justify-between">
                    <CardHeader>
                        <CardTitle className="text-md font-bold text-primary flex items-center gap-1.5">
                            Exam Workspace Summary
                        </CardTitle>
                        <CardDescription>Review examination workspace configurations before initiating.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-1">
                        <div className="p-4 rounded-xl bg-background/50 border space-y-3">
                            <div>
                                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">University</span>
                                <span className="text-sm font-bold text-foreground">{activeUni}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">Course & Exam Year</span>
                                <span className="text-sm font-semibold text-foreground">{activeCourse} ({selectedYear === 'All' ? 'All Years' : `${selectedYear} Past Questions`})</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">Timing & Questions</span>
                                <span className="text-sm font-semibold text-foreground">
                                    {activeUni.toLowerCase().includes('oau') || activeUni.toLowerCase().includes('obafemi')
                                        ? `${(customSubjects.length > 0 ? customSubjects.length : (activeMapping?.subjects.length || 0)) * 10} Questions | 40 Minutes`
                                        : `${(customSubjects.length > 0 ? customSubjects.length : (activeMapping?.subjects.length || 0)) * 40} Questions | ${(customSubjects.length > 0 ? customSubjects.length : (activeMapping?.subjects.length || 0)) * 30} Minutes`
                                    }
                                </span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-border/40">
                        <Button 
                            onClick={handleStartExam} 
                            disabled={isNavigating} 
                            className="w-full h-12 rounded-xl text-md font-bold shadow-md hover:scale-[1.01] transition-all bg-primary hover:bg-primary/95 text-primary-foreground flex items-center justify-center gap-2"
                        >
                            {isNavigating ? (
                                <RefreshCw className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Play className="h-5 w-5 fill-current" />
                                    Start Examination
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
