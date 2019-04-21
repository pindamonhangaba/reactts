import React from 'react';
import { connect } from 'react-redux';
import { actions } from 'app/ducks/menu';

import Modal from 'app/components/modal';
import Tabs from 'app/components/tabs';
import Sheet from 'app/components/sheet';

import Table from 'app/components/react-aria-table';
import { Models } from 'app/components/tables';
import DraggableRow from 'app/components/tables/draggable';


import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

class Tabledata extends React.Component<{}> {
    state: any = { data: [{}, {}, {}], currentFocus: [0, 0] };
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
        this.setState({ data: [...data, {}] });
    };
    handleClickRemoveRow = () => {
        let { data, currentFocus } = this.state;
        data.splice(currentFocus[1], 1);
        this.setState({ data: [...data] });
    };

    moveCard = (dragIndex: number, hoverIndex: number) => {
        const row = this.state.data[dragIndex];
        let d = [...this.state.data];
        d.splice(dragIndex, 1);
        d.splice(hoverIndex, 0, row);
        this.setState({ data: d });
    }

    render() {
        return (<React.Fragment>
            <div style={{ display: 'flex' }}>
                <button onClick={this.handleClickAddRow}>Add column</button>
                <button onClick={this.handleClickRemoveRow}>Remove column</button>
            </div>
            <DragDropContextProvider backend={HTML5Backend}>
                <Table
                    ref={this.ref as any}
                    id="test2"
                    title="teboru"
                    columns={Models.ColumnEditorModel.columns}
                    data={this.state.data}
                    onChange={(v) => {
                        const data = [...this.state.data];
                        data[v.row][v.col] = v.val;
                        this.setState({ data });
                    }}
                    onOutOfBounds={this.handleAddRow}
                    onFocusChange={this.handleFocusChange}
                    rowRenderer={(p: any) => <DraggableRow {...p}
                        key={p.rowIndex}
                        index={p.rowIndex}
                        id={p.rowIndex}
                        moveRow={this.moveCard}
                    />}
                />
            </DragDropContextProvider>

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
                Duis <a href='#'>aute</a> irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </div>
        ),
    },
];

const App = ({ sayhi }) => {
    return <div>
        <button onClick={() => sayhi()}>
            Say hi
        </button>
        <Modal titleText="test me" getApplicationNode={() => null} >
            <div style={{ padding: 5, width: 400, height: 450, display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                <Tabs tabs={tabDescriptions} defaultActive="t1" />
                <footer style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 5, alignSelf: 'flex-end', flexGrow: 0, flexBasis: 1 }}>
                    <button>Ok</button>
                    <button>Cancel</button>
                </footer>
            </div>
        </Modal>
    </div>
}

export default connect(
    () => ({}),
    (dispatch) => ({
        sayhi: () => dispatch(actions.sayHi("hi")),
    })
)(App);