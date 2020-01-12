import { Table } from "app/models/pg";

function renderLenDec(s: string, len?: number, dec?: number): string {
  const ld = (l: number, d: number) => (l ? `(${l}${d ? "," + d : ""})` : "");
  const l = (l: number, d: number) => (l ? `(${l})` : "");
  const n = (l: number, d: number) => "";
  return (
    {
      bit: l,
      char: l,
      decimal: ld,
      interval: l,
      time: l,
      timetz: l,
      timestamp: l,
      timestamptz: l,
      varbit: l,
      varchar: l,
    }[s] ?? n
  )(len, dec);
}

function renderDim(i?: number) {
  return Array(i ?? 0).fill("[]");
}

export function tableToSql(t: Table) {
  const pks = t.columns.filter((c) => c.primary);
  const hasPK = pks.length > 0;
  const fks = t.references ?? [];
  const hasFK = fks.length > 0;
  return `
CREATE TABLE ${q(t.name)} (
    ${t.columns
      .map(
        (c) =>
          `${q(c.name)} ${q(c.type)}${renderLenDec(
            c.name,
            c.length,
            c.decimals
          )} ${c.nonNull ? "NOT NULL" : ""} ${
            c.default ? `DEFAULT ${c.default}` : ""
          }${renderDim(c.dimensions)}`
      )
      .concat(hasPK ? [`PRIMARY KEY (${pks.map((p) => q(p.name))})`] : [])
      .concat(
        hasFK
          ? fks.map(
              (f) =>
                `${
                  f.name ? `CONSTRAINT ${q(f.name)}` : ""
                } FOREIGN KEY (${f.columns
                  .map((fc) => q(fc))
                  .join(",")}) REFERENCES ${
                  f.schemaRef ? q(f.schemaRef) + "." : ""
                }${q(f.tableRef)} (${f.columnsRef
                  .map((fc) => q(fc))
                  .join(",")}) ${f.match ? "MATCH FULL" : ""} ${
                  f.onDelete ? `ON DELETE ${f.onDelete}` : ""
                } ${f.onUpdate ? `ON UPDATE ${f.onUpdate}` : ""} ${
                  f.deferrable ? "DEFERRABLE" : ""
                } ${f.deferred ? "INITIALLY DEFERRED" : ""}`
            )
          : []
      )
      .join(",\r\n\t")}
)
${!t.hasOids ? "WITHOUT OIDS;" : ""}

${t.comment ? `COMMENT ON TABLE ${q(t.name)} IS '${t.comment}';` : ""}
${t.columns
  .map((c) =>
    c.comment
      ? `COMMENT ON COLUMN  ${q(t.name)}.${q(c.name)} IS '${c.comment}';
`
      : ""
  )
  .filter((f) => !!f)
  .join("\r\n\t")}
`;
}

function q(s: string) {
  return `"${s}"`;
}
