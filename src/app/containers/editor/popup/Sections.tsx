import ForeignKeysForm from "app/components/form/table/column/ForeignKeys";
import { getAvailabeTables } from "app/ducks/editor";
import { connect } from "react-redux";

export const ForeignKeysSection = connect(
  getAvailabeTables,
  () => ({})
)(ForeignKeysForm) as any;
