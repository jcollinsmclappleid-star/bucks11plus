import type { ChartBarConfig } from "@shared/contentTypes";

interface BarChartSvgProps {
  config: ChartBarConfig;
}

export default function BarChartSvg({ config }: BarChartSvgProps) {
  const { title, xLabels, values, yMax } = config;
  const barCount = values.length;

  const marginTop = 40;
  const marginBottom = 50;
  const marginLeft = 50;
  const marginRight = 20;
  const chartWidth = Math.max(300, barCount * 60);
  const chartHeight = 200;
  const totalWidth = marginLeft + chartWidth + marginRight;
  const totalHeight = marginTop + chartHeight + marginBottom;

  const barWidth = chartWidth / barCount * 0.6;
  const barGap = chartWidth / barCount;

  const tickCount = 5;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => (yMax / tickCount) * i);

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      data-testid="bar-chart"
    >
      <text
        x={totalWidth / 2}
        y={24}
        textAnchor="middle"
        className="text-sm font-semibold"
        fill="#111827"
        fontSize="14"
      >
        {title}
      </text>

      <line
        x1={marginLeft}
        y1={marginTop}
        x2={marginLeft}
        y2={marginTop + chartHeight}
        stroke="#111827"
        strokeWidth={1.5}
      />
      <line
        x1={marginLeft}
        y1={marginTop + chartHeight}
        x2={marginLeft + chartWidth}
        y2={marginTop + chartHeight}
        stroke="#111827"
        strokeWidth={1.5}
      />

      {ticks.map((tick, i) => {
        const y = marginTop + chartHeight - (tick / yMax) * chartHeight;
        return (
          <g key={i}>
            <line x1={marginLeft - 5} y1={y} x2={marginLeft} y2={y} stroke="#111827" strokeWidth={1} />
            <text x={marginLeft - 8} y={y + 4} textAnchor="end" fill="#6B7280" fontSize="10">
              {tick}
            </text>
          </g>
        );
      })}

      {values.map((val, i) => {
        const barH = (val / yMax) * chartHeight;
        const x = marginLeft + i * barGap + (barGap - barWidth) / 2;
        const y = marginTop + chartHeight - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={barH} fill="#6B7280" rx={2} />
            <text
              x={x + barWidth / 2}
              y={marginTop + chartHeight + 16}
              textAnchor="middle"
              fill="#374151"
              fontSize="10"
            >
              {xLabels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
