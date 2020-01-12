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
          .join(",\r\n")}

    )
    ${!t.hasOids ? "WITHOUT OIDS;" : ""}

    COMMENT ON TABLE ${q(t.name)} IS '';
    ${t.columns.map(
      (c) =>
        `COMMENT ON COLUMN  ${q(t.name)}.${q(c.name)} IS '${c.comment ?? ""};'
`
    )}
    `;
}

function q(s: string) {
  return `"${s}"`;
}
