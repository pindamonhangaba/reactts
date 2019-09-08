import React, { PureComponent, ChangeEvent } from "react";

import { Table } from "./Table";
import Canvas from "./Canvas";
import "./style.css";

export interface GraphProps {
  tables: Array<Table>;
}

export default class Graph extends PureComponent<GraphProps> {
  state = { zoom: 100 };

  handleZoomChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ zoom: e.target.value });
  };

  render() {
    const { tables } = this.props;

    return (
      <div
        className="Graph"
        style={{ overflow: "auto", display: "flex", flexDirection: "column" }}
      >
        <div style={{ background: "#f3f3f3" }}>
          <svg height="calc(100vh - 200px)" width="100%">
            <Canvas zoom={this.state.zoom} tables={tables} />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>{this.state.zoom}%</p>
          <input
            className="rs-range"
            style={{ margin: 24 }}
            type="range"
            min="25"
            max="125"
            value={this.state.zoom}
            onChange={this.handleZoomChange}
          />
        </div>
      </div>
    );
  }
}
