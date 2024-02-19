import { MovieModel } from './MovieModel';
// Define the ListModel interface for API response.
export interface ListModel {
    
      page: number,
        movie_list_array: MovieModel [],
        total_pages: number,
        total_results: number
    }