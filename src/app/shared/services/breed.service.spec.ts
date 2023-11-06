import { TestBed } from '@angular/core/testing';
import { BreedService } from './breed.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('DogService', () => {
  let service: BreedService;
  let httpTestingController: HttpTestingController;
  const dogUrl = environment.dogUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(BreedService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get breeds', (done) => {
    service.getBreeds().subscribe((response: string[]) => {
      expect(response.length).toBe(2);
      expect(response[0]).toBe('bulldog boston');
      expect(response[1]).toBe('bulldog english');
      done();
    });

    const request = httpTestingController.expectOne(
      `${dogUrl}/breeds/list/all`
    );
    expect(request.request.method).toEqual('GET');

    request.flush({
      message: {
        bulldog: ['boston', 'english'],
      },
      status: 'success',
    });
  });

  it('should get images of a breed', (done) => {
    const breedName = 'hound afghan';
    service.getImagesOfBreed(breedName).subscribe((response: string[]) => {
      expect(response.length).toBe(3);
      expect(response[0]).toBe(
        'https://images.dog.ceo/breeds/hound-afghan/n02088094_1932.jpg'
      );
      expect(response[1]).toBe(
        'https://images.dog.ceo/breeds/hound-afghan/n02088094_3201.jpg'
      );
      expect(response[2]).toBe(
        'https://images.dog.ceo/breeds/hound-afghan/n02088094_4143.jpg'
      );
      done();
    });

    const request = httpTestingController.expectOne(
      `${dogUrl}/breed/hound/afghan/images/random/3`
    );
    expect(request.request.method).toEqual('GET');

    request.flush({
      message: [
        'https://images.dog.ceo/breeds/hound-afghan/n02088094_1932.jpg',
        'https://images.dog.ceo/breeds/hound-afghan/n02088094_3201.jpg',
        'https://images.dog.ceo/breeds/hound-afghan/n02088094_4143.jpg',
      ],
      status: 'success',
    });
  });
});
