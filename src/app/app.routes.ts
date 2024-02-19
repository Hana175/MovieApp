import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MovieOverviewComponent } from './pages/movie-overview/movie-overview.component';

// Define the routes
export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'movie/:id', component: MovieOverviewComponent }
];


