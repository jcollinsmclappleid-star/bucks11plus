import { z } from "zod";

const svgStrokeSchema = z.object({
  strokeWidth: z.number(),
  stroke: z.string(),
  fill: z.enum(["none", "solid", "hatched", "crosshatched", "dotted", "striped"]),
  dashed: z.boolean().optional(),
  opacity: z.number().optional(),
});

const svgShapeSchema = z.enum(["circle", "square", "triangle", "pentagon", "arrow", "star", "hexagon", "diamond", "cross", "parallelogram", "trapezoid", "semicircle", "right_triangle", "kite", "rectangle"]);

const svgElementSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("shape"),
    shape: svgShapeSchema,
    x: z.number(),
    y: z.number(),
    size: z.number(),
    rotation: z.number(),
    style: svgStrokeSchema,
  }),
  z.object({
    type: z.literal("line"),
    x1: z.number(),
    y1: z.number(),
    x2: z.number(),
    y2: z.number(),
    style: svgStrokeSchema,
  }),
  z.object({
    type: z.literal("dot"),
    x: z.number(),
    y: z.number(),
    r: z.number(),
    style: svgStrokeSchema,
  }),
]);

const svgFrameSchema = z.object({
  elements: z.array(svgElementSchema),
});

const nvrSequenceConfigSchema = z.object({
  kind: z.literal("nvr.sequence"),
  frames: z.array(svgFrameSchema),
  questionIndex: z.number().int().min(0),
  answerOptions: z.array(svgFrameSchema).min(4).max(6),
});

const nvrTransformConfigSchema = z.object({
  kind: z.literal("nvr.transform"),
  promptFrames: z.array(svgFrameSchema),
  answerOptions: z.array(svgFrameSchema).min(4).max(6),
});

const nvrClassificationConfigSchema = z.object({
  kind: z.literal("nvr.classification"),
  group: z.array(svgFrameSchema),
  answerOptions: z.array(svgFrameSchema).min(4).max(6),
});

const chartBarConfigSchema = z.object({
  kind: z.literal("chart.bar"),
  title: z.string(),
  xLabels: z.array(z.string()),
  values: z.array(z.number()),
  yMax: z.number(),
  questionText: z.string(),
});

const chartLineConfigSchema = z.object({
  kind: z.literal("chart.line"),
  title: z.string(),
  xLabels: z.array(z.string()),
  values: z.array(z.number()),
  yMax: z.number(),
  questionText: z.string(),
});

const chartTableConfigSchema = z.object({
  kind: z.literal("chart.table"),
  title: z.string(),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.union([z.string(), z.number()]))),
  questionText: z.string(),
});

const comprehensionPassageConfigSchema = z.object({
  kind: z.literal("comprehension.passage"),
  passageId: z.string(),
  passageTitle: z.string(),
  passageTheme: z.string(),
  passageText: z.string(),
  questionType: z.string(),
  questionIndex: z.number().int().min(0),
  totalQuestionsInPassage: z.number().int().min(1),
  highlightRange: z.object({ start: z.number(), end: z.number() }).optional(),
  keyWords: z.array(z.object({ word: z.string(), startIndex: z.number() })).optional(),
});

const spatialNetsConfigSchema = z.object({
  kind: z.literal("spatial.nets"),
  promptFrame: svgFrameSchema,
  answerOptions: z.array(svgFrameSchema).min(4).max(6),
});

const spatialCubeConfigSchema = z.object({
  kind: z.literal("spatial.cubes"),
  cubeViews: z.array(svgFrameSchema).min(1),
  answerOptions: z.array(z.string()).min(4).max(6),
});

const spatialFoldConfigSchema = z.object({
  kind: z.literal("spatial.fold"),
  promptFrame: svgFrameSchema,
  foldLine: z.object({ x1: z.number(), y1: z.number(), x2: z.number(), y2: z.number() }),
  answerOptions: z.array(svgFrameSchema).min(4).max(6),
});

export const renderConfigSchema = z.discriminatedUnion("kind", [
  nvrSequenceConfigSchema,
  nvrTransformConfigSchema,
  nvrClassificationConfigSchema,
  chartBarConfigSchema,
  chartLineConfigSchema,
  chartTableConfigSchema,
  comprehensionPassageConfigSchema,
  spatialNetsConfigSchema,
  spatialCubeConfigSchema,
  spatialFoldConfigSchema,
]);

export function validateRenderConfig(config: unknown): { valid: boolean; errors?: string[] } {
  const result = renderConfigSchema.safeParse(config);
  if (result.success) return { valid: true };
  return {
    valid: false,
    errors: result.error.errors.map(e => `${e.path.join(".")}: ${e.message}`),
  };
}
