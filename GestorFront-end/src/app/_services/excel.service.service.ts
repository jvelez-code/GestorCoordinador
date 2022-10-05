import { Injectable } from '@angular/core';
import { PatternValidator } from '@angular/forms';
import { index, range, sum } from 'd3';
import { ImagePosition, Workbook} from 'exceljs';
import * as fs from 'file-saver';
import { type } from 'os';
import { LamadasPorHoraI } from '../_model/llamadasPorHora';
import { LamadasPorHoraDatosI } from '../_model/llamadasPorHoraDatos';
import { Helpvoz } from 'src/assets/img/Helpvoz';
import { powwilogo } from 'src/assets/img/powwilogo';
import { LogoJaime } from 'src/assets/img/logojaime';
import { Tmo } from '../_model/tmo';

@Injectable({
  providedIn: 'root'
})

export class ExcelServiceService {

  private _worbook !: Workbook; 



  
  //#################################### REPORTE LLAMADAS POR HORA #######################################################


  async dowloadExcel(dataExcel: LamadasPorHoraI[]): Promise<void>{ 

    this._worbook= new Workbook();
    this._worbook.creator = 'PORRAS_PRUEBAS';
    await this.crearLLamadasHora(dataExcel);
    
    this._worbook.xlsx.writeBuffer().then((data)=>{
      const blob =new Blob([data]);
      fs.saveAs(blob,'LlamadasPorHora.xlsx')                              
    });   
    }

    

    private crearLLamadasHora(dataExcelTable: LamadasPorHoraI[]) : void {  
      const sheet = this._worbook.addWorksheet('LLAMADAS');
      ['A','B','C','D'].forEach((columkey)=>{             
        sheet.getColumn(columkey).width=30;
        sheet.getColumn(columkey).border= {top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}};

      });

      sheet.mergeCells('A1:D1'); 
      sheet.mergeCells('E23:AH1'); 
      sheet.mergeCells('A200:AH24'); 
      sheet.getCell('A1').alignment = {horizontal: 'center', vertical: 'middle'};
      sheet.getCell('A1').value = 'REPORTE LLAMADAS POR HORA'
      sheet.mergeCells('A2:B2'); 
      sheet.getCell('A2').alignment = {horizontal: 'center', vertical: 'middle'};
      sheet.mergeCells('C2:D2'); 
      sheet.getCell('A2').alignment = {horizontal: 'center', vertical: 'middle'};
  
 const logohelpvoz = this._worbook.addImage({
  base64:Helpvoz ,
  extension:'png'
 })

 const logoidpowwi = this._worbook.addImage({
  base64:powwilogo,
  extension:'png'
 })

 const logoidjaime = this._worbook.addImage({
  base64:LogoJaime,
  extension:'png'
 })


 sheet.addImage(logohelpvoz,'B2:A2')// por rango
 sheet.addImage(logoidpowwi,'D2:C2' ) // por rango
 sheet.addImage(logoidjaime,'D7:A18' ) // por rango



      sheet.columns.forEach((column)=>{ 
        column.alignment={ vertical: 'middle',  
        horizontal :'center',
        shrinkToFit :true, 
        wrapText: true}  
            });

      const encabezado =sheet.getRow(3)
      encabezado.values =[
        'HORA',
        'ATENDIDAS',
        'NO ATENDIDAS',
        'TOTAL'
      ];
      encabezado.font = { bold: true, size: 12 } 
      encabezado.height= 25;
      

      sheet.getRow(2).height = 60;
      
      encabezado.alignment= {horizontal:'center'}
      
      const rowsToInsert = sheet.getRows(4,dataExcelTable.length)!;
      for(let index =0; index < rowsToInsert.length; index ++){
        const itemData= dataExcelTable[index];
        const row = rowsToInsert[index];

        row.values =[  
           
           itemData.hora_llamada, 
           itemData.answered,
           itemData.no_answer,
           itemData.totales
        ];

      }
      ['A1','A3','B3','C3','D3','A23','B23','C23','D23' ].forEach((celdas)=>{  
        sheet.getCell(celdas).fill = {
          type: 'pattern',
          pattern: 'darkVertical',
          fgColor: {argb: 'b3cac7'},
        }

      });
      
