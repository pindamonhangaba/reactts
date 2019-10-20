import React from "react";

import CreatableSelect from "react-select/lib/Creatable";

import Table from "app/components/react-aria-table";
import { Models } from "app/components/tables";

export default class ColumnsForm extends React.Component<
  {
    value?: any;
    onChange?: (data: any) => void;
  },
  any
> {
  state = {
    data: (this.props.value || {}).columns || ([{}] as any),
    currentFocus: [0, 0],
    metadata: (this.props.value || {}).metadata || ([] as any),
  };
  ref = React.createRef();

  updateParent() {
    const { onChange = (d: any) => undefined } = this.props;
    const { data, metadata } = this.state;
    onChange({ columns: data, metadata });
  }
  handleAddRow = (coord: Table.Coord) => {
    const { data } = this.state;
    const l = data.length;
    if (
      l > 0 &&
      coord[1] >= l &&
      Object.entries(data[l - 1] || {}).length > 0
    ) {
      this.setState({ data: [...data, {}] }, () => this.updateParent());
      if (this.ref.current) {
        (this.ref.current as any).setFocused(coord);
      }
    }
  };
  handleFocusChange = (prev: Table.Coord, curr: Table.Coord) => {
    this.setState({ currentFocus: curr });
  };
  handleClickAddRow = () => {
    const { data } = this.state;
    const l = data.length;
    console.log("-->", data, data[data.length - 1]);
    if (l !== 0 && Object.entries(data[l - 1] || {}).length == 0) {
      return;
    }
    this.setState({ data: [...data, {}] }, () => this.updateParent());
  };
  handleClickRemoveRow = () => {
    let { data, currentFocus } = this.state;
    if (data.length <= 1) {
      return;
    }
    data.splice(currentFocus[1], 1);
    if (currentFocus[1] > data.length - 1) {
      currentFocus[1] = data.length - 1;
    }
    this.setState({ data: [...data], currentFocus }, () => {
      this.updateParent();
      if (this.ref.current) {
        (this.ref.current as any).setFocused(currentFocus);
      }
    });
  };
  handleMoveUp = () => {
    let { data, currentFocus } = this.state;
    if (currentFocus[1] <= 0) {
      return;
    }
    const row = data[currentFocus[1]];
    let d = [...data];
    d.splice(currentFocus[1], 1);
    d.splice(--currentFocus[1], 0, row);
    this.setState({ data: d, currentFocus }, () => {
      this.updateParent();
      if (this.ref.current) {
        (this.ref.current as any).setFocused(currentFocus);
      }
    });
  };
  handleMoveDown = () => {
    let { data, currentFocus } = this.state;
    if (currentFocus[1] >= data.length - 1) {
      return;
    }
    const row = data[currentFocus[1]];
    let d = [...data];
    d.splice(currentFocus[1], 1);
    d.splice(++currentFocus[1], 0, row);
    this.setState({ data: d, currentFocus }, () => {
      this.updateParent();
      if (this.ref.current) {
        (this.ref.current as any).setFocused(currentFocus);
      }
    });
  };
  handleChange = (v) => {
    const data = [...this.state.data];
    let val = v.val;
    const cur = data[v.row].pk || 0;
    if (v.col === "pk") {
      let count = 0;
      data.map((e) => {
        let pk = e.pk || 0;
        count += pk ? 1 : 0;
        if (pk > cur && cur) {
          if (!val) {
            pk -= 1;
          } else {
            pk += 1;
          }
        }
        e.pk = pk || "";
        return e;
      });
      val = val ? count + 1 : "";
    }
    data[v.row][v.col] = val;
    this.setState({ data }, () => this.updateParent());
  };
  handleMetaChange = (t: string, value: any) => {
    const idx = this.state.currentFocus[1];
    let md = this.state.metadata[idx] || {};
    md[t] = value;
    let mtl = { ...this.state.metadata };
    mtl[idx] = md;
    this.setState({ metadata: mtl }, () => {
      this.updateParent();
    });
  };

  render() {
    const { currentFocus, data } = this.state;
    return (
      <React.Fragment>
        <div style={{ display: "flex" }}>
          <button onClick={this.handleClickAddRow}>Add column</button>
          <button onClick={this.handleClickRemoveRow}>Remove column</button>
          <button onClick={this.handleMoveUp}>Move up ↑</button>
          <button onClick={this.handleMoveDown}>Move down ↓</button>
        </div>
        <Table
          ref={this.ref as any}
          id="test2"
          title="teboru"
          columns={Models.ColumnEditorModel.columns}
          data={this.state.data}
          onChange={this.handleChange}
          onOutOfBounds={this.handleAddRow}
          onFocusChange={this.handleFocusChange}
          keepFocus
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ flex: 2 }}>Default:</div>
          <div style={{ flex: 8 }}>
            <CreatableSelect
              options={
                (data.length &&
                  Models.ColumnEditorModel.typeDefaults[
                    data[currentFocus[1]].type
                  ]) ||
                Models.ColumnEditorModel.typeDefaults["default"]
              }
              value={
                (this.state.metadata[currentFocus[1]] || { default: "" })
                  .default
              }
              onChange={this.handleMetaChange.bind(this, "default")}
              formatCreateLabel={() => null}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ flex: 2 }}>Comment:</div>
          <div style={{ flex: 8 }}>
            <textarea
              rows={1}
              value={
                (this.state.metadata[currentFocus[1]] || { comment: "" })
                  .comment
              }
              onChange={(e) => this.handleMetaChange("comment", e.target.value)}
            />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ flex: 2 }}>Dimensions:</div>
          <div style={{ flex: 8 }}>
            <input
              type="number"
              value={
                (this.state.metadata[currentFocus[1]] || { dimensions: "" })
                  .dimensions
              }
              onChange={(e) =>
                this.handleMetaChange("dimensions", e.target.value)
              }
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
