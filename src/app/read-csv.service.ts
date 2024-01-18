import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReadCSVService {

  constructor(private http: HttpClient) { }

  getCSVData() {
    return this.http.get('assets/sample_117d.spmeta.tsv', { responseType: 'text' });
  }
}
