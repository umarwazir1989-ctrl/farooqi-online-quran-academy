export const QAIDA_LESSON_ORDER = [
  "letters-01","letters-02","letters-03","letters-04","joined-forms",
  "harakat","sukoon","tanween","shaddah","madd","qalqalah","ghunnah",
  "ikhfa-izhar","idgham-iqlab","laam-ra","waqf","practice",
] as const;

export function adaptivePriority(status: string, ageHours = 0) {
  const base = status === "makhraj_issue" ? 95 : status === "repeat" ? 80 : status === "pending" ? 55 : 25;
  return Math.min(100, base + Math.min(20, Math.floor(ageHours / 24)));
}

export function canUnlockNextLesson(args: {
  currentCompletion: number;
  teacherApproved: boolean;
  reviewedAttempts: number;
  makhrajIssues: number;
}) {
  return args.currentCompletion >= 80 &&
    args.reviewedAttempts >= 1 &&
    args.makhrajIssues === 0 &&
    args.teacherApproved;
}
