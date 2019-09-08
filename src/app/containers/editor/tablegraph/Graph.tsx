import React from "react";
import { connect } from "react-redux";

import * as DB from "app/models/pg";
import { getTables } from "app/ducks/editor";

import GraphComponent from "app/components/tablegraph/Graph";

export interface SidebarProps {
  tables: Array<DB.Table>;
}

export class Graph extends React.Component<SidebarProps, {}> {
  public render() {
    const { tables } = this.props;

    const gtables = tables.map((t: DB.Table, i: number) => ({
      title: t.name,
      rows: t.columns.map((col) => ({
        name: col.name,
        type: col.type,
        primary: !!col.primary,
      })),
      initialX: i * 100,
      initialY: i * 100,
      refs: [],
    }));

    return <GraphComponent tables={gtables} />;
  }
}

export default connect(getTables)(Graph);
