export class CobroMonedas {
    identificacion: string;
    codigoCobro: string;
    monto: string;
    correo: string;
}
export class CobroConCodigo {
    id: string;
    identificacion: string;
    autorizacion: string;
    nombres: string;
    apellidos: string;
    fechaCobro: string;
    codigoPreautorizacion: string;
    montoTotalFactura: number;
    montoSupermonedas: number;
    codigoCobro: string;
}
export class GenerarCobro {
    user_id: string;
    empresa_id: string;
    codigoCobro: string;
    montoTotalFactura: number;
    montoSupermonedas: number;
    numeroFactura?: number;
    nombres: string;
    apellidos: string;
    identificacion: string;
    whatsapp: string;
}
