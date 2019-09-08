import React from "react";

import CreatableSelect from "react-select/lib/Creatable";

import Table from "app/components/react-aria-table";
import { Models } from "app/components/tables";

export default class ForeignKeysForm extends React.Component<
  {
    value?: any;
    onChange?: (data: any) => void;
  },
  any
> {
  state = {
    data: this.props.value || ([{}] as any),
    currentFocus: [0, 0],
    metadata: [] as any,
  };
  ref = React.createRef();

  updateParent() {
    const { onChange = (d: any) => undefined } = this.props;
    onChange(this.state.data);
  }
  handleAddRow = (coord: Table.Coord) => {
    const { data } = this.state;
    const l = data.length;
    if (coord[1] >= l && Object.entries(data[l - 1]).length > 0) {
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
    if (Object.entries(data[data.length - 1]).length == 0) {
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
  handleChange = (v: any) => {
    const data = [...this.state.data];
    let val = v.val;
    data[v.row][v.col] = val;
    this.setState({ data }, () => this.updateParent());
  };
  handleMetaChange = (t: string, value: any) => {
    const idx = this.state.currentFocus[1];
    let md = this.state.metadata[idx] || {};
    md[t] = value;
    let mtl = [...this.state.metadata];
    mtl[idx] = md;
    this.setState({ metadata: mtl });
  };

  render() {
    const { currentFocus, data } = this.state;
    data;
    return (
      <React.Fragment>
        <Table
          ref={this.ref as any}
          id="fktable"
          title="Foreign keys"
          columns={Models.FKEditorModel.columns}
          data={this.state.data}
          onChange={this.handleChange}
          onOutOfBounds={this.handleAddRow}
          onFocusChange={this.handleFocusChange}
          keepFocus
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ flex: 2 }}>Match:</div>
          <div style={{ flex: 8 }}>
            <CreatableSelect
              options={Models.FKEditorModel.typeDefaults["match"]}
              value={
                (this.state.metadata[currentFocus[1]] || { match: "" }).match
              }
              onChange={this.handleMetaChange.bind(this, "match")}
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
          <label htmlFor="defferrable">Defferrable</label>
          <input
            id="defferrable"
            type="checkbox"
            value="defferrable"
            checked={
              (this.state.metadata[currentFocus[1]] || { defferrable: "" })
                .defferrable
            }
            onChange={(e) =>
              this.handleMetaChange("defferrable", !!e.target.checked)
            }
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label htmlFor="deferred">Defferred</label>
          <input
            id="deferred"
            type="checkbox"
            value="checkbox"
            checked={
              (this.state.metadata[currentFocus[1]] || { deferred: "" })
                .deferred
            }
            onChange={(e) =>
              this.handleMetaChange("deferred", !!e.target.checked)
            }
          />
        </div>
      </React.Fragment>
    );
  }
}

// //
//   match?: FKMatch;
//   defferrable: boolean;
//   deferred: boolean;
//   comment?: string;
