export type DateAndTimeParts = {
  appointmentDate: string;
  startTime: string;
};

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function parseScheduledAtParts(value: string): DateAndTimeParts | null {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const [datePart, timePartRaw] = normalized.split("T");
  if (!datePart || !timePartRaw) {
    return null;
  }

  const timePart = timePartRaw.slice(0, 5);
  if (!TIME_REGEX.test(timePart)) {
    return null;
  }

  return {
    appointmentDate: datePart,
    startTime: timePart,
  };
}

export function addMinutesToTime(time: string, minutesToAdd: number): string | null {
  if (!TIME_REGEX.test(time) || minutesToAdd <= 0) {
    return null;
  }

  const [hourText, minuteText] = time.split(":");
  const totalMinutes = Number(hourText) * 60 + Number(minuteText) + minutesToAdd;
  const wrappedMinutes = totalMinutes % (24 * 60);
  const nextHour = String(Math.floor(wrappedMinutes / 60)).padStart(2, "0");
  const nextMinute = String(wrappedMinutes % 60).padStart(2, "0");

  return `${nextHour}:${nextMinute}`;
}
