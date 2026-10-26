export function qaidaMasteryStats(rows: Array<{status?: string | null}>) {
  const total = rows.length;
  const correct = rows.filter(r => r.status === "correct").length;
  const repeat = rows.filter(r => r.status === "repeat").length;
  const makhraj = rows.filter(r => r.status === "makhraj_issue").length;
  const score = total ? Math.round((correct*100 + repeat*35 + makhraj*15)/total) : 0;
  const level = score >= 90 && total >= 3 ? "mastered" : score >= 75 ? "good" : score >= 50 ? "developing" : "needs_practice";
  return {total, correct, repeat, makhraj, score, level};
}
