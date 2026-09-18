'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAcademy } from '@/context/academy-context';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Save, Trash2, Plus, Ban } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { MockExamEvent, MockExamSubject, MockExamQuestion } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function ManageMockExamPage() {
  const { academy } = useAcademy();
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [exam, setExam] = useState<MockExamEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
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
        
        // Format for datetime-local input
        if (data.startTime) {
          const date = new Date(data.startTime);
          // adjust for local timezone offset for input
          const offset = date.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0,16);
          setStartTimeStr(localISOTime);
        }
      } else {
        toast({ title: 'Error', description: 'Exam not found', variant: 'destructive' });
        router.push('/admin-sheun/mock-exams');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [academy, eventId, router]);

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
      const newBanned = exam.bannedEmails.filter(email => email !== emailToRemove);
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
       const generateId = () => Math.random().toString(36).substring(2, 15);
       const questionsData = [
         {
           id: 'quant',
           name: 'Quantitative Reasoning',
           questions: [
             { id: generateId(), questionText: 'Find the missing number: 3, 8, 18, 38, 78, ?', options: ['156', '158', '160', '162'], correctAnswer: 'B' },
             { id: generateId(), questionText: 'A car travels 120 km at 60 km/h and another 180 km at 90 km/h. What is its average speed for the entire journey?', options: ['72 km/h', '75 km/h', '80 km/h', '84 km/h'], correctAnswer: 'B' },
             { id: generateId(), questionText: 'A price is increased by 25% and then reduced by 20%. What is the overall percentage change?', options: ['0%', '5% increase', '5% decrease', '10% increase'], correctAnswer: 'A' },
             { id: generateId(), questionText: 'A man completes a journey in 6 hours. If his speed is increased by 25%, how long will the same journey take?', options: ['4 hours 30 minutes', '4 hours 48 minutes', '5 hours', '5 hours 15 minutes'], correctAnswer: 'B' },
             { id: generateId(), questionText: 'The average of five numbers is 18. If one number is removed, the average of the remaining four is 16. What is the removed number?', options: ['24', '25', '26', '28'], correctAnswer: 'C' },
             { id: generateId(), questionText: 'A sum of money amounts to ₦13,200 in 2 years at simple interest. If the principal is ₦12,000, what is the annual rate?', options: ['4%', '5%', '6%', '8%'], correctAnswer: 'B' },
             { id: generateId(), questionText: 'A bag contains 4 red, 3 blue, and 5 green balls. What is the probability of selecting a ball that is not green?', options: ['5/12', '7/12', '3/7', '1/2'], correctAnswer: 'B' },
             { id: generateId(), questionText: 'If 8 workers complete a task in 15 days, how many days will 12 workers take, assuming the same rate of work?', options: ['8', '10', '12', '15'], correctAnswer: 'B' }
           ]
         },
         {
           id: 'verbal',
           name: 'Verbal Reasoning and English',
           questions: [
             { id: generateId(), questionText: 'Choose the word nearest in meaning to PRAGMATIC.', options: ['Idealistic', 'Practical', 'Emotional', 'Theoretical'], correctAnswer: 'B' },
             { id: generateId(), questionText: 'Choose the word opposite in meaning to OBSCURE.', options: ['Hidden', 'Uncertain', 'Famous', 'Complicated'], correctAnswer: 'C' },
             { id: generateId(), questionText: 'Select the grammatically correct sentence.', options: ['Neither the lecturer nor the students was present.', 'Neither the lecturer nor the students were present.', 'Neither the lecturer or the students were present.', 'Neither the lecturer and the students was present.'], correctAnswer: 'B' },
             { id: generateId(), questionText: 'Identify the part containing the error: The committee have submitted its report to the vice-chancellor.', options: ['The committee', 'have submitted', 'its report', 'to the vice-chancellor'], correctAnswer: 'B' },
             { id: generateId(), questionText: 'Choose the option that best completes the sentence: Had I known about the examination earlier, I __ better prepared.', options: ['will be', 'would be', 'would have been', 'shall have been'], correctAnswer: 'C' },
             { id: generateId(), questionText: 'In the sentence, “The manager’s response was equivocal,” the word equivocal most nearly means:', options: ['Very clear', 'Open to more than one interpretation', 'Extremely harsh', 'Completely false'], correctAnswer: 'B' },
             { id: generateId(), questionText: 'Choose the correctly punctuated sentence.', options: ['The lecturer said “Read the question carefully.”', 'The lecturer said, “Read the question carefully.”', 'The lecturer said “Read the question carefully”.', 'The lecturer, said, “Read the question carefully.”'], correctAnswer: 'B' },
             { id: generateId(), questionText: 'Which of the following is an example of a paradox?', options: ['The wind whispered through the trees.', 'The room was as cold as ice.', 'The more he learned, the less he realized he knew.', 'The sun smiled upon the village.'], correctAnswer: 'C' }
           ]
         },
         {
           id: 'logical',
           name: 'Logical and Analytical Reasoning',
           questions: [
             { id: generateId(), questionText: 'All economists are researchers. Some researchers are lecturers. Which conclusion necessarily follows?', options: ['All economists are lecturers.', 'Some economists are lecturers.', 'All economists are researchers.', 'No lecturer is an economist.'], correctAnswer: 'C' },
             { id: generateId(), questionText: 'All metals conduct electricity. Copper is a metal. Therefore:', options: ['Copper may conduct electricity.', 'Copper conducts electricity.', 'Everything that conducts electricity is copper.', 'No non-metal conducts electricity.'], correctAnswer: 'B' },
             { id: generateId(), questionText: 'If BOOK is coded as CPPL, how is READ coded using the same rule?', options: ['SFBE', 'S F C E', 'Q D Z C', 'T G F E'], correctAnswer: 'A' },
             { id: generateId(), questionText: 'Find the odd one out.', options: ['16', '25', '36', '63'], correctAnswer: 'D' },
             { id: generateId(), questionText: 'A is taller than B. C is taller than A. D is shorter than B. Who is the tallest?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'C' },
             { id: generateId(), questionText: 'If all the statements below are true, which conclusion must be true?\nEvery candidate who passes the mock examination studies consistently.\nTunde passed the mock examination.', options: ['Tunde studies consistently.', 'Everyone who studies consistently passes.', 'Tunde is the best candidate.', 'No candidate fails the mock examination.'], correctAnswer: 'A' },
             { id: generateId(), questionText: 'A man walks 5 km north, turns right and walks 3 km, then turns right and walks 5 km. In which direction is he from the starting point?', options: ['North', 'South', 'East', 'West'], correctAnswer: 'C' }
           ]
         },
         {
           id: 'general',
           name: 'General Knowledge (Literature)',
           questions: [
             { id: generateId(), questionText: 'A literary work in which a character’s apparently virtuous action produces disastrous consequences mainly illustrates the difference between', options: ['intention and consequence', 'theme and subject matter', 'plot and subplot', 'exposition and denouement'], correctAnswer: 'A' },
             { id: generateId(), questionText: 'When a writer deliberately presents an apparently minor detail that later becomes crucial to the plot, the technique is best described as', options: ['bathos', 'foreshadowing', 'anticlimax', 'flashback'], correctAnswer: 'B' },
             { id: generateId(), questionText: 'A character who serves as a contrast to another character in order to highlight the latter’s qualities is called a', options: ['confidant', 'foil', 'chorus', 'stock character'], correctAnswer: 'B' },
             { id: generateId(), questionText: 'In tragedy, hamartia is best understood as', options: ['an unavoidable flaw', 'poetic justice', 'comic relief', 'the hero\'s reward'], correctAnswer: 'A' }
           ]
         }
       ];

       await updateDoc(doc(db, 'academies', academy.id, 'mockExams', exam.id), {
          subjects: questionsData
       });
       toast({ title: 'Success', description: '10:30 AM Mock Questions Seeded!' });
     } catch(e) {
       console.error(e);
     }
  };


  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!exam) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin-sheun/mock-exams">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
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
                <Input readOnly value={`${window.location.origin}/mock-exam/${exam.id}`} className="bg-muted" />
                <Button variant="secondary" onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/mock-exam/${exam.id}`);
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
                  {exam.bannedEmails.map(email => (
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
              {exam.subjects.map(subject => (
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
