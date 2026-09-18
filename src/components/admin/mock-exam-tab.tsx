'use client';

import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAcademy } from '@/context/academy-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Calendar, ArrowLeft, Save, Trash2, Ban } from 'lucide-react';
import { MockExamEvent } from '@/types';
import { useUser } from '@/firebase';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MockExamSubmission } from '@/types';

export default function MockExamTab() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  if (selectedEventId) {
    return <ManageMockExamEvent eventId={selectedEventId} onBack={() => setSelectedEventId(null)} />;
  }

  return <MockExamList onSelectEvent={setSelectedEventId} />;
}

function MockExamList({ onSelectEvent }: { onSelectEvent: (id: string) => void }) {
  const { academy } = useAcademy();
  const { user } = useUser();
  const [exams, setExams] = useState<MockExamEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!academy) return;

    const q = query(
      collection(db, 'academies', academy.id, 'mockExams'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const examsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MockExamEvent[];
      setExams(examsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [academy]);

  const handleCreateMockExam = async () => {
    if (!academy || !user) return;
    setCreating(true);
    try {
      const defaultStartTime = new Date();
      defaultStartTime.setHours(8, 0, 0, 0);
      defaultStartTime.setDate(defaultStartTime.getDate() + 1);

      await addDoc(collection(db, 'academies', academy.id, 'mockExams'), {
        academyId: academy.id,
        title: 'Final Mock CBT Exam',
        startTime: defaultStartTime.getTime(),
        durationMinutes: 60,
        status: 'pending',
        subjects: [],
        categories: {
          Science: ['Aptitude Test', 'Mathematics', 'Physics', 'Chemistry'],
          Arts: ['Aptitude Test', 'Government', 'Literature in English', 'Economics'],
          Commercial: ['Aptitude Test', 'Mathematics', 'Financial Accounting', 'Commerce']
        },
        bannedEmails: [],
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });
      toast({ title: 'Success', description: 'New mock exam created' });
    } catch (error) {
      console.error("Error creating mock exam:", error);
      toast({ title: 'Error', description: 'Failed to create mock exam', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteMockExam = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!academy) return;
    if (!confirm('Are you sure you want to delete this mock exam?')) return;
    try {
      await deleteDoc(doc(db, 'academies', academy.id, 'mockExams', id));
      toast({ title: 'Success', description: 'Mock exam deleted' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to delete mock exam', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mock Exam Contests</h2>
          <p className="text-muted-foreground">Schedule and manage upcoming public CBT mock exams for your students.</p>
        </div>
        <Button onClick={handleCreateMockExam} disabled={creating}>
          {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
          Create New Event
        </Button>
      </div>

      {exams.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Mock Exams yet</h3>
            <p className="text-muted-foreground mb-4">Create your first mock exam event to get started.</p>
            <Button onClick={handleCreateMockExam} disabled={creating}>
              Create Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {exams.map(exam => (
            <Card key={exam.id} className="cursor-pointer hover:border-primary transition-colors flex flex-col justify-between" onClick={() => onSelectEvent(exam.id)}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">{exam.title}</CardTitle>
                <CardDescription>
                  {exam.startTime ? format(new Date(exam.startTime), 'PPP p') : 'No date set'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exam.status === 'active' ? 'bg-green-100 text-green-700' :
                    exam.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {exam.status?.toUpperCase() || 'PENDING'}
                  </span>
                  <span className="text-muted-foreground">{exam.durationMinutes} mins</span>
                </div>
              </CardContent>
              <div className="px-6 pb-4 pt-2 flex justify-end border-t mt-auto">
                 <Button variant="ghost" size="sm" onClick={(e) => handleDeleteMockExam(exam.id, e)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                 </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

const FIXED_SUBJECTS = [
  'Use of English', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'Literature in English', 'Government', 'Economics', 'Financial Accounting',
  'Commerce', 'Christian Religious Studies', 'Islamic Religious Studies',
  'Aptitude Test', 'Geography', 'Agricultural Science', 'Civic Education',
  'Insurance', 'Current Affairs', 'History'
];

function ManageMockExamEvent({ eventId, onBack }: { eventId: string, onBack: () => void }) {
  const { academy } = useAcademy();
  const [exam, setExam] = useState<MockExamEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingSubject, setUpdatingSubject] = useState(false);

  const [title, setTitle] = useState('');
  const [startTimeStr, setStartTimeStr] = useState('');
  const [duration, setDuration] = useState(60);
  const [status, setStatus] = useState<'pending' | 'active' | 'completed'>('pending');
  const [showResults, setShowResults] = useState(false);
  const [banEmail, setBanEmail] = useState('');
  const [categories, setCategories] = useState<Record<string, string[]>>({});

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  
  // JSON Upload State
  const [customQuestions, setCustomQuestions] = useState<any[]>([]);

  // Manual Entry State
  const [manualQuestions, setManualQuestions] = useState([{ questionText: '', options: ['', '', '', ''], correctAnswer: 'A' }]);

  useEffect(() => {
    if (!academy || !eventId) return;

    const unsubscribe = onSnapshot(doc(db, 'academies', academy.id, 'mockExams', eventId), (snapshot) => {
      if (snapshot.exists()) {
        const data = { id: snapshot.id, ...snapshot.data() } as MockExamEvent;
        setExam(data);
        setTitle(data.title || '');
        setDuration(data.durationMinutes || 60);
        setStatus(data.status || 'pending');
        setShowResults(data.showResults || false);
        setCategoriesConfig(data.categoriesConfig || data.categories || DEFAULT_CATEGORIES);
        
        if (data.startTime) {
          const date = new Date(data.startTime);
          const offset = date.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0,16);
          setStartTimeStr(localISOTime);
        }
      } else {
        toast({ title: 'Error', description: 'Exam not found', variant: 'destructive' });
        onBack();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [academy, eventId, onBack]);

  const handleSave = async () => {
    if (!academy || !exam) return;
    setSaving(true);
    try {
      const newStartTime = new Date(startTimeStr).getTime();
      await updateDoc(doc(db, 'academies', academy.id, 'mockExams', exam.id), {
        title,
        startTime: newStartTime,
        durationMinutes: duration,
        status,
        showResults,
        categoriesConfig,
      });
      toast({ title: 'Success', description: 'Exam updated successfully.' });
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to update exam.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleBanEmail = async () => {
    if (!academy || !exam || !banEmail.trim()) return;
    try {
      const newBanned = [...(exam.bannedEmails || []), banEmail.trim()];
      await updateDoc(doc(db, 'academies', academy.id, 'mockExams', exam.id), {
        bannedEmails: newBanned
      });
      setBanEmail('');
      toast({ title: 'Success', description: `Banned ${banEmail.trim()}` });
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveBan = async (emailToRemove: string) => {
    if (!academy || !exam) return;
    try {
      const newBanned = exam.bannedEmails.filter((email: string) => email !== emailToRemove);
      await updateDoc(doc(db, 'academies', academy.id, 'mockExams', exam.id), {
        bannedEmails: newBanned
      });
      toast({ title: 'Success', description: `Unbanned ${emailToRemove}` });
    } catch (error) {
      console.error(error);
    }
  };

  const openModalFor = (subjectName: string) => {
    setActiveSubject(subjectName);
    setCustomQuestions([]);
    setManualQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: 'A' }]);
    setIsModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json) && json.length > 0 && json[0].questionText && json[0].options && json[0].correctAnswer) {
          setCustomQuestions(json);
          toast({ title: 'Success', description: `Loaded ${json.length} custom questions.` });
        } else {
          toast({ title: 'Error', description: 'Invalid JSON format. Make sure it contains questionText, options, and correctAnswer.', variant: 'destructive' });
        }
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to parse JSON file.', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
  };

  const handleAddManualQuestion = () => {
    setManualQuestions([...manualQuestions, { questionText: '', options: ['', '', '', ''], correctAnswer: 'A' }]);
  };

  const handleManualQuestionChange = (index: number, field: string, value: string) => {
    const newQuestions = [...manualQuestions];
    if (field.startsWith('option-')) {
      const optIndex = parseInt(field.split('-')[1]);
      newQuestions[index].options[optIndex] = value;
    } else {
      (newQuestions[index] as any)[field] = value;
    }
    setManualQuestions(newQuestions);
  };

  const saveSubjectToDatabase = async (questions: any[]) => {
    if (!academy || !exam || !activeSubject) return;
    setUpdatingSubject(true);

    try {
      const formattedQuestions = questions.map((q, idx) => ({
        id: `q-${Date.now()}-${idx}`,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));

      const newSubjectData = {
        id: activeSubject.toLowerCase().replace(/\s+/g, '-'),
        name: activeSubject,
        questions: formattedQuestions
      };

      const existingSubjects = exam.subjects || [];
      const updatedSubjects = existingSubjects.filter(s => s.name !== activeSubject);
      updatedSubjects.push(newSubjectData);

      await updateDoc(doc(db, 'academies', academy.id, 'mockExams', exam.id), {
        subjects: updatedSubjects
      });

      toast({ title: 'Success', description: `Saved ${formattedQuestions.length} questions for ${activeSubject}.` });
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to save subject', variant: 'destructive' });
    } finally {
      setUpdatingSubject(false);
    }
  };

  const handleSaveManual = () => {
    // Validate manual questions
    for (const q of manualQuestions) {
      if (!q.questionText.trim()) {
        toast({ title: 'Error', description: 'All questions must have text.', variant: 'destructive' });
        return;
      }
      for (const opt of q.options) {
        if (!opt.trim()) {
          toast({ title: 'Error', description: 'All options must be filled out.', variant: 'destructive' });
          return;
        }
      }
    }
    saveSubjectToDatabase(manualQuestions);
  };

  const handleSaveJson = () => {
    if (customQuestions.length === 0) {
      toast({ title: 'Error', description: 'Please upload a valid JSON file first.', variant: 'destructive' });
      return;
    }
    saveSubjectToDatabase(customQuestions);
  };

  const handleLoadDefaultDatabase = async () => {
    if (!activeSubject) return;
    setUpdatingSubject(true);
    try {
      let questions: any[] = [];
      switch (activeSubject) {
        case 'Use of English':
            questions = (await import('@/app/(app)/cbt-simulator/data/use-of-english')).englishQuestions; break;
        case 'Mathematics':
            questions = (await import('@/app/(app)/cbt-simulator/data/mathematics')).mathematicsQuestions; break;
        case 'Physics':
            questions = (await import('@/app/(app)/cbt-simulator/data/physics')).physicsQuestions; break;
        case 'Chemistry':
            questions = (await import('@/app/(app)/cbt-simulator/data/chemistry')).chemistryQuestions; break;
        case 'Biology':
            questions = (await import('@/app/(app)/cbt-simulator/data/biology')).biologyQuestions; break;
        case 'Government':
            questions = (await import('@/app/(app)/cbt-simulator/data/government')).governmentQuestions; break;
        case 'Literature in English':
            questions = (await import('@/app/(app)/cbt-simulator/data/literature')).literatureQuestions; break;
        case 'Economics':
            questions = (await import('@/app/(app)/cbt-simulator/data/economics')).economicsQuestions; break;
        case 'Financial Accounting':
            questions = (await import('@/app/(app)/cbt-simulator/data/accounting')).accountingQuestions; break;
        case 'Christian Religious Studies':
            questions = (await import('@/app/(app)/cbt-simulator/data/crs')).crsQuestions; break;
        case 'Aptitude Test':
            questions = (await import('@/app/(app)/cbt-simulator/data/aptitude')).aptitudeQuestions; break;
        case 'Geography':
            questions = (await import('@/app/(app)/cbt-simulator/data/geography')).geographyQuestions; break;
        case 'Agricultural Science':
            questions = (await import('@/app/(app)/cbt-simulator/data/agric-science')).agricScienceQuestions; break;
        case 'Commerce':
            questions = (await import('@/app/(app)/cbt-simulator/data/commerce')).commerceQuestions; break;
        case 'Islamic Religious Studies':
            questions = (await import('@/app/(app)/cbt-simulator/data/irk')).irkQuestions; break;
        case 'Civic Education':
            questions = (await import('@/app/(app)/cbt-simulator/data/civic-education')).civicEducationQuestions; break;
        case 'Insurance':
            questions = (await import('@/app/(app)/cbt-simulator/data/insurance')).insuranceQuestions; break;
        case 'Current Affairs':
            questions = (await import('@/app/(app)/cbt-simulator/data/current-affairs')).currentAffairsQuestions; break;
        case 'History':
            questions = (await import('@/app/(app)/cbt-simulator/data/history')).historyQuestions; break;
      }
      
      const shuffledQuestions = [...questions].sort(() => 0.5 - Math.random()).slice(0, 10);
      await saveSubjectToDatabase(shuffledQuestions);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to load default questions', variant: 'destructive' });
      setUpdatingSubject(false);
    }
  };

  const handleClearSubject = async () => {
    if (!academy || !exam || !activeSubject) return;
    if (!confirm(`Are you sure you want to remove all questions for ${activeSubject}?`)) return;
    setUpdatingSubject(true);
    try {
      const existingSubjects = exam.subjects || [];
      const updatedSubjects = existingSubjects.filter(s => s.name !== activeSubject);
      
      await updateDoc(doc(db, 'academies', academy.id, 'mockExams', exam.id), {
        subjects: updatedSubjects
      });
      toast({ title: 'Success', description: 'Subject cleared.' });
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      toast({ title: 'Error', description: 'Failed to clear subject', variant: 'destructive' });
    } finally {
      setUpdatingSubject(false);
    }
  };


  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!exam) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}><ArrowLeft className="h-5 w-5" /></Button>
        <h1 className="text-3xl font-bold tracking-tight">Manage Event: {exam.title}</h1>
      </div>

      <Tabs defaultValue="config">
        <TabsList className="mb-4">
          <TabsTrigger value="config">Event Configuration</TabsTrigger>
          <TabsTrigger value="analytics">Live Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="config" className="space-y-6">
          <Tabs defaultValue="settings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="categories">Categories & Subjects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Event Title</Label>
                      <Input value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Input type="datetime-local" value={startTimeStr} onChange={e => setStartTimeStr(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Duration (Minutes)</Label>
                      <Input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} />
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                        value={status} 
                        onChange={e => setStatus(e.target.value as any)}
                      >
                        <option value="pending">Pending (Not Started)</option>
                        <option value="active">Active (Running)</option>
                        <option value="completed">Completed (Closed)</option>
                      </select>
                    </div>

                    <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label className="text-base">Release Results</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow students to view their scores after submitting.
                        </p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={showResults} 
                        onChange={(e) => setShowResults(e.target.checked)} 
                        className="h-5 w-5" 
                      />
                    </div>

                    <Button onClick={handleSave} disabled={saving} className="w-full mt-4">
                      {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Save Settings
                    </Button>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Student Link</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Share this direct link with your students for this specific exam event. It is hidden from the main site.
                      </p>
                      <div className="flex gap-2">
                        <Input readOnly value={`https://pinnacleacademia.com/mock-exam/${exam.id}`} className="bg-muted" />
                        <Button variant="secondary" onClick={() => {
                          navigator.clipboard.writeText(`https://pinnacleacademia.com/mock-exam/${exam.id}`);
                          toast({ title: 'Copied!' });
                        }}>Copy</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Access Control (Banned Users)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 mb-4">
                        <Input placeholder="student@example.com" value={banEmail} onChange={e => setBanEmail(e.target.value)} />
                        <Button variant="destructive" onClick={handleBanEmail}>
                          <Ban className="h-4 w-4 mr-2" /> Ban
                        </Button>
                      </div>
                      
                      {exam.bannedEmails?.length > 0 ? (
                        <ul className="space-y-2">
                          {exam.bannedEmails.map((email: string) => (
                            <li key={email} className="flex justify-between items-center text-sm p-2 bg-muted rounded-md">
                              <span>{email}</span>
                              <Button variant="ghost" size="sm" onClick={() => handleRemoveBan(email)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No banned users.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Categories Configuration</CardTitle>
                  <CardDescription>Configure the 4 subjects required for each category.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    {['Science', 'Arts', 'Commercial'].map(category => (
                      <div key={category} className="border p-4 rounded-lg bg-card">
                        <h3 className="font-semibold mb-3 flex items-center justify-between">
                          {category} 
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {categoriesConfig[category]?.length || 0}/4 Subjects
                          </span>
                        </h3>
                        <div className="space-y-2 mb-4">
                          {categoriesConfig[category]?.map((subject, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-muted px-2 py-1.5 rounded text-sm">
                              <span>{subject}</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => {
                                  const newConfig = { ...categoriesConfig };
                                  newConfig[category] = newConfig[category].filter((_, i) => i !== idx);
                                  setCategoriesConfig(newConfig);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          {(!categoriesConfig[category] || categoriesConfig[category].length === 0) && (
                            <div className="text-sm text-muted-foreground italic">No subjects configured.</div>
                          )}
                        </div>
                        {(!categoriesConfig[category] || categoriesConfig[category].length < 4) ? (
                          <div className="flex gap-2">
                            <Select 
                              onValueChange={(val) => {
                                const newConfig = { ...categoriesConfig };
                                if (!newConfig[category]) newConfig[category] = [];
                                if (!newConfig[category].includes(val) && newConfig[category].length < 4) {
                                  newConfig[category].push(val);
                                  setCategoriesConfig(newConfig);
                                } else if (newConfig[category].includes(val)) {
                                  toast({ title: 'Notice', description: 'Subject already in category' });
                                }
                              }}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Add subject..." />
                              </SelectTrigger>
                              <SelectContent>
                                {FIXED_SUBJECTS.map(sub => (
                                  <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <div className="text-xs text-green-600 font-medium">Category limit reached (4 subjects).</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button onClick={handleSave} disabled={saving} className="mt-6">
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Categories Configuration
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Exam Subjects Question Bank</CardTitle>
                  <CardDescription>Click on a subject to configure its 10 questions. (Limit: 40 questions per category total)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {FIXED_SUBJECTS.map(subjectName => {
                      const existingSub = exam.subjects?.find(s => s.name === subjectName);
                      const count = existingSub?.questions?.length || 0;
                      
                      return (
                        <div 
                          key={subjectName} 
                          onClick={() => openModalFor(subjectName)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md flex flex-col items-center text-center justify-center min-h-[100px] ${count > 0 ? (count === 10 ? 'border-green-200 bg-green-50/50' : 'border-yellow-200 bg-yellow-50/50') : 'hover:border-primary bg-card'}`}
                        >
                           <h3 className="font-semibold text-sm mb-2">{subjectName}</h3>
                           <div className={`text-xs font-medium px-2 py-1 rounded-full ${count === 10 ? 'bg-green-100 text-green-700' : count > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-muted text-muted-foreground'}`}>
                             {count} / 10 Questions
                           </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Questions: {activeSubject}</DialogTitle>
            <DialogDescription>
              Add questions for this subject. Currently has {exam.subjects?.find(s => s.name === activeSubject)?.questions?.length || 0} questions.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="manual" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manual">Enter Manually</TabsTrigger>
              <TabsTrigger value="json">Upload JSON</TabsTrigger>
              <TabsTrigger value="default">Fetch from Database</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual" className="space-y-6 mt-4">
              <div className="space-y-8">
                {manualQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-muted/20 space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="font-semibold text-base">Question {idx + 1}</Label>
                      {manualQuestions.length > 1 && (
                         <Button variant="ghost" size="sm" className="text-red-500 h-8" onClick={() => {
                            const newQ = [...manualQuestions];
                            newQ.splice(idx, 1);
                            setManualQuestions(newQ);
                         }}>
                           Remove
                         </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Question Text</Label>
                      <Input 
                        value={q.questionText} 
                        onChange={(e) => handleManualQuestionChange(idx, 'questionText', e.target.value)} 
                        placeholder="Enter the question..." 
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {['A', 'B', 'C', 'D'].map((optLabel, optIdx) => (
                        <div key={optLabel} className="space-y-2">
                          <Label>Option {optLabel}</Label>
                          <Input 
                            value={q.options[optIdx]} 
                            onChange={(e) => handleManualQuestionChange(idx, `option-${optIdx}`, e.target.value)} 
                          />
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Select value={q.correctAnswer} onValueChange={(val) => handleManualQuestionChange(idx, 'correctAnswer', val)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select correct option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">Option A</SelectItem>
                          <SelectItem value="B">Option B</SelectItem>
                          <SelectItem value="C">Option C</SelectItem>
                          <SelectItem value="D">Option D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" onClick={handleAddManualQuestion}>
                  <Plus className="h-4 w-4 mr-2" /> Add Another Question
                </Button>
                <Button onClick={handleSaveManual} disabled={updatingSubject}>
                  {updatingSubject && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Manual Questions
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="json" className="space-y-4 mt-4">
              <div className="bg-background border rounded-md p-6 flex flex-col items-center justify-center text-center space-y-4">
                <Label className="block font-medium text-lg">Upload Custom JSON File</Label>
                <Input type="file" accept=".json" onChange={handleFileUpload} className="max-w-md" />
                <p className="text-sm text-muted-foreground">
                  Format: <code>[{'{'}"questionText": "...", "options": ["A","B","C","D"], "correctAnswer": "A"{'}'}]</code>
                </p>
                {customQuestions.length > 0 && (
                  <p className="text-sm text-green-600 font-medium bg-green-50 p-2 rounded w-full max-w-md">Ready: {customQuestions.length} questions loaded.</p>
                )}
                <Button onClick={handleSaveJson} disabled={updatingSubject || customQuestions.length === 0} className="mt-4">
                   {updatingSubject && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                   Save JSON Questions
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="default" className="space-y-4 mt-4">
               <div className="bg-background border rounded-md p-6 flex flex-col items-center justify-center text-center space-y-4">
                  <h3 className="font-semibold text-lg">Use Built-in Database</h3>
                  <p className="text-muted-foreground text-sm max-w-md">
                    This will randomly fetch 10 questions from the existing CBT simulator database for {activeSubject}. 
                    If questions already exist for this subject, they will be replaced.
                  </p>
                  <Button onClick={handleLoadDefaultDatabase} disabled={updatingSubject}>
                     {updatingSubject && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                     Fetch & Save 10 Questions
                  </Button>
               </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end border-t pt-4 mt-6">
             {exam.subjects?.find(s => s.name === activeSubject)?.questions?.length ? (
               <Button variant="outline" className="mr-auto text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50" onClick={handleClearSubject} disabled={updatingSubject}>
                 Clear Subject
               </Button>
             ) : null}
             <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
        <TabsContent value="analytics">
          <MockExamAnalytics eventId={exam.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MockExamAnalytics({ eventId }: { eventId: string }) {
  const { academy } = useAcademy();
  const [submissions, setSubmissions] = useState<MockExamSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!academy || !eventId) return;
    const q = query(collection(db, 'academies', academy.id, 'mockExams', eventId, 'submissions'));
    const unsub = onSnapshot(q, (snap) => {
       const subs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as MockExamSubmission[];
       setSubmissions(subs);
       setLoading(false);
    });
    return () => unsub();
  }, [academy, eventId]);

  if (loading) return <div><Loader2 className="h-6 w-6 animate-spin mx-auto mt-10" /></div>;

  if (submissions.length === 0) return (
     <Card className="py-12 text-center text-muted-foreground">
        No students have submitted this mock exam yet.
     </Card>
  );

  const totalSubs = submissions.length;
  const avgScore = submissions.reduce((acc, curr) => acc + (curr.totalScore / (curr.totalQuestions || 1)), 0) / totalSubs;
  
  const subjectStats: Record<string, { score: number, total: number }> = {};
  submissions.forEach(sub => {
    if (sub.scorePerSubject) {
      Object.entries(sub.scorePerSubject).forEach(([subj, data]) => {
         if (!subjectStats[subj]) subjectStats[subj] = { score: 0, total: 0 };
         subjectStats[subj].score += data.score;
         subjectStats[subj].total += data.total;
      });
    }
  });

  const subjectPerformance = Object.entries(subjectStats).map(([subj, data]) => ({
     subject: subj,
     avgScore: Math.round((data.score / (data.total || 1)) * 100)
  }));

  const sortedLeaderboard = [...submissions].sort((a,b) => (b.totalScore / (b.totalQuestions || 1)) - (a.totalScore / (a.totalQuestions || 1)));

  return (
    <div className="space-y-6">
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Total Submissions</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{totalSubs}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Average Score</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{Math.round(avgScore * 100)}%</div></CardContent>
          </Card>
       </div>
       
       <div className="grid md:grid-cols-2 gap-6">
         <Card>
           <CardHeader><CardTitle>Leaderboard</CardTitle></CardHeader>
           <CardContent className="max-h-[400px] overflow-y-auto">
             <Table>
               <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Score</TableHead></TableRow></TableHeader>
               <TableBody>
                 {sortedLeaderboard.map((sub) => (
                   <TableRow key={sub.id}>
                     <TableCell>
                       <p className="font-medium">{sub.studentName}</p>
                       <p className="text-xs text-muted-foreground">{sub.category}</p>
                     </TableCell>
                     <TableCell className="font-bold">{sub.totalScore}/{sub.totalQuestions}</TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </CardContent>
         </Card>
         
         <Card>
           <CardHeader><CardTitle>Subject Performance</CardTitle></CardHeader>
           <CardContent className="max-h-[400px] overflow-y-auto">
             <Table>
               <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Avg. Score</TableHead></TableRow></TableHeader>
               <TableBody>
                 {subjectPerformance.sort((a,b) => b.avgScore - a.avgScore).map(sub => (
                   <TableRow key={sub.subject}>
                     <TableCell className="capitalize">{sub.subject}</TableCell>
                     <TableCell>{sub.avgScore}%</TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </CardContent>
         </Card>
       </div>
    </div>
  )
}
