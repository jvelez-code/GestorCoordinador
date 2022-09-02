import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { multi } from '../../_model/data'

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.component.html',
  styleUrls: ['./grafico.component.css']
})
export class GraficoComponent {

  longText = `LLamadas que Ingresan a la cola de llamadas pero no son atendidas.`;
  
  constructor(public route: ActivatedRoute) { }

  ngOnInit(): void {
  }

}
