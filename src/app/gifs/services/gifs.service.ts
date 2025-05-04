import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];

  private apiKey: string = environment.api_key;

  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';


  constructor(private http: HttpClient) {
    // Al momento de iniciar, mandamos a llamar el método del localStorage
    this.loadLocalStorage();
    console.log('gifs service ready');
   }

  // Devolver todas las búsquedas
  get tagsHistory() {
    return [...this._tagsHistory];
  }

  // Si se vuelve a buscar un tag que ya ha sido buscado
  private organizeHistory(tag: string) {


    // Si existe el mismo término buscado, eliminamos el viejo y agrefamos al principio el nuevo
    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);

    // Mantener como máximo 10 búsquedas a la vez
    this._tagsHistory = this._tagsHistory.splice(0, 10);

    // Guardar en localStorage
    this.saveLocalStorage();

  }

  // Método para guardar todos los tags en localStorage
  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  // Método para recuperar los datos del localStorage
  private loadLocalStorage(): void {

    // Si No Existe Data
    if( !localStorage.getItem('history') ) return;

    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);

    // Realizar la petición del primer elemento si el LS contiene al menos 1 valor
    if(this._tagsHistory.length === 0) return;
    this.searchTag(this._tagsHistory[0]);

  }

  // Agregar cada etiqueta de búsqueda nueva al principio
  searchTag(tag: string): void {

    if (tag.trim().length === 0) return;

    this.organizeHistory(tag.toLocaleLowerCase());

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);

    // Esto es un observable y aqui hacemos la petición al endpoint
    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, { params }).subscribe( (resp) => {

      this.gifList = resp.data;
      console.log(this.gifList);

    })

  }
}

