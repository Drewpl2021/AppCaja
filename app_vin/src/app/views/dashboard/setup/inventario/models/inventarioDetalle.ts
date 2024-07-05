import {Inventario} from "./inventario";

export class InventarioDetalle {

    id?: number;
    codigo_transaccion?: string;
    entrada?: number;
    salida?: number;
    costo_total?: number;
    precio_de_compra?: number;
    productoId?: number;
    inventario_id?: Inventario;
}
