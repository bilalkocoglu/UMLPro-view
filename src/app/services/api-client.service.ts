import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GenerateRequestDTO} from "../dto/GenerateRequestDTO";
import {Observable} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  private baseUrl = 'http://localhost:8070/';

  constructor(private http: HttpClient) { }

  generateClient(generateReqDTO: GenerateRequestDTO): Observable<any> {

    var subUrl = 'generate';

    var url = this.baseUrl + subUrl;

    return this.http.post(url, generateReqDTO, {observe: 'response'});
  }
}
