import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastSonnerComponent } from './Components/toast-sonner/toast-sonner.component';
import { Platform } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular/standalone';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, ToastSonnerComponent],

})
export class AppComponent  {

  constructor(private platform: Platform, private navController: NavController) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
      this.navController.back();
    });
  }

}
