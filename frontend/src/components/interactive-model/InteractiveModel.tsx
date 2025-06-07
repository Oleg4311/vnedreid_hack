import React, { useState, useRef, useMemo } from 'react';
import styles from './InteractiveModel.module.css';
import { InteractiveModelProps, PartStatus, ZONES } from '../../constants';

export const InteractiveModel: React.FC<InteractiveModelProps> = ({ statuses }) => {
  const statusMap = useMemo(
    () => Object.fromEntries(statuses.map(s => [s.id, s])),
    [statuses]
  ) as Record<PartStatus['id'], PartStatus>;

  const [hovered, setHovered] = useState<PartStatus['id'] | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const getColor = (id: PartStatus['id']) => {
    const score = statusMap[id]?.score;
    if (score === null) return 'transparent';
    if (score === 0) return 'rgba(0, 180, 0, 0.4)';
    const t = Math.max(0, Math.min(score / 5, 1));
    return `rgba(${Math.floor(255 * (1 - t))},${Math.floor(255 * t)},0,0.7)`;
  };

  const getStatusText = (id: PartStatus['id']) => {
    const part = statusMap[id];
    if (part.score === null) return 'Не видно';
    if (part.score > 0) return 'Бита';
    return 'Не бита';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltipPos({ x: e.clientX - rect.left + 10, y: e.clientY - rect.top + 10 });
  };

  return (
    <div className={styles.container}>
      <svg
        ref={svgRef}
        viewBox="0 0 200 320"
        style={{ width: '100%', height: 'auto', maxWidth: '100%', display: 'block' }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
          </filter>
        </defs>

        <path
          d="M100,20 C60,20 30,50 30,80 L30,240 C30,280 60,310 100,310 C140,310 170,280 170,240 L170,80 C170,50 140,20 100,20 Z"
          fill="#e0e0e0"
          stroke="#555"
          strokeWidth={2}
          filter="url(#shadow)"
        />

        <ellipse cx={100} cy={150} rx={60} ry={40} fill="#444" opacity={0.5} />
        <ellipse cx={100} cy={260} rx={60} ry={30} fill="#444" opacity={0.5} />
        <circle cx={60} cy={100} r={15} fill="#222" />
        <circle cx={140} cy={100} r={15} fill="#222" />
        <circle cx={60} cy={260} r={15} fill="#222" />
        <circle cx={140} cy={260} r={15} fill="#222" />

        {ZONES.map(z => (
          <polygon
            key={z.id + '_outline'}
            points={z.points}
            fill="transparent"
            stroke="#999"
            strokeWidth={1}
          />
        ))}

        {ZONES.map(z => (
          <polygon
            key={z.id}
            data-part={z.id}
            points={z.points}
            fill={hovered === z.id || statusMap[z.id]?.score !== null ? getColor(z.id) : 'transparent'}
            onMouseEnter={() => setHovered(z.id)}
            onMouseLeave={() => setHovered(null)}
            onMouseMove={handleMouseMove}
            className={styles.part}
          />
        ))}
      </svg>

      {hovered && statusMap[hovered] && (
        <div className={styles.tooltip} style={{ top: tooltipPos.y, left: tooltipPos.x }}>
          <div className={styles.tooltipArrow} />
          <div className={styles.tooltipBody}>
            <strong>{statusMap[hovered].label}</strong><br />
            Статус: {getStatusText(hovered)}<br />
            {statusMap[hovered].score !== null && `Повреждение: ${statusMap[hovered].score}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveModel;
