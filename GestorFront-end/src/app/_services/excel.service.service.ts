import { Injectable } from '@angular/core';
import { PatternValidator } from '@angular/forms';
import { faBold } from '@fortawesome/free-solid-svg-icons';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { type } from 'os';
import { LamadasPorHoraI } from '../_model/llamadasPorHora';
import { LamadasPorHoraDatosI } from '../_model/llamadasPorHoraDatos';

@Injectable({
  providedIn: 'root'
})
export class ExcelServiceService {

  private _worbook !: Workbook;

  async dowloadExcel(dataExcel: LamadasPorHoraI[]): Promise<void>{

    this._worbook= new Workbook();

    this._worbook.creator = 'jvelez';

    await this.crearLLamadasHora(dataExcel);
    

    this._worbook.xlsx.writeBuffer().then((data)=>{
      const blob =new Blob([data]);
      fs.saveAs(blob,'LlmadasPoHora.xls')
    });   
    }
    
    private crearLLamadasHora(dataExcelTable: LamadasPorHoraI[]) : void {

      const sheet = this._worbook.addWorksheet('Datos');
      
      // sheet.getColumn('B').width= 18;
      // sheet.getColumn('C').width= 18;
      // sheet.getColumn('D').width= 18;
      // sheet.getColumn('E').width= 18;
      
      ['B','C','D','E'].forEach((columkey)=>{
        sheet.getColumn(columkey).width=18;
        // sheet.getColumn(columkey).fill = {
        //   type: 'pattern',
        //   pattern: 'solid',
        //   fgColor:{argb: 'fff5ee'}
        // }

      });

      // for (let index = 0; index<2 ;index ++)[
      //   `A${index + 1 }`,
      //   `B${index + 1 }`,
      //   `C${index + 1 }`,
      //   `D${index + 1 }`,
      //   `E${index + 1 }`
      // ].forEach((key)=> {
      //   sheet.getCell(key).fill ={
      //      type: 'pattern',
      //      pattern: 'solid',
      //      fgColor:{argb: 'fff5ee'}
      //   }

      // });

      for (let index = 0; index<2 ;index ++)[
        1,
        2,
        3
      ].forEach((index)=> {
        sheet.getRow(index).fill ={
           type: 'pattern',
           pattern: 'solid',
           fgColor:{argb: '000000'}
        }
      });

      sheet.getCell('A1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor:{argb: 'ffffff'}

      }

    

      sheet.columns.forEach((column)=>{
        column.alignment={ vertical: 'middle', wrapText: true}
            });

      const encabezado =sheet.getRow(1)
      encabezado.values =[
        '',
        'HORA',
        'ATENDIDAS',
        'NO ATENDIDAS',
        'TOTAL'
      ];
      encabezado.font = { bold: true, size: 12}
      encabezado.height= 20;
      encabezado.alignment

      //INSERTAMOS VALORES EN LA COLUMNA
      const rowsToInsert = sheet.getRows(2,dataExcelTable.length)!;
      for(let index =0; index < rowsToInsert.length; index ++){
        const itemData= dataExcelTable[index];
        const row = rowsToInsert[index];

        row.values =[
           '',
           itemData.hora_llamada,
           itemData.answered,
           itemData.no_answer,
           itemData.totales
        ];


      }
      

  }

  constructor() { }
}
