'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, HelpCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { Subject } from '@/types';

export default function QuestionManager({ subjects }: { subjects: Subject[] }) {
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
    const [questions, setQuestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!selectedSubjectId) {
                setQuestions([]);
                return;
            }
            
            const subject = subjects.find(s => s.id === selectedSubjectId);
            if (!subject) return;

            setIsLoading(true);
            try {
                // Determine file name from subject name or ID
                // Assume the JSON files are named like 'physics.json', 'chemistry.json'
                const fileName = subject.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                const response = await fetch(`/data/questions/${fileName}.json`);
                
                if (response.ok) {
                    const data = await response.json();
                    setQuestions(Array.isArray(data) ? data : []);
                } else {
                    console.error('Failed to load questions JSON');
                    setQuestions([]);
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
                setQuestions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
        setCurrentPage(1); // Reset page on subject change
    }, [selectedSubjectId, subjects]);

    const filteredQuestions = questions.filter(q => 
        (q.questionText || q.question || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + itemsPerPage);

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        CBT Question Viewer
                    </CardTitle>
                    <CardDescription>View and manage the massive repository of CBT questions.</CardDescription>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                        <SelectTrigger className="w-full md:w-[200px]">
                            <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                            {subjects.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                {selectedSubjectId ? (
                    isLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader className="h-6 w-6 animate-spin text-primary" />
                            <span className="ml-2 text-sm text-muted-foreground">Loading thousands of questions...</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="px-3 py-1">
                                    {filteredQuestions.length} Total Questions
                                </Badge>
                                <div className="relative w-full max-w-xs">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search questions..."
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="pl-9 bg-white/5 border-white/10 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                {paginatedQuestions.map((q, idx) => {
                                    const text = q.questionText || q.question;
                                    const opts = q.options || [];
                                    const answer = q.correctAnswer || q.answer;
                                    const id = q.id || startIndex + idx;

                                    return (
                                        <div key={id} className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="font-medium text-sm">
                                                    <span className="text-primary mr-2">Q{startIndex + idx + 1}.</span>
                                                    {text}
                                                </div>
                                                {q.year && <Badge variant="outline" className="shrink-0">{q.year}</Badge>}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                                                {opts.map((opt: string, oIdx: number) => {
                                                    const letter = String.fromCharCode(65 + oIdx);
                                                    const isCorrect = answer === letter || answer === opt;
                                                    return (
                                                        <div key={oIdx} className={`text-xs p-2 rounded ${isCorrect ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-background'}`}>
                                                            <span className="font-bold mr-2">{letter}.</span> {opt}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            {(q.explanation || q.solution) && (
                                                <div className="pl-6 mt-2 text-xs text-muted-foreground bg-background p-2 rounded border border-white/5">
                                                    <span className="font-semibold text-primary mr-2">Explanation:</span>
                                                    {q.explanation || q.solution}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                                {paginatedQuestions.length === 0 && (
                                    <div className="text-center py-12 text-muted-foreground">
                                        No questions found matching your search.
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                    <p className="text-xs text-muted-foreground">
                                        Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredQuestions.length)} of {filteredQuestions.length}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                                        </Button>
                                        <div className="text-sm font-medium px-4">
                                            {currentPage} / {totalPages}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                        >
                                            Next <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                ) : (
                    <div className="text-center py-16 text-muted-foreground">
                        Please select a subject to load the question bank.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
