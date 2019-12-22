import React from "react";

import Selectable from "app/components/react-aria-table/elements/selectable";

export class MultiSelectable extends React.Component {
  ref = React.createRef();
  focus() {
    if (this.ref.current) {
      (this.ref.current as any).focus();
    }
  }

  render() {
    return (
      <Selectable
        ref={this.ref as any}
        multiple={true}
        {...(this.props as any)}
      />
    );
  }
}

export interface OptionsFunc {
  options: (i: number) => Array<{ value: string; label: string }>;
  index: number;
}

export class MultiSelectableWithOptions extends React.Component<OptionsFunc> {
  ref = React.createRef();
  focus() {
    if (this.ref.current) {
      (this.ref.current as any).focus();
    }
  }

  render() {
    const { options, index, ...props } = this.props;
    return (
      <Selectable
        ref={this.ref as any}
        multiple={true}
        {...(props as any)}
        options={options(index)}
      />
    );
  }
}
