'use client';

import * as React from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, Clock, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export default function LeaderboardPage() {
    const firestore = useFirestore();
    const router = useRouter();
    const [leaders, setLeaders] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        async function fetchLeaderboard() {
            if (!firestore) return;
            try {
                const q = query(
                    collection(firestore, 'cbt_leaderboards'),
                    orderBy('percentage', 'desc'),
                    orderBy('submittedAt', 'desc'),
                    limit(50)
                );
                const snapshot = await getDocs(q);
                const results = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...(doc.data() as any)
                })) as any[];
                
                // Keep only highest score per alias
                const uniqueLeadersMap = new Map();
                results.forEach(res => {
                    const existing = uniqueLeadersMap.get(res.alias);
                    if (!existing || existing.percentage < res.percentage) {
                        uniqueLeadersMap.set(res.alias, res);
                    }
                });
                
                setLeaders(Array.from(uniqueLeadersMap.values()).sort((a, b) => b.percentage - a.percentage));
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            } finally {
                setIsLoading(false);
            }
        }
        
        fetchLeaderboard();
    }, [firestore]);

    return (
        <div className="container max-w-5xl mx-auto p-4 md:p-6 lg:p-8 space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <Button variant="ghost" size="sm" className="mb-2 -ml-3 text-muted-foreground" onClick={() => router.push('/cbt-simulator/select-subjects')}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Simulator
                    </Button>
                    <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
                        <Trophy className="h-8 w-8 text-yellow-500" /> CBT Global Leaderboard
                    </h1>
                    <p className="text-muted-foreground mt-2">See how you rank against other scholars. Names are hidden for privacy.</p>
                </div>
            </div>

            <Card className="border shadow-sm">
                <CardHeader className="bg-muted/30 border-b">
                    <CardTitle className="text-lg">Top 50 Performers</CardTitle>
                    <CardDescription>Based on highest overall percentage score</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
                            <Clock className="h-8 w-8 animate-spin text-primary" />
                            Loading rankings...
                        </div>
                    ) : leaders.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            No scores recorded yet. Be the first to take a test!
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16 text-center">Rank</TableHead>
                                    <TableHead>Scholar Alias</TableHead>
                                    <TableHead>Target University</TableHead>
                                    <TableHead className="text-right">Score</TableHead>
                                    <TableHead className="text-right">Percentage</TableHead>
                                    <TableHead className="text-right">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leaders.map((leader, index) => (
                                    <TableRow key={leader.id} className={index < 3 ? 'bg-muted/20' : ''}>
                                        <TableCell className="text-center font-bold">
                                            {index === 0 && <Trophy className="h-5 w-5 text-yellow-500 mx-auto" />}
                                            {index === 1 && <Medal className="h-5 w-5 text-gray-400 mx-auto" />}
                                            {index === 2 && <Award className="h-5 w-5 text-amber-700 mx-auto" />}
                                            {index > 2 && <span className="text-muted-foreground">#{index + 1}</span>}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {leader.alias}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="font-normal text-xs">{leader.university}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                            {leader.score} / {leader.maxScore}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Badge className={leader.percentage >= 70 ? 'bg-green-500/10 text-green-600' : 'bg-primary/10 text-primary'} variant="secondary">
                                                {leader.percentage}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">
                                            {leader.submittedAt ? formatDistanceToNow(leader.submittedAt.toDate(), { addSuffix: true }) : 'Just now'}
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
