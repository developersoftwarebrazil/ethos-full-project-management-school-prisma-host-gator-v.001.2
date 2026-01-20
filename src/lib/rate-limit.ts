const requests = new Map<string, { count: number; time: number }>();

const WINDOW = 1000 * 60 * 10; // 10 min
const LIMIT = 5;

export function rateLimit(key: string) {
  const now = Date.now();
  const entry = requests.get(key);

  if (!entry) {
    requests.set(key, { count: 1, time: now });
    return true;
  }

  if (now - entry.time > WINDOW) {
    requests.set(key, { count: 1, time: now });
    return true;
  }

  if (entry.count >= LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}
