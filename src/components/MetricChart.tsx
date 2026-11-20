import { motion } from "motion/react";
import { useRef } from "react";
import { useInView } from "motion/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type MetricChartProps = {
  title: string;
  labels: string[];
  values: number[];
  yMax?: number;
  highlightIndex?: number;
  summary: string;
};

export function MetricChart({
  title,
  labels,
  values,
  yMax = 1,
  highlightIndex,
  summary,
}: MetricChartProps) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<SVGSVGElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const width = 320;
  const height = 180;
  const pad = { top: 16, right: 16, bottom: 28, left: 32 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const points = values.map((value, index) => {
    const x = pad.left + (index / Math.max(labels.length - 1, 1)) * innerW;
    const y = pad.top + (1 - value / yMax) * innerH;
    return { x, y, value, label: labels[index] };
  });
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <figure>
      <p className="chart-title">{title}</p>
      <svg
        ref={ref}
        className="chart"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={summary}
      >
        {[0, 0.5, 1].map((tick) => {
          const y = pad.top + (1 - tick) * innerH;
          return (
            <g key={tick}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y}
                y2={y}
                stroke="#D8E0DF"
                strokeWidth="1"
              />
              <text x={4} y={y + 4} fontSize="10" fill="#52656B">
                {tick.toFixed(1)}
              </text>
            </g>
          );
        })}
        <motion.path
          d={d}
          fill="none"
          stroke="#087F98"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: reduced ? 1 : 0 }}
          animate={{ pathLength: inView || reduced ? 1 : 0 }}
          transition={{
            duration: reduced ? 0.1 : 0.95,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
        {points.map((point, index) => (
          <g key={point.label}>
            <motion.circle
              cx={point.x}
              cy={point.y}
              r={highlightIndex === index ? 4.5 : 3}
              fill={highlightIndex === index ? "#05677C" : "#087F98"}
              initial={reduced ? false : { opacity: 0, scale: 0.8 }}
              animate={
                inView || reduced
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{
                duration: reduced ? 0.1 : 0.36,
                delay: reduced ? 0 : 0.18 + index * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            <text
              x={point.x}
              y={point.y - 8}
              textAnchor="middle"
              fontSize="10"
              fill="#102D38"
            >
              {point.value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")}
            </text>
            <text
              x={point.x}
              y={height - 6}
              textAnchor="middle"
              fontSize="10"
              fill="#52656B"
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
      <table className="chart-table sr-only">
        <caption className="sr-only">{summary}</caption>
        <thead>
          <tr>
            <th scope="col">{title}</th>
            {labels.map((label) => (
              <th key={label} scope="col">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">AP</th>
            {values.map((value, index) => (
              <td key={labels[index]}>{value.toFixed(3)}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </figure>
  );
}
