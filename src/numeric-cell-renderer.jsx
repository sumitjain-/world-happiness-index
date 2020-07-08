import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const chartHeight = 44;
const margin = {
  top: 0,
  bottom: 0,
  left: 10,
  right: 10
};
export function NumericCellRenderer({ values, selectedCountry }) {
  const { key: f, min, max } = values;
  const [chartWidth, setChartWidth] = useState(0);
  const [dotPosition, setDotPosition] = useState(0);
  const svgRef = useRef(null);
  let val = selectedCountry[f];
  let renderer = p => p;
  if (isNaN(val)) {
    renderer = p => <>&mdash;</>;
  } else if (val % 1 > 0) {
    renderer = p => p.toFixed(2);
  }

  useEffect(() => {
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      setChartWidth(rect.width);
    }
    return () => {};
  }, []);

  useEffect(() => {
    const scale = d3
      .scaleLinear()
      .domain([min, max])
      .range([margin.left, chartWidth - margin.right]);

    setDotPosition(scale(selectedCountry[f]));

    return () => {};
  }, [min, max, chartWidth, f, selectedCountry]);

  return (
    <>
      <svg ref={svgRef} width="100%" height={`${chartHeight}px`}>
        <line
          fill="none"
          stroke="#000"
          x1={margin.left}
          y1={margin.top + chartHeight / 2}
          x2={chartWidth - margin.right}
          y2={margin.top + chartHeight / 2}
        />
        <line
          fill="none"
          stroke="#999"
          x1={margin.left}
          y1={margin.top}
          x2={margin.left}
          y2={margin.top + chartHeight / 2}
        />
        <line
          fill="none"
          stroke="#999"
          x1={chartWidth - margin.right}
          y1={margin.top}
          x2={chartWidth - margin.right}
          y2={margin.top + chartHeight / 2}
        />
        <circle
          cx={dotPosition}
          fill="#000"
          r="5"
          cy={chartHeight / 2}
          style={{
            transition: "all 0.3s ease-out"
          }}
        />
        <text
          x={margin.left + 0}
          y={margin.top + chartHeight / 2}
          text-anchor="start"
          dy="20"
        >
          {renderer(min)}
        </text>
        <text
          x={dotPosition}
          y={margin.top + chartHeight / 2}
          text-anchor="middle"
          dy="-8"
        >
          {renderer(val)}
        </text>
        <text
          x={chartWidth - margin.right}
          y={margin.top + chartHeight / 2}
          text-anchor="end"
          dy="20"
        >
          {renderer(max)}
        </text>
      </svg>
    </>
  );
}
