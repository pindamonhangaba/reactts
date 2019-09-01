import React from "react";
import Focusable from "./elements/Focusable";

const DefaultRowRenderer = (p: any) => <tr {...p} />;

declare namespace AriaTable {
  export interface Props {
    id: string;
    columns: Array<Column>;
    title: string;
    data: Array<any>;
    onChange?: (val: { row: number; col: string; val: any }) => void;
    onFocusChange?: (prev: Coord, curr: Coord, col: string) => void;
    onOutOfBounds?: (c: Coord) => void;
    rowRenderer?: any;
    keepFocus?: boolean;
  }
  export type Coord = [number, number];
  export interface State {
    focused: Coord;
  }
  export interface Column {
    key: string;
    label: string;
    renderer?: any;
    style?: React.CSSProperties;
    width?: number;
    cellProps?: any;
  }
}

class AriaTable extends React.Component<AriaTable.Props, AriaTable.State> {
  state = { focused: [0, 0] as AriaTable.Coord };
  ref = React.createRef();
  cellRefs: Array<any> = [];

  setFocused(coord: AriaTable.Coord) {
    this.focusCoord(this.state.focused, coord);
  }

  handleChangeAccept = (coord: [number, string], val: any) => {
    this.props.onChange &&
      this.props.onChange({ row: coord[0], col: coord[1], val });
  };
  handleCellClick = (
    coord: AriaTable.Coord,
    e: React.MouseEvent<HTMLElement>
  ) => {
    this.focusCoord([-1, -1], coord);
  };
  handleBlur = (coord: AriaTable.Coord, e: React.MouseEvent<HTMLElement>) => {
    const { keepFocus } = this.props;
    if (keepFocus) {
      return;
    }
    setTimeout(() => {
      if (
        this.ref.current &&
        !(this.ref.current as any).contains(document.activeElement)
      ) {
        this.focusCoord([-1, -1], coord);
      }
    }, 100);
  };

  focusCoord(prev: AriaTable.Coord, cur: AriaTable.Coord) {
    const { columns, onFocusChange } = this.props;
    this.setState({ focused: cur }, () => {
      const cur = this.state.focused;
      const cellRef = this.cellRefs[cur[1] * (columns || []).length + cur[0]];
      if (cellRef && cellRef.focus) {
        cellRef.focus(cur);
      }

      onFocusChange && onFocusChange(prev, cur, columns[cur[0]].key);
    });
  }

  handleMouseDown = (
    coord: AriaTable.Coord,
    e: React.KeyboardEvent<HTMLElement>
  ) => {
    const { columns, data, onOutOfBounds } = this.props;
    let [x, y] = coord;
    switch (e.keyCode) {
      case 37: // left
        x -= 1;
        break;
      case 39: // right
        x += 1;
        break;
      case 40: // down
        y += 1;
        break;
      case 38: // top
        y -= 1;
        break;
      default:
        return;
    }

    if (y > data.length - 1 || y < 0 || (x > columns.length - 1 || x < 0)) {
      onOutOfBounds && onOutOfBounds([x, y]);
      return;
    }

    this.focusCoord(coord, [x, y]);
  };

  render() {
    const { id, title, columns, data, rowRenderer } = this.props;
    const { focused } = this.state;
    const Row = rowRenderer || DefaultRowRenderer;

    return (
      <table role="grid" aria-labelledby={id} ref={this.ref as any}>
        <caption id={id}>{title}</caption>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{ "-moz-user-select": "none" } as any}>
          {data.map((row, i) => (
            <Row key={i} row={row} rowIndex={i}>
              {columns.map((col, j) => (
                <Focusable
                  {...(col.cellProps || {})}
                  key={col.key + i}
                  component={col.renderer || "td"}
                  onClick={this.handleCellClick.bind(this, [j, i])}
                  onKeyDown={this.handleMouseDown.bind(this, [j, i])}
                  onBlur={this.handleBlur.bind(this, [j, i])}
                  onChangeAccept={this.handleChangeAccept.bind(this, [
                    i,
                    col.key,
                  ])}
                  colKey={col.key}
                  index={i}
                  row={row}
                  focused={focused[0] === j && focused[1] === i}
                  style={{ ...col.style, width: col.width || 200 }}
                  className={focused[0] === j && focused[1] === i && "active"}
                  ref={(r) => {
                    this.cellRefs[i * (columns || []).length + j] = r;
                  }}
                >
                  {row[col.key]}
                </Focusable>
              ))}
            </Row>
          ))}
        </tbody>
      </table>
    );
  }
}

export default AriaTable;
