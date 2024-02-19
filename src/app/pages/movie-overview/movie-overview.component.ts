import { Component, Input, OnInit } from '@angular/core';
import { MovieApiServiceService } from '../../service/movie-api-service.service';
import { Injectable, inject } from '@angular/core';
import { MovieModel } from '../../Models/MovieModel';

@Component({
  selector: 'app-movie-overview',
  standalone: true,
  imports: [],
  templateUrl: './movie-overview.component.html',
  styleUrl: './movie-overview.component.css'
})
export class MovieOverviewComponent implements OnInit {
  @Input() moviesOut: any = [];
  movies = this.moviesOut;
  movie! : MovieModel;
  // Declare lastClickedMovies property
  lastClickedMovies: MovieModel[] = []; // Adjust the type to match MovieModel
  // Boolean flag to control visibility of last clicked movies
  showLastClicked: boolean = false;

  // injecting the movie service to use the services across the files.
  private movieService = inject(MovieApiServiceService);
  ngOnInit(): void {
    // get the movie id from the movie service
    const id = this.movieService.id;
     this.getMovie(id);
  
  }
// function to get the movie details by subscribing to the returned observable.
  getMovie(movieId: number): void {
    this.movieService.getMovie(movieId).subscribe({
      next: (res: any) => {
        this.movie = res;
        console.log("Movie Details:", res);
      },
      error: (error) => {
        console.error('Error:', error);
      }
    });
  }
 // this function is called when the user clicks on the export to excel button when in movie overview page.
  exportToExcel() {
    const movies = this.movieService.getLastClickedMovies();
    // passing the movies to the movie service to export to excel.
    this.movieService.exportToExcel(movies);
  }
}