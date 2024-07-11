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
import { ReportesGeneral } from "../_model/reportesgeneral";

@Injectable({
  providedIn: 'root'
})
export class ExelDetalladoGestionesService {

  constructor() { }
  private _worbook!: Workbook;

  //#################################### REPORTE DETALLADO DE GESTIONES #######################################################

  //Recibimos la data que es el reporte y los parametros desde donde se origina el reporte
  async detalladoGestion(dataExcel: ReportesGeneral[], parametros: any): Promise<void> {
    //Configuraciones generales del excel
    this._worbook = new Workbook();
    this._worbook.creator = "JaimeTorres";

    await this.crearDetalladoGestiones(dataExcel, parametros);

    this._worbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data]);
      fs.saveAs(blob, "Reporte_detallado_de_gestiones.xlsx");
    });
  }

  //creamos un nuevo reporte con los datos de la tabla y los parametros
  private crearDetalladoGestiones(dataExcelTable: ReportesGeneral[], parametros: any): void {
    //sacamos las variables del objeto parametros
    const fechaini = parametros.fechaini;
    const fechafin = parametros.fechafin;
    const empresa = parametros.empresa;
    const usuario = parametros.usuario;
    const cf = dataExcelTable.length + 7; //cantidad filas que tiene el arreglo + las filas de info
    let logoempresa;

    //Creamos una nueva hoja
    const sheet = this._worbook.addWorksheet(`REPORTE DETALLADO DE GESTIÓN ${empresa}`);

    //Seteamos la informaciòn del reporte
    sheet.getCell("A3").value = `EMPRESA`;
    sheet.getCell("B3").value = `${empresa}`;
    sheet.getCell("A4").value = `FECHA INICIAL`;
    sheet.getCell("B4").value = `${fechaini}`;
    sheet.getCell("A5").value = "FECHA FINAL";
    sheet.getCell("B5").value = `${fechafin}`;

    //Estilos a las columnas
    ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K","L","M","N","O","P"].forEach((columkey) => {
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
    sheet.addImage(logoidjaime, "F7:A16");
    sheet.addImage(logojtcnegro, "F2:D5");

    //Combinar celdas titulo
    sheet.mergeCells("A1:P1");
    //Darle estilos al titulo
    sheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };
    //Negrilla al titulo
    sheet.getCell("A1").font = { bold: true };
    //sheet.mergeCells(`A10000:P${cf + 1}`); //combina las celdas para dejar el espacio blanco abajo
    sheet.mergeCells("Q10000:BD1"); //combina las celdas para dejar el espacio blanco a la derecha

    //Nombre visible del reporte
    sheet.getCell("A1").value = `REPORTE DETALLADO DE GESTIÓN ${empresa}`;
    sheet.mergeCells("C2:P5"); //combinar celdas para logo jtc negro

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
      "CAMPAÑA",
      "TIPO",
      "NÚMERO",
      "RAZÓN SOCIAL",
      "GESTIÓN",
      "CONTACTO",
      "TELÉFONO1",
      "TELÉFONO2",
      "TELÉFONO3",
      "USUARIO",
      "EMPRESA",
      "ESTADO",
      "SUB ESTADO",
      "FECHA",
      "OBSERVACIÓN",
      "EMPLEADOS",
    ];
    encabezado.font = { bold: true, size: 12 };
    encabezado.height = 25;

    sheet.getRow(2).height = 50;

    const startRow = 7;
    const endRow = cf +1;
    for (let i = startRow; i <= endRow; i++) {
      sheet.getRow(i).height = 40;
    }
   
    
 

    encabezado.alignment = { horizontal: "center" };

    const rowsToInsert = sheet.getRows(7, dataExcelTable.length)!;
    for (let index = 0; index < rowsToInsert.length; index++) {
      const itemData = dataExcelTable[index];
      const row = rowsToInsert[index];
     

      row.values = [
        itemData.nombrecampana,
        itemData.tipodocaportante,
        itemData.numdocaporta,
        itemData.razonsocial,
        itemData.tipogestion,
        itemData.nombrecontacto,
        itemData.telefono1,
        itemData.telefono2,
        itemData.telefono3,
        itemData.usuario,
        itemData.empresa,
        itemData.padretipificacion,
        itemData.tipicacion,
        itemData.fechagestion,
        itemData.observacion,
        itemData.empleados,
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
      "G6",
      "H6",
      "I6",
      "J6",
      "K6",
      "L6",
      "M6",
      "N6",
      "O6",
      "P6",
      `A${cf}`,
      `B${cf}`,
      `C${cf}`,
      `D${cf}`,
      `E${cf}`,
      `F${cf}`,
      `G${cf}`,
      `H${cf}`,
      `I${cf}`,
      `J${cf}`,
      `K${cf}`,
      `L${cf}`,
      `M${cf}`,
      `N${cf}`,
      `O${cf}`,
      `P${cf}`, 
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
}
