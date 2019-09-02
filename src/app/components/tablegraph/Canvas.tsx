import React, { PureComponent } from "react";

import { path, Endpoint } from "./path";
import TableRender, { Table, Reference, Position } from "./Table";
import DraggableSVG from "./DraggableSvg";
import Grid from "./BackgroundGrid";

const HEIGHT = 32;

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

export default class Canvas extends PureComponent<
  { tables: Array<Table>; zoom?: number },
  {
    tableOrder: { [k: string]: number };
    tablePositions: { [k: string]: Position };
    highlightRefs?: Array<Reference>;
  }
> {
  state = {
    tableOrder: {},
    tablePositions: {},
    highlightRefs: [],
  };

  componentDidMount() {
    let tableOrder: { [k: string]: number } = {};

    this.props.tables.forEach((t, i) => {
      tableOrder[t.title] = i;
    });

    this.setState({ tableOrder });
  }

  componentWillUpdate(prevProps: any) {
    if (this.props.tables !== prevProps.tables) {
      let tableOrder: { [k: string]: number } = {};

      this.props.tables.forEach((t, i) => {
        tableOrder[t.title] = i;
      });

      this.setState({ tableOrder });
    }
  }

  orderedTables = (): Array<Table> => {
    return this.props.tables.sort((a, b) => {
      const o: { [k: string]: number } = this.state.tableOrder;

      if (o[a.title] < o[b.title]) {
        return -1;
      }

      return 1;
    });
  };

  bringToFront = (t: Table) => {
    let o: { [k: string]: number } = this.state.tableOrder;

    for (const k in o) {
      if (o.hasOwnProperty(k)) {
        o[k] = o[k] / this.props.tables.length;
      }
    }

    this.setState((state) => ({
      tableOrder: {
        ...state.tableOrder,
        [t.title]: this.props.tables.length + 1,
      },
    }));
  };

  handlePositionChange = (p: Position, t: Table) => {
    this.setState((state) => ({
      tablePositions: {
        ...state.tablePositions,
        [t.title]: p,
      },
    }));
  };

  handleBeforePositionChange = (p: Position, t: Table) => {
    this.bringToFront(t);
  };

  handleHover = (h: boolean, t: Table) => {
    this.setState((state) => ({
      highlightRefs: h ? t.refs : [],
    }));
  };

  render() {
    const { tablePositions, highlightRefs = [] }: any = this.state;
    const { tables, zoom = 100 } = this.props;
    const orderedTables = this.orderedTables();
    let references: Array<{
      name: string;
      endpoints: [Endpoint, Endpoint];
    }> = [];
    const highlightedRefs = highlightRefs.reduce(
      (a: Array<string>, ref: Reference) => [...a, ref.name],
      []
    );
    const highlightedTables = highlightRefs.reduce(
      (a: Array<string>, ref: Reference) => [
        ...a,
        ref.relations[0].table,
        ref.relations[1].table,
      ],
      []
    );

    tables.forEach((t) => {
      (t.refs || []).forEach((ref) => {
        if (ref.relations.length !== 2) {
          return;
        }

        const localRelation = ref.relations[0];
        const foreignRelation = ref.relations[1];

        // remove duplicate references
        // that start from other tables
        if (t.title !== localRelation.table) {
          return;
        }

        const localPosition = tablePositions[t.title];
        const foreignPosition = tablePositions[foreignRelation.table];
        if (
          !Boolean(localPosition) ||
          !Boolean(foreignPosition) ||
          localRelation.rows.length === 0 ||
          foreignRelation.rows.length === 0
        ) {
          return;
        }
        // only supports one reference, so multi-key foreign references
        // show only the outermost key
        const localRow = localRelation.rows[localRelation.rows.length - 1];
        const foreignRow =
          foreignRelation.rows[foreignRelation.rows.length - 1];

        const p: [Endpoint, Endpoint] = [
          {
            x: 0,
            y: HEIGHT + localRow * HEIGHT + HEIGHT / 2,
            fieldX: localPosition.x,
            fieldY: localPosition.y + HEIGHT + HEIGHT * localRow + HEIGHT / 2,
            table: {
              ...localPosition,
            },
          },
          {
            x: 0,
            y: HEIGHT + foreignRow * HEIGHT + HEIGHT / 2,
            fieldX: foreignPosition.x,
            fieldY:
              foreignPosition.y + HEIGHT + HEIGHT * foreignRow + HEIGHT / 2,
            table: {
              ...foreignPosition,
            },
          },
        ];
        references.push({ name: ref.name, endpoints: p });
      });
    });

    const width = 2480;
    const height = 3508;
    const min = 0.25,
      max = 125;
    let zfactor = Math.min(Math.max(zoom / 100, min), max);
    const px = (1 - zfactor) * (width / 2);
    const py = (1 - zfactor) * (height / 2);
    const matrix = `matrix(${zfactor}, 0, 0, ${zfactor}, ${py}, ${px})`;

    return (
      <DraggableSVG
        width={`${width}px`}
        height={`${height}px`}
        transform={matrix}
      >
        <Grid />
        {references.map((ref) => (
          <g
            key={ref.name}
            className={`ref ${
              highlightedRefs.indexOf(ref.name) > -1 ? "highlight-ref" : ""
            }`}
          >
            <path className="visible-path" d={path(ref.endpoints)} />
          </g>
        ))}
        {orderedTables.map((t) => (
          <TableRender
            key={t.title}
            title={t.title}
            refs={t.refs}
            rows={t.rows}
            initialX={t.initialX}
            initialY={t.initialY}
            beforePositionChange={this.handleBeforePositionChange}
            onPositionChange={this.handlePositionChange}
            onHover={this.handleHover}
            highlight={highlightedTables.indexOf(t.title) > -1}
          />
        ))}
      </DraggableSVG>
    );
  }
}
