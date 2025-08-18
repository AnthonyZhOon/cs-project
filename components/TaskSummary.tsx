'use client';

import ComponentBox from '@/components/ComponentBox';

type Segment = {
  label: string;
  value: number;
  color: string;
};


const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const arcPath = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`;
};

export default function TaskSummary({
  title = 'Tasks Summary',
  todo = 30,
  inProgress = 40,
  done = 30,
}: {
  title?: string;
  todo?: number;
  inProgress?: number;
  done?: number;
}) {

  const size = 240;        
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.42;
  const labelRadius = r * 0.65;


  const total = Math.max(todo + inProgress + done, 0.0001);
  const data: Segment[] = [
    { label: 'To Do', value: (todo / total) * 100, color: '#9CA3AF' },        
    { label: 'In Progress', value: (inProgress / total) * 100, color: '#4B5563' }, 
    { label: 'Done', value: (done / total) * 100, color: '#E5E7EB' },  
  ];

 
  let acc = 0;
  const segments = data.map((seg) => {
    const startAngle = (acc / 100) * 360;
    const sweep = (seg.value / 100) * 360;
    const endAngle = startAngle + sweep;
    acc += seg.value;

    const mid = startAngle + sweep / 2;
    const tp = polarToCartesian(cx, cy, labelRadius, mid);

    return {
      ...seg,
      path: arcPath(cx, cy, r, startAngle, endAngle),
      tx: tp.x,
      ty: tp.y,
    };
  });

  return (
    <ComponentBox title={title} className="p-3">
      <div className="flex items-center justify-center">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Task status pie">
          {segments.map((s, i) => (
            <g key={i}>
              <path d={s.path} fill={s.color} stroke="#FFFFFF" strokeWidth={2} />
              <text
                x={s.tx}
                y={s.ty}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fill="#111827"
                style={{ pointerEvents: 'none' }}
              >
                {`${s.label} -- ${Math.round(s.value)}%`}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </ComponentBox>
  );
}
