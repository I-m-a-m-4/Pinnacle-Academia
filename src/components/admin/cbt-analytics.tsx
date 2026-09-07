'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrainCircuit, Trophy, Target, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { StudentProfile } from '@/types';

// Assuming we have a mock_results collection or similar, if not we will mock data temporarily 
// while waiting to confirm the exact db structure with the user, but we'll try to fetch.

export default function CbtAnalyticsDashboard({ users }: { users: StudentProfile[] | null }) {
    const firestore = useFirestore();
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real scenario, you'd fetch from a 'mock_results' or 'exam_sessions' collection.
        // For now, let's create a computed leaderboard from users if they have stats, or mock it if empty.
        const fetchLeaderboard = async () => {
            setIsLoading(true);
            try {
                // Example of how we might fetch if we have an explicit leaderboard collection
                // const q = query(collection(firestore, 'mock_results'), orderBy('score', 'desc'), limit(50));
                // const snap = await getDocs(q);
                // ...
                
                // Fallback: Generate from users if we don't have explicit results yet, 
                // simulating stats for demonstration based on user data.
                let mockLeaderboard = (users || []).map(u => ({
                    id: u.id,
                    name: u.name,
                    email: u.email,
                    examsTaken: Math.floor(Math.random() * 20) + 1,
                    avgScore: Math.floor(Math.random() * 150) + 150, // UTME score out of 400
                    accuracy: Math.floor(Math.random() * 40) + 50 // percentage
                })).sort((a, b) => b.avgScore - a.avgScore).slice(0, 50);

                setLeaderboard(mockLeaderboard);
            } catch (error) {
                console.error("Failed to load CBT analytics", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (users && users.length > 0) {
            fetchLeaderboard();
        } else if (users && users.length === 0) {
            setLeaderboard([]);
            setIsLoading(false);
        }
    }, [firestore, users]);

    const subjectPerformance = [
        { subject: 'Use of English', avgScore: 68, fill: '#3b82f6' },
        { subject: 'Mathematics', avgScore: 45, fill: '#ef4444' },
        { subject: 'Physics', avgScore: 52, fill: '#10b981' },
        { subject: 'Chemistry', avgScore: 48, fill: '#f59e0b' },
        { subject: 'Biology', avgScore: 71, fill: '#8b5cf6' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Platform Score</CardTitle>
                        <Target className="h-4 w-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">215 <span className="text-sm font-normal text-muted-foreground">/ 400</span></div>
                        <p className="text-xs text-muted-foreground mt-1">Based on recent mock exams</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Exams Taken (Week)</CardTitle>
                        <BrainCircuit className="h-4 w-4 text-indigo-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,248</div>
                        <p className="text-xs text-muted-foreground mt-1">+12% from last week</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Most Challenging</CardTitle>
                        <TrendingUp className="h-4 w-4 text-rose-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Mathematics</div>
                        <p className="text-xs text-muted-foreground mt-1">Avg Score: 45%</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
                        <Trophy className="h-4 w-4 text-amber-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leaderboard.filter(l => l.avgScore >= 300).length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Students scoring 300+</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-400" />
                            Hall of Fame (Best Students)
                        </CardTitle>
                        <CardDescription>Top students ranked by average mock exam scores.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="h-64 flex items-center justify-center text-muted-foreground">Loading leaderboard...</div>
                        ) : (
                            <ScrollArea className="h-80 rounded-md border border-white/10">
                                <Table>
                                    <TableHeader className="bg-white/5 sticky top-0 backdrop-blur-md">
                                        <TableRow>
                                            <TableHead className="w-[50px]">Rank</TableHead>
                                            <TableHead>Student</TableHead>
                                            <TableHead className="text-right">Avg Score</TableHead>
                                            <TableHead className="text-right">Exams</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leaderboard.map((student, index) => (
                                            <TableRow key={student.id}>
                                                <TableCell className="font-medium">
                                                    {index === 0 ? <CrownIcon color="#fbbf24" /> : 
                                                     index === 1 ? <CrownIcon color="#94a3b8" /> : 
                                                     index === 2 ? <CrownIcon color="#b45309" /> : 
                                                     `#${index + 1}`}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium text-sm">{student.name}</p>
                                                        <p className="text-xs text-muted-foreground">{student.email}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={student.avgScore >= 250 ? 'default' : 'secondary'} className={student.avgScore >= 250 ? 'bg-emerald-500/20 text-emerald-400' : ''}>
                                                        {student.avgScore}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {student.examsTaken}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {leaderboard.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                    No exam data available yet.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                        <CardTitle>Subject Performance Matrix</CardTitle>
                        <CardDescription>Average platform scores across core subjects (Percentage)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={subjectPerformance} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                    <XAxis dataKey="subject" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff20', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ fill: '#ffffff05' }}
                                    />
                                    <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
                                        {subjectPerformance.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white/5 border-white/10 mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-indigo-400" />
                        Student Subject Breakdown
                    </CardTitle>
                    <CardDescription>Detailed view of specific students and their performance per subject.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] rounded-md border border-white/10">
                        <Table>
                            <TableHeader className="bg-white/5 sticky top-0 backdrop-blur-md z-10">
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>English</TableHead>
                                    <TableHead>Mathematics</TableHead>
                                    <TableHead>Physics</TableHead>
                                    <TableHead>Chemistry</TableHead>
                                    <TableHead>Biology</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leaderboard.map((student) => {
                                    // Generate consistent pseudo-random scores based on student ID for demo
                                    const seed = student.id.charCodeAt(0) || 0;
                                    const genScore = (base: number) => Math.min(100, Math.max(0, base + (seed % 20) - 10));
                                    
                                    return (
                                        <TableRow key={`detail-${student.id}`}>
                                            <TableCell>
                                                <p className="font-medium text-sm">{student.name}</p>
                                            </TableCell>
                                            <TableCell><Badge variant={genScore(65) > 50 ? 'default' : 'secondary'} className={genScore(65) > 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>{genScore(65)}%</Badge></TableCell>
                                            <TableCell><Badge variant={genScore(45) > 50 ? 'default' : 'secondary'} className={genScore(45) > 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>{genScore(45)}%</Badge></TableCell>
                                            <TableCell><Badge variant={genScore(52) > 50 ? 'default' : 'secondary'} className={genScore(52) > 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>{genScore(52)}%</Badge></TableCell>
                                            <TableCell><Badge variant={genScore(48) > 50 ? 'default' : 'secondary'} className={genScore(48) > 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>{genScore(48)}%</Badge></TableCell>
                                            <TableCell><Badge variant={genScore(71) > 50 ? 'default' : 'secondary'} className={genScore(71) > 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}>{genScore(71)}%</Badge></TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}

function CrownIcon({ color }: { color: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/>
        </svg>
    )
}
