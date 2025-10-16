// src/reports/amef-excel.ts
import * as ExcelJS from 'exceljs';
import { OrganizationalInformation } from 'src/organizational-information/entities/organizational-information.entity';

export async function buildAmefExcel(org: OrganizationalInformation): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'AMEF System';
  wb.created = new Date();
  const NAVY = 'FF002B5B';      
  const NAVY_ACCENT = 'FF153E75'; 
  const WHITE = 'FFFFFFFF';
  const BAND = 'FFF8FAFC';      
  const BORDER = 'FFDDE3EA';   
  const TEXT = 'FF0F172A';    

  const s1 = wb.addWorksheet('Resumen', {
    properties: { defaultRowHeight: 18 },
    pageSetup: { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 },
  });

  s1.mergeCells(1, 1, 1, 6);
  const title = s1.getCell(1, 1);
  title.value = 'AMFE';
  title.font = { size: 18, bold: true, color: { argb: WHITE } };
  title.alignment = { vertical: 'middle', horizontal: 'left' };
  title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: NAVY } };
  s1.getRow(1).height = 28;

  s1.columns = [{ width: 28 }, { width: 48 }, { width: 3 }, { width: 28 }, { width: 48 }, { width: 3 }];

  const kvLeft: [string, any][] = [
    ['Fecha AMFE (Orig)', safe(org.dateOfOrigin)],
    ['Fecha target', safe(org.targetDate)],
    ['Sistema', safe(org.system)],
    ['Sub-sistema', safe(org.subsystem)],
    ['Componente', safe(org.component)],
    ['Preparado por', org?.preparedBy?.fullName ?? ''],
  ];
  const kvRight: [string, any][] = [
    ['Número AMFE', safe(org.amefId)],
    ['Revisión', safe(org.revision)],
    ['Equipo', safe(org.team)],
    ['Código de proyecto', safe(org.proyectCode)],
    ['Departamento líder', safe(org.leadingDepartment)],
    ['Generado', new Date().toLocaleString()],
  ];

  let r = 3;
  for (let i = 0; i < Math.max(kvLeft.length, kvRight.length); i++, r++) {
    const [k1, v1] = kvLeft[i] ?? ['', ''];
    const [k2, v2] = kvRight[i] ?? ['', ''];
    setKV(s1, r, 1, k1, v1);
    setKV(s1, r, 4, k2, v2);
  }

  r += 1;
  s1.mergeCells(r, 1, r, 6);
  s1.getCell(r, 1).border = { bottom: { style: 'thin', color: { argb: NAVY_ACCENT } } };

  const s2 = wb.addWorksheet('Analyses', { properties: { defaultRowHeight: 18 } });
  s2.views = [{ state: 'frozen', ySplit: 1 }];

  const analysisColumns = [
    { header: 'analysisId', key: 'analysisId', width: 12, align: 'center' as const },
    { header: 'systemFunction', key: 'systemFunction', width: 28 },
    { header: 'failureMode', key: 'failureMode', width: 28 },
    { header: 'failureEffects', key: 'failureEffects', width: 42 },
    { header: 'severity', key: 'severity', width: 10, align: 'center' as const },
    { header: 'failureCauses', key: 'failureCauses', width: 42 },
    { header: 'occurrence', key: 'occurrence', width: 12, align: 'center' as const },
    { header: 'currentControls', key: 'currentControls', width: 42 },
    { header: 'detection', key: 'detection', width: 12, align: 'center' as const },
    { header: 'npr', key: 'npr', width: 12, align: 'center' as const, bold: true },
  ];
  s2.columns = analysisColumns.map(c => ({ header: c.header, key: c.key, width: c.width }));

  const analyses = org.analysis ?? [];
  s2.addRows(
    analyses.map((a, i) => ({
      analysisId: i + 1,
      systemFunction: a.systemFunction ?? '',
      failureMode: a.failureMode ?? '',
      failureEffects: a.failureEffects ?? '',
      severity: a.severity ?? '',
      failureCauses: a.failureCauses ?? '',
      occurrence: a.occurrence ?? '',
      currentControls: a.currentControls ?? '',
      detection: a.detection ?? '',
      npr: a.npr ?? '',
    })),
  );

  styleTableSheet(s2, analysisColumns.length, NAVY, WHITE, BAND, BORDER, analysisColumns);

  const s3 = wb.addWorksheet('Actions', { properties: { defaultRowHeight: 18 } });
  s3.views = [{ state: 'frozen', ySplit: 1 }];

  const actionColumns = [
    { header: 'analysisId', key: 'analysisId', width: 12, align: 'center' as const },
    { header: 'recommendedAction', key: 'recommendedAction', width: 46 },
    { header: 'responsible', key: 'responsible', width: 24 },
    { header: 'targetDate', key: 'targetDate', width: 16, fmt: 'yyyy-mm-dd', align: 'center' as const },
    { header: 'implementedAction', key: 'implementedAction', width: 46 },
    { header: 'completionDate', key: 'completionDate', width: 16, fmt: 'yyyy-mm-dd', align: 'center' as const },
    { header: 'newSeverity', key: 'newSeverity', width: 12, align: 'center' as const },
    { header: 'newOccurrence', key: 'newOccurrence', width: 14, align: 'center' as const },
    { header: 'newDetection', key: 'newDetection', width: 14, align: 'center' as const },
    { header: 'newNpr', key: 'newNpr', width: 12, align: 'center' as const, bold: true },
  ];
  s3.columns = actionColumns.map(c => ({ header: c.header, key: c.key, width: c.width }));

  const rowsActions: any[] = [];
  analyses.forEach((a, i) => {
    (a.actions ?? []).forEach(act => {
      rowsActions.push({
        analysisId: i + 1,
        recommendedAction: act.recommendedAction ?? '',
        responsible: act.responsible ?? '',
        targetDate: maybeDate(act.targetDate),
        implementedAction: act.implementedAction ?? '',
        completionDate: maybeDate(act.completionDate),
        newSeverity: act.newSeverity ?? '',
        newOccurrence: act.newOccurrence ?? '',
        newDetection: act.newDetection ?? '',
        newNpr: act.newNpr ?? '',
      });
    });
  });
  s3.addRows(rowsActions);

  styleTableSheet(s3, actionColumns.length, NAVY, WHITE, BAND, BORDER, actionColumns);

  const ab = await wb.xlsx.writeBuffer();
  return Buffer.from(ab as ArrayBuffer);

  function safe(v: any) { return v == null ? '' : String(v); }
  function maybeDate(v: any) {
    if (!v) return '';
    const d = new Date(v);
    return isNaN(+d) ? String(v) : d;
  }

  function setKV(ws: ExcelJS.Worksheet, row: number, col: number, k: string, v: any) {
    const ck = ws.getCell(row, col);
    const cv = ws.getCell(row, col + 1);
    ck.value = k; ck.font = { bold: true, color: { argb: TEXT } };
    cv.value = v; cv.font = { color: { argb: TEXT } };
  }

  function styleTableSheet(
    ws: ExcelJS.Worksheet,
    numCols: number,
    navy: string,
    white: string,
    band: string,
    border: string,
    colMeta: Array<{ align?: 'center' | 'left' | 'right'; fmt?: string; bold?: boolean }>
  ) {
    const header = ws.getRow(1);
    for (let c = 1; c <= numCols; c++) {
      const cell = header.getCell(c);
      cell.font = { bold: true, color: { argb: white } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: navy } };
      cell.border = {
        top: { style: 'thin', color: { argb: border } },
        bottom: { style: 'thin', color: { argb: border } },
        left: { style: 'thin', color: { argb: border } },
        right: { style: 'thin', color: { argb: border } },
      };
    }
    header.height = 22;

    ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: numCols } };
    ws.views = [{ state: 'frozen', ySplit: 1 }];

    for (let r = 2; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      const zebra = r % 2 === 0;
      for (let c = 1; c <= numCols; c++) {
        const cell = row.getCell(c);
        if (zebra) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: band } };
        }

        cell.border = {
          top: { style: 'thin', color: { argb: border } },
          bottom: { style: 'thin', color: { argb: border } },
          left: { style: 'thin', color: { argb: border } },
          right: { style: 'thin', color: { argb: border } },
        };
        const meta = colMeta[c - 1] || {};
        const h = meta.align ?? 'left';
        cell.alignment = { vertical: 'top', horizontal: h as any, wrapText: true };
        if (meta.fmt) cell.numFmt = meta.fmt;
        if (meta.bold) cell.font = { ...(cell.font || {}), bold: true };
      }
      row.height = 18;
    }
  }
}
