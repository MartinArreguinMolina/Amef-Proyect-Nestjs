// src/amef-report/getAmefReport.ts
import {
  StyleDictionary,
  TDocumentDefinitions,
  Content,
  ContentTable,
  TableCell,
  TableLayout,
} from "pdfmake/interfaces";
import { getHeaderSection } from "./sections/header-section";
import { OrganizationalInformation } from "src/organizational-information/entities/organizational-information.entity";
import { getFooterSection } from "./sections/footer-section";

const styles: StyleDictionary = {
  headerTitle: { fontSize: 18, color: "#FFFFFF", bold: true },
  headerSubtitle: { fontSize: 9, color: "#FFFFFF", margin: [0, 2, 0, 0], bold: true },
  headerFieldLabel: { fontSize: 8, color: "#FFFFFF", margin: [0, 10, 0, 0], bold: true },
  sectionTitle: { fontSize: 12, color: "#002B5B", bold: true },

  table: { fillColor: "#002B5B" },

  th: { bold: true, color: "#FFFFFF", alignment: "center", fontSize: 8, lineHeight: 1.05 },
  td: { fontSize: 7.5, lineHeight: 1.1, color: "#0f172a" },
};

const defaultStyle = { font: "Roboto", fontSize: 8, color: "#000" };

const layoutCompact: TableLayout = {
  defaultBorder: true,
  hLineWidth: () => 0.4,
  vLineWidth: () => 0.4,
  hLineColor: () => "#DDE3EA",
  vLineColor: () => "#DDE3EA",
  paddingLeft: () => 4,
  paddingRight: () => 4,
  paddingTop: () => 2,
  paddingBottom: () => 2,
};

/* ==== helpers de formato con “soft wrap” para palabras largas ==== */
const ZWSP = "\u200B"; // zero-width space
// Inserta ZWSP cada chunkLen caracteres en tokens sin espacios cuando son largos
function insertSoftWraps(s: string, minLen = 20, chunkLen = 12): string {
  // Reemplaza cada secuencia larga sin espacios
  return s.replace(/\S{20,}/g, (token) =>
    token.replace(new RegExp(`.{1,${chunkLen}}`, "g"), (m) => (m ? m + ZWSP : m)),
  );
}

const fmt = (v: any) => {
  const s = v === null || v === undefined ? "" : String(v);
  return insertSoftWraps(s);
};
const fmtDate = (v: any) => (v ? String(v) : "");

/* ==== crea una fila; por defecto todas las celdas permiten wrap ==== */
function row(texts: any[], opts: Partial<TableCell>[] = [], zebra?: string): TableCell[] {
  return texts.map((t, i) => {
    const cell: TableCell = { text: fmt(t), style: "td", noWrap: false } as TableCell; // 👈 wrap habilitado
    if (opts[i]) Object.assign(cell as any, opts[i] as any);
    if (zebra) (cell as any).fillColor = zebra;
    return cell;
  });
}

function buildAnalysisTable(body: OrganizationalInformation): ContentTable {
  const headerFill = "#002B5B";
  const widths = [70, 70, "*", 34, "*", 34, "*", 36, 40];

  const header: TableCell[] = [
    { text: "systemFunction", style: "th", fillColor: headerFill },
    { text: "failureMode", style: "th", fillColor: headerFill },
    { text: "failureEffects", style: "th", fillColor: headerFill },
    { text: "severity", style: "th", fillColor: headerFill },
    { text: "failureCauses", style: "th", fillColor: headerFill },
    { text: "occurrence", style: "th", fillColor: headerFill },
    { text: "currentControls", style: "th", fillColor: headerFill },
    { text: "detection", style: "th", fillColor: headerFill },
    { text: "npr", style: "th", fillColor: headerFill },
  ];

  const rows: TableCell[][] = (body.analysis ?? []).map((a, i) => {
    const zebra = i % 2 ? "#F8FAFC" : undefined;
    return row(
      [
        a.systemFunction,
        a.failureMode,
        a.failureEffects,
        a.severity,
        a.failureCauses,
        a.occurrence,
        a.currentControls,
        a.detection,
        a.npr,
      ],
      [
        {}, // systemFunction
        {}, // failureMode
        { noWrap: false }, // effects (larga)
        { alignment: "center" }, // sev
        { noWrap: false }, // causes (larga)
        { alignment: "center" }, // occ
        { noWrap: false }, // controls (larga)
        { alignment: "center" }, // det
        { alignment: "center", bold: true }, // npr
      ],
      zebra,
    );
  });

  return {
    margin: [0, 8, 0, 6],
    layout: layoutCompact,
    table: { headerRows: 1, widths, body: [header, ...rows] },
  };
}

function buildActionsTable(body: OrganizationalInformation): ContentTable {
  const headerFill = "#002B5B";
  const widths = ["*", 90, 70, "*", 70, 42, 48, 48, 50];

  const header: TableCell[] = [
    { text: "recommendedAction", style: "th", fillColor: headerFill },
    { text: "responsible", style: "th", fillColor: headerFill },
    { text: "targetDate", style: "th", fillColor: headerFill },
    { text: "implementedAction", style: "th", fillColor: headerFill },
    { text: "completionDate", style: "th", fillColor: headerFill },
    { text: "newSeverity", style: "th", fillColor: headerFill },
    { text: "newOccurrence", style: "th", fillColor: headerFill },
    { text: "newDetection", style: "th", fillColor: headerFill },
    { text: "newNpr", style: "th", fillColor: headerFill },
  ];

  const rows: TableCell[][] = (body.analysis ?? []).flatMap((a, idx) => {
    const acts = a.actions ?? [];
    return acts.map((act, i) => {
      const zebra = (idx + i) % 2 ? "#F8FAFC" : undefined;
      return row(
        [
          act.recommendedAction,
          act.responsible,
          fmtDate(act.targetDate),
          act.implementedAction,
          fmtDate(act.completionDate),
          act.newSeverity,
          act.newOccurrence,
          act.newDetection,
          act.newNpr,
        ],
        [
          { noWrap: false }, // rec
          {}, // responsible
          { alignment: "center" }, // target
          { noWrap: false }, // implemented
          { alignment: "center" }, // completion
          { alignment: "center" }, // new sev
          { alignment: "center" }, // new occ
          { alignment: "center" }, // new det
          { alignment: "center", bold: true }, // new npr
        ],
        zebra,
      );
    });
  });

  return {
    margin: [0, 8, 0, 0],
    layout: layoutCompact,
    table: { headerRows: 1, widths, body: [header, ...rows] },
  };
}

export const getAmefReport = (body: OrganizationalInformation): TDocumentDefinitions => ({
  pageOrientation: "landscape",
  pageMargins: [20, 100, 20, 100],
  header: () => getHeaderSection(body),
  footer: (currentPage, pageCount) => getFooterSection(currentPage, pageCount),
  content: [
    { text: "Resumen de análisis", style: "sectionTitle", margin: [0, 8, 0, 4] },
    buildAnalysisTable(body),
    { text: "Acciones", style: "sectionTitle", margin: [0, 10, 0, 4] },
    buildActionsTable(body),
  ],
  styles,
  defaultStyle,
});
