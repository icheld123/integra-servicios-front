import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { LoginCredentials } from '../../core/services/auth/auth.models';
import { ToastrService } from 'ngx-toastr';
import { UsuarioDataService } from '../../shared/services/usuario.data.service';
import { timeout } from 'rxjs';


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
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuarioDataService: UsuarioDataService,
    private toastr: ToastrService
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('contrasena')?.value;
    const confirmarPassword = group.get('confirmarPassword')?.value;
    return password === confirmarPassword ? null : { passwordMismatch: true };
  }

  enviarRegistro(){
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
    const usuarioNuevoData = {
      nombre: this.registroForm.get('nombre')?.value,
      apellido: this.registroForm.get('apellido')?.value,
      correo: this.registroForm.get('correo')?.value,
      contrasena: this.registroForm.get('contrasena')?.value,
    }

    if(this.registroForm.valid && this.registroForm.get('contrasena')?.value == this.registroForm.get('contrasena')?.value){
      const usuarioNuevoData = {
        nombre: this.registroForm.get('nombre')?.value,
        apellido: this.registroForm.get('apellido')?.value,
        correo: this.registroForm.get('correo')?.value,
        contrasena: this.registroForm.get('contrasena')?.value,
      }
      this.usuarioDataService.createUsuario(usuarioNuevoData).subscribe({
        next: () => {
          this.toastr.success("Nuevo usuario registrado! Ya puede iniciar sesión.");
          this.loading = false;
          this.registroForm.reset();
          this.cerrar.emit();
        },
        error: (e) => {
          this.loading = false;
          this.toastr.error(e.error.detail,"Error.");
        }
      });
    }
  }

  enviarLogin() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;

    const credentials: LoginCredentials = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.toastr.success('¡Inicio de sesión exitoso!', 'Éxito');
        setTimeout(() => {
          this.cerrar.emit();
          this.loginForm.reset();
          this.successMessage = null;
          window.location.href = '/';
        }, 1500);
      },
      error: (error) => {
        this.loading = false;
        this.toastr.error('Credenciales inválidas. Intenta nuevamente.', 'Error');
      }
    });
  }

  cambiarModo() {
    this.modoRegistro = !this.modoRegistro;
    this.errorMessage = null;
    this.successMessage = null;
  }

  close() {
    this.cerrar.emit();
    this.errorMessage = null;
    this.successMessage = null;
  }

}
