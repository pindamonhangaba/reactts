import React from "react";
import Editable from "app/components/react-aria-table/elements/editable";
import Selectable from "app/components/react-aria-table/elements/selectable";
import Checkable from "app/components/react-aria-table/elements/checkable";
import * as DB from "app/models/pg";
import { MultiSelectable, MultiSelectableWithOptions } from "./cells";

const validTypes = [
  "varchar",
  "time",
  "timestamp",
  "date",
  "int8",
  "int2",
  "jsonb",
  "json",
];
const typeOptions = validTypes.map((o) => ({ value: o, label: o }));
const fkOnOptions = [
  DB.FKActions.Cascade,
  DB.FKActions.NoAction,
  DB.FKActions.Restrict,
  DB.FKActions.SetDefault,
  DB.FKActions.SetNull,
].map((o) => ({ value: o, label: o }));
const matchOptions = [
  DB.FKMatch.Full,
  DB.FKMatch.Partial,
  DB.FKMatch.Simple,
].map((o) => ({ value: o, label: o }));

export class ColumnTypesSel extends React.Component<any> {
  ref = React.createRef();
  focus() {
    this.ref.current && (this.ref.current as any).focus();
  }
  render() {
    return (
      <Selectable
        ref={this.ref as any}
        {...this.props}
        options={typeOptions}
        component={this.props.component}
      />
    );
  }
}

export interface Column {
  key: string;
  label: string;
  renderer?: any;
  cellProps?: any;
}

export const ColumnEditorModel = {
  columns: [
    { key: "name", label: "Name", renderer: Editable },
    {
      key: "type",
      label: "Type",
      renderer: Selectable,
      cellProps: { options: typeOptions },
    },
    { key: "length", label: "Length", renderer: Editable },
    { key: "decimals", label: "Decimals", renderer: Editable },
    { key: "nonNull", label: "Non null", renderer: Checkable },
    { key: "pk", label: "PK", renderer: Checkable },
  ] as Array<Column>,
  typeDefaults: {
    default: [
      { value: "NULL", label: "NULL" },
      { value: "", label: "Empty string" },
    ],
  },
};

export const FKEditorModel = {
  columns: [
    { key: "name", label: "Name", renderer: Editable },
    {
      key: "columns",
      label: "Columns",
      renderer: MultiSelectable,
      cellProps: { options: [], multiple: true },
    },
    { key: "schemaRef", label: "Schema", renderer: Editable },
    {
      key: "tableRef",
      label: "Referenced table",
      renderer: MultiSelectable,
      cellProps: { options: [] },
    },
    {
      key: "columnsRef",
      label: "Referenced columns",
      renderer: MultiSelectableWithOptions,
      cellProps: { options: () => [], multiple: true },
    },
    {
      key: "onUpdate",
      label: "On update",
      renderer: Selectable,
      cellProps: { options: fkOnOptions },
    },
    {
      key: "onDelete",
      label: "On delete",
      renderer: Selectable,
      cellProps: { options: fkOnOptions },
    },
  ] as Array<Column>,
  typeDefaults: {
    match: matchOptions,
  },
};
