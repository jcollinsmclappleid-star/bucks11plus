import type { SvgFrame, SvgElement, SvgShape, SvgStroke, FillPattern } from "@shared/contentTypes";
import { viewBox, fillMuted, patternStroke } from "@shared/style";

function getShapePath(shape: SvgShape, size: number): string {
  const h = size / 2;
  switch (shape) {
    case "circle":
      return "";
    case "square":
      return `M ${-h} ${-h} L ${h} ${-h} L ${h} ${h} L ${-h} ${h} Z`;
    case "triangle": {
      const top = -h;
      const bottom = h;
      const left = -h;
      const right = h;
      return `M 0 ${top} L ${right} ${bottom} L ${left} ${bottom} Z`;
    }
    case "pentagon": {
      const pts = Array.from({ length: 5 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        return `${Math.cos(angle) * h} ${Math.sin(angle) * h}`;
      });
      return `M ${pts.join(" L ")} Z`;
    }
    case "hexagon": {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        return `${Math.cos(angle) * h} ${Math.sin(angle) * h}`;
      });
      return `M ${pts.join(" L ")} Z`;
    }
    case "arrow": {
      const w = h * 0.4;
      return `M 0 ${-h} L ${h} 0 L ${w} 0 L ${w} ${h} L ${-w} ${h} L ${-w} 0 L ${-h} 0 Z`;
    }
    case "star": {
      const pts = Array.from({ length: 10 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 10 - Math.PI / 2;
        const r = i % 2 === 0 ? h : h * 0.4;
        return `${Math.cos(angle) * r} ${Math.sin(angle) * r}`;
      });
      return `M ${pts.join(" L ")} Z`;
    }
    case "diamond":
      return `M 0 ${-h} L ${h} 0 L 0 ${h} L ${-h} 0 Z`;
    case "cross": {
      const w = h * 0.33;
      return `M ${-w} ${-h} L ${w} ${-h} L ${w} ${-w} L ${h} ${-w} L ${h} ${w} L ${w} ${w} L ${w} ${h} L ${-w} ${h} L ${-w} ${w} L ${-h} ${w} L ${-h} ${-w} L ${-w} ${-w} Z`;
    }
    case "parallelogram": {
      const skew = h * 0.35;
      return `M ${-h + skew} ${-h * 0.6} L ${h + skew} ${-h * 0.6} L ${h - skew} ${h * 0.6} L ${-h - skew} ${h * 0.6} Z`;
    }
    case "trapezoid": {
      const topW = h * 0.6;
      return `M ${-topW} ${-h * 0.6} L ${topW} ${-h * 0.6} L ${h} ${h * 0.6} L ${-h} ${h * 0.6} Z`;
    }
    case "semicircle":
      return `M ${-h} 0 A ${h} ${h} 0 0 1 ${h} 0 Z`;
    case "right_triangle":
      return `M ${-h} ${h} L ${-h} ${-h} L ${h} ${h} Z`;
    case "kite":
      return `M 0 ${-h} L ${h * 0.5} ${-h * 0.1} L 0 ${h} L ${-h * 0.5} ${-h * 0.1} Z`;
  }
}

function getPatternDef(pattern: FillPattern, id: string, stroke: string) {
  const color = stroke || patternStroke;
  switch (pattern) {
    case "hatched":
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={color} strokeWidth="1.5" opacity="0.6" />
        </pattern>
      );
    case "crosshatched":
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="6" height="6">
          <line x1="0" y1="0" x2="6" y2="6" stroke={color} strokeWidth="1" opacity="0.5" />
          <line x1="6" y1="0" x2="0" y2="6" stroke={color} strokeWidth="1" opacity="0.5" />
        </pattern>
      );
    case "dotted":
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="6" height="6">
          <circle cx="3" cy="3" r="1.2" fill={color} opacity="0.5" />
        </pattern>
      );
    case "striped":
      return (
        <pattern id={id} patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="4" height="8" fill={color} opacity="0.2" />
        </pattern>
      );
    default:
      return null;
  }
}

function resolveFill(fillPattern: FillPattern, patternId: string): string {
  switch (fillPattern) {
    case "solid":
      return fillMuted;
    case "none":
      return "none";
    case "hatched":
    case "crosshatched":
    case "dotted":
    case "striped":
      return `url(#${patternId})`;
  }
}

function needsPatternDef(fill: FillPattern): boolean {
  return fill === "hatched" || fill === "crosshatched" || fill === "dotted" || fill === "striped";
}

function getStrokeProps(style: SvgStroke, patternId: string) {
  const props: Record<string, string | number> = {
    stroke: style.stroke,
    strokeWidth: style.strokeWidth,
    strokeLinejoin: "round" as any,
    fill: resolveFill(style.fill, patternId),
  };
  if (style.dashed) {
    props.strokeDasharray = "5 3";
  }
  if (style.opacity !== undefined) {
    props.opacity = style.opacity;
  }
  return props;
}

function renderElement(el: SvgElement, index: number, patterns: React.ReactNode[], frameId: string) {
  const patternId = `${frameId}-${index}`;

  if (el.type === "line") {
    if (needsPatternDef(el.style.fill)) {
      patterns.push(getPatternDef(el.style.fill, patternId, el.style.stroke));
    }
    return (
      <line
        key={index}
        x1={el.x1}
        y1={el.y1}
        x2={el.x2}
        y2={el.y2}
        {...getStrokeProps(el.style, patternId)}
      />
    );
  }

  if (el.type === "dot") {
    if (needsPatternDef(el.style.fill)) {
      patterns.push(getPatternDef(el.style.fill, patternId, el.style.stroke));
    }
    return (
      <circle
        key={index}
        cx={el.x}
        cy={el.y}
        r={el.r}
        {...getStrokeProps(el.style, patternId)}
      />
    );
  }

  if (el.type === "shape") {
    if (needsPatternDef(el.style.fill)) {
      patterns.push(getPatternDef(el.style.fill, patternId, el.style.stroke));
    }
    const transform = `translate(${el.x}, ${el.y}) rotate(${el.rotation})`;
    const strokeProps = getStrokeProps(el.style, patternId);

    if (el.shape === "circle") {
      return (
        <circle
          key={index}
          cx={0}
          cy={0}
          r={el.size / 2}
          transform={transform}
          {...strokeProps}
        />
      );
    }

    const d = getShapePath(el.shape, el.size);
    return (
      <path
        key={index}
        d={d}
        transform={transform}
        {...strokeProps}
      />
    );
  }

  return null;
}

interface SvgFrameViewProps {
  frame: SvgFrame;
  className?: string;
}

let frameCounter = 0;

export default function SvgFrameView({ frame, className }: SvgFrameViewProps) {
  const frameId = `f${++frameCounter}`;
  const patterns: React.ReactNode[] = [];
  const elements = frame.elements.map((el, i) => renderElement(el, i, patterns, frameId));

  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      data-testid="svg-frame-view"
    >
      {patterns.length > 0 && <defs>{patterns}</defs>}
      {elements}
    </svg>
  );
}
