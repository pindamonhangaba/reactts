import React from "react";
import Focusable from "./elements/Focusable";

type Coord = [number, number];

export declare namespace DataTable {
  export interface Props {
    id: string;
    columns: Array<Column>;
    title: string;
    data: Array<any>;
  }
  export interface State {
    focused: Coord;
  }
  export interface Column {
    key: string;
    label: string;
    width?: number;
    cellProps?: any;
    headerProps?: any;
    renderer?: any; //React.Component<{ colKey: string, index: number, row: Array<any>, focused?: boolean }>;
  }
}

class DataTable extends React.Component<DataTable.Props, DataTable.State> {
  state = { focused: [0, 0] as Coord };

  handleCellClick = (coord: Coord, e: React.MouseEvent<HTMLElement>) => {
    this.setState({ focused: coord });
  };

  handleMouseDown = (coord: Coord, e: React.KeyboardEvent<HTMLElement>) => {
    const { columns, data } = this.props;
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

    if (y > data.length - 1 || y < 0) {
      return;
    }
    if (x > columns.length - 1 || x < 0) {
      return;
    }

    this.setState({ focused: [x, y] });
  };

  render() {
    const { id, title, columns, data } = this.props;
    const { focused } = this.state;

    return (
      <table role="grid" aria-labelledby={id}>
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
            <tr key={i}>
              {columns.map((col, j) => (
                <Focusable
                  key={col.key + i}
                  component={col.renderer || "td"}
                  onClick={this.handleCellClick.bind(this, [j, i])}
                  onKeyDown={this.handleMouseDown.bind(this, [j, i])}
                  colKey={col.key}
                  index={i}
                  row={row}
                  focused={focused[0] === j && focused[1] === i}
                  onChangeAccept={(v) => console.log("accepted value", v)}
                >
                  {row[col.key]}
                </Focusable>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default DataTable;
