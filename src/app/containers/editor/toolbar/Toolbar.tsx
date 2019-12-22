import * as React from "react";
import { connect } from "react-redux";

import { actions } from "app/ducks/editor";
import * as DB from "app/models/pg";
import TableEditorPopup from "app/containers/editor/popup/TableEditor";
import IconTable from "app/components/icon/Table";

export interface SidebarProps {
  addTable: (tableName: string, table: DB.Table) => void;
}

export class Editor extends React.Component<SidebarProps, {}> {
  handleAddTable = () => {
    TableEditorPopup().then((r: any) => {
      if (!r) return;
      const table: DB.Table = {
        name: r.name,
        columns: r.columns.map((c:any) => ({
          name: c.name,
          type: c.type,
          nonNull: c.nonNull,
          primary: c.pk,
          default: c?.metadata?.default,
          dimensions: c?.metadata?.dimensions,
          comment: c?.metadata?.comment,
        })),
        references: r.references?.map?.((ref:any) => ({
          name: ref.name,
          columns: [ref.columns],
          schemaRef: ref?.schemaRef,
          tableRef: ref.tableRef,
          columnsRef: [ref.columnsRef],
          onDelete: ref.onDelete,
          match: ref?.metadata?.match?.value,
          defferrable: ref?.metadata?.defferable ?? false,
          deferred: ref?.metadata?.deferred ?? false,
          comment: ref?.metadata?.comment,
        }))
      };

      this.props.addTable(r.name, table);
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
