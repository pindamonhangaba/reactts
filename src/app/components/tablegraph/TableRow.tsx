import React from "react";

const PADDING = 12;

export default (props: {
  highlight: boolean;
  name: string;
  type: string;
  primary?: boolean;
  width: number;
  height: number;
  x: number;
  y: number;
  padding?: number;
}) => {
  return (
    <svg
      className={`field ${props.primary ? "primary-key" : ""} ${
        props.highlight ? "highlight-field" : ""
      }`}
      height={props.height}
      width={props.width}
      x={props.x}
      y={props.y}
    >
      <rect height={props.height} width={props.width}></rect>
      <text
        className="field-name"
        x={props.padding || PADDING}
        y={props.height / 2}
        dy=".35em"
      >
        {props.name}
      </text>
      <text
        className="field-type"
        dy=".35em"
        x={props.width - (props.padding || PADDING)}
        y={props.height / 2}
      >
        {props.type}
      </text>
      <title>
        {props.name} ({props.type})
      </title>
    </svg>
  );
};
