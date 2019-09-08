import React from "react";
import AriaModal from "react-aria-modal";
import { noselectCSS } from "app/styles";

declare namespace Modal {
  export interface Props {
    onClose?: (e?: React.SyntheticEvent) => void;
    initialFocusId?: string;
    getApplicationNode?: () => HTMLElement | null;
    children?: React.ReactNode;
    titleText: string;
    open?: boolean;
  }
}

//d9d9d9

export default function Modal({
  children,
  initialFocusId,
  titleText,
  getApplicationNode = () => null,
  onClose,
}: Modal.Props) {
  return (
    <AriaModal
      titleText={titleText}
      onExit={onClose}
      initialFocus={initialFocusId}
      getApplicationNode={getApplicationNode}
      underlayStyle={{ paddingTop: "2em" }}
      underlayColor="rgba(0,0,0,0)"
    >
      <div
        style={{
          boxShadow: "0px 0px 5px 1px rgba(0,0,0,0.15)",
          border: "1px solid #707070",
        }}
      >
        <header
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            backgroundColor: "#fff",
            ...noselectCSS,
          }}
        >
          <h4 style={{ flex: 10, margin: 5 }}>{titleText}</h4>
          <button
            style={{
              flexGrow: 0,
              flexBasis: 1,
              backgroundColor: "transparent",
              border: "none",
            }}
            onClick={onClose}
          >
            ✖
          </button>
        </header>
        <div style={{ backgroundColor: "#f0f0f0", margin: 0 }}>{children}</div>
      </div>
    </AriaModal>
  );
}
