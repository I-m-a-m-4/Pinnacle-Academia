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

function ManageMockExamEvent({ eventId, onBack }: { eventId: string, onBack: () => void }) {
  const { academy } = useAcademy();
  const [exam, setExam] = useState<MockExamEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [startTimeStr, setStartTimeStr] = useState('');
  const [duration, setDuration] = useState(60);
  const [status, setStatus] = useState<'pending' | 'active' | 'completed'>('pending');
  const [showResults, setShowResults] = useState(false);
  const [banEmail, setBanEmail] = useState('');

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

  const seed1030MockQuestions = async () => {
     if (!academy || !exam) return;
     try {
       const { aptitudeQuestions } = await import('@/app/(app)/cbt-simulator/data/aptitude');
       const { mathematicsQuestions } = await import('@/app/(app)/cbt-simulator/data/mathematics');
       const { physicsQuestions } = await import('@/app/(app)/cbt-simulator/data/physics');
       const { chemistryQuestions } = await import('@/app/(app)/cbt-simulator/data/chemistry');

       const questionsData = [
         {
           id: 'aptitude',
           name: 'Aptitude Test',
           questions: aptitudeQuestions.slice(0, 10)
         },
         {
           id: 'maths',
           name: 'Mathematics',
           questions: mathematicsQuestions.slice(0, 10)
         },
         {
           id: 'physics',
           name: 'Physics',
           questions: physicsQuestions.slice(0, 10)
         },
         {
           id: 'chemistry',
           name: 'Chemistry',
           questions: chemistryQuestions.slice(0, 10)
         }
       ];

       await updateDoc(doc(db, 'academies', academy.id, 'mockExams', exam.id), {
          subjects: questionsData
       });
       toast({ title: 'Success', description: 'OAU Engineering Mock Questions Seeded!' });
     } catch(e) {
       console.error(e);
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Exam Subjects & Questions</CardTitle>
          <Button variant="outline" onClick={seed1030MockQuestions}>Seed 10:30 AM Mock Questions (Quick Load)</Button>
        </CardHeader>
        <CardContent>
          {exam.subjects?.length > 0 ? (
            <div className="space-y-4">
              {exam.subjects.map((subject: any) => (
                <div key={subject.id} className="border p-4 rounded-md">
                  <h3 className="font-semibold text-lg">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground">{subject.questions.length} Questions</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground py-8 text-center border rounded-md border-dashed">
              No subjects added yet. Click "Seed 10:30 AM Mock Questions" to add the provided questions.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
