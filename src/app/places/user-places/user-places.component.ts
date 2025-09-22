import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{
  // places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false)
  error = signal('')
  // private httpClient = inject(HttpClient)
  private destroyRef = inject(DestroyRef)
  private placesService = inject(PlacesService)
  places = this.placesService.loadedUserPlaces;
   ngOnInit(){
      this.isFetching.set(true)

      
      // const subscription = this.httpClient.get<{places : Place[]}>('http://localhost:3000/places')
      // .pipe(
      //   map((resData)=> resData.places)).subscribe({
      //   next:(resData)=>{
      //     console.log(resData.places);
      //     this.places.set(places)  
      //   }
      // const subscription = this.httpClient.get<{places : Place[]}>('http://localhost:3000/user-places')
      // .pipe(
      //   map((resData)=>resData.places),
      //   catchError((error)=>{
      //     console.error(error);
      //     return throwError(
      //       ()=> new Error('sth went wrong!')
      //     )
      //   })
      // )
      const subscription = this.placesService.loadUserPlaces()
      .subscribe({
        // next:(places)=>{
        //   console.log(places);
        //   this.places.set(places)  
        // },
        error:(error)=>{
          // this.error.set(error.message)
          this.error.set("something went wrong fetching your favorite places!")
        }
        ,complete:()=>{
          this.isFetching.set(false)
        }
        // next:(event)=>{
        //   console.log(event);  
        // }
      })
      this.destroyRef.onDestroy(()=>{
        subscription.unsubscribe();
      })
    }
}
