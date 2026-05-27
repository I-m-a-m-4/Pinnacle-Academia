import { InteractiveGrid } from '@/components/interactive-grid';
import {
    ShoppingCart,
    ArrowRight,
    Bot,
    BrainCircuit,
    Check,
    Globe,
    Monitor,
    Package,
    Users,
    BarChart2,
    UserCog,
    WifiOff,
    Download,
    ShieldCheck,
    Clock,
    InfinityIcon,
    FileText,
    ScanBarcode,
    Printer,
    Workflow,
    TrendingUp,
    Store,
    DollarSign,
    Trophy,
    Box,
    Database,
    Shirt,
    Coffee,
    BookOpen,
    Sparkles,
    Smartphone,
    Search,
    Layers,
    Award
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import MarketingHeader from '@/components/layout/marketing-header';
import MarketingFooter from '@/components/layout/marketing-footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AppConfig } from '@/lib/config';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MarqueeSection } from '@/components/marquee-section';
import { ThemeProvider } from '@/components/theme-provider';

// Client Components
import { HeroInputForm } from '@/components/home/hero-input-form';
import { DashboardCarousel } from '@/components/home/dashboard-carousel';
import { ZenAIInsights } from '@/components/home/zen-ai-insights';
import { PricingPlans } from '@/components/home/pricing-plans';

const faqItems = [
    {
        question: "Who is Pinnacle Academia built for?",
        answer: "Pinnacle Academia is designed for students seeking academic excellence — preparing for local exams (JAMB, WAEC, NECO, POST-UTME, JUPEB, IJMB) or international exams (SAT, IELTS, GRE, GMAT)."
    },
    {
        question: "What makes Pinnacle Academia different from other tutorial centers?",
        answer: "We focus on results, not just class hours. Our personalized tutoring, expert-led hybrid model, and extensive study question banks prepare you to hit top scores on your first attempt."
    },
    {
        question: "Do you offer physical learning centers?",
        answer: "Yes. Our physical tutorial centers in Lagos and Osun State are fully equipped with modern learning facilities to provide a distraction-free, highly engaging study environment."
    },
    {
        question: "Can I study online?",
        answer: "Yes! We provide robust online interactive classes covering various subjects, allowing you to learn at your comfort zone while receiving top-tier mentorship."
    },
    {
        question: "How does university admission processing work?",
        answer: "Our expert advisors provide professional guidance and handle your application process from start to finish, helping you secure admission into top universities in Nigeria and abroad."
    },
    {
        question: "Do you offer international exam preparation?",
        answer: "Yes! We cover international test preparations (SAT, IELTS, TOEFL, GRE) to open global academic opportunities for our students."
    },
    {
        question: "Are study materials free?",
        answer: "Yes. We offer downloadable JAMB syllabus outlines and years of past questions for all major subjects directly on our platform."
    },
    {
        question: "How do I get started?",
        answer: "Simply create an account on our student portal, select your program, and join the next batch of future leaders."
    }
];

const examTypes = [
    { name: 'JAMB & UTME Prep', imageUrl: '/assets/JAMBO.png', description: 'Master the syllabus and excel in your computer-based test.', link: '/signup' },
    { name: 'WAEC & NECO', imageUrl: '/assets/malestd.jpg', description: 'Ace your senior secondary school certificate examinations.', link: '/signup' },
    { name: 'Post-UTME Screening', imageUrl: '/assets/library.jpg', description: 'Prepare for your university specific entrance examinations.', link: '/signup' },
    { name: 'International Exams', imageUrl: '/assets/girl.jpg', description: 'Open global doors with SAT, IELTS, TOEFL, and GRE prep.', link: '/signup' },
    { name: 'JUPEB & IJMB', imageUrl: '/assets/degree.jpg', description: 'Gain direct entry admission into 200-level university courses.', link: '/signup' },
    { name: 'IGCSE & O-Levels', imageUrl: '/assets/book.jpg', description: 'Excel in your international and secondary general education exams.', link: '/signup' },
    { name: 'Basic Classes', imageUrl: '/assets/lockstudy.jpg', description: 'Build a solid foundation for junior level classes.', link: '/signup' },
    { name: 'Admission Consultancy', imageUrl: '/assets/admit.jpg', description: 'Secure your admission into local and foreign universities.', link: '/signup' },
];

export default function Home() {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "EducationalOrganization",
                "name": "Pinnacle Academia",
                "description": "A vibrant academic community driving excellence through online and physical tutorials, exam registration, and admission processing.",
                "offers": {
                    "@type": "Offer",
                    "price": "10000",
                    "priceCurrency": "NGN"
                }
            },
            {
                "@type": "WebPage",
                "@id": "https://pinnacle-academia.com"
            },
            {
                "@type": "FAQPage",
                "mainEntity": faqItems.map(item => ({
                    "@type": "Question",
                    "name": item.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": item.answer
                    }
                }))
            }
        ]
    };

    return (
        <ThemeProvider forcedTheme="light">
            <div className="h-full overflow-y-auto w-full antialiased overflow-x-hidden text-slate-900 bg-[#F9F8F6] relative">
                <div className="fixed grid-lines w-full h-full top-[var(--tauri-title-height,0)] right-0 left-0 pointer-events-none z-0 opacity-[0.15]"></div>
                <div className="relative z-10">
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                    />
                    <MarketingHeader />

                    {/* Main Hero Section */}
                    <main className="bg-transparent lg:pt-48 lg:pb-48 w-full max-w-none mr-auto ml-auto pt-40 pr-6 pb-32 pl-6 relative overflow-hidden">
                        <InteractiveGrid />
                        <div className="aura-background"></div>
                        <div className="grid lg:grid-cols-2 max-w-7xl mr-auto ml-auto items-center">

                            {/* Left Column: Copy & Form */}
                            <div className="max-w-xl z-10 mx-auto lg:mx-0 text-center lg:text-left">
                                <p className="uppercase text-xs font-semibold tracking-tight font-dm-sans mb-6 text-slate-900">The Premier Educational Community</p>
                                <h1 className="leading-[0.95] lg:text-6xl xl:text-7xl text-4xl md:text-5xl font-medium text-foreground tracking-tighter font-display mb-8">
                                    Igniting Minds.<br />
                                    Achieving <span className="text-muted-foreground/80 relative inline-block">Excellence.
                                        <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary -z-10" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.4"></path></svg>
                                    </span>
                                </h1>

                                <p className="leading-relaxed text-lg tracking-tight font-dm-sans max-w-lg mb-4 text-slate-900 font-medium">
                                    A Vibrant Community Driving Academic Excellence with Passion and Dedication.
                                </p>
                                <p className="leading-relaxed text-sm tracking-tight font-dm-sans max-w-lg mb-10 text-slate-600 hidden md:block">
                                    Expert Instruction. Comprehensive Study Materials. Local and International Exams Prep.
                                </p>

                                <HeroInputForm />
                                
                                <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
                                    <Link href="/login" className="group flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors">
                                        <Monitor className="h-4 w-4" />
                                        Access Student Portal
                                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                                    </Link>
                                </div>
                            </div>

                            {/* Right Column: UI Mockups */}
                            <div className="mt-8 sm:mt-0 relative [perspective:1000px]">
                                <Image 
                                    src="/pinnacle_hero_laptop.png" 
                                    alt="Pinnacle Academia Student Portal Mockup" 
                                    width={1600} 
                                    height={1200} 
                                    className="w-full h-auto block" 
                                    priority 
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    </main>

                    <MarqueeSection />



                    {/* Social Proof Section */}
                    <section className="bg-black">
                        <div className="max-w-7xl mr-auto ml-auto pt-12 pr-6 pb-12 pl-6">
                            <p className="uppercase text-xs font-medium tracking-tight font-dm-sans text-center mb-10 text-stone-300">
                                Empowering students across major examinations
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-l border-stone-700">
                                <div className="flex flex-col gap-2 hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer opacity-60 h-28 border-r border-b pt-6 pr-6 pb-6 pl-6 grayscale items-center justify-center border-stone-700">
                                    <BookOpen className="w-8 h-8 text-stone-400" />
                                    <span className="tracking-tight font-dm-sans text-sm text-stone-300 text-center">JAMB & UTME</span>
                                </div>
                                <div className="flex flex-col gap-2 hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer opacity-60 h-28 border-r border-b pt-6 pr-6 pb-6 pl-6 grayscale items-center justify-center border-stone-700">
                                    <Users className="w-8 h-8 text-stone-400" />
                                    <span className="tracking-tight font-dm-sans text-sm text-stone-300 text-center">WAEC & NECO</span>
                                </div>
                                <div className="flex flex-col gap-2 hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer opacity-60 h-28 border-r border-b pt-6 pr-6 pb-6 pl-6 grayscale items-center justify-center border-stone-700">
                                    <Trophy className="w-8 h-8 text-stone-400" />
                                    <span className="tracking-tight font-dm-sans text-sm text-stone-300 text-center">A-Levels (JUPEB)</span>
                                </div>
                                <div className="flex flex-col gap-2 hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer opacity-60 h-28 border-r border-b pt-6 pr-6 pb-6 pl-6 grayscale items-center justify-center border-stone-700">
                                    <Globe className="w-8 h-8 text-stone-400" />
                                    <span className="tracking-tight font-dm-sans text-sm text-stone-300 text-center">International (SAT)</span>
                                </div>
                                <div className="flex flex-col gap-2 hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer opacity-60 h-28 border-r border-b pt-6 pr-6 pb-6 pl-6 grayscale items-center justify-center border-stone-700">
                                    <FileText className="w-8 h-8 text-stone-400" />
                                    <span className="tracking-tight font-dm-sans text-sm text-stone-300 text-center">IGCSE & GCSE</span>
                                </div>
                                <div className="flex flex-col gap-2 hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer opacity-60 h-28 border-r border-b pt-6 pr-6 pb-6 pl-6 grayscale items-center justify-center border-stone-700">
                                    <Sparkles className="w-8 h-8 text-stone-400" />
                                    <span className="tracking-tight font-dm-sans text-sm text-stone-300 text-center">Admissions Proc.</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="features" className="py-24 px-6 bg-white border-t-2 border-slate-100 relative overflow-hidden">
                        <div className="absolute inset-0 z-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, hsl(var(--border)) 1px, transparent 0%)', backgroundSize: '50px 50px' }}></div>
                        <div className="max-w-7xl mx-auto relative z-10">
                            <div className="text-center max-w-2xl mx-auto mb-16">
                                <h2 className="text-4xl font-light text-slate-900 tracking-tight font-bricolage mb-4">
                                    Empowering Students' Academic Growth
                                </h2>
                                <p className="text-lg text-slate-600 tracking-tight font-dm-sans mb-6">
                                    Our services include the following. Pinnacle Academia provides everything a student needs to succeed.
                                </p>
                                <Button asChild variant="outline" size="sm">
                                    <Link href="/our-services">Explore Our Services</Link>
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                                {[
                                    {
                                        icon: Monitor,
                                        title: "CBT Engine",
                                        description: "High-fidelity simulator with school-specific modes (UNILAG, UI, OAU, etc.), smart AI topic analysis, gamified head-to-head speed battles against bots/peers, and complete offline capability.",
                                        bgColor: "bg-blue-100",
                                        iconColor: "text-blue-600",
                                        hoverBg: "bg-[#EFF6FF]"
                                    },
                                    {
                                        icon: Store,
                                        title: "Verified News Hub",
                                        description: "Double-layered authenticity checks (Verified badges vs. Rumors), direct bulletin feeds from campus reps, and student-profile personalization.",
                                        bgColor: "bg-green-100",
                                        iconColor: "text-green-600",
                                        hoverBg: "bg-[#FFF1F2]"
                                    },
                                    {
                                        icon: FileText,
                                        title: "Syllabus Tracker & Checker",
                                        description: "Official JAMB tracker with checklist state, summary cards for text novels, and an automated subject combination finder.",
                                        bgColor: "bg-purple-100",
                                        iconColor: "text-purple-600",
                                        hoverBg: "bg-[#FAFAF9]"
                                    },
                                    {
                                        icon: Globe,
                                        title: "Community & Mentorship",
                                        description: "Nairaland-style real-time forum using Firebase Firestore, and an interactive 15-minute booking system to consult top student mentors.",
                                        bgColor: "bg-pink-100",
                                        iconColor: "text-pink-600",
                                        hoverBg: "bg-[#FFFBEB]"
                                    },
                                    {
                                        icon: BookOpen,
                                        title: "Smart Calculators & Alerts",
                                        description: "One-Click aggregate admission calculators and fresher scholarship alerts to give you a competitive edge.",
                                        bgColor: "bg-sky-100",
                                        iconColor: "text-sky-600",
                                        hoverBg: "bg-[#EFF6FF]"
                                    },
                                    {
                                        icon: Users,
                                        title: "Expert Instructors",
                                        description: "Learn from highly experienced and dedicated educators committed to providing personalized guidance to help you succeed.",
                                        bgColor: "bg-yellow-100",
                                        iconColor: "text-yellow-600",
                                        hoverBg: "bg-[#FFF1F2]"
                                    },
                                    {
                                        icon: Database,
                                        title: "Past Questions Library",
                                        description: "Get years of exam past questions with verified answers for thorough preparation and confidence building.",
                                        bgColor: "bg-gray-200",
                                        iconColor: "text-gray-700",
                                        hoverBg: "bg-[#FFFBEB]"
                                    },
                                    {
                                        icon: Trophy,
                                        title: "Mock Examinations",
                                        description: "Take regular timed practice examinations simulating actual computer-based test (CBT) environments.",
                                        bgColor: "bg-teal-100",
                                        iconColor: "text-teal-600",
                                        hoverBg: "bg-[#EFF6FF]"
                                    },
                                    {
                                        icon: UserCog,
                                        title: "Personalized Mentorship",
                                        description: "Participate in 1-on-1 feedback sessions to identify weaker subjects and map out target improvement plans.",
                                        bgColor: "bg-rose-100",
                                        iconColor: "text-rose-600",
                                        hoverBg: "bg-[#FFF1F2]"
                                    },
                                    {
                                        icon: Clock,
                                        title: "Flexible Scheduling",
                                        description: "Choose from morning, evening, or weekend batches to balance tutorials with your other commitments.",
                                        bgColor: "bg-cyan-100",
                                        iconColor: "text-cyan-600",
                                        hoverBg: "bg-[#ECFEFF]"
                                    },
                                    {
                                        icon: TrendingUp,
                                        title: "Progress Tracking",
                                        description: "Review detailed performance analytics and statistics mapping your preparation levels over time.",
                                        bgColor: "bg-fuchsia-100",
                                        iconColor: "text-fuchsia-600",
                                        hoverBg: "bg-[#FDF4FF]"
                                    },
                                    {
                                        icon: Layers,
                                        title: "Academic Library",
                                        description: "Utilize our physical quiet study areas and a vast e-library of recommended textbooks and references.",
                                        bgColor: "bg-red-100",
                                        iconColor: "text-red-600",
                                        hoverBg: "bg-[#FAFAF9]"
                                    },
                                    {
                                        icon: BrainCircuit,
                                        title: "Interactive Quizzes",
                                        description: "Participate in quick daily quizzes designed to reinforce classroom lessons and memory retention.",
                                        bgColor: "bg-orange-100",
                                        iconColor: "text-orange-600",
                                        hoverBg: "bg-[#FFF7ED]"
                                    },
                                    {
                                        icon: Sparkles,
                                        title: "Scholarship Guidance",
                                        description: "Get updates and advisory on local and international scholarship opportunities and requirements.",
                                        bgColor: "bg-indigo-100",
                                        iconColor: "text-indigo-600",
                                        hoverBg: "bg-[#EEF2FF]"
                                    },
                                    {
                                        icon: Award,
                                        title: "University Portals Prep",
                                        description: "Receive specialized coaching and registration guidance for various university screening tests.",
                                        bgColor: "bg-amber-100",
                                        iconColor: "text-amber-600",
                                        hoverBg: "bg-[#FFFBEB]"
                                    }
                                ].map((feature: any, index: number) => (
                                    <div key={index} className="group relative p-8 bg-white border-2 border-dashed border-slate-200 rounded-lg overflow-hidden transition-all duration-300 isolate cursor-pointer shadow-sm">
                                        {/* Slide-in Background Animation */}
                                        <div className={`absolute inset-0 w-0 group-hover:w-full transition-all duration-500 ease-out ${feature.hoverBg} -z-10`}></div>

                                        <div className={`w-12 h-12 ${feature.bgColor} ${feature.iconColor} rounded-xl flex items-center justify-center mb-6 relative z-10 transition-colors duration-300 group-hover:bg-white/80`}>
                                            <feature.icon width="24" height="24" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 mb-2 relative z-10">{feature.title}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed relative z-10 group-hover:text-slate-700 transition-colors">{feature.description}</p>

                                        {/* Always visible corner accents */}
                                        <div className="absolute top-4 right-4 h-3 w-3 border-t-2 border-r-2 border-slate-300 z-10"></div>
                                        <div className="absolute bottom-4 left-4 h-3 w-3 border-b-2 border-l-2 border-slate-300 z-10"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="how-it-works" className="py-24 px-6 bg-white border-t-2 border-slate-100 relative overflow-hidden bg-noise">
                        <div className="absolute inset-0 z-0 opacity-[0.15]" style={{ backgroundImage: 'radial-gradient(circle at 25px 25px, hsl(var(--border)) 1px, transparent 0%)', backgroundSize: '50px 50px' }}></div>
                        <div className="aura-background"></div>
                        <div className="sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
                            <div className="text-center mb-16">
                                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] text-primary ring-1 ring-primary/20 uppercase tracking-tight mb-4 font-semibold">
                                    <Workflow className="mr-1 h-3 w-3" />
                                    The Platform for Academic Success
                                </span>
                                <h2 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 mb-6 font-bricolage">
                                    <Link href="/about/our-mission" className="text-primary transition-colors cursor-pointer">
                                        Pinnacle AI: The Engine of Success
                                    </Link>
                                </h2>
                                <p className="text-lg text-slate-600 font-light max-w-3xl mx-auto mb-8">
                                    Pinnacle Academia connects CBT prep, syllabus tracking, admission advisory, and community forums into one unified experience — with Pinnacle AI guiding you to your target score.
                                </p>

                                <div className="bg-white border-2 border-dashed border-slate-200 rounded-lg p-6 md:p-8 max-w-4xl mx-auto text-left relative overflow-hidden shadow-sm">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <BrainCircuit className="w-32 h-32 text-slate-900" />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-8 relative z-10">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-8 text-slate-900">What Pinnacle AI actually does:</h3>
                                            <ul className="space-y-8">
                                                <li className="flex items-start gap-4">
                                                    <div className="bg-primary/10 p-2.5 rounded-xl shrink-0 border border-primary/20 shadow-sm">
                                                        <TrendingUp className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900 text-base">Score Forecasting</h4>
                                                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                                            Predicts your likely exam performance based on mock test trends and suggests high-yield topics to study.
                                                        </p>
                                                    </div>
                                                </li>
                                                <li className="flex items-start gap-4">
                                                    <div className="bg-primary/10 p-2.5 rounded-xl shrink-0 border border-primary/20 shadow-sm">
                                                        <Store className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900 text-base">Personalized Quizzing</h4>
                                                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                                            Adapts daily practice quizzes to target your specific weak areas and reinforce active recall.
                                                        </p>
                                                    </div>
                                                </li>
                                                <li className="flex items-start gap-4">
                                                    <div className="bg-primary/10 p-2.5 rounded-xl shrink-0 border border-primary/20 shadow-sm">
                                                        <Search className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-slate-900 text-base">Admission Probability</h4>
                                                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                                            Calculates your university aggregate admission chances instantly using post-UTME and JAMB requirements.
                                                        </p>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

                                        <ZenAIInsights />
                                    </div>
                                </div>
                            </div>

                            <div className="relative mx-auto max-w-4xl">
                                <div className="flex items-center justify-center gap-6 sm:gap-10 relative z-10">
                                    <div className="group relative cursor-pointer">
                                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 border border-neutral-200 shadow-lg group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] transition-all duration-300">
                                            <Monitor className="text-neutral-600 group-hover:text-primary transition-colors h-6 w-6" />
                                        </span>
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-wide text-neutral-500 uppercase transition-opacity">CBT Engine</span>
                                    </div>
                                    <div className="group relative cursor-pointer">
                                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 border border-neutral-200 shadow-lg group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] transition-all duration-300">
                                            <Check className="text-neutral-600 group-hover:text-primary transition-colors h-6 w-6" />
                                        </span>
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-wide text-neutral-500 uppercase transition-opacity">Syllabus</span>
                                    </div>
                                    <div className="group relative cursor-pointer">
                                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 border border-neutral-200 shadow-lg group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] transition-all duration-300">
                                            <Globe className="text-neutral-600 group-hover:text-primary transition-colors h-6 w-6" />
                                        </span>
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-wide text-neutral-500 uppercase transition-opacity">Portal</span>
                                    </div>
                                    <div className="group relative cursor-pointer">
                                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 border border-neutral-200 shadow-lg group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] transition-all duration-300">
                                            <Users className="text-neutral-600 group-hover:text-primary transition-colors h-6 w-6" />
                                        </span>
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-wide text-neutral-500 uppercase transition-opacity">Forum</span>
                                    </div>
                                    <div className="group relative cursor-pointer">
                                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 border border-neutral-200 shadow-lg group-hover:scale-110 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)] transition-all duration-300">
                                            <BarChart2 className="text-neutral-600 group-hover:text-primary transition-colors h-6 w-6" />
                                        </span>
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-wide text-neutral-500 uppercase transition-opacity">Reports</span>
                                    </div>
                                </div>

                                <div className="relative mt-8 h-64 pointer-events-none">
                                    <svg viewBox="0 0 900 360" className="absolute inset-0 w-full h-full" fill="none">
                                        <defs>
                                            <linearGradient id="line-gradient-light" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0"></stop>
                                                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8"></stop>
                                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0"></stop>
                                            </linearGradient>
                                        </defs>
                                        <path d="M450 300 C 450 200, 300 120, 150 30" stroke="url(#line-gradient-light)" strokeWidth="1" strokeLinecap="round" fill="none">
                                            <animate attributeName="stroke-dasharray" values="600" dur="0.1s" fill="freeze" />
                                            <animate attributeName="stroke-dashoffset" values="600;0;600" dur="4s" repeatCount="indefinite" />
                                        </path>
                                        <path d="M450 300 C 450 210, 360 130, 270 30" stroke="url(#line-gradient-light)" strokeWidth="1" strokeLinecap="round" fill="none">
                                            <animate attributeName="stroke-dasharray" values="520" dur="0.1s" fill="freeze" />
                                            <animate attributeName="stroke-dashoffset" values="520;0;520" dur="4s" begin="0.2s" repeatCount="indefinite" />
                                        </path>
                                        <path d="M450 300 C 450 210, 540 130, 630 30" stroke="url(#line-gradient-light)" strokeWidth="1" strokeLinecap="round" fill="none">
                                            <animate attributeName="stroke-dasharray" values="520" dur="0.1s" fill="freeze" />
                                            <animate attributeName="stroke-dashoffset" values="520;0;520" dur="4s" begin="0.8s" repeatCount="indefinite" />
                                        </path>
                                        <path d="M450 300 L 450 30" stroke="url(#line-gradient-light)" strokeWidth="1" strokeLinecap="round" fill="none">
                                            <animate attributeName="stroke-dasharray" values="270" dur="0.1s" fill="freeze" />
                                            <animate attributeName="stroke-dashoffset" values="270;0;270" dur="4s" begin="0.8s" repeatCount="indefinite" />
                                        </path>
                                        <path d="M450 300 C 450 200, 600 120, 750 30" stroke="url(#line-gradient-light)" strokeWidth="1" strokeLinecap="round" fill="none">
                                            <animate attributeName="stroke-dasharray" values="600" dur="0.1s" fill="freeze" />
                                            <animate attributeName="stroke-dashoffset" values="600;0;600" dur="4s" begin="1s" repeatCount="indefinite" />
                                        </path>
                                    </svg>

                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                                        <span className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-background/80 ring-1 ring-slate-200 backdrop-blur-lg shadow-[0_0_50px_rgba(var(--primary-rgb),0.15)] relative z-20">
                                            <img src={AppConfig.logoIconUrl} alt="Pinnacle AI Logo" className="h-10 w-10 object-contain" />
                                            <span className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl animate-pulse"></span>
                                        </span>
                                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-bold tracking-wide text-slate-900 whitespace-nowrap">Pinnacle AI</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mx-auto mt-12 max-w-4xl">
                                <div className="flex items-center justify-center gap-3 flex-wrap text-sm text-slate-600">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-100/80 cursor-pointer">
                                        <BrainCircuit className="h-4 w-4 text-primary" />
                                        <span className="font-medium text-xs">Smart Forecasting</span>
                                    </div>
                                    <div className="hidden sm:block w-16 h-px border-t border-dashed border-slate-200"></div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-100/80 cursor-pointer">
                                        <Bot className="h-4 w-4 text-primary" />
                                        <span className="font-medium text-xs">Actionable Insights</span>
                                    </div>
                                    <div className="hidden sm:block w-16 h-px border-t border-dashed border-slate-200"></div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-100/80 cursor-pointer">
                                        <Database className="h-4 w-4 text-primary" />
                                        <span className="font-medium text-xs">Unified Data</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="academy-types" className="py-24 px-6 bg-white border-t border-slate-100">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center max-w-2xl mx-auto mb-16">
                                <h2 className="text-4xl font-light text-slate-900 tracking-tight font-bricolage mb-4">
                                    Tailored for Every Exam
                                </h2>
                                <p className="text-lg text-slate-600 tracking-tight font-dm-sans">
                                    Pinnacle Academia adapts to your specific academic goals. From senior certificate examinations to international admissions preparation, we have a pathway for you.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                                {examTypes.map((type) => {
                                    return (
                                        <Link href={type.link} key={type.name} className="group relative overflow-hidden rounded-xl shadow-lg aspect-[4/5] cursor-pointer block">
                                            <Image
                                                src={type.imageUrl}
                                                alt={type.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 p-4 md:p-6 text-white">
                                                <h3 className="text-2xl font-light tracking-tight font-bricolage">{type.name}</h3>
                                                <p className="mt-1 text-sm text-white/90">{type.description}</p>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Pricing Section */}
                    <section id="pricing" className="py-24 px-6 bg-[#F9F8F6] border-t border-slate-100">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center max-w-2xl mx-auto mb-16">
                                <h2 className="text-4xl font-light text-slate-900 tracking-tight font-bricolage mb-4">
                                    Choose the Perfect Plan for Your Studies
                                </h2>
                                <p className="text-lg text-slate-600 tracking-tight font-dm-sans">
                                    Start with basic prep resources, or subscribe to our intensive tutoring programs to secure your academic future.
                                </p>
                            </div>

                            <PricingPlans />
                        </div>
                    </section>

                    <section id="faq" className="py-24 px-6 border-t bg-white border-slate-100">
                        <div className="max-w-3xl mr-auto ml-auto">
                            <h2 className="text-3xl tracking-tight mb-12 text-center font-bricolage font-light text-slate-900">Frequently asked questions</h2>
                            <Accordion type="multiple" className="w-full">
                                {faqItems.map((item, index) => (
                                    <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                                        <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                                            {item.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                            <div className="text-center mt-12">
                                <p className="mb-4 font-dm-sans tracking-tight text-neutral-600">Still have questions?</p>
                                <Button asChild>
                                    <a href="#contact">Contact Us</a>
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* Profit Dial Section */}
                    <section className="py-24 px-6 bg-[#F9F8F6] text-slate-900 relative overflow-hidden text-center">
                        {/* Grid Background */}
                        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
                            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
                            backgroundSize: '32px 32px'
                        }}></div>

                        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 text-left">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6 font-bricolage text-slate-900">
                                    Turn Potential Into Academic Success — <span className="text-primary">Automatically</span>
                                </h2>
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                    Pinnacle Academia doesn’t just teach. We actively guide students toward academic success by balancing expert guidance, structured study plans, and regular practice exams.
                                </p>

                                <div className="space-y-6 mb-10">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Users className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">Personalized Tutorials</h3>
                                            <p className="text-slate-600">Learn at your comfort zone with our experienced tutors.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <FileText className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">Exam Registration</h3>
                                            <p className="text-slate-600">Seamless registration for local and international exams.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <BookOpen className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">Comprehensive Materials</h3>
                                            <p className="text-slate-600">Complete access to JAMB/WAEC past questions and syllabus outlines.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            <Globe className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-slate-900">Admission Support</h3>
                                            <p className="text-slate-600">Expert guidance to secure admission into your dream university.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-sm">
                                    <p className="text-lg font-medium text-slate-900 text-center">
                                        Every student deserves an exceptional education.
                                    </p>
                                </div>
                            </div>
                            <div className="relative">
                                {/* Glow Effect */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-500/30 blur-[100px] rounded-full -z-10 mix-blend-multiply"></div>
                                <Image
                                    src="/student_portrait.png"
                                    alt="Pinnacle Academia Student"
                                    width={500}
                                    height={500}
                                    className="relative w-full max-w-xl mx-auto h-auto rounded-full object-cover aspect-square border-4 border-dashed border-primary"
                                />
                            </div>
                        </div>
                    </section>

                    <a href="https://wa.me/2349064233805?text=Hello%2C%20I'm%20interested%20in%20Pinnacle%20Academia.%20I'd%20like%20to%20learn%20more%20about%20your%20tutorial%20services." target="_blank" rel="noopener noreferrer" className="whatsapp-button z-50" aria-label="Contact us on WhatsApp">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                            <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z" fillRule="evenodd" fill="#ffffff"></path>
                        </svg>
                    </a>



                    <MarketingFooter />
                </div >
            </div >
        </ThemeProvider >
    );
}
