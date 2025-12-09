import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecursoDataService } from '../../shared/services/recurso.data.service';
import { ToastrService } from 'ngx-toastr';
import { TipoRecurso } from '../../shared/models/tipo-recurso.model';
import { UNIDADES } from '../../shared/constants/unidades';
import { HORARIOS } from '../../shared/constants/horarios';
import { UnidadDataService } from '../../shared/services/unidad.data.service';
import { Unidad } from '../../shared/models/unidad.model';
import { UsuarioDataService } from '../../shared/services/usuario.data.service';
import { TIPO_USUARIO } from '../../shared/constants/tipo_usuario';

@Component({
  selector: 'app-panel-admin',
  templateUrl: './panel-admin.component.html',
  styleUrl: './panel-admin.component.css'
})
export class PanelAdminComponent {
  nuevoRecursoForm: FormGroup;
  nuevoTipoRecursoForm: FormGroup;
  nuevaUnidadForm: FormGroup;
  nuevoUsuarioForm: FormGroup;
  selectedFile: File | null = null;
  tiposRecursos: TipoRecurso[] = [];
  unidades: Unidad[] = [];
  categoriasHorarios: string[] = [];
  tiposUsuario = TIPO_USUARIO;

  constructor(private fb: FormBuilder,
    private recursoDataService: RecursoDataService,
    private unidadDataService: UnidadDataService,
    private usuarioDataService: UsuarioDataService,
    private toastr: ToastrService
  ) { 
    this.nuevoRecursoForm = this.fb.group({
      nombre_recurso: ['', [Validators.required]],
      descripcion_recurso: ['', [Validators.required]],
      id_tipo_recurso: ['', [Validators.required]],
      foto_recurso: ['']
    });
    this.nuevoTipoRecursoForm = this.fb.group({
      nombre_tipo_recurso: ['', [Validators.required]],
      codigo_tipo_recurso: ['', [Validators.required]],
      descripcion_tipo_recurso: [''],
      horario_disponibilidad: ['', [Validators.required]],
      id_unidad: ['', [Validators.required]]
    });
    this.nuevaUnidadForm = this.fb.group({
      nombre_unidad: ['', [Validators.required]],
      horario_unidad: ['', [Validators.required]]
    });
    this.nuevoUsuarioForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      contrasena: ['', [Validators.required]],
      id_tipo_usuario: ['', [Validators.required]],
      id_unidad: ['', [Validators.required]]
    });
    this.getTiposRecursos();
    this.getUnidades();
    this.categoriasHorarios = Object.keys(HORARIOS);
  }

  getUnidades(){
    this.unidadDataService.getUnidades()
      .subscribe(unidades => {
        this.unidades = unidades;
    });
  }

  crearUsuario(){
    const usuarioData = {
      nombre: this.nuevoUsuarioForm.get('nombre')?.value,
      apellido: this.nuevoUsuarioForm.get('apellido')?.value,
      correo: this.nuevoUsuarioForm.get('correo')?.value,
      contrasena: this.nuevoUsuarioForm.get('contrasena')?.value,
      id_tipo_usuario: this.nuevoUsuarioForm.get('id_tipo_usuario')?.value,
      id_unidad: this.nuevoUsuarioForm.get('id_unidad')?.value,
    }

    this.usuarioDataService.createUsuario(usuarioData).subscribe({
      next: () => {
        this.toastr.success("¡Usuario creado exitosamente!");
        this.nuevoUsuarioForm.reset()
      },
      error: (e) => {
        this.toastr.error(e.error.detail,"Error.");
      } 
    });
  }

  crearTipoRecurso(){
    const tipoRecursoData = {
      nombre_tipo_recurso: this.nuevoTipoRecursoForm.get('nombre_tipo_recurso')?.value,
      codigo_tipo_recurso: this.nuevoTipoRecursoForm.get('codigo_tipo_recurso')?.value,
      descripcion_tipo_recurso: this.nuevoTipoRecursoForm.get('descripcion_tipo_recurso')?.value,
      horario_disponibilidad: this.nuevoTipoRecursoForm.get('horario_disponibilidad')?.value,
      id_unidad: this.nuevoTipoRecursoForm.get('id_unidad')?.value
    }
    console.log(tipoRecursoData)
    this.recursoDataService.createTipoRecurso(tipoRecursoData).subscribe({
      next: () => {
        this.toastr.success("¡Tipo de recurso creado exitosamente!");
        this.nuevoTipoRecursoForm.reset()
      },
      error: (e) => {
        this.toastr.error(e.error.detail,"Error.");
      } 
    });
  }

  crearUnidad(){
    const unidadData = {
      nombre_unidad: this.nuevaUnidadForm.get('nombre_unidad')?.value,
      horario_unidad: this.nuevaUnidadForm.get('horario_unidad')?.value,
    }
    console.log(unidadData)
    this.unidadDataService.createUnidad(unidadData).subscribe({
      next: () => {
        this.toastr.success("¡Nueva unidad creada exitosamente!");
        this.nuevaUnidadForm.reset()
      },
      error: (e) => {
        this.toastr.error(e.error.detail,"Error.");
      } 
    });
  }  

  getTiposRecursos() {
    this.recursoDataService.getTiposRecursos({})
      .subscribe(tipos => {
        this.tiposRecursos = tipos;
      });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file ?? null;
  }

  nuevoRecursoData(): FormData{
    const formData = new FormData();

    formData.append(
      'nombre_recurso',
      this.nuevoRecursoForm.get('nombre_recurso')?.value
    );

    formData.append(
      'descripcion_recurso',
      this.nuevoRecursoForm.get('descripcion_recurso')?.value
    );

    formData.append(
      'id_tipo_recurso',
      this.nuevoRecursoForm.get('id_tipo_recurso')?.value
    );

    const file = this.nuevoRecursoForm.get('foto_recurso')?.value;
    if (file) {
      formData.append('foto_recurso', file);
    }
    return formData;
  }

  crearRecursoNuevo() {
     const payload = this.nuevoRecursoData();

    this.recursoDataService.createRecurso(payload).subscribe({
      next: () => {
        this.toastr.success("¡Recurso creado exitosamente!");
        this.nuevoRecursoForm.reset()
      },
      error: (e) => {
        this.toastr.error(e.error.detail,"Error.");
      }
    });
  }

}
