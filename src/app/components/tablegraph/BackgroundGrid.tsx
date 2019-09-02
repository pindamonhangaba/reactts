import React from "react";

export default (props: {
  sectionSize?: number;
  sectionColor?: string;
  subsectionDivisor?: number;
  subsectionColor?: string;
}) => {
  const {
    sectionSize = 100,
    sectionColor,
    subsectionDivisor = 10,
    subsectionColor,
  } = props;
  const sb = sectionSize / subsectionDivisor;
  return (
    <React.Fragment>
      <defs>
        <pattern
          id="smallGrid"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${sb} 0 L 0 0 0 ${sb}`}
            fill="none"
            stroke={subsectionColor || "#efefef"}
            strokeWidth="0.5"
          />
        </pattern>
        <pattern
          id="grid"
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <rect width="100" height="100" fill="url(#smallGrid)" />
          <path
            d={`M ${sectionSize} 0 L 0 0 0 ${sectionSize}`}
            fill="none"
            stroke={sectionColor || "#eaeaea"}
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="#fff" />
      <rect
        width="100%"
        height="100%"
        fill="url(#grid)"
        stroke={sectionColor || "#eaeaea"}
        strokeWidth="1"
      />
    </React.Fragment>
  );
};
