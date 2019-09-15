import ForeignKeysForm from "app/components/form/table/column/ForeignKeys";
import { getAvailableTables } from "app/ducks/editor";
import { connect } from "react-redux";

export const ForeignKeysSection = connect(
  getAvailableTables,
  () => ({})
)(ForeignKeysForm);
