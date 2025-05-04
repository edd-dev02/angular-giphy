import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '../../services/gifs.service';

@Component({
  selector: 'gifs-search-box',
  template: `
    <h5>Buscar:</h5>
    <input type="text"
    class="form-control"
    placeholder="Buscar gifs..."
    (keyup.enter)="searchTag()"
    #txtTagInput
    >
  `
})

export class SearchBoxComponent {

  @ViewChild('txtTagInput')
  tagInput!: ElementRef<HTMLInputElement>;

  constructor(private gifsService : GifsService) { }

  // searchTag( newTag: string ): void {
  searchTag(): void {

    const newTag = this.tagInput.nativeElement.value;

    // Guardar la búsqueda del input al principio del arreglo
    this.gifsService.searchTag(newTag);

    // Limpiar el texto del input
    this.tagInput.nativeElement.value = '';

  }

}
