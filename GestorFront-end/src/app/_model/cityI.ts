export interface CityI{
    fecha?:string;
    fechafin?:any;
    reproducciendo ?: Boolean;
  }

  export const listas:Array<CityI>=[
    {fecha:"hola", fechafin:"assets/sonidos/aves.wav", reproducciendo:true},
    {fecha:"Mundo", fechafin:"assets/sonidos/aves.wav", reproducciendo:true},
  ]