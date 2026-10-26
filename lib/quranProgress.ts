export function quranReviewScore(status: string) {
  if (status === "correct") return 100;
  if (status === "repeat") return 40;
  if (status === "tajweed_issue") return 25;
  if (status === "makhraj_issue") return 15;
  return 0;
}

export function quranRevisionPriority(status: string) {
  if (status === "makhraj_issue") return 100;
  if (status === "tajweed_issue") return 90;
  if (status === "repeat") return 75;
  return 35;
}

export function quranRevisionDays(status: string) {
  if (status === "makhraj_issue") return 1;
  if (status === "tajweed_issue") return 1;
  if (status === "repeat") return 2;
  return 7;
}
