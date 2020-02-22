import * as React from "react";

export interface TextFileInputProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  onChange?: (t: string) => void;
}

export class TextFileInput extends React.Component<TextFileInputProps, {}> {
  handleLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const f = e.target.files?.[0];

    reader.onloadend = ((_) => {
      return () => {
        this.props?.onChange?.(reader.result as string);
      };
    })(f);
    reader.readAsText(f as Blob);
    this.props.inputProps?.onChange?.(e);
  };

  render() {
    const { children, inputProps, labelProps, onChange, ...props } = this.props;
    return (
      <button {...props}>
        <label {...labelProps}>
          {children}
          <input
            type="file"
            style={{ display: "none" }}
            {...inputProps}
            onChange={this.handleLoad}
          />
        </label>
      </button>
    );
  }
}
