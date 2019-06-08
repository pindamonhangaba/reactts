import React from "react";
import Focusable from "./elements/Focusable";

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

  setFocused(coord: AriaTable.Coord) {
    this.setState({ focused: coord });
  }

  handleChangeAccept = (coord: [number, string], val: any) => {
    this.props.onChange &&
      this.props.onChange({ row: coord[0], col: coord[1], val });
  };
  handleCellClick = (
    coord: AriaTable.Coord,
    e: React.MouseEvent<HTMLElement>
  ) => {
    const { columns, onFocusChange } = this.props;
    this.setState(
      { focused: coord },
      () => onFocusChange && onFocusChange(coord, coord, columns[coord[1]].key)
    );
  };

  handleMouseDown = (
    coord: AriaTable.Coord,
    e: React.KeyboardEvent<HTMLElement>
  ) => {
    const { columns, data, onFocusChange, onOutOfBounds } = this.props;
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

    this.setState(
      { focused: [x, y] },
      () => onFocusChange && onFocusChange(coord, [x, y], columns[y].key)
    );
  };

  render() {
    const { id, title, columns, data, rowRenderer } = this.props;
    const { focused } = this.state;
    const Row = rowRenderer || "tr";
    return (
      <table role="grid" aria-labelledBy={id}>
        <caption id={id}>{title}</caption>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody style={{ "-moz-user-select": "none" } as any}>
          {data.map((row, i) => (
            <Row key={i} row={row} rowIndex={i}>
              {columns.map((col, j) => (
                <Focusable
                  {...col.cellProps || {}}
                  key={col.key + i}
                  component={col.renderer || "td"}
                  onClick={this.handleCellClick.bind(this, [j, i])}
                  onKeyDown={this.handleMouseDown.bind(this, [j, i])}
                  onChangeAccept={this.handleChangeAccept.bind(this, [
                    i,
                    col.key
                  ])}
                  colKey={col.key}
                  index={i}
                  row={row}
                  focused={focused[0] === j && focused[1] === i}
                  style={{ ...col.style, width: col.width || 200 }}
                  className={focused[0] === j && focused[1] === i && "active"}
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
