import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs'
import * as moment from 'moment';

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/api/0101/position`)
  }

  getById(_id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/api/0101/position/${_id}`);
  }

  getByCategory(_id: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/api/0101/position/category/${_id}`);
  } 

  create(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/api/0101/position`, data)
  }

  patch(position: any, _id: string): Observable<any> {

    const fd = new FormData()

    if (position.imageUpload) {
      fd.append('image', position.imageUpload, moment().format() )
    }

    fd.append("position", JSON.stringify(position))

    return this.http.patch<any>(`${environment.apiURL}/api/0101/position/${_id}`, fd)
  }

  delete(_id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiURL}/api/0101/position/${_id}`);
  }

  changeOrder(positions: any[]): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/api/0101/position/changeOrder`, positions)
  }
  
}
