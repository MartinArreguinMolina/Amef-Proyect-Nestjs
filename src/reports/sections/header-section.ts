import { Content } from "pdfmake/interfaces";
import { OrganizationalInformation } from "src/organizational-information/entities/organizational-information.entity";


export const getHeaderSection = (body: OrganizationalInformation): Content => {
    return {
        style: 'table',
        layout: 'noBorders',
        table: {
            headerRows: 1,
            widths: ["25%", "25%", "25%", "25%"],
            body: [
                [
                    {
                        stack: [
                            { text: `AMFE`, style: "headerTitle" },
                            { text: `Fecha AMFE (Orig): ${body.dateOfOrigin}`, style: `headerFieldLabel` },
                            { text: `Fecha target: ${body.targetDate}`, style: `headerFieldLabel` },
                        ],
                        alignment: "left",
                        margin: [10, 12, 0, 0],
                    },
                    {
                        stack: [
                            { text: `Número AMFE: ${body.amefId}`, style: "headerFieldLabel" },
                            { text: `Revisión: ${body.revision}`, style: "headerFieldLabel" },
                            { text: `Equipo: ${body.team.map(user => user.fullName.split(' ')[0])}`, style: "headerFieldLabel" },
                        ],
                    },
                    {
                        stack: [
                            { text: `Sistema: ${body.system ?? ''}`, style: `headerFieldLabel` },
                            { text: `Sub-sistema: ${body.subsystem ?? ''}`, style: `headerFieldLabel` },
                            { text: `Componente: ${body.component ?? ''}`, style: `headerFieldLabel` },
                        ],
                    },
                    {
                        stack: [
                            { text: `Código de proyecto: ${body.proyectCode}`, style: `headerFieldLabel` },
                            { text: `Departamento líder: ${body.leadingDepartment}`, style: `headerFieldLabel` },
                            { text: `Preparado por: ${body.preparedBy.fullName}`, style: `headerFieldLabel` },
                        ],
                    },
                ],
            ],
        },
    }
}