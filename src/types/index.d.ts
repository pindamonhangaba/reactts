

declare module 'react-aria-modal' {
    import { Component, SyntheticEvent, CSSProperties } from 'react';

    interface Props {
        getApplicationNode: () => HTMLElement | null;
        initialFocus?: string;
        underlayProps?: any;
        underlayStyle?: CSSProperties;
        dialogId?: string;
        underlayClickExits?: boolean;
        escapeExits?: boolean;
        underlayColor?: string;
        includeDefaultStyles?: boolean;
        focusTrapPaused?: boolean;
        scrollDisabled?: boolean;
        onExit?: (e?: SyntheticEvent) => void;
    }
    interface AltText extends Props {
        titleText: string;
        titleId?: string;
    }
    interface AltId extends Props {
        titleText?: string;
        titleId: string;
    }
    export default class Modal extends Component<AltText | AltId> { }
}

declare module 'react-aria-tabpanel' {
    import { Component } from 'react';

    export class Tab extends Component<any> { }
    export class TabList extends Component<any> { }
    export class TabPanel extends Component<any> { }
    export class Wrapper extends Component<any> { }
}