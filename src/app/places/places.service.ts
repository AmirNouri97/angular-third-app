import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap, throwError } from 'rxjs';
import { ErrorService } from '../shared/error.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private userPlaces = signal<Place[]>([]);
private httpClient = inject(HttpClient)
private errorService = inject(ErrorService)
  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places','sth went wrong fetching the available places!')
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places','sth went wrong fetching the user favorite places!').pipe(tap({next:(userPlaces)=>this.userPlaces.set(userPlaces)}))
  }

  // addPlaceToUserPlaces(placeId : string) {
  //     return this.httpClient.put('http://localhost:3000/user-places',{placeId})
  // }
//با مدلی که به جای ایدی کل ارایه رو میگیره جایگزین میکمنیم
 addPlaceToUserPlaces(place : Place) {
  const prevPlaces = this.userPlaces()
if(!prevPlaces.some((p)=>p.id === place.id)){
this.userPlaces.set([...prevPlaces,place])
}
  
      return this.httpClient.put('http://localhost:3000/user-places',{placeId:place.id})
      .pipe(catchError((error)=>{
        this.userPlaces.set(prevPlaces)
        this.errorService.showError('failed to store selected places')
        return throwError(()=>new Error('failed to store selected place'))}))
  }




  removeUserPlace(place: Place) {
      const prevPlaces = this.userPlaces()
if(prevPlaces.some((p)=>p.id === place.id)){
this.userPlaces.set(prevPlaces.filter(p=>p.id != place.id))
}
    return this.httpClient.delete('http://localhost:3000/user-places/' + place.id).pipe(
      catchError((error)=>{
        this.errorService.showError('Failed to remove the selected places!')
        return throwError(()=>new Error('failed to delete place'))
      })
    )
  }

  private fetchPlaces(url:string,errorMessage:string){
    return this.httpClient.get<{places : Place[]}>(url)
      .pipe(
        map((resData)=>resData.places),
        catchError((error)=>{
          console.error(error);
          return throwError(
            ()=> new Error(errorMessage)
          )
        })
      )
  }
}
// 'http://localhost:3000/user-places'
// 'sth went wrong!'