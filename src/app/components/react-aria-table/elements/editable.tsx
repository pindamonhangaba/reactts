import React from 'react';

export declare namespace Editable {
    export interface Props {
        [k: string]: any
        focused?: boolean
        component: any
        onChangeAccept?: (v: string) => void
    }
    export interface State {
        editing: boolean
    }
}

class Editable extends React.Component<Editable.Props> {
    ref = React.createRef()
    inputRef = React.createRef()
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

    select() {
        if (this.state.editing && this.inputRef.current) {
            (this.inputRef.current as any).select();
            return;
        }
    }

    handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        switch (e.keyCode) {
            case 13: // enter
                e.preventDefault();
                e.stopPropagation();
                this.setState({ editing: !this.state.editing }, this.focus);
                if (this.state.editing) {
                    // accept changes
                    this.props.onChangeAccept && this.props.onChangeAccept(this.state.value);
                }
                break;
            case 27: // esc
                e.preventDefault();
                e.stopPropagation();
                this.setState({ editing: false }, this.focus);
                break;
            default:
                if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 96 && e.keyCode <= 105) {
                    // key is alpha-numeric
                    if (!this.state.editing) {
                        this.setState({ editing: true }, () => { this.focus(); this.select() });
                    }
                } else {
                    this.props.onKeyDown(e);
                }
        }
    };
    handleDoubleClick = () => {
        if (!this.state.editing) {
            this.setState({ editing: true }, () => { this.focus(); this.select() });
        }
    };
    handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ editing: false }, this.focus);
        if (this.state.editing) {
            // accept changes
            this.props.onChangeAccept && this.props.onChangeAccept(this.state.value);
        }
    };
    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ value: e.target.value }, this.focus);
    };

    render() {
        const { colKey, row } = this.props as any;
        const { value, editing } = this.state as any;
        let contents = row[colKey];

        if (editing) {
            contents = <input ref={this.inputRef as any} style={{ width: '100%' }} onBlur={this.handleBlur} value={value} onChange={this.handleChange} />
        }

        return <td
            {...this.props}
            onKeyDown={this.handleKeyDown}
            onDoubleClick={this.handleDoubleClick}
            ref={this.ref as any}
        >
            {contents}
        </td>;
    }
}

export default Editable;