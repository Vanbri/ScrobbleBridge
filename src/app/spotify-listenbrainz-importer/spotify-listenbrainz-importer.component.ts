import { Component } from '@angular/core';
import { SpotifyListenbrainzImporterService } from './spotify-listenbrainz-importer.service';

@Component({
    selector: 'app-spotify-listenbrainz-importer',
    templateUrl: './spotify-listenbrainz-importer.html',
    standalone: false
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
