import * as React from "react";
import { connect } from "react-redux";

import * as DB from "app/models/pg";
import { getTables, updateTable } from "app/ducks/editor";

import IconTable from "app/components/icon/Table";
import IconSearch from "app/components/icon/Search";
import TableEditorPopup from "app/containers/editor/popup/TableEditor";

export interface SidebarProps {
  tables: Array<DB.Table>;
  updateTable: (table: DB.Table) => void;
}

export class Editor extends React.Component<SidebarProps, {}> {
  handleTableClick = (t: DB.Table) => {
    TableEditorPopup({ initialValues: t }).then((r: any) => {
      if (!r) return;
      this.props.updateTable(r);
    });
  };
  public render() {
    return (
      <div style={{ flex: 1, height: "100%" }}>
        <div style={{ height: 40, background: "#ccc", display: "flex" }}>
          <IconSearch size={24} style={{ padding: 8 }} />{" "}
          <input type="text" style={{ border: "none", margin: "8px 0" }} />
        </div>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {this.props.tables.map((t) => (
            <li
              key={t.name}
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <button
                style={{
                  border: "none",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  flex: 1,
                }}
                onClick={() => this.handleTableClick(t)}
              >
                <IconTable size={24} /> {t.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default connect(getTables, (dispatch) => ({
  updateTable: (t: DB.Table) => dispatch(updateTable(t) as any),
}))(Editor);
