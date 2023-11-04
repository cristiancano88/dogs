import { Component, OnInit } from '@angular/core';
import { DogService } from './shared/services/dog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'dogs';

  constructor(private dogsService: DogService) {}

  ngOnInit(): void {
    this.dogsService.getDogs().subscribe((dogs) => {
      console.log(dogs);
    });
  }


}
