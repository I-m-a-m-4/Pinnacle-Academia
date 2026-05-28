'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Hash, 
  Users, 
  Sparkles, 
  MessageSquare, 
  User, 
  ChevronLeft, 
  Bot, 
  HelpCircle,
  BookOpen,
  School,
  GraduationCap
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { useAcademy } from '@/context/academy-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  text: string;
  createdAt: any;
}

export default function PeersMentorsPage() {
  const { academy, currentUserProfile: currentUser, users, students } = useAcademy();
  const firestore = useFirestore();
  const { toast } = useToast();

  // Dynamic Cohort Year calculation based on user's profile creation or current year
  const cohortYear = React.useMemo(() => {
    if (!currentUser) return new Date().getFullYear();
    const date = currentUser.createdAt?.toDate 
      ? currentUser.createdAt.toDate() 
      : new Date(currentUser.createdAt || Date.now());
    return date.getFullYear();
  }, [currentUser]);

  // Dynamic Channel list perpetual with the cohort year
  const channels = React.useMemo(() => {
    return [
      { id: `${cohortYear}-general`, name: `general-study-${cohortYear}`, description: `General academic discussions and prep advice for Class of ${cohortYear}.`, icon: MessageSquare },
      { id: `${cohortYear}-jamb`, name: `jamb-prep-${cohortYear}`, description: `JAMB UTME past questions and strategies for Class of ${cohortYear}.`, icon: BookOpen },
      { id: `${cohortYear}-post-utme`, name: `post-utme-talk-${cohortYear}`, description: `Post-UTME screening updates and admission help for Class of ${cohortYear}.`, icon: School },
      { id: `${cohortYear}-waec-neco`, name: `waec-neco-corner-${cohortYear}`, description: `WAEC & NECO exam topics and practical prep for Class of ${cohortYear}.`, icon: GraduationCap },
      { id: `${cohortYear}-mentors`, name: `ask-a-mentor-${cohortYear}`, description: `Direct advice from high-performing student mentors for Class of ${cohortYear}.`, icon: Sparkles },
    ];
  }, [cohortYear]);

  const [activeChannelId, setActiveChannelId] = React.useState(`${cohortYear}-general`);
  const [messageText, setMessageText] = React.useState('');
  const [showSidebarMobile, setShowSidebarMobile] = React.useState(true);
  const [isSending, setIsSending] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Sync activeChannelId if cohortYear changes
  React.useEffect(() => {
    setActiveChannelId(`${cohortYear}-general`);
  }, [cohortYear]);

  // Firestore query: Scoped to cohort channel so students in the same year can talk.
  // Note: Ordered by createdAt so they display in historical order. Limit to last 150 to keep load light.
  const chatsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'peers_chats'),
      where('channelId', '==', activeChannelId),
      orderBy('createdAt', 'asc'),
      limit(150)
    );
  }, [firestore, activeChannelId]);

  const { data: dbMessages, isLoading: isChatLoading } = useCollection<ChatMessage>(chatsQuery);

  // Fallback messages for when the database is empty (customized for the cohort year)
  const fallbackMessages = React.useMemo(() => {
    const defaultText: Record<string, ChatMessage[]> = {
      [`${cohortYear}-general`]: [
        { id: 'g1', channelId: `${cohortYear}-general`, senderId: 'chidi', senderName: 'Chidi Benson', senderEmail: 'chidi@example.com', senderRole: 'mentor', text: `Welcome to the Class of ${cohortYear} study room! Let's work together to smash our exams.`, createdAt: { toDate: () => new Date(Date.now() - 3600000 * 2) } }
      ],
      [`${cohortYear}-jamb`]: [
        { id: 'j1', channelId: `${cohortYear}-jamb`, senderId: 'emeka', senderName: 'Emeka Obi', senderEmail: 'emeka@example.com', senderRole: 'mentor', text: `Class of ${cohortYear} JAMB room is open! Share subject combinations or past questions you need help with.`, createdAt: { toDate: () => new Date(Date.now() - 3600000) } }
      ],
      [`${cohortYear}-post-utme`]: [
        { id: 'p1', channelId: `${cohortYear}-post-utme`, senderId: 'chidi', senderName: 'Chidi Benson', senderEmail: 'chidi@example.com', senderRole: 'mentor', text: `Post-UTME discussions for the ${cohortYear} session. Share target schools here!`, createdAt: { toDate: () => new Date(Date.now() - 3600000 * 3) } }
      ],
      [`${cohortYear}-waec-neco`]: [
        { id: 'w1', channelId: `${cohortYear}-waec-neco`, senderId: 'amina', senderName: 'Amina Yusuf', senderEmail: 'amina@example.com', senderRole: 'admin', text: `WAEC & NECO preparation corner. Drop complex questions or study sheets.`, createdAt: { toDate: () => new Date(Date.now() - 3600000 * 4) } }
      ],
      [`${cohortYear}-mentors`]: [
        { id: 'm1', channelId: `${cohortYear}-mentors`, senderId: 'chidi', senderName: 'Chidi Benson', senderEmail: 'chidi@example.com', senderRole: 'mentor', text: `Hi! Ask me anything about preparing, timed practice, or choosing courses.`, createdAt: { toDate: () => new Date(Date.now() - 3600000 * 5) } }
      ]
    };
    return defaultText[activeChannelId] || [];
  }, [activeChannelId, cohortYear]);

  // Combine Firestore messages and initial fallbacks
  const messages = React.useMemo(() => {
    if (!dbMessages || dbMessages.length === 0) {
      return fallbackMessages;
    }
    // Prevent duplicate entries if fallbacks get pushed to DB
    const dbIds = new Set(dbMessages.map(m => m.id));
    const filteredFallback = fallbackMessages.filter(f => !dbIds.has(f.id));
    return [...filteredFallback, ...dbMessages].sort((a, b) => {
      const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
      const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
      return timeA - timeB;
    });
  }, [dbMessages, fallbackMessages]);

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];

  // Filter classmates belonging to the same cohort/year
  const cohortClassmates = React.useMemo(() => {
    if (!users) return [];
    return users.filter(u => {
      if (u.id === currentUser?.id) return false;
      const uYear = u.createdAt?.toDate 
        ? u.createdAt.toDate().getFullYear() 
        : new Date(u.createdAt || Date.now()).getFullYear();
      return uYear === cohortYear;
    });
  }, [users, currentUser, cohortYear]);

  // Auto Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isChatLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !firestore || !currentUser) return;

    setIsSending(true);
    const contentText = messageText.trim();
    setMessageText('');

    try {
      await addDoc(collection(firestore, 'peers_chats'), {
        channelId: activeChannelId,
        academyId: academy?.id || 'public',
        senderId: currentUser.id || 'anonymous',
        senderName: currentUser.name || 'Anonymous Student',
        senderEmail: currentUser.email || '',
        senderRole: currentUser.role || 'student',
        text: contentText,
        createdAt: serverTimestamp(),
      });
      scrollToBottom();
    } catch (err) {
      console.error("Failed to send message:", err);
      toast({
        variant: 'destructive',
        title: 'Message failed',
        description: 'Your message could not be sent. Please check your connection.',
      });
      setMessageText(contentText); // Restore draft
    } finally {
      setIsSending(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'owner':
      case 'admin':
      case 'super-admin':
        return <Badge className="bg-red-500 hover:bg-red-600 text-white font-bold text-[10px] scale-90 px-1 py-0 h-4">Admin</Badge>;
      case 'mentor':
        return <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-[10px] scale-90 px-1 py-0 h-4">Mentor</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px] text-muted-foreground border-muted-foreground/30 scale-90 px-1 py-0 h-4">Student</Badge>;
    }
  };

  const formatMessageTime = (createdAt: any) => {
    if (!createdAt) return '';
    const date = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] w-full gap-4 overflow-hidden rounded-2xl border bg-card shadow-lg">
      
      {/* Sidebar List (Channels & Peers) */}
      <div className={cn(
        "w-full md:w-80 border-r bg-muted/20 flex flex-col h-full transition-all duration-300",
        !showSidebarMobile && "hidden md:flex"
      )}>
        <div className="p-4 border-b bg-muted/40">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Peers & Mentors
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Cohort year {cohortYear} study rooms</p>
        </div>

        {/* Channels Section */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Cohort {cohortYear} Rooms</span>
            <ul className="mt-2 space-y-1">
              {channels.map((channel) => {
                const Icon = channel.icon;
                const isActive = channel.id === activeChannelId;
                return (
                  <li key={channel.id}>
                    <button
                      onClick={() => {
                        setActiveChannelId(channel.id);
                        setShowSidebarMobile(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 text-left font-medium",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-md scale-[1.02]" 
                          : "hover:bg-muted text-foreground/80 hover:text-foreground"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-primary")} />
                      <span className="truncate">#{channel.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Classmates List */}
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Classmates ({cohortYear})</span>
            <ul className="mt-2 space-y-2">
              {cohortClassmates.slice(0, 10).map((classmate) => (
                <li key={classmate.id} className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/30">
                  <div className="relative">
                    <Avatar className="h-7 w-7 border">
                      <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                        {classmate.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{classmate.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{classmate.email}</p>
                  </div>
                </li>
              ))}
              {cohortClassmates.length === 0 && (
                <li className="text-xs text-muted-foreground text-center py-4">No classmates found in {cohortYear} cohort.</li>
              )}
            </ul>
          </div>
        </div>

        {/* User Card footer */}
        {currentUser && (
          <div className="p-3 border-t bg-muted/40 flex items-center gap-3">
            <Avatar className="h-8 w-8 border">
              <AvatarFallback className="text-xs font-bold bg-primary text-primary-foreground">
                {currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {getRoleBadge(currentUser.role)}
                <span className="text-[9px] text-muted-foreground font-semibold">Cohort {cohortYear}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Chat Thread Area */}
      <div className={cn(
        "flex-1 flex flex-col h-full bg-background",
        showSidebarMobile && "hidden md:flex"
      )}>
        {/* Chat Sticky Header */}
        <div className="p-4 border-b flex items-center gap-3 bg-card/60 backdrop-blur-sm">
          <button 
            onClick={() => setShowSidebarMobile(true)}
            className="md:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-base flex items-center gap-2 text-foreground">
              <Hash className="h-4 w-4 text-primary" />
              {activeChannel.name}
            </h4>
            <p className="text-xs text-muted-foreground truncate">{activeChannel.description}</p>
          </div>
        </div>

        {/* Message Panel list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
          {isChatLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <span className="loading-spinner animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent" />
              <p className="text-xs text-muted-foreground">Loading chat room messages...</p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => {
                const isCurrentUser = message.senderId === currentUser?.id || message.senderEmail === currentUser?.email;
                return (
                  <div 
                    key={message.id || index} 
                    className={cn(
                      "flex gap-3 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                      isCurrentUser ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    <Avatar className="h-8 w-8 border shrink-0">
                      <AvatarFallback className={cn(
                        "text-xs font-bold",
                        isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted-foreground/10 text-foreground"
                      )}>
                        {message.senderName ? message.senderName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'ST'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      {/* Message sender header */}
                      <div className={cn(
                        "flex items-center gap-2 text-xs",
                        isCurrentUser ? "justify-end" : "justify-start"
                      )}>
                        <span className="font-bold text-foreground/90">{message.senderName}</span>
                        {getRoleBadge(message.senderRole)}
                        <span className="text-[10px] text-muted-foreground">{formatMessageTime(message.createdAt)}</span>
                      </div>

                      {/* Message text bubble */}
                      <div className={cn(
                        "p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-sm",
                        isCurrentUser 
                          ? "bg-primary text-primary-foreground rounded-tr-none" 
                          : "bg-card text-foreground border rounded-tl-none"
                      )}>
                        {message.text}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input box */}
        <form onSubmit={handleSendMessage} className="p-3 border-t bg-card/80 flex items-center gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={`Message #${activeChannel.name}...`}
            className="flex-1 bg-muted/30 border-muted focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary/50"
            disabled={isSending}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!messageText.trim() || isSending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-10 shrink-0"
          >
            <Send className="h-4.5 w-4.5" />
          </Button>
        </form>
      </div>

    </div>
  );
}
