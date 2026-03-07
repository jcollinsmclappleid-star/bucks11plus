export type RenderType = "text" | "svg" | "chart";

export type FillPattern = "none" | "solid" | "hatched" | "crosshatched" | "dotted" | "striped";

export type SvgStroke = {
  strokeWidth: number;
  stroke: string;
  fill: FillPattern;
  dashed?: boolean;
  opacity?: number;
};

export type SvgShape = "circle" | "square" | "triangle" | "pentagon" | "arrow" | "star" | "hexagon" | "diamond" | "cross" | "parallelogram" | "trapezoid" | "semicircle" | "right_triangle" | "kite";

export type SvgElement =
  | { type: "shape"; shape: SvgShape; x: number; y: number; size: number; rotation: number; style: SvgStroke }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number; style: SvgStroke }
  | { type: "dot"; x: number; y: number; r: number; style: SvgStroke };

export type SvgFrame = {
  elements: SvgElement[];
};

export type NvrSequenceConfig = {
  kind: "nvr.sequence";
  frames: SvgFrame[];
  questionIndex: number;
  answerOptions: SvgFrame[];
};

export type NvrTransformConfig = {
  kind: "nvr.transform";
  promptFrames: SvgFrame[];
  answerOptions: SvgFrame[];
};

export type NvrClassificationConfig = {
  kind: "nvr.classification";
  group: SvgFrame[];
  answerOptions: SvgFrame[];
};

export type ChartBarConfig = {
  kind: "chart.bar";
  title: string;
  xLabels: string[];
  values: number[];
  yMax: number;
  questionText: string;
};

export type ChartLineConfig = {
  kind: "chart.line";
  title: string;
  xLabels: string[];
  values: number[];
  yMax: number;
  questionText: string;
};

export type ChartTableConfig = {
  kind: "chart.table";
  title: string;
  headers: string[];
  rows: (string | number)[][];
  questionText: string;
};

export type RenderConfig =
  | NvrSequenceConfig
  | NvrTransformConfig
  | NvrClassificationConfig
  | ChartBarConfig
  | ChartLineConfig
  | ChartTableConfig;
