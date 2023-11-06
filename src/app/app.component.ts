import { Component, OnInit } from '@angular/core';
import { BreedService } from './shared/services/breed.service';
import { Observable, map, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  breeds: string[] = [];

  selectedBreed: string = '';

  relatedBreeds: string[] = [];

  searchControl = new FormControl('');

  filteredOptions: Observable<string[]> | null = null;

  imagesOfBreed: string[] = [];

  accordianItemOpened: number = 1;

  constructor(
    private _breedService: BreedService,
  ) {}

  ngOnInit(): void {
    this._getBreeds();

    this.filteredOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  private _getBreeds(): void {
    this._breedService.getBreeds().subscribe((dogs: string[]) => {
      this.breeds = dogs;
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.breeds.filter((dog: string) =>
      dog.toLowerCase().includes(filterValue)
    );
  }

  selectBreed(breed: string): void {
    this._breedService
      .getImagesOfBreed(breed)
      .subscribe((imagesOfBreed: string[]) => {
        this.selectedBreed = breed;
        this.imagesOfBreed = imagesOfBreed;
        this.relatedBreeds = this._getRelatedBreeds();
      });
  }

  private _getRelatedBreeds(): string[] {
    const relatedBreeds: string[] = [];
    const breedSplit = this.selectedBreed.split(' ');
    if (breedSplit.length > 0) {
      this.breeds.forEach((breed: string) => {
        if (breed.startsWith(breedSplit[0]) && breed !== this.selectedBreed) {
          relatedBreeds.push(breed);
        }
      });
    }
    return relatedBreeds;
  }

  toggleAccordianItem(item: number): void {
    this.accordianItemOpened = item;
  }
}