      sheet.getCell('A23').value = ('TOTALES:') ;
      sheet.getCell('B23').value = { formula: 'B4+B5+B6+B7+B8+B9+B10+B11+B12+B13+B14+B15+B16+B17+B18+B19+B20+B21+B22', date1904: false };
      sheet.getCell('C23').value = { formula: 'C4+C5+C6+C7+C8+C9+C10+C11+C12+C13+C14+C15+C16+C17+C18+C19+C20+C21+C22', date1904: false };
      sheet.getCell('D23').value = { formula: 'D4+D5+D6+D7+D8+D9+D10+D11+D12+D13+D14+D15+D16+D17+D18+D19+D20+D21+D22', date1904: false };
     

      sheet.headerFooter.oddFooter = "Creado por HELPVOZ para JAIME TORRES C Y CIA";
  }

  //#################################### REPORTE TMO #######################################################


  async tmoExcel(dataExcel: Tmo[]): Promise<void>{ 

    this._worbook= new Workbook();
    this._worbook.creator = 'JaimeTorres';
    await this.crearTmo(dataExcel);
    
    this._worbook.xlsx.writeBuffer().then((data)=>{
      const blob =new Blob([data]);
      fs.saveAs(blob,'reporteTmo.xlsx')                              
    });   
    }

    

    private crearTmo(dataExcelTable: Tmo[]) : void {  
      const sheet = this._worbook.addWorksheet('LLAMADAS');
      ['A','B','C','D'].forEach((columkey)=>{             
        sheet.getColumn(columkey).width=30;
        sheet.getColumn(columkey).border= {top: {style: 'thin'},
        left: {style: 'thin'},
        bottom: {style: 'thin'},
        right: {style: 'thin'}};

      });

      sheet.mergeCells('A1:D1'); 
      sheet.mergeCells('E23:AH1'); 
      sheet.mergeCells('A200:AH24'); 
      sheet.getCell('A1').alignment = {horizontal: 'center', vertical: 'middle'};
      sheet.getCell('A1').value = 'REPORTE TMO'
      sheet.mergeCells('A2:B2'); 
      sheet.getCell('A2').alignment = {horizontal: 'center', vertical: 'middle'};
      sheet.mergeCells('C2:D2'); 
      sheet.getCell('A2').alignment = {horizontal: 'center', vertical: 'middle'};
  
 const logohelpvoz = this._worbook.addImage({
  base64:Helpvoz ,
  extension:'png'
 })

 const logoidpowwi = this._worbook.addImage({
  base64:powwilogo,
  extension:'png'
 })

 const logoidjaime = this._worbook.addImage({
  base64:LogoJaime,
  extension:'png'
 })


 sheet.addImage(logohelpvoz,'B2:A2')// por rango
 sheet.addImage(logoidpowwi,'D2:C2' ) // por rango
 sheet.addImage(logoidjaime,'D7:A18' ) // por rango



      sheet.columns.forEach((column)=>{ 
        column.alignment={ vertical: 'middle',  
        horizontal :'center',
        shrinkToFit :true, 
        wrapText: true}  
            });

      const encabezado =sheet.getRow(3)
      encabezado.values =[
        'FECHA',
        'DOCUMENTO',
        'AGENTE',
        'DURACIÒN'
      ];
      encabezado.font = { bold: true, size: 12 } 
      encabezado.height= 25;
      

      sheet.getRow(2).height = 60;
      
      encabezado.alignment= {horizontal:'center'}
      
      const rowsToInsert = sheet.getRows(4,dataExcelTable.length)!;
      for(let index =0; index < rowsToInsert.length; index ++){
        const itemData= dataExcelTable[index];
        const row = rowsToInsert[index];

        row.values =[  
           
           itemData.fecha, 
           itemData.documento,
           itemData.agente,
           itemData.duracionllamadas
        ];

      }
      ['A1','A3','B3','C3','D3','A23','B23','C23','D23' ].forEach((celdas)=>{  
        sheet.getCell(celdas).fill = {
          type: 'pattern',
          pattern: 'darkVertical',
          fgColor: {argb: 'b3cac7'},
        }

      });

      sheet.headerFooter.oddFooter = "Creado por HELPVOZ para JAIME TORRES C Y CIA";
  }


  constructor() { }
}