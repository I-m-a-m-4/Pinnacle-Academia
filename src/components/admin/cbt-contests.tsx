'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, Clock, Users, Trophy, Plus, Save, Trash2, Loader } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function CbtContestManager({ subjects }: { subjects: any[] }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [contests, setContests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [maxParticipants, setMaxParticipants] = useState('1000');

    useEffect(() => {
        if (!firestore) return;
        const q = query(collection(firestore, 'cbt_contests'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setContests(data);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, [firestore]);

    const handleCreateContest = async () => {
        if (!title || !date || !time) {
            toast({ title: 'Missing fields', description: 'Please fill out all required fields.', variant: 'destructive' });
            return;
        }

        setIsSaving(true);
        try {
            await addDoc(collection(firestore, 'cbt_contests'), {
                title,
                date,
                time,
                maxParticipants: parseInt(maxParticipants),
                status: 'upcoming',
                registeredCount: 0,
                createdAt: serverTimestamp()
            });
            toast({ title: 'Contest Scheduled', description: 'The mock exam contest has been announced to students.' });
            setTitle('');
            setDate('');
            setTime('');
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteContest = async (id: string) => {
        if (!confirm('Are you sure you want to cancel this contest?')) return;
        try {
            await deleteDoc(doc(firestore, 'cbt_contests', id));
            toast({ title: 'Contest Cancelled' });
        } catch (error: any) {
            toast({ title: 'Error', description: error.message, variant: 'destructive' });
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-white/10 bg-white/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-400" />
                        Schedule New Contest
                    </CardTitle>
                    <CardDescription>Announce an upcoming mock exam that students can register for.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label>Contest Title</Label>
                            <Input 
                                value={title} 
                                onChange={e => setTitle(e.target.value)} 
                                placeholder="e.g. OAU Post-UTME Grand Mock" 
                                className="bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Exam Date</Label>
                            <Input 
                                type="date"
                                value={date} 
                                onChange={e => setDate(e.target.value)} 
                                className="bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input 
                                type="time"
                                value={time} 
                                onChange={e => setTime(e.target.value)} 
                                className="bg-background"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Participant Capacity</Label>
                            <Input 
                                type="number"
                                value={maxParticipants} 
                                onChange={e => setMaxParticipants(e.target.value)} 
                                className="bg-background"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleCreateContest} disabled={isSaving} className="w-full md:w-auto">
                        {isSaving ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                        Announce Contest
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Active & Past Contests</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center p-8"><Loader className="h-6 w-6 animate-spin text-primary" /></div>
                    ) : contests.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                            No contests scheduled yet.
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Contest Name</TableHead>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Registrations</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {contests.map(c => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.title}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1 text-xs">
                                                <CalendarIcon className="h-3 w-3" /> {c.date} 
                                                <Clock className="h-3 w-3 ml-2" /> {c.time}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3 w-3 text-muted-foreground" />
                                                <span>{c.registeredCount} / {c.maxParticipants}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={c.status === 'upcoming' ? 'default' : 'secondary'} className={c.status === 'upcoming' ? 'bg-indigo-500/20 text-indigo-400' : ''}>
                                                {c.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteContest(c.id)} className="text-muted-foreground hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
