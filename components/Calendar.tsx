'use client';
import {useMemo} from 'react';
import ComponentBox from './ComponentBox';

// Utility to format a date as YYYY-MM-DD (local) for set membership
const fmt = (d: Date) =>
	[
		d.getFullYear(),
		String(d.getMonth() + 1).padStart(2, '0'),
		String(d.getDate()).padStart(2, '0'),
	].join('-');

export interface CalendarProps {
	// Dates that should display a dot. Only the day portion (local) matters.
	markedDates?: Date[];
	// Month index 0-11 (default: current month)
	month?: number;
	// Full year (default: current year)
	year?: number;
	// Optional callback when a day is clicked
	onSelectDate?: (date: Date) => void;
	// Optional custom title; defaults to `Month YYYY`
	title?: string;
	className?: string;
}

export default function Calendar({
	markedDates = [],
	month,
	year,
	onSelectDate,
	title,
	className = '',
}: CalendarProps) {
	const today = new Date();
	const m = month ?? today.getMonth();
	const y = year ?? today.getFullYear();

	const firstOfMonth = new Date(y, m, 1);
	const daysInMonth = new Date(y, m + 1, 0).getDate();
	const firstWeekday = firstOfMonth.getDay(); // 0 = Sunday

	const markedSet = useMemo(() => new Set(markedDates.map(fmt)), [markedDates]);

	const cells: {key: string; date?: Date}[] = [];
	// leading blanks
	for (let i = 0; i < firstWeekday; i++) cells.push({key: `b-${i}`});
	// days
	for (let d = 1; d <= daysInMonth; d++) {
		const date = new Date(y, m, d);
		cells.push({key: fmt(date), date});
	}

	const monthName = firstOfMonth.toLocaleString(undefined, {month: 'long'});

	return (
		<ComponentBox title={title ?? `${monthName} ${y}`} className={className}>
			<div className="flex flex-col gap-1">
				<div className="grid grid-cols-7 text-center text-xs font-semibold">
					{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
						<div key={d}>{d}</div>
					))}
				</div>
				<div className="grid grid-cols-7 gap-1 text-center text-sm">
					{cells.map(({key, date}) => {
						if (!date) return <div key={key} className="h-9" />; // blank cell to align days
						const dateKey = fmt(date);
						const isToday =
							date.getFullYear() === today.getFullYear() &&
							date.getMonth() === today.getMonth() &&
							date.getDate() === today.getDate();
						const marked = markedSet.has(dateKey);
						return (
							<button
								key={key}
								type="button"
								onClick={() => onSelectDate?.(date)}
								className={`relative h-9 rounded-md border border-black/20 hover:border-black transition-colors focus:outline-none focus:ring-2 focus:ring-black/50 flex items-center justify-center ${
									isToday ? 'bg-black text-white font-semibold' : 'bg-white'
								}`}
							>
								<span>{date.getDate()}</span>
								{marked && (
									<span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-black" />
								)}
							</button>
						);
					})}
				</div>
			</div>
		</ComponentBox>
	);
}
