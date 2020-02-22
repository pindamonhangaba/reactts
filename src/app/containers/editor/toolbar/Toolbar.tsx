import * as React from "react";
import { connect } from "react-redux";

import {
  updateTable,
  exportSQL,
  exportProject,
  importProject,
} from "app/ducks/editor";
import * as DB from "app/models/pg";
import TableEditorPopup from "app/containers/editor/popup/TableEditor";
import { TextFileInput } from "app/components/input";

export interface SidebarProps {
  addTable: (table: DB.Table) => void;
  exportSQL: () => void;
  exportProject: () => void;
  importProject: (t: string) => void;
}

export class Editor extends React.Component<SidebarProps, {}> {
  handleAddTable = () => {
    TableEditorPopup().then((r: any) => {
      if (!r) return;
      this.props.addTable(r);
    });
  };

  handleExportSQL = () => {
    this.props.exportSQL();
  };
  handleExporProject = () => {
    this.props.exportProject();
  };

  handleLoadProject = (t: string) => {
    this.props.importProject(t);
  };

  render() {
    return (
      <div style={{ height: 40, background: "#ccc", display: "flex" }}>
        <button
          style={{
            margin: 1,
            fontSize: 12,
            height: 40,
            display: "flex",
            alignItems: "center",
          }}
          onClick={this.handleAddTable}
        >
          Create table
        </button>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TextFileInput
            style={{
              margin: 1,
              fontSize: 12,
              height: 40,
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-end",
            }}
            labelProps={{
              style: {
                display: "flex",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              },
            }}
            onChange={this.handleLoadProject}
          >
            Open project
          </TextFileInput>
          <button
            style={{
              margin: 1,
              fontSize: 12,
              height: 40,
              display: "flex",
              alignItems: "center",
            }}
            onClick={this.handleExporProject}
          >
            Export project
          </button>
          <button
            style={{
              margin: 1,
              fontSize: 12,
              height: 40,
              display: "flex",
              alignItems: "center",
            }}
            onClick={this.handleExportSQL}
          >
            Export SQL
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    addTable: (table: DB.Table) => dispatch(updateTable(table) as any),
    exportSQL: () => dispatch(exportSQL() as any),
    exportProject: () => dispatch(exportProject() as any),
    importProject: (file: string) => dispatch(importProject(file) as any),
  })
)(Editor);
