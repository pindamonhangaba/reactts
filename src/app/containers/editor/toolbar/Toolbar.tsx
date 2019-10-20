import * as React from "react";
import { connect } from "react-redux";

import { actions } from "app/ducks/editor";

import TableEditorPopup from "app/containers/editor/popup/TableEditor";
import IconTable from "app/components/icon/Table";

export interface SidebarProps {
  addTable: (tableName: string, table: any) => void;
}

export class Editor extends React.Component<SidebarProps, {}> {
  handleAddTable = () => {
    TableEditorPopup().then((r: any) => {
      if (!r) return;
      console.log("-->", r);

      //this.props.addTable(r.name, r);
    });
  };
  public render() {
    return (
      <div style={{ height: 40, background: "#ccc" }}>
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
      </div>
    );
  }
}

export default connect(
  () => ({}),
  (dispatch) => ({
    addTable: (tableName: string, table: any) =>
      dispatch(actions.setTable(tableName, table)),
  })
)(Editor);
