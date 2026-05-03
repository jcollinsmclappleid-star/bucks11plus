const KNOWN_TEST_DATES = [
  new Date("2026-09-12T08:00:00+01:00"),
  new Date("2027-09-11T08:00:00+01:00"),
  new Date("2028-09-09T08:00:00+01:00"),
];

export function getNextTestDate(now: Date = new Date()): Date {
  const next = KNOWN_TEST_DATES.find((d) => d.getTime() > now.getTime());
  if (next) return next;
  const year = now.getFullYear() + 1;
  const sept1 = new Date(year, 8, 1);
  const offsetToSat = (6 - sept1.getDay() + 7) % 7;
  return new Date(year, 8, 1 + offsetToSat + 7);
}

export function getWeeksToTest(now: Date = new Date()): number {
  const next = getNextTestDate(now);
  const ms = next.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (7 * 24 * 60 * 60 * 1000)));
}

export function getTestYear(now: Date = new Date()): number {
  return getNextTestDate(now).getFullYear();
}
