import { Component, SimpleChanges } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';
import { Usuario } from '../../shared/models/usuario.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reserva } from '../../shared/models/reserva.model';
import { ReservaDataService } from '../../shared/services/reserva.data.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css'
})
export class MiPerfilComponent {
  usuarioLogueado: Usuario | null = null;
  reservas: Reserva[] = [];
  reservaSeleccionada: Reserva | null = null;
  usuarioForm: FormGroup;
  editando: boolean = false;
  modalAbierto = false;

  displayedColumns: string[] = [
    'transaccion',
    'estado',
    'recurso',
    'inicio',
    'fin',
    'responsable',
    'editar'
  ];

  
  constructor(private auth: AuthService, 
    private fb: FormBuilder,
    private reservaData: ReservaDataService) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.auth.currentUser$.subscribe(usuario => {
      this.usuarioLogueado = usuario;

      this.usuarioForm.patchValue({
        nombre: usuario?.nombre,
        apellido: usuario?.apellido,
        correo: usuario?.sub
      });

      this.bloquearCampos();
    });
    this.getAllReservas();
  }
  
  getAllReservas(){
    const filtros = {
      id_usuario: this.usuarioLogueado?.id_usuario
    };

    this.reservaData.getReservas(filtros)
      .subscribe(reservas => {
        this.reservas = reservas;
    });
  }


  bloquearCampos() {
    this.usuarioForm.get('nombre')?.disable();
    this.usuarioForm.get('apellido')?.disable();
    this.usuarioForm.get('correo')?.disable();
  }

  habilitarCampos() {
    this.usuarioForm.get('nombre')?.enable();
    this.usuarioForm.get('apellido')?.enable();
    this.usuarioForm.get('correo')?.enable();
  }

  editarReserva(reserva: Reserva){
    this.reservaSeleccionada = reserva;
    this.modalAbierto = true;
  }

  editar() {
    this.editando = true;
    this.habilitarCampos();
  }

  cancelar() {
    this.editando = false;
    this.usuarioForm.patchValue({
      nombre: this.usuarioLogueado?.nombre,
      apellido: this.usuarioLogueado?.apellido,
      correo: this.usuarioLogueado?.sub
    });
    this.bloquearCampos();
  }

  guardar() {
    if (this.usuarioForm.invalid) return;

    const datosActualizados = this.usuarioForm.value;

    this.editando = false;
    this.bloquearCampos();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.usuarioLogueado) {
      this.usuarioForm.patchValue({
        nombre: this.usuarioLogueado.nombre
      });
      this.usuarioForm.get('nombre')?.disable();
    }
  }

  cerrarModal() {
    this.modalAbierto = false;
  }
  
}
