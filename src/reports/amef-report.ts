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

const ZWSP = "\u200B";
function insertSoftWraps(s: string, minLen = 20, chunkLen = 12): string {
  return s.replace(/\S{20,}/g, (token) =>
    token.replace(new RegExp(`.{1,${chunkLen}}`, "g"), (m) => (m ? m + ZWSP : m)),
  );
}
const fmt = (v: any) => {
  const s = v === null || v === undefined ? "" : String(v);
  return insertSoftWraps(s);
};
const fmtDate = (v: any) => (v ? String(v) : "");
function row(texts: any[], opts: Partial<TableCell>[] = [], zebra?: string): TableCell[] {
  return texts.map((t, i) => {
    const cell: TableCell = { text: fmt(t), style: "td", noWrap: false } as TableCell;
    if (opts[i]) Object.assign(cell as any, opts[i] as any);
    if (zebra) (cell as any).fillColor = zebra;
    return cell;
  });
}

function buildAnalysisHeaderTable(): { header: TableCell[]; widths: (number | string)[] } {
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
  return { header, widths };
}

function buildActionsHeaderTable(): { header: TableCell[]; widths: (number | string)[] } {
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
  return { header, widths };
}

function buildSingleAnalysisTable(a: any, idx: number): ContentTable {
  const { header, widths } = buildAnalysisHeaderTable();
  const zebra = "#F8FAFC";
  const analysisRow = row(
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
      {},
      {},
      { noWrap: false },
      { alignment: "center" },
      { noWrap: false },
      { alignment: "center" },
      { noWrap: false },
      { alignment: "center" },
      { alignment: "center", bold: true },
    ],
    zebra,
  );

  return {
    margin: [0, idx === 0 ? 8 : 12, 0, 4],
    layout: layoutCompact,
    table: {
      headerRows: 1,
      widths,
      body: [header, analysisRow],
    },
  };
}

function buildActionsForAnalysis(a: any): Content {
  const acts = a.actions ?? [];
  const { header, widths } = buildActionsHeaderTable();

  if (!acts.length) {
    return {
      margin: [0, 2, 0, 0],
      text: "Sin acciones registradas para este análisis.",
      italics: true,
      color: "#64748b",
    };
  }

  const rows: TableCell[][] = acts.map((act: any, i: number) => {
    const zebra = i % 2 ? "#F8FAFC" : undefined;
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
        { noWrap: false },
        {},
        { alignment: "center" },
        { noWrap: false },
        { alignment: "center" },
        { alignment: "center" },
        { alignment: "center" },
        { alignment: "center" },
        { alignment: "center", bold: true },
      ],
      zebra,
    );
  });

  return {
    margin: [0, 4, 0, 0],
    layout: layoutCompact,
    table: { headerRows: 1, widths, body: [header, ...rows] },
  };
}

function buildAnalysisBlock(a: any, idx: number): Content[] {
  return [
    { text: `Análisis #${idx + 1}`, style: "sectionTitle", margin: [0, idx === 0 ? 8 : 12, 0, 4] },
    buildSingleAnalysisTable(a, idx),
    { text: "Acciones", style: "sectionTitle", margin: [0, 6, 0, 2] },
    buildActionsForAnalysis(a),
  ];
}

export const getAmefReport = (body: OrganizationalInformation): TDocumentDefinitions => {
  const analyses = body?.analysis ?? [];

  const content: Content[] = [
    {
      text: 'Equipo',
      bold: true,
      fontSize: 12,
      color: "#002B5B",
      margin: [0,0,0,10]
    },
    {
      table: {
        headerRows: 1,
        widths: ['20%', '20%', '20%'],
        body: [
          [
            { text: 'Nombre', bold: true, color: '#ffffff', fillColor: "#002B5B", margin: [8, 6, 8, 6] },
            { text: 'Email', bold: true, color: '#ffffff', fillColor: "#002B5B", margin: [8, 6, 8, 6] },
            { text: 'Departamento', bold: true, color: '#ffffff', fillColor: "#002B5B", margin: [8, 6, 8, 6] },
          ],

          ...(body.team).map(u => ([
            { text: u?.fullName ?? '—', margin: [8, 4, 8, 4] },
            { text: u?.email ?? '—', margin: [8, 4, 8, 4] },
            { text: u?.departaments?.[0]?.department ?? '—', margin: [8, 4, 8, 4] },
          ])),
        ],
      },

      layout: {
        hLineWidth: () => 0.2,
        vLineWidth: () => 0.2,
        paddingLeft: () => 0.2,
        paddingRight: () => 0.2,
        paddingTop: () => 0.2,
        paddingBottom: () => 0.2,
      },
    },

    { text: "Resumen de análisis", style: "sectionTitle", margin: [0, 8, 0, 4] },
    ...analyses.flatMap((a, idx) => buildAnalysisBlock(a, idx)),
  ];

  return {
    pageOrientation: "landscape",
    pageMargins: [20, 100, 20, 100],
    header: () => getHeaderSection(body),
    footer: (currentPage, pageCount) => getFooterSection(currentPage, pageCount),
    content,
    styles,
    defaultStyle,
  };
};
