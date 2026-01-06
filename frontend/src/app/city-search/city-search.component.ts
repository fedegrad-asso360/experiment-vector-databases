import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Subject, of } from 'rxjs';

export interface City {
  name: string;
  isoCode: string;
  belfioreCode: string;
  cityId: number;
  district: string;
  region: string;
}

export interface SearchResponse {
  query: string;
  count: number;
  results: City[];
}

@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrl: './city-search.component.css'
})
export class CitySearchComponent implements OnInit {
  @Input() apiUrl: string = 'http://localhost:3000/cities/search';
  @Input() placeholder: string = 'Search for a city...';
  @Input() limit: number = 10;
  @Output() citySelected = new EventEmitter<City | null>();

  searchTerm: string = '';
  cities: City[] = [];
  selectedCity: City | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  showDropdown: boolean = false;
  
  private searchSubject = new Subject<string>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Set up search with debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.trim().length < 2) {
          this.cities = [];
          return of({ query: '', count: 0, results: [] });
        }
        this.isLoading = true;
        this.errorMessage = '';
        return this.http.get<SearchResponse>(
          `${this.apiUrl}?name=${encodeURIComponent(term)}&limit=${this.limit}`
        ).pipe(
          catchError(error => {
            console.error('Error searching cities:', error);
            this.errorMessage = 'Error searching cities. Please try again.';
            return of({ query: term, count: 0, results: [] });
          })
        );
      })
    ).subscribe(response => {
      this.cities = response.results;
      this.isLoading = false;
      this.showDropdown = this.cities.length > 0;
    });
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
    this.searchSubject.next(value);
  }

  selectCity(city: City) {
    this.selectedCity = city;
    this.searchTerm = city.name;
    this.showDropdown = false;
    this.citySelected.emit(city);
  }

  clearSelection() {
    this.selectedCity = null;
    this.searchTerm = '';
    this.cities = [];
    this.showDropdown = false;
    this.citySelected.emit(null);
  }

  onFocus() {
    if (this.cities.length > 0) {
      this.showDropdown = true;
    }
  }

  onBlur() {
    // Delay to allow click on dropdown item
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }
}
