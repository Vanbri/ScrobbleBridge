import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

interface SpotifyTrack {
  ts: string;  // "2023-02-10T12:34:56Z"
  master_metadata_track_name?: string;
  master_metadata_album_artist_name?: string;
  master_metadata_album_album_name?: string;
  platform?: string;
  ms_played?: number;
  conn_country?: string;
  ip_addr?: string;
  spotify_track_uri?: string;
  episode_name?: string;
  episode_show_name?: string;
  spotify_episode_uri?: string;
  audiobook_title?: string;
  audiobook_uri?: string;
  audiobook_chapter_uri?: string;
  audiobook_chapter_title?: string;
  reason_start?: string;
  reason_end?: string;
  shuffle?: boolean;
  skipped?: boolean;
  offline?: boolean;
  offline_timestamp?: number;
  incognito_mode?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SpotifyListenbrainzImporterService {
  private readonly LISTENBRAINZ_API = 'https://api.listenbrainz.org/1/submit-listens';
  private readonly BATCH_SIZE = 1000;
  private readonly DELAY_MS = 3000;

  constructor(private http: HttpClient) {}

  private chunkList<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  private async sendBatch(tracksBatch: SpotifyTrack[], batchNumber: number, userToken: string): Promise<void> {
    const payload = {
      listen_type: 'import',
      payload: tracksBatch.map((track) => {
        const listenedAt = Math.floor(Date.parse(track.ts) / 1000);
        return {
          listened_at: listenedAt,
          track_metadata: {
            track_name: track.master_metadata_track_name,
            artist_name: track.master_metadata_album_artist_name,
            release_name: track.master_metadata_album_album_name,
            additional_info: {
              platform: track.platform,
              ms_played: track.ms_played,
              conn_country: track.conn_country,
              ip_addr: track.ip_addr,
              spotify_track_uri: track.spotify_track_uri,
              episode_name: track.episode_name,
              episode_show_name: track.episode_show_name,
              spotify_episode_uri: track.spotify_episode_uri,
              audiobook_title: track.audiobook_title,
              audiobook_uri: track.audiobook_uri,
              audiobook_chapter_uri: track.audiobook_chapter_uri,
              audiobook_chapter_title: track.audiobook_chapter_title,
              reason_start: track.reason_start,
              reason_end: track.reason_end,
              shuffle: track.shuffle,
              skipped: track.skipped,
              offline: track.offline,
              offline_timestamp: track.offline_timestamp,
              incognito_mode: track.incognito_mode
            }
          }
        };
      })
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${userToken}`
    });

    try {
      const response: any = await firstValueFrom(
        this.http.post(this.LISTENBRAINZ_API, payload, { headers })
      );
      console.log(`Lote ${batchNumber} enviado correctamente:`, response);
    } catch (error) {
      console.error(`Error al enviar el lote ${batchNumber}:`, error);
    }
  }

  public async processTracks(userToken: string, tracks: SpotifyTrack[]): Promise<void> {
    try {
      if (!Array.isArray(tracks)) {
        throw new Error('El archivo JSON no contiene un array válido');
      }

      const trackBatches = this.chunkList(tracks, this.BATCH_SIZE);
      console.log(`Se enviarán ${trackBatches.length} lotes de ${this.BATCH_SIZE} canciones.`);

      for (let i = 0; i < trackBatches.length; i++) {
        await this.sendBatch(trackBatches[i], i + 1, userToken);
        if (i < trackBatches.length - 1) {
          console.log(`Esperando ${this.DELAY_MS / 1000} segundos antes de enviar el siguiente lote...`);
          await this.sleep(this.DELAY_MS);
        }
      }
      console.log('Proceso completado.');
    } catch (error) {
      console.error('Error en processTracks:', error);
      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
