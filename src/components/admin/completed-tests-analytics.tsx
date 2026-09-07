'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { collectionGroup, query, getDocs, orderBy, where, Timestamp } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, isSameDay, startOfDay } from 'date-fns';
import { Activity, CheckCircle2, TrendingUp, CalendarDays } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function CompletedTestsAnalytics() {
    const firestore = useFirestore();
    const [tests, setTests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            if (!firestore) return;
            setIsLoading(true);
            try {
                // Fetch tests from the last 30 days using collectionGroup
                const thirtyDaysAgo = Timestamp.fromDate(subDays(new Date(), 30));
                
                // Note: This requires a composite index on examResults (createdAt) in Firebase
                const resultsQuery = query(
                    collectionGroup(firestore, 'examResults'),
                    where('createdAt', '>=', thirtyDaysAgo),
                    orderBy('createdAt', 'desc')
                );
                
                const snap = await getDocs(resultsQuery);
                const resultsData = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                
                setTests(resultsData);
            } catch (error: any) {
                console.error("Failed to fetch completed tests:", error);
                // If index is missing, it will throw an error with a URL to create it.
                // You can check the console to click the link.
            } finally {
                setIsLoading(false);
            }
        };

        fetchTests();
    }, [firestore]);

    const stats = useMemo(() => {
        const today = new Date();
        const startOfTodayDate = startOfDay(today);
        const startOfThisWeek = startOfDay(subDays(today, today.getDay()));

        let todayCount = 0;
        let weekCount = 0;

        tests.forEach(test => {
            if (!test.createdAt) return;
            const testDate = test.createdAt.toDate();
            
            if (testDate >= startOfTodayDate) {
                todayCount++;
            }
            if (testDate >= startOfThisWeek) {
                weekCount++;
            }
        });

        // Group by day for chart (last 14 days)
        const last14Days = Array.from({ length: 14 }, (_, i) => {
            const d = subDays(today, 13 - i);
            return {
                date: d,
                displayDate: format(d, 'MMM dd'),
                count: 0
            };
        });

        tests.forEach(test => {
            if (!test.createdAt) return;
            const testDate = test.createdAt.toDate();
            
            const dayObj = last14Days.find(d => isSameDay(d.date, testDate));
            if (dayObj) {
                dayObj.count++;
            }
        });

        return {
            total: tests.length,
            today: todayCount,
            week: weekCount,
            chartData: last14Days
        };
    }, [tests]);

    if (isLoading) {
        return <div className="text-sm text-muted-foreground animate-pulse py-8 text-center">Loading test analytics...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary/5 border-primary/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tests (Last 30 Days)</CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{stats.total}</div>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-500/5 border-emerald-500/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tests (Today)</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">{stats.today}</div>
                    </CardContent>
                </Card>
                <Card className="bg-indigo-500/5 border-indigo-500/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tests (This Week)</CardTitle>
                        <CalendarDays className="h-4 w-4 text-indigo-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-indigo-600">{stats.week}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-sm border-border/40">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Daily Test Completions (Last 14 Days)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                    <XAxis 
                                        dataKey="displayDate" 
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis 
                                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => Math.floor(val).toString()}
                                    />
                                    <Tooltip 
                                        cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                                        contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                    />
                                    <Bar 
                                        dataKey="count" 
                                        fill="hsl(var(--primary))" 
                                        radius={[4, 4, 0, 0]} 
                                        barSize={32}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-border/40 flex flex-col">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-base font-semibold">Recent Test Feed</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <ScrollArea className="h-[250px] w-full">
                            {tests.length === 0 ? (
                                <div className="p-6 text-center text-sm text-muted-foreground">No recent tests found.</div>
                            ) : (
                                <div className="divide-y">
                                    {tests.slice(0, 20).map((test, i) => (
                                        <div key={i} className="p-4 hover:bg-muted/30 transition-colors flex justify-between items-center">
                                            <div>
                                                <div className="font-medium text-sm">Score: {test.totalScore || test.score} / {test.maxScore || test.totalQuestions}</div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    {test.mode} mode • {test.subjects?.join(', ')}
                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                                                {test.createdAt ? format(test.createdAt.toDate(), 'MMM dd, p') : ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
