import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Breeds } from '../models/breeds.model';
import { Observable, map } from 'rxjs';
import { BreedsResponse } from '../models/breeds-response.model';

@Injectable({
  providedIn: 'root',
})
export class BreedService {
  private dogUrl = environment.dogUrl;

  constructor(private http: HttpClient) {}

  getBreeds(): Observable<string[]> {
    return this.http
      .get<BreedsResponse<Breeds>>(`${this.dogUrl}/breeds/list/all`)
      .pipe(
        map((breedsResponse: BreedsResponse<Breeds>) =>
          this._transformToBreeds(breedsResponse.message)
        )
      );
  }

  private _transformToBreeds(dogBreeds: { [key: string]: string[] }): string[] {
    let dogs: string[] = [];
    for (const key in dogBreeds) {
      if (dogBreeds[key].length > 0) {
        dogs = dogs.concat(
          dogBreeds[key].map((subBreed: string) => `${key} ${subBreed}`)
        );
      } else {
        dogs.push(key);
      }
    }
    return dogs;
  }

  getImagesOfBreed(breed: string): Observable<string[]> {
    const breedName = breed.split(' ').join('/');
    return this.http
      .get<BreedsResponse<string[]>>(`${this.dogUrl}/breed/${breedName}/images/random/3`)
      .pipe(
        map(
          (breedsResponse: BreedsResponse<string[]>) => breedsResponse.message
        )
      );
  }
}
