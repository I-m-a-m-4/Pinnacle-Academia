'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CbtContestBanner() {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [upcomingContest, setUpcomingContest] = useState<any>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);

    useEffect(() => {
        if (!firestore) return;
        // Fetch only upcoming contests
        const q = query(collection(firestore, 'cbt_contests'), where('status', '==', 'upcoming'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const contest = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
                setUpcomingContest(contest);
                
                // Check local storage or user doc to see if registered
                if (user && (contest as any).registeredUsers?.includes(user.uid)) {
                    setIsRegistered(true);
                }
            } else {
                setUpcomingContest(null);
            }
        });
        return () => unsubscribe();
    }, [firestore, user]);

    const handleRegister = async () => {
        if (!user || !upcomingContest) {
            toast({ title: 'Please log in to register for contests', variant: 'destructive' });
            return;
        }

        setIsRegistering(true);
        try {
            const contestRef = doc(firestore, 'cbt_contests', upcomingContest.id);
            await updateDoc(contestRef, {
                registeredCount: increment(1)
            });
            setIsRegistered(true);
            toast({ title: 'Registered Successfully!', description: `You are booked for ${upcomingContest.title}.` });
        } catch (error: any) {
            toast({ title: 'Failed to register', description: error.message, variant: 'destructive' });
        } finally {
            setIsRegistering(false);
        }
    };

    if (!upcomingContest) return null;

    return (
        <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-4 z-10 w-full md:w-auto">
                <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Trophy className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-amber-500 border-amber-500/30 bg-amber-500/10 text-[10px] px-1.5 py-0 uppercase">Upcoming Mock</Badge>
                        <h3 className="font-bold text-lg">{upcomingContest.title}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {upcomingContest.date}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {upcomingContest.time}</span>
                    </div>
                </div>
            </div>
            
            <div className="z-10 w-full md:w-auto mt-4 md:mt-0">
                {isRegistered ? (
                    <Button variant="outline" disabled className="w-full md:w-auto bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                        <CheckCircle2 className="mr-2 h-4 w-4" /> Registered
                    </Button>
                ) : (
                    <Button onClick={handleRegister} disabled={isRegistering} className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold">
                        {isRegistering ? 'Registering...' : 'Register Now'} <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
