'use client';

import React from 'react';
import { 
  BookOpen, 
  Download, 
  FileText, 
  ArrowRight,
  Sparkles,
  Info,
  PhoneCall,
  Search,
  CheckCircle
} from 'lucide-react';
import { InteractiveGrid } from '@/components/interactive-grid';
import MarketingHeader from '@/components/layout/marketing-header';
import MarketingFooter from '@/components/layout/marketing-footer';
import { ThemeProvider } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function StudyMaterialsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');

  const subjects = [
    { name: "Use of English", id: "english", code: "ENG" },
    { name: "Mathematics", id: "math", code: "MTH" },
    { name: "Chemistry", id: "chemistry", code: "CHM" },
    { name: "Biology", id: "biology", code: "BIO" },
    { name: "Physics", id: "physics", code: "PHY" },
    { name: "Literature", id: "literature", code: "LIT" },
    { name: "Economics", id: "economics", code: "ECN" },
    { name: "Christian Religious Knowledge", id: "crk", code: "CRK" },
    { name: "Islamic Religious Knowledge", id: "irk", code: "IRK" },
    { name: "Government", id: "government", code: "GOV" },
    { name: "Commerce", id: "commerce", code: "COM" },
    { name: "Geography", id: "geography", code: "GEO" },
    { name: "Financial Accounting", id: "accounting", code: "ACC" }
  ];

  const handleDownload = (subjectName: string, type: 'Syllabus' | 'Past Questions') => {
    toast({
      title: "Download Initiated",
      description: `Your download for JAMB ${subjectName} ${type} has started.`,
      variant: "success"
    });
  };

  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider forcedTheme="light">
      <div className="h-full overflow-y-auto w-full antialiased overflow-x-hidden text-slate-900 bg-[#F9F8F6] relative font-jakarta">
        <div className="fixed grid-lines w-full h-full top-0 right-0 left-0 pointer-events-none z-0 opacity-[0.15]"></div>
        
        <div className="relative z-10">
          <MarketingHeader />

          <main className="min-h-screen pt-20">
            {/* Hero Section */}
            <section className="text-center max-w-5xl mt-24 mx-auto pt-20 pb-16 px-6 relative z-10 bg-transparent">
              <InteractiveGrid />
              <div className="aura-background"></div>
              
              <div className="inline-flex gap-2 text-xs text-orange-800 bg-orange-50 border-orange-200/60 border rounded-full px-4 py-2 items-center backdrop-blur-sm shadow-sm mb-6">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-semibold">STUDY MATERIAL.</span>
                <span className="mx-1 h-1 w-1 rounded-full bg-orange-300"></span>
                <span className="text-orange-600">Access essential resources to enhance your prep</span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight mb-8">
                Study Materials
              </h1>
              
              <p className="mt-6 text-lg md:text-xl text-slate-700 max-w-3xl mx-auto font-medium leading-relaxed">
                At Pinnacle Academia, we are committed to providing students with the tools they need to excel in their academic journey. Explore curricula, study briefs, and questions.
              </p>

              <div className="flex gap-4 items-center justify-center mt-10">
                <a href="#contact" className="rounded-full bg-primary hover:bg-orange-600 text-white font-semibold shadow-md px-8 py-3.5 transition-all text-sm flex items-center gap-2">
                  <PhoneCall className="w-4 h-4" /> Get in touch
                </a>
              </div>
            </section>

            {/* Search bar */}
            <section className="px-6 mb-12">
              <div className="max-w-2xl mx-auto relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search subjects (e.g. Mathematics, Physics...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-14 w-full rounded-full border border-slate-200 bg-white pl-12 pr-6 text-base text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                />
              </div>
            </section>

            {/* Interactive Materials Section */}
            <section className="py-12 px-6 bg-white border-t border-b border-slate-100 relative">
              <div className="max-w-5xl mx-auto">
                <Tabs defaultValue="syllabus" className="w-full">
                  <div className="flex justify-center mb-10">
                    <TabsList className="grid grid-cols-2 w-full max-w-md bg-[#F9F8F6] p-1.5 rounded-full border border-slate-200">
                      <TabsTrigger value="syllabus" className="rounded-full font-bold uppercase text-[11px] tracking-wider py-2">
                        JAMB Syllabus
                      </TabsTrigger>
                      <TabsTrigger value="past-questions" className="rounded-full font-bold uppercase text-[11px] tracking-wider py-2">
                        JAMB Past Questions
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="syllabus">
                    <div className="text-center max-w-xl mx-auto mb-10">
                      <h3 className="text-xl font-bold text-slate-900">JAMB Syllabus Directory</h3>
                      <p className="text-slate-500 text-sm mt-2 font-medium">Click on the subjects below to access each JAMB syllabus</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {filteredSubjects.map((sub) => (
                        <div key={sub.id} className="bg-[#F9F8F6] border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group">
                          <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black bg-orange-100/60 text-primary px-2.5 py-1 rounded-md uppercase tracking-wider">{sub.code}</span>
                            <FileText className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg mb-6 leading-tight">{sub.name}</h4>
                          </div>
                          <Button 
                            onClick={() => handleDownload(sub.name, 'Syllabus')}
                            className="w-full rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all font-semibold flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Download className="w-4 h-4" /> Download Syllabus
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="past-questions">
                    <div className="text-center max-w-xl mx-auto mb-10">
                      <h3 className="text-xl font-bold text-slate-900">JAMB Past Questions Directory</h3>
                      <p className="text-slate-500 text-sm mt-2 font-medium">Click on the subjects below to access each JAMB Past questions</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {filteredSubjects.map((sub) => (
                        <div key={sub.id} className="bg-[#F9F8F6] border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group">
                          <div className="flex justify-between items-start mb-6">
                            <span className="text-[10px] font-black bg-blue-100/60 text-blue-700 px-2.5 py-1 rounded-md uppercase tracking-wider">{sub.code}</span>
                            <BookOpen className="w-5 h-5 text-slate-400" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg mb-6 leading-tight">{sub.name}</h4>
                          </div>
                          <Button 
                            onClick={() => handleDownload(sub.name, 'Past Questions')}
                            className="w-full rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-primary hover:text-white hover:border-primary transition-all font-semibold flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Download className="w-4 h-4" /> Download Questions
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </section>
          </main>

          <MarketingFooter />
        </div>
      </div>
    </ThemeProvider>
  );
}
