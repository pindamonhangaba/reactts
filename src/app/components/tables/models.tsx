import React from 'react';
import Editable from 'app/components/react-aria-table/elements/editable';
import Selectable from 'app/components/react-aria-table/elements/selectable';
import Checkable from 'app/components/react-aria-table/elements/checkable';


const typeOptions = ['varchar', 'time', 'timestamp', 'date', 'int8', 'int2', 'jsonb', 'json'].map(o => ({ value: o, label: o }));

export class ColumnTypesSel extends React.Component<any> {
    ref = React.createRef()
    focus() {
        this.ref.current && (this.ref.current as any).focus();
    }
    render() {
        return <Selectable ref={this.ref as any} {...this.props} options={typeOptions} component={this.props.component} />
    }
}

export interface Column {
    key: string
    label: string
    renderer?: any
    cellProps?: any
}

export const ColumnEditorModel = {
    columns: [
        { key: 'name', label: 'Name', renderer: Editable },
        { key: 'type', label: 'Type', renderer: Selectable, cellProps: { options: typeOptions } },
        { key: 'length', label: 'Length', renderer: Editable },
        { key: 'decimals', label: 'Decimals', renderer: Editable },
        { key: 'not-null', label: 'Not null', renderer: Checkable },
        { key: 'pk', label: 'PK', renderer: Checkable },
    ] as Array<Column>
};