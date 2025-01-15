import { Injectable } from '@angular/core';
import { API_URI } from '../../../config/config';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Movimiento } from '../models/movimiento';
import { PaginatedResponse } from '../models/paginated-response';


@Injectable({
  providedIn: 'root'
})

export class MovimentService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get(`${API_URI}/movimientos`).pipe(
      map(response => response as any[])
    );
  }
  getMovientos(page: number = 1, limit: number = 10): Observable<PaginatedResponse<Movimiento>> {
    return this.http.get<PaginatedResponse<Movimiento>>(`${API_URI}/movimientos/?page=${page}&limit=${limit}`);
  }

  get(id: any): Observable<Movimiento> {
    return this.http.get<Movimiento>(`${API_URI}/movimiento/${id}`);
  }

  create(data: Movimiento): Observable<any> {
    return this.http.post(`${API_URI}/movimiento`, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${API_URI}/movimiento/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${API_URI}/movimiento/${id}`);
  }
  buscarPorRangoDeFecha(startDate: string, endDate: string): Observable<any> {
    let params = new HttpParams().set('startDate', startDate).set('endDate', endDate);
    return this.http.get<any>(`${API_URI}/bydate?${params}`);
  }

  buscarPorRangoDeFechaByProduct(startDate: string, endDate: string, productCode: string): Observable<any> {
    let params = new HttpParams().set('startDate', startDate).set('endDate', endDate).set('productCode', productCode);
    return this.http.get<any>(`${API_URI}/bydateproduct?${params}`);
  }

  buscarPorRangoDeFechaByService(startDate: string, endDate: string, serviceId: string): Observable<any> {
    let params = new HttpParams().set('startDate', startDate).set('endDate', endDate).set('serviceId', serviceId);
    return this.http.get<any>(`${API_URI}/bydateservice?${params}`);
  }

  downloadPdf(id: any) {
    return this.http.get(`${API_URI}/generate-pdf/${id}`, {
      responseType: 'blob', // Importante: recibimos el PDF como Blob
    });
  }


}
