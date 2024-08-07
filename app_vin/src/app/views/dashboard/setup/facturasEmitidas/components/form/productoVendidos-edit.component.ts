import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {ProductoVendidos} from '../../models/productoVendidos';
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
      <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 text-white" style="background-color: lightseagreen;">
        <div class="text-lg font-medium" >Editar Ventas</div>
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
                <mat-label>Producto</mat-label>
                <input matInput formControlName="productoId" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Codigo de Factura</mat-label>
                <input matInput formControlName="nombreVen" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Cantidad</mat-label>
                <input matInput formControlName="cantidad" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Precio Unitario</mat-label>
                <input matInput formControlName="precioUnitario" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Total</mat-label>
                <input matInput formControlName="total" />
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
export class ProductoVendidosEditComponent implements OnInit {
    clientForm = new FormGroup({
        nombreVen: new FormControl('', [Validators.required]),
        cantidad: new FormControl('', [Validators.required]),
        total: new FormControl('', [Validators.required]),
        precioUnitario: new FormControl('', [Validators.required]),
        productoId: new FormControl('', [Validators.required]),
    });
  @Input() title: string = '';
  @Input() client = new ProductoVendidos();
  abcForms: any;

  constructor(
      private formBuilder: FormBuilder,
      private _matDialog: MatDialogRef<ProductoVendidosEditComponent>,
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
