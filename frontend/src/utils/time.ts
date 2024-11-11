export const getRemainingSeconds = (a: Date, b: Date) => Math.trunc((a.getTime() - b.getTime()) / 1000);
