import React, { FormEvent } from "react";
import { connect } from "react-redux";
import { actions } from "app/ducks/pgeditor";
import { ThunkDispatch } from "redux-thunk";

const Editor = ({ createTable }: { createTable: (n: string) => void }) => {
  return (
    <div>
      <form
        onSubmit={(e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          createTable(data.get("name") as string);
        }}
      >
        <input type="text" name="name" />
        <button type="submit">Create table</button>
      </form>
    </div>
  );
};

export default connect(
  () => ({}),
  (dispatch: ThunkDispatch<any, any, any>) => ({
    createTable: (n: string) => dispatch(actions.createTable(n))
  })
)(Editor);
