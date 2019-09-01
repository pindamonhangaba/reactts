import * as React from "react";
import { connect } from "react-redux";

import DB from "models/pg";
import { getTables } from "app/ducks/editor";

import IconTable from "app/components/icon/Table";
import IconSearch from "app/components/icon/Search";

export interface SidebarProps {
  tables: Array<DB.Table>;
}

export class Editor extends React.Component<SidebarProps, {}> {
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
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <IconTable size={24} /> {t.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default connect(getTables)(Editor);
