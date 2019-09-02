import { path as d3path } from "d3-path";

export interface Endpoint {
  table: {
    width: number;
    height: number;
    x: number;
    y: number;
    x1: number;
    y1: number;
  };
  x: number;
  y: number;
  fieldX: number;
  fieldY: number;
}

export function horizontalPath(endpoints: Array<Endpoint>) {
  const connectorLocation = endpoints.map((endpoint) => ({
    x: endpoint.fieldX,
    y: endpoint.fieldY,
  }));
  if (connectorLocation[0].x < connectorLocation[1].x) {
    connectorLocation[0].x += endpoints[0].table.width;
    endpoints[0].x = connectorLocation[0].x + 9;
    endpoints[1].x = connectorLocation[1].x - 9;
  } else {
    connectorLocation[1].x += endpoints[1].table.width;
    endpoints[1].x = connectorLocation[1].x + 9;
    endpoints[0].x = connectorLocation[0].x - 9;
  }

  if (connectorLocation[0].y < connectorLocation[1].y) {
    endpoints[0].y = connectorLocation[0].y - 9;
    endpoints[1].y = connectorLocation[1].y + 9;
  } else {
    endpoints[1].y = connectorLocation[1].y - 9;
    endpoints[0].y = connectorLocation[0].y + 9;
  }

  const x = (connectorLocation[0].x + connectorLocation[1].x) / 2;
  return constructPath([
    connectorLocation[0],
    { x, y: connectorLocation[0].y },
    { x, y: connectorLocation[1].y },
    connectorLocation[1],
  ]);
}

export function verticalPath(endpoints: Array<Endpoint>) {
  const connectorLocation = endpoints.map((endpoint) => ({
    x: endpoint.fieldX + endpoint.table.width,
    y: endpoint.fieldY,
  }));
  const x = Math.max(...connectorLocation.map((l) => l.x)) + 10;
  endpoints[0].x = connectorLocation[0].x + 9;
  endpoints[1].x = connectorLocation[1].x + 9;
  if (connectorLocation[0].y < connectorLocation[1].y) {
    endpoints[0].y = connectorLocation[0].y - 9;
    endpoints[1].y = connectorLocation[1].y + 9;
  } else {
    endpoints[1].y = connectorLocation[1].y - 9;
    endpoints[0].y = connectorLocation[0].y + 9;
  }
  return constructPath([
    connectorLocation[0],
    { x, y: connectorLocation[0].y },
    { x, y: connectorLocation[1].y },
    connectorLocation[1],
  ]);
}

export function constructPath(sequence: Array<Point>) {
  const drawPath = d3path();
  drawPath.moveTo(sequence[0].x, sequence[0].y);
  for (let i = 1; i < sequence.length - 1; i += 1) {
    const radius = Math.min(
      8,
      distance(sequence[i - 1], sequence[i]) / 2,
      distance(sequence[i], sequence[i + 1]) / 2
    );
    drawPath.arcTo(
      sequence[i].x,
      sequence[i].y,
      sequence[i + 1].x,
      sequence[i + 1].y,
      radius
    );
  }
  const lastPoint = sequence[sequence.length - 1];
  drawPath.lineTo(lastPoint.x, lastPoint.y);
  return drawPath.toString();
}

export type Point = { x: number; y: number };
export function distance(point1: Point, point2: Point) {
  return Math.hypot(point1.x - point2.x, point1.y - point2.y);
}

export function path(endpoints: [Endpoint, Endpoint] | []) {
  if (endpoints.length === 0) {
    return "";
  }
  let pathStr = "";
  if (
    endpoints[0].table.x1 < endpoints[1].table.x ||
    endpoints[0].table.x > endpoints[1].table.x1
  ) {
    pathStr = horizontalPath(endpoints);
  } else if (
    endpoints[0].table.y1 < endpoints[1].table.y ||
    endpoints[0].table.y > endpoints[1].table.y1 ||
    endpoints[0].table === endpoints[1].table
  ) {
    pathStr = verticalPath(endpoints);
  } else {
    endpoints.forEach((endpoint) => {
      endpoint.x = endpoint.fieldX + 5;
      endpoint.y = endpoint.fieldY;
    });
  }
  return pathStr;
}
