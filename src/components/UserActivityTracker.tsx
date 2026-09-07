'use client';

import { useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { doc, updateDoc, serverTimestamp, getDoc, writeBatch } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { usePathname } from 'next/navigation';

export function UserActivityTracker() {
    const auth = useAuth();
    const firestore = useFirestore();
    const pathname = usePathname();

    useEffect(() => {
        if (!auth || !firestore) return;

        const checkAndUpdateActivity = async (user: any) => {
            if (!user) return;
            const userRef = doc(firestore, 'users', user.uid);
            const sessionIdKey = `pinnacle_session_id_${user.uid}`;
            let sessionId = sessionStorage.getItem(sessionIdKey);

            if (!sessionId) {
                sessionId = crypto.randomUUID();
                sessionStorage.setItem(sessionIdKey, sessionId);
            }

            const sessionRef = doc(firestore, 'users', user.uid, 'sessions', sessionId);

            const getActivityFromPath = (path: string) => {
                if (path.includes('/active-test')) return 'Taking CBT Exam';
                if (path.includes('/select-subjects') || path.includes('/exam-mode')) return 'Setting up CBT Exam';
                if (path.includes('/study-materials')) return 'Browsing Study Materials';
                if (path.includes('/syllabus-tracker')) return 'Reviewing Syllabus';
                if (path.includes('/performance-analytics')) return 'Checking Analytics';
                if (path.includes('/dashboard')) return 'On Dashboard';
                if (path.includes('/pinnacle-ai') || path.includes('/ai-insights')) return 'Using AI Tutor';
                if (path.includes('/forum') || path.includes('/peers-mentors')) return 'In Community Forum';
                if (path.includes('/admin-sheun')) return 'Admin Dashboard';
                return 'Active in App';
            };

            const currentActivityString = getActivityFromPath(pathname);

            try {
                const lastUpdate = sessionStorage.getItem('last_user_activity_update');
                const lastActivityStored = sessionStorage.getItem('last_user_activity_string');
                const now = Date.now();
                
                // Update if:
                // - Never updated this session
                // - It's been > 5 minutes
                // - The actual activity changed
                if (!lastUpdate || now - parseInt(lastUpdate) > 5 * 60 * 1000 || lastActivityStored !== currentActivityString) {
                    // Check if session is revoked only when we're going to update
                    const sessionSnap = await getDoc(sessionRef);
                    if (sessionSnap.exists() && sessionSnap.data().revoked) {
                        await signOut(auth);
                        sessionStorage.removeItem(sessionIdKey);
                        return;
                    }

                    const sessionExists = sessionSnap.exists();
                    const batch = writeBatch(firestore);
                    
                    batch.set(userRef, {
                        lastSeen: serverTimestamp(),
                        status: 'active',
                        currentActivity: currentActivityString
                    }, { merge: true });

                    batch.set(sessionRef, {
                        sessionId,
                        userAgent: navigator.userAgent,
                        lastSeen: serverTimestamp(),
                        createdAt: sessionExists ? sessionSnap.data().createdAt : serverTimestamp(),
                        revoked: false,
                        deviceInfo: {
                            platform: navigator?.platform || 'Unknown',
                            vendor: navigator?.vendor || 'Unknown',
                            language: navigator?.language || 'Unknown'
                        }
                    }, { merge: true });

                    await batch.commit();
                    sessionStorage.setItem('last_user_activity_update', now.toString());
                    sessionStorage.setItem('last_user_activity_string', currentActivityString);
                    console.log("User session updated successfully");
                }
            } catch (error: any) {
                if (error?.message?.includes('Missing or insufficient permissions') || error?.code === 'permission-denied') {
                    // Silently ignore during logout as auth state is cleared before the request finishes
                    return;
                }
                console.error("Error updating user activity/session:", error);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                checkAndUpdateActivity(user);
            }
        });

        // Trigger on navigation
        if (auth.currentUser) {
            checkAndUpdateActivity(auth.currentUser);
        }

        // Trigger continuously while tab is active
        const intervalId = setInterval(() => {
            if (document.visibilityState === 'visible' && auth.currentUser) {
                checkAndUpdateActivity(auth.currentUser);
            }
        }, 60 * 1000);

        return () => {
            unsubscribe();
            clearInterval(intervalId);
        };
    }, [auth, firestore, pathname]);

    return null;
}
