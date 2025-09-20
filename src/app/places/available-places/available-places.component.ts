import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { map, single } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit{
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false)
  error = signal('')
  private httpClient = inject(HttpClient)
  private destroyRef = inject(DestroyRef)


  ngOnInit(){
    this.isFetching.set(true)
    // const subscription = this.httpClient.get<{places : Place[]}>('http://localhost:3000/places')
    // .pipe(
    //   map((resData)=> resData.places)).subscribe({
    //   next:(resData)=>{
    //     console.log(resData.places);
    //     this.places.set(places)  
    //   }
    const subscription = this.httpClient.get<{places : Place[]}>('http://localhost:3000/places')
    .subscribe({
      next:(resData)=>{
        console.log(resData.places);
        this.places.set(resData.places)  
      },error:(error)=>{
        // this.error.set(error.message)
        this.error.set("something went wrong!")
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


  onSelectedPlace(selectedPlace : Place){
    this.httpClient.put('http://localhost:3000/user-places',{placeId:selectedPlace.id}).subscribe({next:(resData)=>console.log(resData)
    })
  }
  // constructor(private httpClient :HttpClient){}
}
