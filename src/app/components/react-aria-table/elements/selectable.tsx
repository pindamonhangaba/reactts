import React from "react";
import CreatableSelect from "react-select/creatable";

const selStyle = { margin: 0, height: 20, padding: 0 };
const colourStyles = {
  container: (styles: any) => ({ ...styles, ...selStyle, width: "100%" }),
  valueContainer: (styles: any) => ({ ...styles, ...selStyle }),
  control: (styles: any) => ({
    display: "flex",
    ...selStyle,
    flex: 1,
    flexDirection: "row",
  }),
  dropdownIndicator: (styles: any) => ({ padding: 0, background: "#cecece" }),
  indicatorSeparator: (styles: any) => ({ display: "none" }),
};

export interface EditableProps {
  [k: string]: any;
  focused?: boolean;
  component: any;
  onChangeAccept?: (v: string | Array<string>) => void;
  options: Array<KV>;
  multiple?: boolean;
}
export interface EditableState {
  editing: boolean;
  value: any;
}

export type KV = { value: string; label: string };

class Editable extends React.Component<EditableProps, EditableState> {
  ref = React.createRef();
  inputRef = React.createRef();
  state = { editing: false, value: this.props.row[this.props.colKey] };

  focus() {
    if (this.state.editing && this.inputRef.current) {
      (this.inputRef.current as any).focus();
      return;
    }
    if (this.ref.current) {
      (this.ref.current as any).focus();
    }
  }

  handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const key = e.keyCode;
    switch (key) {
      case 13: // enter
        e.preventDefault();
        e.stopPropagation();
        this.setState({ editing: !this.state.editing }, this.focus);
        break;
      case 27: // esc
        e.preventDefault();
        e.stopPropagation();
        this.setState({ editing: false }, this.focus);
        break;
      default:
        if (this.state.editing && key >= 37 && key <= 40) {
          return;
        }
        if (
          (key >= 48 && key <= 57) ||
          (key >= 65 && key <= 90) ||
          (key >= 96 && key <= 105)
        ) {
          // key is alpha-numeric
          this.setState({ editing: true }, this.focus);
        } else {
          this.props.onKeyDown(e);
        }
    }
  };
  handleDoubleClick = () => {
    if (!this.state.editing) {
      this.setState({ editing: true }, this.focus);
    }
  };
  handleBlur = () => {
    this.setState({ editing: false }, this.focus);
    if (this.state.editing) {
      // accept changes
      const val =
        "value" in this.state.value
          ? this.state.value.value
          : this.state.value.map((e) => e.value);
      this.props.onChangeAccept?.(val);
    }
  };
  handleChange = (value: string | KV) => {
    this.setState(
      { value: typeof value === "object" ? value.value : value },
      this.focus
    );
  };
  handleSelectChange = (v: KV | Array<KV>) => {
    const val = "value" in v ? v.value : v.map((e) => e.value);

    this.props.onChangeAccept?.(val);
    this.setState({ value: v });
  };

  render() {
    const { colKey, row, focused, options, multiple } = this.props;
    const { value, editing } = this.state;
    let contents = row[colKey];
    if (editing) {
      contents = (
        <CreatableSelect
          ref={this.inputRef as any}
          options={options || []}
          //onBlur={this.handleBlur}
          //inputValue={editing ? value : contents}
          value={value}
          //onInputChange={this.handleChange}
          onChange={this.handleSelectChange}
          formatCreateLabel={() => null}
          placeholder="..."
          tabIndex={focused && editing ? 0 : -1}
          styles={colourStyles}
          isMulti={multiple}
          closeMenuOnSelect={false}
          components={{
            ClearIndicator: null,
          }}
        />
      );
    }

    return (
      <td
        {...this.props}
        onKeyDown={this.handleKeyDown}
        ref={this.ref as any}
        onDoubleClick={this.handleDoubleClick}
        tabIndex={focused && !this.state.editing ? 0 : -1}
      >
        {" "}
        {contents}
      </td>
    );
  }
}

export default Editable;
