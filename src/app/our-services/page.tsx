'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Award, Laptop, School, Globe, Plane, Search, ArrowRight, Zap, Target, Star, CheckCircle2 } from 'lucide-react';
import { InteractiveGrid } from '@/components/interactive-grid';
import MarketingHeader from '@/components/layout/marketing-header';
import MarketingFooter from '@/components/layout/marketing-footer';
import { ThemeProvider } from '@/components/theme-provider';

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const services = [
    {
      title: "JAMB & UTME Preparations",
      description: "Score 300+ in your computer-based JAMB exams with intensive coaching and timed CBT simulators.",
      icon: <BookOpen className="w-6 h-6 text-primary" />,
      href: "/signup"
    },
    {
      title: "WAEC & NECO Secondary Exams",
      description: "Achieve straight A1s in your senior secondary certificate examinations with syllabus-focused tutorials.",
      icon: <Award className="w-6 h-6 text-primary" />,
      href: "/signup"
    },
    {
      title: "Online Interactive Classes",
      description: "Learn from anywhere with robust interactive online classrooms, study briefs, and virtual tutor support.",
      icon: <Laptop className="w-6 h-6 text-primary" />,
      href: "/signup"
    },
    {
      title: "Physical Tutorial Centers",
      description: "Study in structured, fully equipped facilities in Lagos and Osun State with expert face-to-face mentorship.",
      icon: <School className="w-6 h-6 text-primary" />,
      href: "/signup"
    },
    {
      title: "Admission Consultation",
      description: "Secure your entry into top Nigerian universities and foreign colleges (USA, UK, Canada, Europe) seamlessly.",
      icon: <Globe className="w-6 h-6 text-primary" />,
      href: "/signup"
    },
    {
      title: "International Test Prep",
      description: "Open global doors with competitive test preps for SAT, IELTS, TOEFL, GRE, and GMAT.",
      icon: <Plane className="w-6 h-6 text-primary" />,
      href: "/signup"
    }
  ];

  const coreCapabilities = [
    "Proven Hybrid Classroom Coaching Model",
    "Curated Past Questions & Syllabus Library",
    "Weekly Timed CBT Mock Simulator Runs",
    "Comprehensive Admission & Visa Processing",
    "1-on-1 Private Tutorials & Academic Counselors"
  ];

  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider forcedTheme="light">
      <main className="min-h-screen bg-background font-jakarta">
        <MarketingHeader />
        
        {/* Hero Section */}
        <section className="relative flex items-center justify-center px-6 pt-28 pb-16 md:py-32 overflow-hidden bg-transparent">
          <div className="absolute inset-0 z-0">
            <InteractiveGrid />
            <div className="aura-background"></div>
          </div>
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>What Pinnacle Academia Offers</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
              Services Tailored for Excellence
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              From senior secondary certificates to foreign university admissions, discover our academic pathways.
            </p>
          </div>
        </section>

        {/* Search Bar Section */}
        <section className="py-12 px-6 bg-primary/5">
          <div className="max-w-2xl mx-auto -mt-20">
            <div className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-border/50 p-2 flex items-center focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="w-5 h-5 mx-3 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search for your academic goal..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-base py-3"
              />
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors hidden sm:block">
                Search
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
              <span>Popular:</span>
              <button onClick={() => setSearchTerm('JAMB')} className="hover:text-primary transition-colors">JAMB</button>
              <span>•</span>
              <button onClick={() => setSearchTerm('WAEC')} className="hover:text-primary transition-colors">WAEC</button>
              <span>•</span>
              <button onClick={() => setSearchTerm('Admission')} className="hover:text-primary transition-colors">Admissions</button>
              <span>•</span>
              <button onClick={() => setSearchTerm('')} className="hover:text-primary transition-colors">Reset</button>
            </div>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Explore Academic Pathways</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See exactly how our custom study plans, online CBT drills, and experienced instructors prepare you for victory.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
                <Link 
                  key={index} 
                  href={service.href}
                  className="group block bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-all hover:border-primary/30"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {service.description}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Get Started <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-24 bg-secondary rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Core Capabilities</h2>
                  <p className="text-muted-foreground mb-6">
                    No matter your level, Pinnacle Academia provides the essential educational support to help you secure admission into your dream university.
                  </p>
                  <Link href="/about" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-fit">
                    Read Our Story
                  </Link>
                </div>
                
                <div className="space-y-4">
                  {coreCapabilities.map((capability, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center bg-background p-4 rounded-xl border border-border/50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        <span className="font-medium text-neutral-800 dark:text-neutral-200">{capability}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-24 text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Ready to accelerate your learning?</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of accomplished learners utilizing Pinnacle Academia to secure admission and master competitive exams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 shadow-md">
                  Register For Free
                </Link>
                <Link href="mailto:pinnacleacademia254@gmail.com" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </section>

        <MarketingFooter />
      </main>
    </ThemeProvider>
  );
}
