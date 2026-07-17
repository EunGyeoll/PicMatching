// 이 서비스는 한국 사용자 대상 MVP라 모든 시간 계산을 KST(+09:00) 고정으로 다룹니다.
const KST_OFFSET = "+09:00";

export function kstDateTimeToISO(date: string, time: string): string {
  return `${date}T${time}:00${KST_OFFSET}`;
}

export function startOfDayUTC(date: string): Date {
  return new Date(`${date}T00:00:00${KST_OFFSET}`);
}

export function endOfDayUTC(date: string): Date {
  return new Date(startOfDayUTC(date).getTime() + 24 * 60 * 60 * 1000);
}

/** Y-M-D 문자열 기준 요일을 반환합니다 (0=일요일 ... 6=토요일), 서버 타임존과 무관합니다. */
export function dayOfWeek(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.slice(0, 5).split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function addMinutesToTime(time: string, minutesToAdd: number): string {
  return minutesToTime(timeToMinutes(time) + minutesToAdd);
}

/** 오늘부터 count일간의 YYYY-MM-DD 목록을 KST 기준으로 생성합니다. */
export function upcomingDates(count: number): string[] {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const todayKst = formatter.format(new Date());
  const [y, m, d] = todayKst.split("-").map(Number);
  const base = Date.UTC(y, m - 1, d);

  return Array.from({ length: count }, (_, i) => {
    const date = new Date(base + i * 24 * 60 * 60 * 1000);
    const yyyy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(date.getUTCDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
}

export const DOW_LABEL_KO = ["일", "월", "화", "수", "목", "금", "토"];

export function formatDateChip(date: string): { dow: string; day: string } {
  const [, , d] = date.split("-");
  return { dow: DOW_LABEL_KO[dayOfWeek(date)], day: String(Number(d)) };
}

export function toKstDateString(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

export function toKstTimeString(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

/** 예약 시작 시각이 이미 지났는지 확인합니다 (촬영 완료 처리 가능 여부 판단용). */
export function isPastInstant(iso: string): boolean {
  return new Date(iso).getTime() <= Date.now();
}

/** 예약 저장값(ISO 문자열)을 "7/17(목) 13:00–14:00" 형태로 표시합니다. */
export function formatBookingSchedule(startsAtIso: string, endsAtIso: string): string {
  const dateStr = toKstDateString(startsAtIso);
  const dateParts = dateStr.split("-").map(Number);
  const month = dateParts[1];
  const day = dateParts[2];
  const dow = DOW_LABEL_KO[dayOfWeek(dateStr)];
  return `${month}/${day}(${dow}) ${toKstTimeString(startsAtIso)}–${toKstTimeString(endsAtIso)}`;
}
