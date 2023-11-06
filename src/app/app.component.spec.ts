import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { BreedService } from './shared/services/breed.service';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(async () => {
    const breedServiceSpy = jasmine.createSpyObj('BreedService', [
      'getBreeds',
      'getImagesOfBreed',
    ]);
    breedServiceSpy.getBreeds.and.returnValue(
      of(['bulldog french', 'cavapoo', 'bulldog boston'])
    );
    breedServiceSpy.getImagesOfBreed.and.returnValue(
      of([
        'https://images.dog.ceo/breeds/hound-english/n02089973_3265.jpg',
        'https://images.dog.ceo/breeds/hound-ibizan/n02091244_1252.jpg',
        'https://images.dog.ceo/breeds/hound-walker/n02089867_4001.jpg',
      ])
    );

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        MatAutocompleteModule,
        ReactiveFormsModule,
        MatInputModule,
        MatCardModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [
        {
          provide: BreedService,
          useValue: breedServiceSpy,
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should get breeds from the beginning', () => {
    spyOn<any>(component, '_getBreeds');
    component.ngOnInit();
    expect(component['_getBreeds']).toHaveBeenCalled();
  });

  it('should get breeds', () => {
    component['_getBreeds']();

    expect(component['_breedService'].getBreeds).toHaveBeenCalled();
    expect(component.breeds.length).toBe(3);
  });

  it('should filter correctly', () => {
    spyOn<any>(component, '_getBreeds');

    component.breeds = ['bulldog french', 'cavapoo', 'bulldog boston'];
    const result = component['_filter']('bulldog');

    expect(result.length).toBe(2);
    expect(result[0]).toBe('bulldog french');
    expect(result[1]).toBe('bulldog boston');
  });

  it('should select breed, images and related breeds', () => {
    spyOn<any>(component, '_getRelatedBreeds').and.returnValue([
      'bulldog french',
      'bulldog boston',
    ]);

    const breed = 'bulldog french';
    component.selectBreed(breed);

    expect(component['_breedService'].getImagesOfBreed).toHaveBeenCalled();
    expect(component.selectedBreed).toBe(breed);
    expect(component.imagesOfBreed.length).toBe(3);
    expect(component['_getRelatedBreeds']).toHaveBeenCalled();
    expect(component.relatedBreeds.length).toBe(2);
  });

  it('should get related breeds', () => {
    component.breeds = ['bulldog boston', 'bulldog english', 'bulldog french'];
    component.selectedBreed = 'bulldog english';

    const relatedBreeds = component['_getRelatedBreeds']();

    expect(relatedBreeds.length).toBe(2);
    expect(relatedBreeds[0]).toBe('bulldog boston');
    expect(relatedBreeds[1]).toBe('bulldog french');
  });
});
