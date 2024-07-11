import { Injectable } from "@angular/core";
import { PatternValidator } from "@angular/forms";
import { index, range, sum } from "d3";
import { ImagePosition, Workbook } from "exceljs";
import * as fs from "file-saver";
import { type } from "os";
import { LamadasPorHoraI } from "../_model/llamadasPorHora";
import { LamadasPorHoraDatosI } from "../_model/llamadasPorHoraDatos";
import { Helpvoz } from "src/assets/img/Helpvoz";
import { powwilogo } from "src/assets/img/powwilogo";
import { LogoJaime } from "src/assets/img/logojaime";
import { LogoAsopagos } from "src/assets/img/LogoAsopagos";
import { LogoJtcNegro } from "src/assets/img/LogoJtcNegro";
import { LogoFaceldi } from "src/assets/img/LogoFaceldi";
import { LogoUniandes } from "src/assets/img/LogoUniandes";
import { Tmo } from "../_model/tmo";
import { LoginService } from "./login.service";
import { Usuario } from "../_model/usuario";

@Injectable({
  providedIn: "root",
})
export class ExcelServiceService {

  constructor ( 
    private loginService: LoginService
    ) {}
    
  private _worbook!: Workbook;

  //#################################### GRAFICO LLAMADAS POR HORA #######################################################

