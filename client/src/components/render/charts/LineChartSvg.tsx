import type { ChartLineConfig } from "@shared/contentTypes";

interface LineChartSvgProps {
  config: ChartLineConfig;
}

export default function LineChartSvg({ config }: LineChartSvgProps) {
  const { title, xLabels, values, yMax } = config;
  const pointCount = values.length;

  const marginTop = 40;
  const marginBottom = 50;
  const marginLeft = 50;
  const marginRight = 20;
  const chartWidth = Math.max(300, pointCount * 60);
  const chartHeight = 200;
  const totalWidth = marginLeft + chartWidth + marginRight;
  const totalHeight = marginTop + chartHeight + marginBottom;

  const tickCount = 5;
  const ticks = Array.from({ length: tickCount + 1 }, (_, i) => (yMax / tickCount) * i);

  const points = values.map((val, i) => ({
    x: marginLeft + (i / Math.max(pointCount - 1, 1)) * chartWidth,
    y: marginTop + chartHeight - (val / yMax) * chartHeight,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
      data-testid="line-chart"
    >
      <text
        x={totalWidth / 2}
        y={24}
        textAnchor="middle"
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

      {xLabels.map((label, i) => {
        const x = marginLeft + (i / Math.max(pointCount - 1, 1)) * chartWidth;
        return (
          <g key={i}>
            <line x1={x} y1={marginTop + chartHeight} x2={x} y2={marginTop + chartHeight + 5} stroke="#111827" strokeWidth={1} />
            <text x={x} y={marginTop + chartHeight + 18} textAnchor="middle" fill="#374151" fontSize="10">
              {label}
            </text>
          </g>
        );
      })}

      <path d={linePath} fill="none" stroke="#6B7280" strokeWidth={2} />

      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#6B7280" stroke="#fff" strokeWidth={1.5} />
      ))}
    </svg>
  );
}
