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

    componentDidMount() {
        this.shouldFocus();
    }

    componentDidUpdate() {
        this.shouldFocus();
    }

    shouldFocus() {
        const { focused } = this.props;
        if (this.ref.current && focused) {
            (this.ref.current as any).focus();
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