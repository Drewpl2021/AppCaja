import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {Producto} from '../../models/producto';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDialogRef} from "@angular/material/dialog";
import {Factura} from "../../../generarFactura/models/factura";
import {Proveedor} from "../../models/proveedor";
import {CommonModule, NgForOf} from "@angular/common";

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [FormsModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    NgForOf,
    CommonModule, // Incluye CommonModule aquí
  ],

  template: `
    <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
      <!-- Header -->
      <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8" style="background-color: lightseagreen; color: white">
        <div class="text-lg font-medium" [innerHTML]="title"></div>
        <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
          <mat-icon
              class="text-current"
              [svgIcon]="'heroicons_outline:x-mark'"
          ></mat-icon>
        </button>
      </div>

      <!-- Compose form -->
        <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="clientForm">
            <mat-form-field>
                <mat-label>Nombre o Razon Social</mat-label>
                <input matInput formControlName="nombre" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Descripcion</mat-label>
                <input matInput formControlName="descripcion" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Precio Unitario</mat-label>
                <input matInput formControlName="precio" />
            </mat-form-field>
            <div>
                <label >Unidades de Medida</label>
                <select class="form-select" aria-label="Default select example" formControlName="unidades_medida">
                    <option value="GALON">GALON</option>
                    <option value="UNID">UNID</option>
                </select>
            </div><br>

            <mat-form-field>
                <mat-label>Stock</mat-label>
                <input matInput formControlName="stock" />
            </mat-form-field>

            <div >
                <strong>Producto: </strong><br>
                <select class="form-select" aria-label="Default select example" style="width: 580px" formControlName="proveedor"
                        (change)="onSelectChange($event.target.value)">
                    <option class="custom-option" *ngFor="let r of proveedor" [value]="r.id">
                        {{ r.nombre }}
                    </option>
                </select>
            </div>



            <!-- Actions -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                <div class="flex space-x-2 items-center mt-4 sm:mt-0 ml-auto">
                    <button mat-stroked-button [color]="'warn'" (click)="cancelForm()">Cancelar</button>
                    <button mat-stroked-button [color]="'primary'" (click)="saveForm()">
                        Guardar
                    </button>
                </div>
            </div>
        </form>
    </div>
  `
})
export class ProductoEditComponent implements OnInit {
    clientForm = new FormGroup({
        nombre: new FormControl('', [Validators.required]),
        descripcion: new FormControl('', [Validators.required]),
        precio: new FormControl('', [Validators.required]),
        unidades_medida: new FormControl('', [Validators.required]),
        stock: new FormControl('', [Validators.required]),
        proveedor: new FormControl('', ),
    });
  @Input() title: string = '';
  @Input() client = new Producto();
  @Input() proveedor: Proveedor[] = [];
  abcForms: any;
  selectedProduct: any = {};

  constructor(
      private formBuilder: FormBuilder,
      private fb: FormBuilder,
      private _matDialog: MatDialogRef<ProductoEditComponent>,
  ) {

  }

  ngOnInit() {
    this.abcForms = abcForms;

    if (this.client) {
        console.log(this.client);
        console.log("vacio: ",this.clientForm.value);
      this.clientForm.patchValue(this.client);
        console.log("llenado: ",this.clientForm.value);
    }
      console.log('Datos de proveedores recibidos:', this.proveedor);
  }
    onSelectChange(id: string): void {
        const selectedId = Number(id);
        this.selectedProduct = this.proveedor.find(producto => producto.id === selectedId);
        this.clientForm.controls['proveedor'].setValue(id); // Pasa el id como string
    }


    public saveForm(): void {
    if (this.clientForm.valid) {
      this._matDialog.close(this.clientForm.value);
    }
    console.log('Datos de proveedores Enviados:', this.selectedProduct);
  }

  public cancelForm(): void {
    this._matDialog.close('');
  }
}
