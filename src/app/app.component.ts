import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieOverviewComponent } from './pages/movie-overview/movie-overview.component';
import { Router } from '@angular/router'; // Import Router from Angular Router
import { Injectable, inject } from '@angular/core';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MovieOverviewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private router = inject(Router);

  title = 'movie-app';
  navbg:any;
  // @HostListener('document:scroll') scrollover(){
  //   console.log(document.body.scrollTop, 'scrolllength#')
  //   // if(document.body.scrollTop > 0 || document.documentElement.scrollTop > 0)
  //   // {
  //   //   this.navbg = {
  //   //     'background-color': 'black'
  //   //   };
  //   // } else 
  //   // {
  //   //   this.navbg = {
  //   //     'background-color': 'black'
  //   //   };
  //   // }
  // }
  goToHome() {
    this.router.navigate(['']); // Navigate to MovieOverviewComponent with the movie ID as a parameter
  }

}
