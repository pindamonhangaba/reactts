import * as React from "react";
import { connect } from "react-redux";

import { updateTable, exportSQL } from "app/ducks/editor";
import * as DB from "app/models/pg";
import TableEditorPopup from "app/containers/editor/popup/TableEditor";
import IconTable from "app/components/icon/Table";

export interface SidebarProps {
  addTable: (table: DB.Table) => void;
  exportSQL: () => void;
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
          <IconTable size={16} />
          New
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
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    addTable: (table: DB.Table) => dispatch(updateTable(table) as any),
    exportSQL: () => dispatch(exportSQL() as any),
  })
)(Editor);
