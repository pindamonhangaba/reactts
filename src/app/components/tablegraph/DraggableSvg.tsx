import React, { PureComponent } from "react";

export default class DraggableSVG extends PureComponent<
  any,
  { x: number; y: number }
> {
  state = {
    x: 0,
    y: 0,
  };
  coords: { x: number; y: number } = { x: 0, y: 0 };

  positionChanged = () => {
    const { onPositionChange } = this.props;

    onPositionChange && onPositionChange(this.state);
  };

  handleMouseDown = (e: any) => {
    this.coords = {
      x: e.pageX,
      y: e.pageY,
    };
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseleave", this.handleCheckMouseLeaveDocument);

    const { beforePositionChange } = this.props;
    beforePositionChange && beforePositionChange(this.state);
  };

  handleCheckMouseLeaveDocument = (e: MouseEvent) => {
    if (
      e.clientY <= 0 ||
      e.clientX <= 0 ||
      (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)
    ) {
      this.handleMouseUp();
    }
  };

  handleMouseUp = () => {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener(
      "mouseleave",
      this.handleCheckMouseLeaveDocument
    );
    this.coords = { x: 0, y: 0 };
  };

  handleMouseMove = (e: any) => {
    const xDiff = this.coords.x - e.pageX;
    const yDiff = this.coords.y - e.pageY;

    this.coords.x = e.pageX;
    this.coords.y = e.pageY;

    this.setState(
      {
        x: this.state.x - xDiff,
        y: this.state.y - yDiff,
      },
      () => this.positionChanged()
    );
  };

  render() {
    const { x, y } = this.state;
    const { height, width, children, ...otherProps } = this.props;

    return (
      <svg
        {...otherProps}
        height={height}
        width={width}
        x={x}
        y={y}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        //onMouseOut={this.handleMouseUp}
      >
        {children}
      </svg>
    );
  }
}
