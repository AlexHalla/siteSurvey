const DEVICE_ID_STORAGE_KEY = 'device_id';

function detectDeviceType(userAgent: string): string {
  if (/ipad|tablet|playbook|silk/i.test(userAgent)) {
    return 'Tablet';
  }

  if (/mobi|android|iphone|ipod|phone/i.test(userAgent)) {
    return 'Mobile';
  }

  return 'Desktop';
}

function detectOS(userAgent: string): string {
  if (/windows nt/i.test(userAgent)) {
    return 'Windows';
  }

  if (/android/i.test(userAgent)) {
    return 'Android';
  }

  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return 'iOS';
  }

  if (/mac os x|macintosh/i.test(userAgent)) {
    return 'macOS';
  }

  if (/linux/i.test(userAgent)) {
    return 'Linux';
  }

  return 'Unknown OS';
}

function detectBrowser(userAgent: string): string {
  if (/edg\//i.test(userAgent)) {
    return 'Edge';
  }

  if (/opr\//i.test(userAgent)) {
    return 'Opera';
  }

  if (/chrome\//i.test(userAgent) && !/edg\//i.test(userAgent) && !/opr\//i.test(userAgent)) {
    return 'Chrome';
  }

  if (/firefox\//i.test(userAgent)) {
    return 'Firefox';
  }

  if (/safari\//i.test(userAgent) && !/chrome\//i.test(userAgent)) {
    return 'Safari';
  }

  return 'Unknown Browser';
}

export function getOrCreateDeviceId(): string {
  if (typeof window === 'undefined') {
    return 'unknown-device';
  }

  const existing = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
  if (existing) {
    return existing;
  }

  const generated =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `device-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

  window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, generated);
  return generated;
}

export function getDeviceLabel(): string {
  if (typeof navigator === 'undefined') {
    return 'Unknown device';
  }

  const userAgent = navigator.userAgent || '';
  const deviceType = detectDeviceType(userAgent);
  const os = detectOS(userAgent);
  const browser = detectBrowser(userAgent);

  return `${deviceType} / ${os} / ${browser}`;
}