  async dowloadExcel(
    dataExcel: LamadasPorHoraI[],
    parametros: any
  ): Promise<void> {
    this._worbook = new Workbook();
    this._worbook.creator = "Helpvoz";
    await this.crearLLamadasHora(dataExcel, parametros);

    this._worbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      fs.saveAs(blob, "LlamadasPorHora.xlsx");
    });
  }

  private crearLLamadasHora(
    dataExcelTable: LamadasPorHoraI[],
    parametros: any
  ): void {
    const fechaini = parametros.fechaini;
    const fechafin = parametros.fechafin;
    const empresa = parametros.empresa;
    const usuario = parametros.usuario;
    const cf = dataExcelTable.length + 7; //cantidad filas que tiene el arreglo + las filas de info
    let logoempresa;
    const sheet = this._worbook.addWorksheet(`LLAMADAS POR HORA ${empresa}`);

    sheet.getCell("A3").value = `EMPRESA`;
    sheet.getCell("B3").value = `${empresa}`;
    sheet.getCell("A4").value = `FECHA INICIAL`;
    sheet.getCell("B4").value = `${fechaini}`;
    sheet.getCell("A5").value = "FECHA FINAL";
    sheet.getCell("B5").value = `${fechafin}`;

    ["A", "B", "C", "D"].forEach((columkey) => {
      sheet.getColumn(columkey).width = 30;
      sheet.getColumn(columkey).border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    sheet.mergeCells("A1:D1");
    sheet.mergeCells("E23:AH1");
    sheet.mergeCells("A200:AH24");
    sheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    sheet.getCell("A1").value = `REPORTE LLAMADAS POR HORA${empresa}`;
    sheet.mergeCells("A2:B2");
    sheet.getCell("A2").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    sheet.mergeCells("C5:D2");
    sheet.getCell("A2").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    //Traemos las imagenes que deben estar en base 64
    const logohelpvoz = this._worbook.addImage({
      base64: Helpvoz,
      extension: "png",
    });

    const logoidpowwi = this._worbook.addImage({
      base64: powwilogo,
      extension: "png",
    });

    const logoidjaime = this._worbook.addImage({
      base64: LogoJaime,
      extension: "png",
    });

    const logojtcnegro = this._worbook.addImage({
      base64: LogoJtcNegro,
      extension: "png",
    });

    const logoidasopagos = this._worbook.addImage({
      base64: LogoAsopagos,
      extension: "png",
    });

    const logofaceldi = this._worbook.addImage({
      base64: LogoFaceldi,
      extension: "png",
    });

    const logouniandes = this._worbook.addImage({
      base64: LogoUniandes,
      extension: "png",
    });

    //hacemos una variable para que el logo salga difente a cada empresa que lo descargue
    if (empresa == "FACELDI") {
      logoempresa = logofaceldi;
    } else if (empresa == "COMERCIAL_JTC") {
      logoempresa = logojtcnegro;
    } else if (empresa == "PAGOS_GDE" || empresa == "MUII") {
      logoempresa = logoidpowwi;
    } else if (empresa == "UNIANDES") {
      logoempresa = logouniandes;
    } else {
      logoempresa = logoidasopagos;
    }

    //Posicionamos las imagenes donde corresponda rango de derecha superior a izquierda inferior
    sheet.addImage(logohelpvoz, "A2:A2");
    sheet.addImage(logoempresa, "B2:B2");
    sheet.addImage(logojtcnegro, "D2:C5");
    sheet.addImage(logoidjaime, "D8:A17");
    sheet.columns.forEach((column) => {
      column.alignment = {
        vertical: "middle",
        horizontal: "center",
        shrinkToFit: true,
        wrapText: true,
      };
    });

    const encabezado = sheet.getRow(6);
    encabezado.values = ["HORA", "ATENDIDAS", "NO ATENDIDAS", "TOTAL"];
    encabezado.font = { bold: true, size: 12 };
    encabezado.height = 25;

    sheet.getRow(2).height = 60;

    encabezado.alignment = { horizontal: "center" };

    const rowsToInsert = sheet.getRows(7, dataExcelTable.length)!;
    for (let index = 0; index < rowsToInsert.length; index++) {
      const itemData = dataExcelTable[index];
      const row = rowsToInsert[index];

      row.values = [
        itemData.hora_llamada,
        itemData.answered,
        itemData.no_answer,
        itemData.totales,
      ];
    }

    ["A1", "A6", "B6", "C6", "D6", `A23`, `B23`, `C23`, `D23`].forEach(
      (celdas) => {
        sheet.getCell(celdas).fill = {
          type: "pattern",
          pattern: "darkVertical",
          fgColor: { argb: "b3cac7" },
        };
      }
    );

    //ultimas filas para calculos

    sheet.getCell("A23").value = "TOTALES:";
    sheet.getCell("B23").value = {
      formula: "B7+B8+B9+B10+B11+B12+B13+B14+B15+B16+B17+B18+B19+B20+B21+B22",
      date1904: false,
    };

    sheet.getCell("C23").value = {
      formula: "C7+C8+C9+C10+C11+C12+C13+C14+C15+C16+C17+C18+C19+C20+C21+C22",
      date1904: false,
    };

    sheet.getCell("D23").value = {
      formula: "D7+D8+D9+D10+D11+D12+D13+D14+D15+D16+D17+D18+D19+D20+D21+D22",
      date1904: false,
    };

    sheet.headerFooter.oddFooter =
      "Creado por HELPVOZ para JAIME TORRES C Y CIA";
  }

  //#################################### REPORTE TMO #######################################################

  //Recibimos la data que es el reporte y los parametros desde donde se origina el reporte
  async tmoExcel(dataExcel: Tmo[], parametros: any): Promise<void> {
    //Configuraciones generales del excel
    this._worbook = new Workbook();
    this._worbook.creator = "JaimeTorres";

    await this.crearTmo(dataExcel, parametros);

    this._worbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      fs.saveAs(blob, "reporteTmo.xlsx");
    });
  }

  //creamos un nuevo reporte con los datos de la tabla y los parametros
  private crearTmo(dataExcelTable: Tmo[], parametros: any): void {
    //sacamos las variables del objeto parametros
    const fechaini = parametros.fechaini;
    const fechafin = parametros.fechafin;
    const empresa = parametros.empresa;
    const usuario = parametros.usuario;
    const cf = dataExcelTable.length + 7; //cantidad filas que tiene el arreglo + las filas de info
    let logoempresa;

    //Creamos una nueva hoja
    const sheet = this._worbook.addWorksheet(`REPORTE TMO ${empresa}`);

    //Seteamos la informaciòn del reporte
    sheet.getCell("A3").value = `EMPRESA`;
    sheet.getCell("B3").value = `${empresa}`;
    sheet.getCell("A4").value = `FECHA INICIAL`;
    sheet.getCell("B4").value = `${fechaini}`;
    sheet.getCell("A5").value = "FECHA FINAL";
    sheet.getCell("B5").value = `${fechafin}`;

    //Estilos a las columnas
    ["A", "B", "C", "D", "E", "F"].forEach((columkey) => {
      //itera sobre las columnas que se indiquen
      sheet.getColumn(columkey).width = 30; //ancho de las columnas
      sheet.getColumn(columkey).border = {
        //Borde de las columnas
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    //Traemos las imagenes que deben estar en base 64
    const logohelpvoz = this._worbook.addImage({
      base64: Helpvoz,
      extension: "png",
    });

    const logoidpowwi = this._worbook.addImage({
      base64: powwilogo,
      extension: "png",
    });

    const logoidjaime = this._worbook.addImage({
      base64: LogoJaime,
      extension: "png",
    });

    const logojtcnegro = this._worbook.addImage({
      base64: LogoJtcNegro,
      extension: "png",
    });

    const logoidasopagos = this._worbook.addImage({
      base64: LogoAsopagos,
      extension: "png",
    });

    const logofaceldi = this._worbook.addImage({
      base64: LogoFaceldi,
      extension: "png",
    });

    const logouniandes = this._worbook.addImage({
      base64: LogoUniandes,
      extension: "png",
    });

    //hacemos una variable para que el logo salga difente a cada empresa que lo descargue
    if (empresa == "FACELDI") {
      logoempresa = logofaceldi;
    } else if (empresa == "COMERCIAL_JTC") {
      logoempresa = logojtcnegro;
    } else if (empresa == "PAGOS_GDE" || empresa == "MUII") {
      logoempresa = logoidpowwi;
    } else if (empresa == "UNIANDES") {
      logoempresa = logouniandes;
    } else {
      logoempresa = logoidasopagos;
    }

    //Posicionamos las imagenes donde corresponda rango de derecha superior a izquierda inferior
    sheet.addImage(logohelpvoz, "A2:A2");
    sheet.addImage(logoempresa, "B2:B2");
    sheet.addImage(logoidjaime, "F10:A27");
    sheet.addImage(logojtcnegro, "E2:D5");

    //Combinar celdas titulo
    sheet.mergeCells("A1:F1");
    //Darle estilos al titulo
    sheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    //Negrilla al titulo
    sheet.getCell("A1").font = { bold: true };
    //sheet.mergeCells(`A1000:F${cf + 1}`); //combina las celdas para dejar el espacio blanco abajo
    sheet.mergeCells("G1000:AH1"); //combina las celdas para dejar el espacio blanco a la derecha

    //Nombre visible del reporte
    sheet.getCell("A1").value = `REPORTE TMO ${empresa}`;
    sheet.mergeCells("C2:F5"); //combinar celdas para logo jtc negro

    sheet.columns.forEach((column) => {
      column.alignment = {
        vertical: "middle",
        horizontal: "center",
        shrinkToFit: true,
        wrapText: true,
      };
    });

    const encabezado = sheet.getRow(6); //Lo que va a tener el encabezado y desde que fila empieza
    encabezado.values = [
      "FECHA",
      "DOCUMENTO",
      "AGENTE",
      "LLAMADAS",
      "DURACIÓN",
      "PROMEDIO",
    ];
    encabezado.font = { bold: true, size: 12 };
    encabezado.height = 25;

    sheet.getRow(2).height = 50;

    encabezado.alignment = { horizontal: "center" };

    const rowsToInsert = sheet.getRows(7, dataExcelTable.length)!;
    for (let index = 0; index < rowsToInsert.length; index++) {
      const itemData = dataExcelTable[index];
      const row = rowsToInsert[index];

      row.values = [
        itemData.fecha,
        itemData.documento,
        itemData.agente,
        itemData.cantidadgrabaciones,
        itemData.duracionllamadas,
        itemData.segundos,
      ];
    }

    //Todas las casillas que tienen colorcito verde y son titulos o reultados
    [
      "A1",
      "A6",
      "B6",
      "C6",
      "D6",
      "E6",
      "F6",
      `A${cf}`,
      `A${cf}`,
      `B${cf}`,
      `C${cf}`,
      `D${cf}`,
      `E${cf}`,
      `F${cf}`,
    ].forEach((celdas) => {
      sheet.getCell(celdas).fill = {
        type: "pattern",
        pattern: "darkVertical",
        fgColor: { argb: "b3cac7" },
      };
    });

    /*Mido el arreglo, le sumo los 7 de info 
    const cantidadfilas = dataExcelTable.length + 7
    sheet.getCell(`D${cantidadfilas}`).value = "PRUEBA FIN DEL ARREGLO:";
    sheet.getCell(`E${cantidadfilas}`).value = "PRUEBA FIN DEL ARREGLO:";
    sheet.getCell(`F${cantidadfilas}`).value = "PRUEBA FIN DEL ARREGLO:";*/

    sheet.headerFooter.oddFooter =
      "Creado por HELPVOZ para JAIME TORRES C Y CIA";
  }
  //#################################### REPORTE SECRETARIA VIRTUAL #######################################################

  async repSecretariaVirtual(dataExcel: LamadasPorHoraI[]): Promise<void> {
    console.log("hola ");
    this.loginService.isEmpresa.subscribe((data) => {
      console.log(data);
    });
  }
}
