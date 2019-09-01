import React from "react";

class Header extends React.Component<any> {
  render() {
    const { children, className, style } = this.props;

    return (
      <div
        className={className}
        style={{
          background: "#c3c3c3",
          color: "#535353",
          height: 50,
          display: "flex",
          alignItems: "center",
          ...style,
        }}
      >
        {children}
      </div>
    );
  }
}

export default Header;
