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
  state = { tableData: [] as any, tableName: this.props.tableName, fkData: [] };

  handleTableDataChange = (d: any) => {
    this.setState({ tableData: d.columns });
  };
  handleFKDataChange = (d: any) => {
    this.setState({ fkData: d });
  };
  handleTableNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ tableName: e.target.value });
  };
  handleAccept = () => {
    const { close } = this.props;
    const { tableData, tableName, fkData } = this.state;
    close({
      columns: [...tableData],
      references: [...fkData],
      name: tableName,
    });
  };
  handleCancel = () => {
    const { close } = this.props;
    close();
  };

  public render() {
    const { open } = this.props;
    const { tableName, tableData } = this.state;

    const tabDescriptions = [
      {
        title: "Columns",
        id: "t1",
        content: (
          <div>
            <ColumnsForm onChange={this.handleTableDataChange} />
          </div>
        ),
      },
      {
        title: "Foreign keys",
        id: "t2",
        content: (
          <div>
            <ForeignKeysSection
              onChange={this.handleFKDataChange}
              availableColumns={tableData.map((t: any) => t.name)}
            />
          </div>
        ),
      },
    ];
    return (
      open && (
        <Modal titleText="test me" onClose={this.handleCancel}>
          <div
            style={{
              padding: 5,
              width: 400,
              height: 450,
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
