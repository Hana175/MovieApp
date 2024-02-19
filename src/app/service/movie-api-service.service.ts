import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListModel } from '../Models/ListModel';
import { MovieModel } from '../Models/MovieModel';
import { map, catchError, tap } from 'rxjs/operators';
import * as utils from 'xlsx';
import { writeFile } from 'xlsx';
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class MovieApiServiceService {
  // declaring api key, url, query url, movie url, photo url for the movie database for later usage of services across the files.
  apiKey = '1a46636ac1ff6aeaa4c23c0d575cfd92';
  apiURL = "https://api.themoviedb.org/3/discover/movie?api_key=";
  queryURL = "https://api.themoviedb.org/3/search/movie?api_key=";
  movieURL  = 'https://api.themoviedb.org/3/movie/';
  photoURL = 'https://image.tmdb.org/t/p/w500';
  // declaring the id of the movie to be used in the movie overview page.
  id : number = 0;
  // declaring the last clicked movies array to be used when exporting to excel sheet.
  lastClickedMovies: MovieModel[] = [];
  // declaring the previously viewed movies array to be used in suggestions.
  PreviouslyViewedMovies: MovieModel[] = [];
  uniqueMovieIds = new Set<number>();


  constructor(private http: HttpClient) { }
  // Get all movies
  getMovies(): Observable<ListModel> {
    return this.http.get<ListModel>(this.apiURL + this.apiKey);
  }

  // Search movies by keyup/input from user.
  searchMovies(suggestion: string): Observable<ListModel> { 
    return this.http.get<ListModel>(this.queryURL + this.apiKey + "&query=" + suggestion);
  }

  // Get movie details by ID
  getMovie(movieId: number): Observable<MovieModel> {
    const urlTest = this.movieURL + movieId.toString();
    return this.http.get<MovieModel>(urlTest + '?' + 'api_key=' + this.apiKey).pipe(
      tap((movie: MovieModel) => {
        this.lastClickedMovies.push(movie); // Push the clicked movie details to the array
        this.PreviouslyViewedMovies.push(movie); // Push the viewed movies' details to the array
        this.setPreviouslyViewedMovies(this.PreviouslyViewedMovies);
        if (this.PreviouslyViewedMovies.length > 10) {
          this.PreviouslyViewedMovies.shift(); // Remove the oldest clicked movie if the array length exceeds 10
        }
        if(this.lastClickedMovies.length > 1){
          this.lastClickedMovies.shift(); // Remove the oldest clicked movie if the array length exceeds 10
        }
      })
      
    );
  }
  //awel 7aga: load movies el fel home page yekon leha getmoves mo5talefa be page number mo5talefa 3shan ama agy a search maybd2sh mn page ghalat
  // 
  getMoviesHome(): Observable<ListModel> {
    return this.http.get<ListModel>(this.apiURL + this.apiKey + "&page=1");
  }

  // Get movie pages by page number, returns list of movies when user scrolls.
  getMoviesPages(pageNumber: number): Observable<ListModel> {
    const url = this.apiURL + this.apiKey + "&page=" + pageNumber;
    console.log(pageNumber);
    return this.http.get<ListModel>(url);
  }

  // gets previously viewed movies array used for suggestions.
  getPreviouslyViewedMovies(): MovieModel[] {
    return this.PreviouslyViewedMovies;
  }
  
  // sets previously viewed movies array used for suggestions.
  setPreviouslyViewedMovies(movies: MovieModel[]) {
    // Use a Set to keep track of unique movie IDs
    const uniqueMovieIds = new Set<number>();
    const filteredMovies = [];
  
    for (const movie of movies) {
      // Check if the movie ID is already in the set
      if (!uniqueMovieIds.has(movie.id)) {
        uniqueMovieIds.add(movie.id); // Add movie ID to the set
        filteredMovies.push(movie); // Add the movie to the filtered array
      }
    }
  
    // Ensure only the last 10 viewed movies are kept
    this.PreviouslyViewedMovies = filteredMovies.slice(-10);
  }
  

 // Method to get last clicked movies
 getLastClickedMovies(): MovieModel[] {
  return this.lastClickedMovies;
}

// gets previously clicked movie used for exporting.
setLastClickedMovies(movies: MovieModel[]) {
  // Store the last clicked movie
  this.lastClickedMovies = movies.slice(0, 1);
}

// this method is used to export the last clicked movie to an excel sheet.
exportToExcel(movies: MovieModel[]) {
  const worksheet: utils.WorkSheet = utils.utils.json_to_sheet(movies);
  const workbook: utils.WorkBook = utils.utils.book_new();
  utils.utils.book_append_sheet(workbook, worksheet, 'Movies');
  const excelBuffer: any = utils.write(workbook, { bookType: 'xlsx', type: 'array' });
  this.saveExcelFile(excelBuffer, 'Movie_details.xlsx');
}

// this method is used to save the excel file to the local storage.
saveExcelFile(buffer: any, fileName: string) {
  const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
  FileSaver.saveAs(data, fileName);
}
}
