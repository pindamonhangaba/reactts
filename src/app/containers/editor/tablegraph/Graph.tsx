import React from "react";
import { connect } from "react-redux";

import * as DB from "app/models/pg";
import { getTables, actions, Position, TablePosMap } from "app/ducks/editor";

import GraphComponent from "app/components/tablegraph/Graph";
import { Relation } from "app/components/tablegraph/Table";

export interface SidebarProps {
  tables: Array<DB.Table>;
  tablePositions: TablePosMap;
  updateTablePos: (t: string, p: Position) => void;
}

// todo: add aria labels to svg tables
// https://developer.paciellogroup.com/blog/2013/12/using-aria-enhance-svg-accessibility/
export class Graph extends React.Component<SidebarProps, {}> {
  public render() {
    const { tables, tablePositions, updateTablePos } = this.props;

    const gtables = tables.map((t: DB.Table, i: number) => ({
      title: t.name,
      rows: t.columns.map((col) => ({
        name: col.name,
        type: col.type,
        primary: !!col.primary,
      })),
      initialX: tablePositions?.[t.name]?.x ?? i * 100,
      initialY: tablePositions?.[t.name]?.y ?? i * 100,
      refs: (t.references || []).map((e) => ({
        name: e.name,
        relationLabels: ["*", "*"] as [string, string],
        relations: [
          {
            table: t.name,
            rows: e.columns.map((c) =>
              getTableColumnIdx(
                tables,
                ColTypes.Self,
                t.schemaName || "",
                t.name,
                c
              )
            ),
          },
          {
            table: e.tableRef,
            rows: e.columnsRef.map((c) =>
              getTableColumnIdx(
                tables,
                ColTypes.Reference,
                e.schemaRef || "",
                e.tableRef,
                c
              )
            ),
          },
        ] as [Relation, Relation],
      })),
    }));

    return (
      <GraphComponent
        tables={gtables}
        onPositionChange={(p) =>
          Object.keys(p).forEach((k) => updateTablePos(k, p[k]))
        }
      />
    );
  }
}

export default connect(getTables, (dispatch) => ({
  updateTablePos: (t: string, p: Position) =>
    dispatch(actions.updateTablePos(t, p)),
}))(Graph);

enum ColTypes {
  Self = "columns",
  Reference = "columnsRef",
}

function getTableColumnIdx(
  tables: Array<DB.Table>,
  refType: ColTypes,
  schema: string,
  t: string,
  col: string
): number | null {
  const tb = tables.find((tb) => {
    if ((schema || "").trim().length > 0) {
      return schema === tb.schemaName && tb.name === t;
    }
    return tb.name === t;
  });

  if (tb === undefined || !tb) {
    return null;
  }

  const selt: DB.Table = tb;
  const c = (selt.references || []).find((c) => c[refType].indexOf(col) > -1);
  if (c === undefined) {
    return null;
  }
  return (selt.references || []).indexOf(c);
}
