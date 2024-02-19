import { Component, Output, Input } from '@angular/core';
import { MovieOverviewComponent } from '../movie-overview/movie-overview.component';
import { NgIf, CommonModule } from '@angular/common';
import { MovieApiServiceService } from '../../service/movie-api-service.service';
import { Injectable, inject } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { Router } from '@angular/router'; // Import Router from Angular Router
import { MovieModel } from '../../Models/MovieModel';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ InfiniteScrollModule, MovieOverviewComponent, CommonModule ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})

export class SearchComponent {
  // declaring page number to be used in the infinite scroll
  pageNumber: number = 1;
  // Declare loading property
  loading: boolean = false;
  // Declare lastClickedMovies property
  lastViewedMovies: MovieModel[] = []; // Adjust the type to match MovieModel
  // Boolean flag to control visibility of last clicked movies
  showLastViewed: boolean = false;

  // Declare movieDetails property as an observable output.
  @Output()
  movieDetails: Observable<MovieModel> | null = null; // Declare movieDetails property
  // HideOverviewBool: boolean = true;
  // HideOverviewBool2: boolean = false;
  // Inject the movie service to use the services across the files and router to navigate to the movie overview page.
  private movieService = inject(MovieApiServiceService);
  private router = inject(Router);
  // Declare movies property as an input
  @Input() movies: any = [];
  // Declare moviesOut property as an output
  @Output() moviesOut= this.movies;
  // take movie method takes input from user as uses presses on keyup so that it does not wait for the user to finish the search keyword, and outputs the suggestions.
   TakeMovie(event: Event){
    // gets the movie from the html input element.
    const movie = (event.target as HTMLInputElement).value; 
    if (movie) {
      // if user enters anything in the search input field, search movies is called from the service and the movies are returned using subscribe from the observable.
      this.movieService.searchMovies(movie).subscribe({
        next: (res: any) => {
          this.movies = res.results;
          console.log(res.results);
        },
        error: (error) => {
          console.error('Error:', error);
        }
      });
    } else {
      this.movies = []; // Clear the movies array if the search query is empty
    }
  }
  // this method loads more movies when the user scrolls to the bottom of the page.
  loadMovies() {
    this.loading = true; // Set loading state to true
    // Call the getMoviesPages method from the service
    this.movieService.getMoviesPages(this.pageNumber).subscribe({
      next: (res: any) => {
        const newMovies = res.results;
        // Concatenate newMovies with existing movies array
        this.movies = this.movies.concat(newMovies); 
        this.pageNumber++;
        this.loading = false; // Set loading state to false after loading
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false; 
      }
    });
  }
  // Method to handle the scroll event
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      // Load more movies when scrolled to bottom
      this.loadMovies();
    }
  }
  // Method to navigate to the movie overview page and gives the movie id as a parameter.
  goToMovieOverview(movieId: number) {
    console.log(this.movieService.getMovie(movieId) )
    this.movieService.id = movieId;
    this.router.navigate(['/movie', movieId]); // Navigate to MovieOverviewComponent with the movie ID as a parameter
  }
  
  // Method to retrieve last clicked/viewed movies for suggestions.
  showLastClickedMovies() {
    // Get last clicked movies from the service
    this.lastViewedMovies = this.movieService.getPreviouslyViewedMovies();
    // Set showLastClicked flag to true to display the list
    this.showLastViewed = true;
  }
}
