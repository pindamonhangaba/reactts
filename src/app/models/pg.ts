export enum FKActions {
  Restrict = "RESTRICT",
  NoAction = "NO ACTION",
  Cascade = "CASCADE",
  SetNull = "SET NULL",
  SetDefault = "SET DEFAULT",
}

export enum FKMatch {
  Full = "MATCH FULL",
  Partial = "MATCH PARTIAL",
  Simple = "MATCH SIMPLE",
}

export type Unique = {
  name: string;
  columns: Array<string>;
  tablespace?: string;
  defferrable: boolean;
  deferred: boolean;
  comment?: string;
};

export type Column = {
  name: string;
  type: string;
  length?: number;
  decimals?: number;
  nonNull: boolean;
  primary?: number;
  default?: string;
  dimensions?: number;
  comment?: string;
};

export type ForeignKey = {
  name: string;
  columns: Array<string>;
  schemaRef?: string;
  tableRef: string;
  columnsRef: Array<string>;
  onDelete?: FKActions;
  match?: FKMatch;
  defferrable: boolean;
  deferred: boolean;
  comment?: string;
};

export type Table = {
  name: string;
  columns: Array<Column>;
  references?: Array<ForeignKey>;
  uniques?: Array<Unique>;
  comment?: string;
  schemaName?: string;
  tablespace?: string;
  unlogged?: boolean;
  owner?: string;
  inheritsTable?: string;
  hasOids?: boolean;
  fillFactor?: number;
};
