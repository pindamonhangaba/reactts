import * as React from "react";
import { createModal } from "react-modal-promise";

import * as DB from "app/models/pg";
import Tabs from "app/components/tabs";
import Modal from "app/components/modal";
import ColumnsForm from "app/components/form/table/column/Columns";
import { ForeignKeysSection } from "./Sections";

export class MyModal extends React.Component<{
  open: boolean;
  close: (...d: any) => void;
  tableName?: string;
  initialValues?: DB.Table;
}> {
  state = {
    tableData: { columns: [] as Array<any>, metadata: {} },
    tableName: this.props.tableName,
    fkData: {} as { entries: Array<any>; metadata: Array<any> },
    ...(this.props.initialValues
      ? mapFromDBTable(this.props.initialValues)
      : {}),
  };

  handleTableDataChange = (d: any) => {
    this.setState({ tableData: d });
  };
  handleFKDataChange = (d: any) => {
    this.setState({ fkData: d });
  };
  handleTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ tableName: e.target.value });
  };
  handleAccept = () => {
    const { close } = this.props;
    close(mapToDBTable(this.state));
  };
  handleCancel = () => {
    const { close } = this.props;
    close();
  };

  public render() {
    const { open } = this.props;
    const { tableName, tableData, fkData } = this.state;

    const tabDescriptions = [
      {
        title: "Columns",
        id: "t1",
        content: (
          <div>
            <ColumnsForm
              value={tableData}
              onChange={this.handleTableDataChange}
            />
          </div>
        ),
      },
      {
        title: "Foreign keys",
        id: "t2",
        content: (
          <div>
            <ForeignKeysSection
              value={fkData}
              onChange={this.handleFKDataChange}
              availableColumns={tableData.columns.map((t: any) => t.name)}
            />
          </div>
        ),
      },
    ];
    return (
      open && (
        <Modal titleText="Table editor" onClose={this.handleCancel}>
          <div
            style={{
              padding: 5,
              minHeight: 450,
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <input
              type="text"
              value={tableName}
              onChange={this.handleTableNameChange}
            />
            <Tabs tabs={tabDescriptions} defaultActive="t1" />
            <footer
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 5,
                alignSelf: "flex-end",
                flexGrow: 0,
                flexBasis: 1,
              }}
            >
              <button onClick={this.handleAccept}>Ok</button>
              <button onClick={this.handleCancel}>Cancel</button>
            </footer>
          </div>
        </Modal>
      )
    );
  }
}

const myPromiseModal = createModal(MyModal);

export default myPromiseModal;

function mapToDBTable(state: any) {
  const {
    tableData: { columns = [], metadata: colMetadata = [] },
    tableName = "",
    fkData: { entries = [], metadata = [] } = {},
  } = state;
  const r = {
    columns: [
      ...columns.map((e, i) => ({ ...e, metadata: colMetadata[i] || {} })),
    ],
    references: [
      ...entries.map((e, i) => ({ ...e, metadata: metadata[i] || {} })),
    ],
    name: tableName,
  };
  const table: DB.Table = {
    name: r.name,
    columns: r.columns.map((c: any) => ({
      name: c.name,
      type: c.type,
      nonNull: c.nonNull,
      primary: c.pk,
      default: c?.metadata?.default,
      dimensions: c?.metadata?.dimensions,
      comment: c?.metadata?.comment,
    })),
    references: r.references?.map?.((ref: any) => ({
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
    })),
  };
  return table;
}

function mapFromDBTable(t: DB.Table) {
  let v = {
    tableName: t.name,
    tableData: { columns: [] as any, metadata: [] as any },
    fkData: { entries: [] as any, metadata: [] as any },
  };
  t.columns.forEach((c, i) => {
    v.tableData.columns[i] = {
      name: c.name,
      type: c.type,
      nonNull: c.nonNull,
      pk: c.primary,
    };
    v.tableData.metadata[i] = {
      default: c.default,
      dimensions: c.dimensions,
      comment: c.comment,
    };
  });

  t.references?.forEach?.((ref: any, i) => {
    v.fkData.entries[i] = {
      name: ref.name,
      columns: ref.columns,
      schemaRef: ref.schemaRef,
      tableRef: ref.tableRef,
      columnsRef: ref.columnsRef,
      onDelete: ref.onDelete,
    };

    v.fkData.metadata[i] = {
      match: { label: ref.match, value: ref.match },
      defferrable: ref.defferable ?? false,
      deferred: ref.deferred ?? false,
      comment: ref.comment,
    };
  });
  return v;
}
