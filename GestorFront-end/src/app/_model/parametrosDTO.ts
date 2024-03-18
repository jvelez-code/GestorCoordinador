export class ParametrosDTO {

    tipoDoc?: string;
	loginAgente?: string;
	idUsuario?: number;
	nroDocumento?: string;
	idCliente?: number;
	empresa?: string;
	idEmpresa?: number;
	idTipoCampana?: number;
	idEstadoPadre?: number;
	tipoLlamada?: number;
	fechaInicial?: string;
	fechaFinal?: string;
	idDetalleComer?: number;
	cicloVida?: number;
	idGestion?: number;
	
	
	constructor(tipoDoc: string, loginAgente: string, idUsuario:number, nroDocumento: string, idCliente: number, 
		empresa: string, idEmpresa: number, idTipoCampana: number, idEstadoPadre: number, tipoLlamada: number,
		fechaInicial: string, fechaFinal: string , idDetalleComer: number , cicloVida: number ,idGestion: number ) {
            
		this.tipoDoc = tipoDoc;
		this.loginAgente = loginAgente;
		this.idUsuario = idUsuario;
		this.nroDocumento = nroDocumento;
		this.idCliente = idCliente;
		this.empresa = empresa;
		this.idEmpresa = idEmpresa;
		this.idTipoCampana = idTipoCampana;
		this.idEstadoPadre = idEstadoPadre;
		this.tipoLlamada = tipoLlamada;
		this.fechaInicial = fechaInicial;
		this.fechaFinal = fechaFinal;
		this.idDetalleComer = idDetalleComer;
		this.cicloVida = cicloVida;
		this.idGestion = idGestion;
	}
}

let parametrosDTO : ParametrosDTO;