import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GenerateRequestDTO} from "../dto/GenerateRequestDTO";
import {Observable} from "rxjs/index";
import {GenerateResponseDTO} from "../dto/GenerateResponseDTO";

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  private baseUrl = 'https://umlpro-api.herokuapp.com/generate/';

  //heroku URL = https://umlpro-api.herokuapp.com/generate/
  //local URL = http://localhost:8070/generate/

  constructor(private http: HttpClient) { }

  generateClient(generateReqDTO: GenerateRequestDTO): Observable<any> {

    var url = this.baseUrl;

    return this.http.post(url, generateReqDTO, {observe: 'response'});
  }

  getFileUrl(generateResponse: GenerateResponseDTO): Observable<any> {
    return this.http.post(this.baseUrl + "zip", generateResponse, {observe: 'response'});
  }

  runHerokuService(): Observable<any> {
    return this.http.get(this.baseUrl + 'runService', {observe: 'response'});
  }
}
