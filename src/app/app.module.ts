import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from './app.component';
import * as Component from 'src/app/components';
import { FormsModule } from '@angular/forms';
import { StringLengthPipe } from './pipe/string-length.pipe';
import { SiderComponent } from './components/sider/sider.component';

const Pipe = [
  StringLengthPipe,
];

@NgModule({
  declarations: [
    AppComponent,
    Component.MapComponent,
    ...Pipe,
    SiderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
