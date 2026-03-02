import type { SvgFrame, SvgElement, SvgShape, SvgStroke } from "@shared/contentTypes";
import { viewBox, fillMuted } from "@shared/style";

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
  }
}

function getStrokeProps(style: SvgStroke) {
  const props: Record<string, string | number> = {
    stroke: style.stroke,
    strokeWidth: style.strokeWidth,
    fill: style.fill === "solid" ? fillMuted : "none",
  };
  if (style.dashed) {
    props.strokeDasharray = "5 3";
  }
  if (style.opacity !== undefined) {
    props.opacity = style.opacity;
  }
  return props;
}

function renderElement(el: SvgElement, index: number) {
  if (el.type === "line") {
    return (
      <line
        key={index}
        x1={el.x1}
        y1={el.y1}
        x2={el.x2}
        y2={el.y2}
        {...getStrokeProps(el.style)}
      />
    );
  }

  if (el.type === "dot") {
    return (
      <circle
        key={index}
        cx={el.x}
        cy={el.y}
        r={el.r}
        {...getStrokeProps(el.style)}
      />
    );
  }

  if (el.type === "shape") {
    const transform = `translate(${el.x}, ${el.y}) rotate(${el.rotation})`;
    const strokeProps = getStrokeProps(el.style);

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

export default function SvgFrameView({ frame, className }: SvgFrameViewProps) {
  return (
    <svg
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      data-testid="svg-frame-view"
    >
      {frame.elements.map((el, i) => renderElement(el, i))}
    </svg>
  );
}
