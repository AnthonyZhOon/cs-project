const sameDay = (a: Date, b: Date): boolean =>
	a.getFullYear() === b.getFullYear() &&
	a.getMonth() === b.getMonth() &&
	a.getDate() === b.getDate();
const y = (d: Date): number => d.getFullYear();
const fmt = (d: Date, withYear: boolean): string =>
	new Intl.DateTimeFormat(undefined, {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		...(withYear ? {year: 'numeric' as const} : {}),
	}).format(d);
const fmtTime = (d: Date): string =>
	new Intl.DateTimeFormat(undefined, {
		hour: 'numeric',
		minute: '2-digit',
	}).format(d);

export const formatRange = (start: Date, end: Date): string => {
	const includeYear =
		y(start) !== new Date().getFullYear() || y(start) !== y(end);
	return sameDay(start, end)
		? `${fmt(start, includeYear)} • ${fmtTime(start)}–${fmtTime(end)}`
		: `${fmt(start, includeYear)} • ${fmtTime(start)} → ${fmt(end, includeYear)} • ${fmtTime(end)}`;
};

export const formatInstant = (date: Date): string => {
	const includeYear = y(date) !== new Date().getFullYear();
	return `${fmt(date, includeYear)} • ${fmtTime(date)}`;
};
