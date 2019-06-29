import React from 'react';

export declare namespace Focusable {
    export interface Props {
        [k: string]: any
        focused?: boolean
        component: any
    }
}

class Focusable extends React.Component<Focusable.Props> {
    ref = React.createRef()
    getName() {
        return this.props.index + '--' + this.props.colKey;
    }

    componentDidMount() {
        this.shouldFocus();
    }

    focus(e?: any) {
        if (this.ref.current) {
            (this.ref.current as any).focus();
        }
    }

    shouldFocus() {
        const { focused } = this.props;
        if (focused) {
            this.focus();
        }
    }

    render() {
        const { component, focused, children, ...otherProps } = this.props;

        return React.createElement(component, {
            ref: this.ref,
            focused,
            tabIndex: focused ? 0 : -1,
            ...otherProps,
        }, children);
    }
}

export default Focusable;