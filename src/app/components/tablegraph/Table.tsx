import React, { PureComponent } from "react";

import Row from "./TableRow";

const PADDING = 12;
const HEIGHT = 32;
const MIN_SEP = 32;
const DEFAULT_WIDTH = 200;

function tw(
  txt: string,
  style: any = {},
  cacheString: string = "Xk3TXkuMUNPZ5rhM"
): number {
  let w: any = window;
  if (!w[cacheString]) {
    w[cacheString] = {};
  }
  if (w[cacheString][txt] !== undefined) {
    return w[cacheString][txt];
  }

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  Object.assign(text.style, style);
  svg.appendChild(text);
  document.body.appendChild(svg);

  text.textContent = txt;
  const width = text.getComputedTextLength();
  document.body.removeChild(svg);

  w[cacheString][txt] = width;

  return width;
}

export type Relation = {
  table: string;
  rows: Array<number>;
};

export interface Reference {
  name: string;
  relationLabels: [string, string];
  relations: [Relation, Relation];
}

export interface Row {
  primary?: boolean;
  name: string;
  type: string;
}

export interface Table {
  title: string;
  rows: Array<Row>;
  initialX: number;
  initialY: number;
  refs?: Array<Reference>;
  primary?: boolean;
}

export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
  x1: number;
  y1: number;
}

export interface TableProps extends Table {
  onPositionChange?: (pos: Position, t: Table) => void;
  beforePositionChange?: (pos: Position, t: Table) => void;
  onHover?: (hover: boolean, t: Table) => void;
  highlight?: boolean;
}

export default class TableRender extends PureComponent<
  TableProps,
  { x: number; y: number; height: number; width: number; hover: boolean }
> {
  state = {
    x: this.props.initialX,
    y: this.props.initialY,
    height: (this.props.rows.length + 1) * HEIGHT + HEIGHT,
    width: DEFAULT_WIDTH,
    hover: false,
  };
  coords: { x: number; y: number } = { x: 0, y: 0 };

  componentDidMount() {
    this.setState({ width: this.calculatedWidth() });
    this.positionChanged();
  }

  componentWillUpdate(prevProps: any, prevState: any) {
    if (this.props.rows !== prevProps.rows) {
      this.setState({
        width: this.calculatedWidth(),
        height: (this.props.rows.length + 1) * HEIGHT + HEIGHT,
      });
    }
  }

  calculatedWidth = () => {
    const widths = this.props.rows.map(
      (r) => tw(r.name) + PADDING * 2 + MIN_SEP + tw(r.type)
    );
    const maxWidth = Math.max(...widths);
    return maxWidth < DEFAULT_WIDTH ? DEFAULT_WIDTH : maxWidth;
  };

  positionChanged = () => {
    const {
      onPositionChange,
      beforePositionChange,
      onHover,
      highlight,
      ...table
    } = this.props;

    onPositionChange &&
      onPositionChange(
        {
          ...this.state,
          x1: this.state.width + this.state.x,
          y1: this.state.height + this.state.y,
        },
        table
      );
  };

  handleMouseOver = () => {
    this.setState(() => ({
      hover: true,
    }));
    const {
      onPositionChange,
      beforePositionChange,
      onHover,
      highlight,
      ...table
    } = this.props;
    onHover && onHover(true, table);
  };

  handleMouseOut = (e: any) => {
    this.setState(() => ({
      hover: false,
    }));
    const {
      onPositionChange,
      beforePositionChange,
      onHover,
      highlight,
      ...table
    } = this.props;
    onHover && onHover(false, table);
  };

  handleMouseDown = (e: any) => {
    e.stopPropagation();
    this.coords = {
      x: e.pageX,
      y: e.pageY,
    };
    document.addEventListener("mousemove", this.handleMouseMove);

    const {
      onPositionChange,
      beforePositionChange,
      onHover,
      highlight,
      ...table
    } = this.props;
    beforePositionChange &&
      beforePositionChange(
        {
          ...this.state,
          x1: this.state.width + this.state.x,
          y1: this.state.height + this.state.y,
        },
        table
      );
  };

  handleMouseUp = (e: any) => {
    e.stopPropagation();
    document.removeEventListener("mousemove", this.handleMouseMove);
    this.coords = { x: 0, y: 0 };
  };

  handleMouseMove = (e: any) => {
    e.stopPropagation();
    const xDiff = this.coords.x - e.pageX;
    const yDiff = this.coords.y - e.pageY;

    this.coords.x = e.pageX;
    this.coords.y = e.pageY;

    this.setState(
      {
        x: this.state.x - xDiff,
        y: this.state.y - yDiff,
      },
      () => this.positionChanged()
    );
  };

  render() {
    const { x, y, width, height, hover } = this.state;
    const { rows, title, highlight, refs = [] } = this.props;

    const h = highlight || hover;

    const fks = refs.reduce(
      (a, b) => {
        let rows: Array<number> = [];
        if (b.relations[0].table === title) {
          rows = [...rows, ...b.relations[0].rows];
        }
        if (b.relations[1].table === title) {
          rows = [...rows, ...b.relations[1].rows];
        }
        return rows;
      },
      [] as Array<number>
    );

    return (
      <svg
        className="table no-select"
        height={height}
        width={width}
        x={x}
        y={y}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        <svg
          className="table-header"
          height={HEIGHT}
          width={width}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onMouseOut={this.handleMouseUp}
        >
          <rect height={HEIGHT} width={width}></rect>
          <text
            className="table-name"
            fontWeight="bold"
            x="13"
            y="16"
            dy=".35em"
          >
            {title}
          </text>
          <title>{title}</title>
        </svg>
        {rows.map((r, i) => (
          <Row
            key={i}
            highlight={fks.indexOf(i) > -1 && h}
            x={0}
            y={HEIGHT + HEIGHT * i}
            name={r.name}
            type={r.type}
            primary={r.primary}
            height={HEIGHT}
            width={width}
          />
        ))}
      </svg>
    );
  }
}
