import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Dogs } from '../models/dogs.model';
import { Observable, map } from 'rxjs';
import { DogsResponse } from '../models/dogs-response.model';

@Injectable({
  providedIn: 'root',
})
export class DogService {
  private dogUrl = environment.dogUrl;

  constructor(private http: HttpClient) {}

  getDogs(): Observable<Dogs> {
    return this.http
      .get<DogsResponse>(`${this.dogUrl}/list/all`)
      .pipe(map((dogsResponse: DogsResponse) => dogsResponse.message));
  }
}
