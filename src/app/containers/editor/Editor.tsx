import * as React from "react";

import Sidebar from "app/containers/editor/sidebar/Sidebar";
import Toolbar from "app/containers/editor/toolbar/Toolbar";
import Header from "app/components/header/Header";

export class Editor extends React.Component<{}, {}> {
  public render() {
    return (
      <div
        style={{
          height: "100vh",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header>
          <h2 style={{ margin: "12px", fontSize: 18, lineHeight: "16px" }}>
            Tabua
          </h2>
        </Header>
        <div style={{ flex: 1, display: "flex" }}>
          <div
            style={{
              flex: "0 0  200px",
              height: "100%",
              borderRight: "1px solid rgb(234, 234, 234)",
            }}
          >
            <Sidebar />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Toolbar />
          </div>
        </div>
      </div>
    );
  }
}

export default Editor;
