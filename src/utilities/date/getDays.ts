
export function getDaysPassedFromDate(date: Date) {
  const today = new Date();
  const timeDiff = today.getTime() - new Date(date).getTime();
  const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  return daysPassed;
}