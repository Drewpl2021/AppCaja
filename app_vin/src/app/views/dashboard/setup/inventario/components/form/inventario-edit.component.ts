import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {Inventario} from '../../models/inventario';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [FormsModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSlideToggleModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
      <!-- Header -->
      <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 bg-primary text-on-primary">
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
                <mat-label>Estado de Inventario</mat-label>
                <input matInput formControlName="estado" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Descripcion</mat-label>
                <input matInput formControlName="descripcion" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Precio Venta</mat-label>
                <input matInput formControlName="precio_venta" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Stock</mat-label>
                <input matInput formControlName="stock" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Stock Maximo</mat-label>
                <input matInput formControlName="stock_maximo" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Stock Minimo</mat-label>
                <input matInput formControlName="stock_minimo" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Producto</mat-label>
                <input matInput formControlName="productoId" />
            </mat-form-field>
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
export class InventarioEditComponent implements OnInit {
    clientForm = new FormGroup({
        estado: new FormControl('', [Validators.required]),
        descripcion: new FormControl('', [Validators.required]),
        precio_venta: new FormControl('', [Validators.required]),
        stock: new FormControl('', [Validators.required]),
        stock_maximo: new FormControl('', [Validators.required]),
        stock_minimo: new FormControl('', [Validators.required]),
        productoId: new FormControl('', [Validators.required]),
    });
  @Input() title: string = '';
  @Input() client = new Inventario();
  abcForms: any;

  constructor(
      private formBuilder: FormBuilder,
      private _matDialog: MatDialogRef<InventarioEditComponent>,
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
  }

  public saveForm(): void {
    if (this.clientForm.valid) {
      this._matDialog.close(this.clientForm.value);
    }
  }

  public cancelForm(): void {
    this._matDialog.close('');
  }
}
