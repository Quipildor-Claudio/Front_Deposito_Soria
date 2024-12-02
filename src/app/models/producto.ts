import { FormControl } from "@angular/forms";
import { Marca } from "./marca";
import { Tipo } from "./tipo";
import { UnidadMedida } from "./unidad-medida";

export class Producto {
    _id?: string; // Equivalente a _id en MongoDB, puede ser opcional
    name: string; // Nombre del producto, requerido
    price?: number; // Precio del producto, opcional
    stock: number; // Stock del producto, requerido con valor predeterminado de 0
    observation?: string; // Observación, opcional con valor predeterminado de ''
    min?: number;
    marca?: Marca; // ID de la marca (referencia)
    tipo?: Tipo; // ID del tipo (referencia)
    unidad?: UnidadMedida; // ID de la unidad de medida (referencia)
    createdAt?: string; // Fecha de creación, generada automáticamente
    updatedAt?: string; // Fecha de actualización, generada automáticamente
    cantidad?: FormControl; 
    codigo?:string;
}

