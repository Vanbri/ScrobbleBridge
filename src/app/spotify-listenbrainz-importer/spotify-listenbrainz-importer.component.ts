import { Component } from '@angular/core';
import { SpotifyListenbrainzImporterService } from './spotify-listenbrainz-importer.service';

@Component({
  selector: 'app-spotify-listenbrainz-importer',
  template: 'spotify-listenbrainz-importer.component.html'
})
export class SpotifyListenbrainzImporterComponent {
  logs: string[] = [];

  constructor(private listenbrainzService: SpotifyListenbrainzImporterService) {}

  process() {
    this.logs.push('Iniciando proceso...');
    this.listenbrainzService.processTracks()
      .then(() => {
        this.logs.push('Proceso completado.');
      })
      .catch((error) => {
        this.logs.push('Error en el proceso: ' + error);
      });
  }
}
