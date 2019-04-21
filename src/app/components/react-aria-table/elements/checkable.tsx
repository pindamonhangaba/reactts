import React from 'react';

export declare namespace Checkable {
    export interface Props {
        [k: string]: any
        focused?: boolean
        component: any
        onChangeAccept?: (v: boolean) => void
    }
    export interface State {
        editing: boolean
    }
}

class Checkable extends React.Component<Checkable.Props> {
    ref = React.createRef()
    inputRef = React.createRef()
    state = { editing: false, value: !!this.props.row[this.props.colKey] };

    focus() {
        if (this.inputRef.current) {
            (this.inputRef.current as any).focus();
        }
    }

    handleKeyUp = (e: React.KeyboardEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        switch (e.keyCode) {
            case 32: // spacebar
                this.toggle();
                break;
        }
    };
    handleCellClick = (e: React.MouseEvent<HTMLTableCellElement>) => {
        this.toggle();
        this.props.onClick && this.props.onClick(e);
    };

    toggle = () => {
        const { colKey, row } = this.props;
        let val = row[colKey];
        this.props.onChangeAccept && this.props.onChangeAccept(!val);
    };

    render() {
        const { colKey, row, tabIndex } = this.props;
        let contents = row[colKey];

        contents = <label>
            <input tabIndex={tabIndex} type="checkbox" ref={this.inputRef as any} checked={!!contents} />
            {contents}
        </label>


        return <td
            {...this.props}
            onKeyUp={this.handleKeyUp}
            onClick={this.handleCellClick}
            tabIndex={-1}
            ref={this.ref as any}
        >
            {contents}
        </td>;
    }
}

export default Checkable;