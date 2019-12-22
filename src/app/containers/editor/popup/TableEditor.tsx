import * as React from "react";
import { createModal } from "react-modal-promise";

import Tabs from "app/components/tabs";
import Modal from "app/components/modal";
import ColumnsForm from "app/components/form/table/column/Columns";
import { ForeignKeysSection } from "./Sections";

export class MyModal extends React.Component<{
  open: boolean;
  close: (...d: any) => void;
  tableName?: string;
}> {
  state = {
    tableData: { columns: [] as Array<any>, metadata: {} },
    tableName: this.props.tableName,
    fkData: {} as { entries: Array<any>; metadata: Array<any> },
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
    const {
      tableData: { columns = [], metadata: colMetadata = [] },
      tableName = "",
      fkData: { entries = [], metadata = [] } = {},
    } = this.state;
    close({
      columns: [
        ...columns.map((e, i) => ({ ...e, metadata: colMetadata[i] || {} })),
      ],
      references: [
        ...entries.map((e, i) => ({ ...e, metadata: metadata[i] || {} })),
      ],
      name: tableName,
    });
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
