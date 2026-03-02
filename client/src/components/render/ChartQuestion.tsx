import type { ChartBarConfig, ChartLineConfig, ChartTableConfig } from "@shared/contentTypes";
import BarChartSvg from "./charts/BarChartSvg";
import LineChartSvg from "./charts/LineChartSvg";
import TableView from "./charts/TableView";

interface ChartQuestionProps {
  config: ChartBarConfig | ChartLineConfig | ChartTableConfig;
}

export default function ChartQuestion({ config }: ChartQuestionProps) {
  return (
    <div className="space-y-4" data-testid="chart-question">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {config.kind === "chart.bar" && <BarChartSvg config={config} />}
        {config.kind === "chart.line" && <LineChartSvg config={config} />}
        {config.kind === "chart.table" && <TableView config={config} />}
      </div>
      <p className="text-center text-sm text-gray-700 font-medium" data-testid="chart-question-text">
        {config.questionText}
      </p>
    </div>
  );
}
