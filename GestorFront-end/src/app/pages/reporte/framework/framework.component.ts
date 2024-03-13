import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-framework',
  templateUrl: './framework.component.html',
  styleUrls: ['./framework.component.scss']
})
export class FrameworkComponent implements OnInit {


  campaignOne!: UntypedFormGroup;
  campaignTwo!: UntypedFormGroup;
  fechaInicio : Date = new Date;
  fechaFin : Date = new Date;
  form!: UntypedFormGroup;

  constructor() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new UntypedFormGroup({
      start: new UntypedFormControl(new Date(year, month, 13)),
      end: new UntypedFormControl(new Date(year, month, 16)),

    });

      this.campaignTwo = new UntypedFormGroup({
        start: new UntypedFormControl(new Date(year, month, 15)),
        end: new UntypedFormControl(new Date(year, month, 19)),
      });

  }
   

  ngOnInit(): void {
  }

}
