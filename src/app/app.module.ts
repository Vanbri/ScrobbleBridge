import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpotifyListenbrainzImporterComponent } from './spotify-listenbrainz-importer/spotify-listenbrainz-importer.component';

@NgModule({
  declarations: [
    AppComponent,
    SpotifyListenbrainzImporterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
