import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.css'
})
export class InicioSesionComponent {
  @Input() abierto = false;
  @Output() cerrar = new EventEmitter<void>();

  modoRegistro = false;
  loginForm: FormGroup;
  registroForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
    });
  }

  enviarLogin() {
    if (this.loginForm.invalid) return;
    console.log("LOGIN:", this.loginForm.value);
  }

  enviarRegistro() {
    if (this.registroForm.invalid) return;
    console.log("REGISTRO:", this.registroForm.value);
  }

  cambiarModo() {
    this.modoRegistro = !this.modoRegistro;
  }

  close() {
    this.cerrar.emit();
  }

}
