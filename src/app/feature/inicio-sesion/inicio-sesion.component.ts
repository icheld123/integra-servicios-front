import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth/auth.service';
import { LoginCredentials } from '../../core/services/auth/auth.models';
import { ToastrService } from 'ngx-toastr';


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
    private toastr: ToastrService
  ) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });

    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmarPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmarPassword = group.get('confirmarPassword')?.value;
    return password === confirmarPassword ? null : { passwordMismatch: true };
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

  enviarRegistro() {
    if (this.registroForm.invalid) {
      this.toastr.error('Por favor, completa todos los campos correctamente', 'Error');
      return;
    }
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = null;
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
