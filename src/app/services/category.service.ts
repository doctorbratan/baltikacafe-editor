import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as moment from 'moment';

import { environment } from "../../environments/environment";

export interface Category {
  _id?: string | any,
  name: 
  {
    ru: string | any,
    en?: string | any,
    md?: string | any
  },
  hide: boolean
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }


  changeOrder(categories: any[]): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/api/0101/category/changeOrder`, categories)
  }

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiURL}/api/0101/category`)
  }

  getById(_id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/api/0101/category/${_id}`);
  }

  create(category: any): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/api/0101/category`, category)
  }

  patch(category: any, _id: string): Observable<any> {
    return this.http.patch<any>(`${environment.apiURL}/api/0101/category/${_id}`, category)
  }

  delete(_id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiURL}/api/0101/category/${_id}`);
  }



}
