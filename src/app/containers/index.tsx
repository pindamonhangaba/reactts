import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'app/ducks/menu';

import Modal from 'app/components/modal';
import Tabs from 'app/components/tabs';
import Sheet from 'app/components/sheet';

import CreatableSelect from 'react-select/lib/Creatable';

import Table from 'app/components/react-aria-table';
import { Models } from 'app/components/tables';
import Header from 'app/components/header/Header';

class Tabledata extends React.Component<{ defaults: { [k: string]: Array<{ value: string, label: string }> } } | any> {
  state: any = { data: [{}], currentFocus: [0, 0], metadata: [] };
  ref = React.createRef();

  handleAddRow = (coord: Table.Coord) => {
    const { data } = this.state;
    const l = data.length;
    if (coord[1] >= l && Object.entries(data[l - 1]).length > 0) {
      this.setState({ data: [...data, {}] });
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
    this.setState({ data: [...data, {}] });
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
      if (this.ref.current) {
        (this.ref.current as any).setFocused(currentFocus);
      }
    });
  };
  handleChange = (v) => {
    const data = [...this.state.data];
    let val = v.val;
    const cur = data[v.row].pk || 0;
    if (v.col === 'pk') {
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
        e.pk = pk || '';
        return e;
      });
      val = val ? count + 1 : '';
    }
    data[v.row][v.col] = val;
    this.setState({ data });
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
    return (<React.Fragment>
      <div style={{ display: 'flex' }}>
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

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 2 }}>Default:</div>
        <div style={{ flex: 8 }}>
          <CreatableSelect
            options={Models.ColumnEditorModel.typeDefaults[data[currentFocus[1]].type] || Models.ColumnEditorModel.typeDefaults['default']}
            value={(this.state.metadata[currentFocus[1]] || { default: '' }).default}
            onChange={this.handleMetaChange.bind(this, 'default')}
            formatCreateLabel={() => null}
          />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 2 }}>Comment:</div>
        <div style={{ flex: 8 }}>
          <textarea
            rows={1}
            value={(this.state.metadata[currentFocus[1]] || { comment: '' }).comment}
            onChange={(e) => this.handleMetaChange('comment', e.target.value)}
          />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 2 }}>Dimensions:</div>
        <div style={{ flex: 8 }}>
          <input
            type="number"
            value={(this.state.metadata[currentFocus[1]] || { dimensions: '' }).dimensions}
            onChange={(e) => this.handleMetaChange('dimensions', e.target.value)}
          />
        </div>
      </div>

    </React.Fragment>
    )
  }
}

const tabDescriptions = [
  {
    title: 'one',
    id: 't1',
    content: (
      <div>
        <Tabledata />
      </div>
    ),
  },
  {
    title: 'two',
    id: 't2',
    content: (
      <div>
        <Sheet />
      </div>
    ),
  },
  {
    title: 'three',
    id: 't3',
    content: (
      <div>
        Duis <a href='#'>aute</a> irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    ),
  },
  {
    title: 'three',
    id: 't4',
    content: (
      <div>
        Duis <a href='#'>aute</a> irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
    ),
  },
  {
    title: 'three',
    id: 't5',
    content: (
      <div>
        <Modal titleText="test me" getApplicationNode={() => null} >
          <div style={{ padding: 5, width: 400, height: 450, display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
            <Tabs tabs={[]} defaultActive="t1" />
            <footer style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 5, alignSelf: 'flex-end', flexGrow: 0, flexBasis: 1 }}>
              <button>Ok</button>
              <button>Cancel</button>
            </footer>
          </div>
        </Modal>
      </div>
    ),
  },
];
tabDescriptions;

const App = ({ sayhi }) => {
  return <div style={{ height: '100vh', flex: 1 }}>
    <Header>
      <h2 style={{ margin: '-2px 0 0 12px', color: '#fff', fontSize: 18, lineHeight: '16px' }}>Tabua</h2>
    </Header>
  </div>
}

export default connect(
  () => ({}),
  (dispatch: any) => ({
    sayhi: () => dispatch(actions.sayHi("hi")),
  })
)(App);