import { Component } from '@angular/core';
import { SpotifyListenbrainzImporterService } from './spotify-listenbrainz-importer.service';

@Component({
  selector: 'app-spotify-listenbrainz-importer',
  templateUrl: './spotify-listenbrainz-importer.html',
  standalone: false
})
export class SpotifyListenbrainzImporterComponent {
  logs: string[] = [];
  fileName: string = '';
  userToken: string = '';
  tracks: any[] = [];

  constructor(private listenbrainzService: SpotifyListenbrainzImporterService) { }

  process() {
    if (!this.userToken) {
      this.logs.push('Debe ingresar un token de usuario.');
      return;
    }
    if (!this.tracks || !this.tracks.length) {
      this.logs.push('Debe seleccionar un archivo válido.');
      return;
    }
    this.logs.push('Iniciando proceso...');
    this.listenbrainzService.processTracks(this.userToken, this.tracks)
      .then(() => {
        this.logs.push('Proceso completado.');
      })
      .catch((error) => {
        this.logs.push('Error en el proceso: ' + error);
      });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result;
        try {
          // Se parsea el contenido del archivo y se almacena en la propiedad "tracks"
          this.tracks = JSON.parse(fileContent as string);
          console.log('Archivo cargado y parseado:', this.tracks);
        } catch (error) {
          console.error('Error al parsear el archivo JSON:', error);
          this.logs.push('Error al parsear el archivo JSON.');
        }
      };
      reader.readAsText(file);
    }
  }
}
