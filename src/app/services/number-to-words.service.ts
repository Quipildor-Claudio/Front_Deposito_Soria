import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NumberToWordsService {
  private UNIDADES = [
    '',
    'UN',
    'DOS',
    'TRES',
    'CUATRO',
    'CINCO',
    'SEIS',
    'SIETE',
    'OCHO',
    'NUEVE',
    'DIEZ',
    'ONCE',
    'DOCE',
    'TRECE',
    'CATORCE',
    'QUINCE',
    'DIECISÉIS',
    'DIECISIETE',
    'DIECIOCHO',
    'DIECINUEVE',
    'VEINTE',
  ];

  private DECENAS = [
    '',
    '',
    'VEINTI',
    'TREINTA',
    'CUARENTA',
    'CINCUENTA',
    'SESENTA',
    'SETENTA',
    'OCHENTA',
    'NOVENTA',
  ];

  private CENTENAS = [
    '',
    'CIEN',
    'DOSCIENTOS',
    'TRESCIENTOS',
    'CUATROCIENTOS',
    'QUINIENTOS',
    'SEISCIENTOS',
    'SETECIENTOS',
    'OCHOCIENTOS',
    'NOVECIENTOS',
  ];

  convertNumberToWords(num: number): string {
    if (num === 0) {
      return 'CERO PESOS';
    }

    const parts = num.toString().split('.');
    const integerPart = parseInt(parts[0], 10);

    const words = this.convertIntegerToWords(integerPart);
    return `${words} PESOS`.trim();
  }

  private convertIntegerToWords(num: number): string {
    if (num === 0) return '';
    if (num < 21) return this.UNIDADES[num];
    if (num < 100) {
      const decena = Math.floor(num / 10);
      const unidad = num % 10;
      return `${this.DECENAS[decena]}${unidad !== 0 ? ' Y ' + this.UNIDADES[unidad] : ''}`;
    }
    if (num < 1000) {
      const centena = Math.floor(num / 100);
      const resto = num % 100;
      return `${this.CENTENAS[centena]} ${this.convertIntegerToWords(resto)}`.trim();
    }
    if (num < 1000000) {
      const miles = Math.floor(num / 1000);
      const resto = num % 1000;
      const milesText = miles === 1 ? 'MIL' : `${this.convertIntegerToWords(miles)} MIL`;
      return `${milesText} ${this.convertIntegerToWords(resto)}`.trim();
    }
    if (num < 1000000000000) {
      const millones = Math.floor(num / 1000000);
      const resto = num % 1000000;
      const millonesText =
        millones === 1 ? 'UN MILLÓN' : `${this.convertIntegerToWords(millones)} MILLONES`;
      return `${millonesText} ${this.convertIntegerToWords(resto)}`.trim();
    }
    return 'Número demasiado grande';
  }
}
