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
import { collection, query, where, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
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

const CHANNELS = [
  { id: 'general', name: 'general-study', description: 'General academic discussions, questions, and study advice.', icon: MessageSquare },
  { id: 'jamb', name: 'jamb-prep', description: 'JAMB UTME past questions, registrations, and exam strategies.', icon: BookOpen },
  { id: 'post-utme', name: 'post-utme-talk', description: 'Post-UTME updates, screening details, and admission aggregate help.', icon: School },
  { id: 'waec-neco', name: 'waec-neco-corner', description: 'WAEC, NECO, and GCE syllabus prep and exam topics.', icon: GraduationCap },
  { id: 'mentors', name: 'ask-a-mentor', description: 'Get direct advice from high-performing student mentors.', icon: Sparkles },
];

const FALLBACK_MESSAGES: Record<string, ChatMessage[]> = {
  general: [
    { id: 'g1', channelId: 'general', senderId: 'chidi', senderName: 'Chidi Benson', senderEmail: 'chidi@example.com', senderRole: 'mentor', text: 'Welcome to the general study room! Feel free to share any study challenges or questions here.', createdAt: { toDate: () => new Date(Date.now() - 3600000 * 2) } },
    { id: 'g2', channelId: 'general', senderId: 'amina', senderName: 'Amina Yusuf', senderEmail: 'amina@example.com', senderRole: 'admin', text: 'Hey guys! Don\'t forget to use the Syllabus Tracker to monitor your JAMB prep progress.', createdAt: { toDate: () => new Date(Date.now() - 3600000) } },
    { id: 'g3', channelId: 'general', senderId: 'tunde', senderName: 'Tunde Bakare', senderEmail: 'tunde@example.com', senderRole: 'student', text: 'Does anyone have the WAEC Chemistry past questions for 2025?', createdAt: { toDate: () => new Date(Date.now() - 1800000) } }
  ],
  jamb: [
    { id: 'j1', channelId: 'jamb', senderId: 'amina', senderName: 'Amina Yusuf', senderEmail: 'amina@example.com', senderRole: 'admin', text: 'Welcome to the JAMB Prep room! Use this channel to discuss subject combinations and past questions.', createdAt: { toDate: () => new Date(Date.now() - 3600000 * 3) } },
    { id: 'j2', channelId: 'jamb', senderId: 'emeka', senderName: 'Emeka Obi', senderEmail: 'emeka@example.com', senderRole: 'mentor', text: 'Tip: For Physics, make sure you focus on Mechanics and Waves. Those topics carry a lot of marks.', createdAt: { toDate: () => new Date(Date.now() - 3600000) } }
  ],
  'post-utme': [
    { id: 'p1', channelId: 'post-utme', senderId: 'chidi', senderName: 'Chidi Benson', senderEmail: 'chidi@example.com', senderRole: 'mentor', text: 'Post-UTME screening formats vary by school. UNILAG uses CBT (Maths, Eng, Gen Paper), OAU has subject exams.', createdAt: { toDate: () => new Date(Date.now() - 3600000 * 5) } }
  ],
  'waec-neco': [
    { id: 'w1', channelId: 'waec-neco', senderId: 'amina', senderName: 'Amina Yusuf', senderEmail: 'amina@example.com', senderRole: 'admin', text: 'WAEC timetables are out. Let\'s use this space to share tips for practicals.', createdAt: { toDate: () => new Date(Date.now() - 3600000 * 12) } }
  ],
  mentors: [
    { id: 'm1', channelId: 'mentors', senderId: 'chidi', senderName: 'Chidi Benson', senderEmail: 'chidi@example.com', senderRole: 'mentor', text: 'Hello! I scored 335 in JAMB last year. Ask me anything about scheduling study hours or tackling tough topics.', createdAt: { toDate: () => new Date(Date.now() - 3600000 * 4) } }
  ]
};

export default function PeersMentorsPage() {
  const { academy, currentUserProfile: currentUser, students } = useAcademy();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [activeChannelId, setActiveChannelId] = React.useState('general');
  const [messageText, setMessageText] = React.useState('');
  const [showSidebarMobile, setShowSidebarMobile] = React.useState(true);
  const [isSending, setIsSending] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Firestore collection query for real-time messages
  const chatsQuery = useMemoFirebase(() => {
    if (!firestore || !academy?.id) return null;
    return query(
      collection(firestore, 'peers_chats'),
      where('academyId', '==', academy.id),
      where('channelId', '==', activeChannelId),
      orderBy('createdAt', 'asc')
    );
  }, [firestore, academy?.id, activeChannelId]);

  const { data: dbMessages, isLoading: isChatLoading } = useCollection<ChatMessage>(chatsQuery);

  // Combine Firestore messages and initial fallbacks
  const messages = React.useMemo(() => {
    const fallbackList = FALLBACK_MESSAGES[activeChannelId] || [];
    if (!dbMessages || dbMessages.length === 0) {
      return fallbackList;
    }
    // Filter fallback messages so they don't duplicate if already stored/saved in DB
    return [...fallbackList, ...dbMessages].sort((a, b) => {
      const timeA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
      const timeB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
      return timeA - timeB;
    });
  }, [dbMessages, activeChannelId]);

  const activeChannel = CHANNELS.find(c => c.id === activeChannelId) || CHANNELS[0];

  // Auto Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isChatLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !firestore || !academy?.id || !currentUser) return;

    setIsSending(true);
    const contentText = messageText.trim();
    setMessageText('');

    try {
      await addDoc(collection(firestore, 'peers_chats'), {
        channelId: activeChannelId,
        academyId: academy.id,
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
        description: 'Your message could not be sent. Please check your internet connection.',
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
          <p className="text-xs text-muted-foreground mt-0.5">Discuss preparation with fellow candidates.</p>
        </div>

        {/* Channels Section */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Rooms / Channels</span>
            <ul className="mt-2 space-y-1">
              {CHANNELS.map((channel) => {
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

          {/* Online Peers List */}
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Classmates & Mentors</span>
            <ul className="mt-2 space-y-2">
              {students && students.slice(0, 10).map((student) => (
                <li key={student.id} className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-muted/30">
                  <div className="relative">
                    <Avatar className="h-7 w-7 border">
                      <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                        {student.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-background" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">{student.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{student.email}</p>
                  </div>
                </li>
              ))}
              {(!students || students.length === 0) && (
                <li className="text-xs text-muted-foreground text-center py-4">No classmates found.</li>
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
