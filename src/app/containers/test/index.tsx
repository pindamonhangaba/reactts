import React from "react";
import { connect } from "react-redux";
import { actions } from "app/ducks/hen";

class Test extends React.Component<any> {
  render() {
    return (
      <div>
        <button
          onClick={() =>
            this.props.addItem(`Item ${this.props.items.length + 1}`)
          }
        >
          Add item
        </button>
        {this.props.items.map((i) => i)}
      </div>
    );
  }
}

export default connect(
  (state: any) => {
    console.log("--> maptoprosp", state);

    return {
      items: state.hen.items,
    };
  },
  (dispatch) => ({
    addItem: (item: any) => dispatch(actions.addItem(item)),
  })
)(Test);
