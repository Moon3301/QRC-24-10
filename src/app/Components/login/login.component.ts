import { Component, OnInit, ViewChild, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ContentChild  } from '@angular/core';
import { Router } from '@angular/router';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {FormBuilder, Validators, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatStepperModule} from '@angular/material/stepper';
import { IonicModule } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { MatDialog } from '@angular/material/dialog';
import { SecurityService } from 'src/app/Services/Security/security.service';
import { ToastSonnerComponent } from '../toast-sonner/toast-sonner.component';
import { SwiperContainer } from 'swiper/element/bundle';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatButtonModule,
    MatSlideToggleModule, ReactiveFormsModule, MatStepperModule, IonicModule, ToastSonnerComponent]
})
export class LoginComponent  implements OnInit {

  @ViewChild(ToastSonnerComponent)
  toast_sonner!: ToastSonnerComponent;

  @ViewChild('swiper') swiper!: ElementRef<SwiperContainer>;

  introSlides = false;
  swiperConfig: any;

  @ViewChild(IonModal) modalRegister!: IonModal;
  paletteToggle = false;
  isLinear = true;
  loginForm!: FormGroup

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });

  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });

  constructor(private _formBuilder: FormBuilder, private router: Router, private matDialog:MatDialog,
    private security:SecurityService) {

      this.swiperConfig = {
        pagination: {
          el: '.swiper-pagination',  // Selecciona el contenedor de la paginación
          clickable: true,            // Permite que los bullets sean clicables
          bulletActiveClass: 'custom-bullet-active'  // Clase CSS personalizada para el bullet activo
        },
      };

    }

  async ngOnInit() {

    this.introSlides = localStorage.getItem('introSlides') === 'true' ? true : false;

    // true: Si ya se ha mostrado la presentación de la aplicación
    // false: Si no se ha mostrado la presentación de la aplicación

    if(this.introSlides === false){

      localStorage.setItem('introSlides', 'false');

    }
    
    this.loginForm = this._formBuilder.group({

      username: ['', Validators.required],
      password: ['', Validators.required]
    })

    const active = await this.security.activeUser();

    if(active){
      this.navigateToHome();
    }

  }

  async login(){

    try{

      const username = this.loginForm.get("username")?.value;
      const password = this.loginForm.get("password")?.value;

      this.toast_sonner.PromiseToast('Validando credenciales ...','Validado','Error al iniciar sesion', this.security.login(username, password))
      
      await this.security.login(username, password)
      
      this.navigateToHome();

      this.loginForm.reset();

    }catch{
      console.log('Error al ingresar las credenciales')
    }
    
  }

  openModalResetPass(){
    this.matDialog.open(ResetPasswordComponent, {
      width: '99%',
    })
  }

  confirmRegister() {
    this.modalRegister.dismiss(null,'confirm');
  }

  cancelRegister() {
    this.modalRegister.dismiss(null, 'cancel');
  }

  navigateToHome() {
    this.router.navigate(['/inicio']);
  }

  onWillDismissRegister(event: any) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {

      
    }
  }

  slideNext() {
    this.swiper.nativeElement.swiper.slideNext();

  }

  slidePrev() {
    this.swiper.nativeElement.swiper.slidePrev();
  }

  exitSlides(){

    localStorage.setItem('introSlides', 'true');
    this.introSlides = true;

  }

}
