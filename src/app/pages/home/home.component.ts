import { Component, Input, OnInit } from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { MovieApiServiceService } from '../../service/movie-api-service.service';
import { Injectable, inject } from '@angular/core';
import { MovieOverviewComponent } from '../movie-overview/movie-overview.component';
import { Output } from '@angular/core';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ SearchComponent , MovieOverviewComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  
  // HideOver: boolean= false;
  // inject the movie service to use the services across the files.

    private movieService = inject(MovieApiServiceService);
    @Output()
    movies: any = [];
  
    // initialize the load movies function
    ngOnInit(): void {
      this.loadHome();
    }
  
    // function to load the movies
    loadHome() {
      // gets the movies from the movie service by subscribing to the  returned observable
      this.movieService.getMoviesHome().subscribe({
        // next is the callback function that gets called when the observable emits a value
        next: (res: any) => {
          this.movies = res.results;
          console.log(res.results);
        },
        //printing the errors if any.
        error: (error) => {
          console.log("Error:" + error);
        },
      });
    }
    
  }
  

