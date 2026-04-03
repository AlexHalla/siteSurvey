import { User } from '../types';

const TEST_CREATOR_ROLES = new Set(['admin', 'company_rep', 'psychologist', 'moderator']);
const ANALYTICS_ROLES = new Set(['admin', 'company_rep', 'psychologist', 'moderator']);

function normalizeRoles(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

export function extractUserRoles(user: User | null): string[] {
  if (!user) {
    return [];
  }

  const roleCandidates = [
    ...normalizeRoles((user as any).roles),
    ...normalizeRoles((user as any).role),
    ...normalizeRoles((user as any).realm_access?.roles),
  ];

  const localProfileRaw = localStorage.getItem('userProfile');
  if (localProfileRaw) {
    try {
      const parsed = JSON.parse(localProfileRaw);
      const profile = parsed?.profile ?? parsed;
      roleCandidates.push(...normalizeRoles(profile?.roles));
      roleCandidates.push(...normalizeRoles(profile?.role));
      roleCandidates.push(...normalizeRoles(profile?.realm_access?.roles));
    } catch {
      // ignore malformed local storage payload
    }
  }

  return Array.from(new Set(roleCandidates));
}

export function canCreateSurvey(user: User | null): boolean {
  const roles = extractUserRoles(user);
  return roles.some((role) => TEST_CREATOR_ROLES.has(role));
}

export function canViewSurveyAnalytics(user: User | null): boolean {
  const roles = extractUserRoles(user);
  return roles.some((role) => ANALYTICS_ROLES.has(role));
}
