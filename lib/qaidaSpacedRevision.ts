export function revisionIntervalForStatus(
  status: "correct" | "repeat" | "makhraj_issue",
  previousIntervalDays = 1
) {
  if (status === "makhraj_issue") return 1;
  if (status === "repeat") return Math.max(1, Math.min(3, previousIntervalDays));
  return Math.min(30, Math.max(2, previousIntervalDays * 2));
}

export function rewardPointsForStatus(status: string) {
  if (status === "correct") return 10;
  if (status === "repeat") return 3;
  if (status === "makhraj_issue") return 2;
  return 1;
}

export function calculateStreak(dates: string[]) {
  const unique = Array.from(
    new Set(
      dates
        .filter(Boolean)
        .map((d) => new Date(d).toISOString().slice(0, 10))
    )
  ).sort().reverse();

  if (!unique.length) {
    return { currentStreak: 0, longestStreak: 0, totalPracticeDays: 0 };
  }

  const dayMs = 24 * 60 * 60 * 1000;

  let longest = 1;
  let run = 1;

  for (let i = 1; i < unique.length; i++) {
    const prev = new Date(`${unique[i - 1]}T00:00:00Z`).getTime();
    const curr = new Date(`${unique[i]}T00:00:00Z`).getTime();

    if (prev - curr === dayMs) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const yesterday = new Date(today.getTime() - dayMs).toISOString().slice(0, 10);

  let current = 0;

  if (unique[0] === todayStr || unique[0] === yesterday) {
    current = 1;
    for (let i = 1; i < unique.length; i++) {
      const prev = new Date(`${unique[i - 1]}T00:00:00Z`).getTime();
      const curr = new Date(`${unique[i]}T00:00:00Z`).getTime();

      if (prev - curr === dayMs) current++;
      else break;
    }
  }

  return {
    currentStreak: current,
    longestStreak: longest,
    totalPracticeDays: unique.length,
  };
}
