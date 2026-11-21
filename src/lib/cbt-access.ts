import type { Academy, StudentProfile } from '@/types';
import { safeToDate } from '@/lib/utils';

export const JAMB_ENGLISH_SUBJECT = 'Use of English';
export const JAMB_ENGLISH_QUESTIONS = 60;
export const JAMB_OTHER_SUBJECT_QUESTIONS = 40;
export const JAMB_TOTAL_SUBJECTS = 4;
export const JAMB_FULL_DURATION_MINUTES = 120; // 2 Hours standard JAMB UTME

// Limited preview configuration for non-subscribed students
export const FREE_PREVIEW_ENGLISH_QUESTIONS = 5;
export const FREE_PREVIEW_OTHER_QUESTIONS = 5;
export const FREE_PREVIEW_DURATION_MINUTES = 15;

export function hasFullCbtAccess(
  academy: Academy | null | undefined,
  profile: StudentProfile | null | undefined
): boolean {
  if (profile?.role === 'super-admin') return true;
  if (!academy) return false;
  if (academy.accessLevel === 'lifetime') return true;

  const isPaidPlan = academy.plan === 'pro' || academy.plan === 'academy';
  if (!isPaidPlan) return false;

  if (!academy.trialExpiresAt) return true;
  const expiry = safeToDate(academy.trialExpiresAt);
  return expiry.getTime() > Date.now();
}

export function getQuestionCountForSubject(subjectName: string, isSubscribed: boolean): number {
  const isEnglish =
    subjectName.toLowerCase() === 'use of english' ||
    subjectName.toLowerCase() === 'english language';
  if (isSubscribed) {
    return isEnglish ? JAMB_ENGLISH_QUESTIONS : JAMB_OTHER_SUBJECT_QUESTIONS;
  }
  return isEnglish ? FREE_PREVIEW_ENGLISH_QUESTIONS : FREE_PREVIEW_OTHER_QUESTIONS;
}

