export function masteryLevel(score: number, reviewed: number) {
  if (reviewed < 2) return "insufficient";
  if (score >= 90) return "mastered";
  if (score >= 75) return "good";
  if (score >= 50) return "developing";
  return "needs_practice";
}

export function nextRevisionDate(status: string, reviewCount = 0) {
  const now = Date.now();
  let days = 7;

  if (status === "makhraj_issue") days = 1;
  else if (status === "tajweed_issue") days = 1;
  else if (status === "repeat") days = Math.min(7, Math.max(2, 2 + reviewCount));
  else if (status === "correct") days = Math.min(30, 7 + reviewCount * 3);

  return new Date(now + days * 86400000).toISOString();
}

export function assignmentScore(statuses: string[]) {
  if (!statuses.length) return 0;
  const map: Record<string, number> = {
    correct: 100,
    repeat: 40,
    tajweed_issue: 25,
    makhraj_issue: 15,
    pending: 0,
  };
  return Math.round(
    statuses.reduce((sum, s) => sum + (map[s] ?? 0), 0) / statuses.length
  );
}
