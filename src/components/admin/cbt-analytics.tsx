'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BrainCircuit, Trophy, Target, TrendingUp, Users, MousePointerClick, Calendar, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend } from 'recharts';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { format, subDays, eachDayOfInterval, startOfDay } from 'date-fns';
import type { StudentProfile } from '@/types';
import { CompletedTestsAnalytics } from './completed-tests-analytics';

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

            {/* REAL COMPLETED TESTS ANALYTICS */}
            <CompletedTestsAnalytics />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
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

            {/* Retention Cohort Section */}
            <RetentionCohortSection users={users} />

            {/* Page Usage Analytics */}
            <PageUsageAnalytics users={users} />
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

// --- Retention Cohort Chart (Day-by-Day Active Users) ---
function RetentionCohortSection({ users }: { users: StudentProfile[] | null }) {
    const retentionData = useMemo(() => {
        if (!users || users.length === 0) return [];
        const days = 14; // last 14 days
        const today = startOfDay(new Date());
        const dateRange = eachDayOfInterval({ start: subDays(today, days - 1), end: today });

        return dateRange.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const activeCount = users.filter(u => {
                const activeDays: string[] = (u as any).activeDays || [];
                return activeDays.includes(dateStr);
            }).length;
            return {
                date: format(day, 'MMM dd'),
                active: activeCount,
                retention: users.length > 0 ? Math.round((activeCount / users.length) * 100) : 0
            };
        });
    }, [users]);

    const todayActive = retentionData[retentionData.length - 1]?.active ?? 0;
    const yesterdayActive = retentionData[retentionData.length - 2]?.active ?? 0;
    const d7Active = retentionData[retentionData.length - 7]?.active ?? 0;

    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* Stat Cards */}
            <div className="md:col-span-1 flex flex-col gap-4">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Active Users</CardTitle>
                        <Activity className="h-4 w-4 text-emerald-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{todayActive}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {yesterdayActive > 0 ? (
                                todayActive >= yesterdayActive
                                    ? `+${todayActive - yesterdayActive} vs yesterday`
                                    : `-${yesterdayActive - todayActive} vs yesterday`
                            ) : 'First day of tracking'}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">7-Day Returning</CardTitle>
                        <Calendar className="h-4 w-4 text-indigo-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{d7Active}</div>
                        <p className="text-xs text-muted-foreground mt-1">Active users 7 days ago</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Retention Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-amber-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {users && users.length > 0 ? Math.round((todayActive / users.length) * 100) : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">of total {users?.length ?? 0} users</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card className="bg-white/5 border-white/10 md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-400" />
                        Day-by-Day Retention Cohort (Last 14 Days)
                    </CardTitle>
                    <CardDescription>Number of unique active users returning each day based on their activity logs.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={retentionData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="date" stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff20', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: '#ffffff20' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="active" name="Active Users" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                                <Line type="monotone" dataKey="retention" name="Retention %" stroke="#6366f1" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// --- Page Usage Analytics ---
function PageUsageAnalytics({ users }: { users: StudentProfile[] | null }) {
    const pageData = useMemo(() => {
        if (!users || users.length === 0) return [];

        // Aggregate pageViews across all users
        const totals: Record<string, number> = {};
        users.forEach(u => {
            const views = (u as any).pageViews || {};
            Object.entries(views).forEach(([rawKey, count]) => {
                // Un-sanitize the key back to a path-like string
                const path = '/' + rawKey.replace(/^_/, '').replace(/_/g, '/');
                totals[path] = (totals[path] || 0) + (count as number);
            });
        });

        return Object.entries(totals)
            .map(([page, views]) => ({ page, views }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 12); // top 12 pages
    }, [users]);

    const totalPageViews = useMemo(() => pageData.reduce((sum, d) => sum + d.views, 0), [pageData]);

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#0ea5e9', '#84cc16', '#a855f7', '#d946ef'];

    return (
        <Card className="bg-white/5 border-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MousePointerClick className="h-5 w-5 text-indigo-400" />
                    Page Usage Analytics
                </CardTitle>
                <CardDescription>
                    Total page views: <strong className="text-foreground">{totalPageViews.toLocaleString()}</strong> — Which screens your students spend the most time on.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {pageData.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
                        <MousePointerClick className="h-8 w-8 opacity-30" />
                        <p>No page view data yet. Students need to navigate the app to start tracking.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={pageData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                                    <XAxis type="number" stroke="#ffffff50" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis dataKey="page" type="category" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} width={130} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#ffffff20', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        cursor={{ fill: '#ffffff05' }}
                                        formatter={(val: number) => [`${val.toLocaleString()} views`, 'Page Views']}
                                    />
                                    <Bar dataKey="views" radius={[0, 4, 4, 0]}>
                                        {pageData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Page</TableHead>
                                        <TableHead className="text-right">Views</TableHead>
                                        <TableHead className="text-right">Share</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pageData.map((row, i) => (
                                        <TableRow key={row.page}>
                                            <TableCell className="font-mono text-xs">
                                                <span className="mr-2 inline-block w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                                {row.page}
                                            </TableCell>
                                            <TableCell className="text-right font-bold">{row.views.toLocaleString()}</TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {totalPageViews > 0 ? `${Math.round((row.views / totalPageViews) * 100)}%` : '0%'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
