import { Content } from "pdfmake/interfaces";

export const getFooterSection = (currentPage: number, pageCount: number): Content => {
  return {
    margin: [20, 80],
    columns: [
      { text: `Generado: ${new Date().toLocaleDateString()}`, style: "footerLeft" },
      { text: `Página ${currentPage} de ${pageCount}`, alignment: "right", style: "footerRight" },
    ],
  };
};
