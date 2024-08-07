import { Component, Input, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { abcForms } from '../../../../../../../environments/generals';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Factura } from "../../models/factura";
import {CommonModule, NgForOf} from "@angular/common";
import {Producto} from "../../models/producto";

@Component({
    selector: 'app-factura-new',
    standalone: true,
    imports: [
        FormsModule,
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
            <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 text-on-primary"
                 style="background-color: lightseagreen; color: white">
                <div class="text-lg font-medium">Añadir Productos</div>
                <button mat-icon-button (click)="cancelForm()" [tabIndex]="-1">
                    <mat-icon
                        class="text-current"
                        [svgIcon]="'heroicons_outline:x-mark'"
                    ></mat-icon>
                </button>
            </div>

            <div style="flex: 1; font-size: 17px;" class="ml-8">
                <strong>Producto: </strong><br>
                <select class="form-select" aria-label="Default select example" style="width: 580px"
                        (change)="onSelectChange($event.target.value)">
                    <option value="" disabled selected>Seleccione un Producto</option>
                    <option class="custom-option" *ngFor="let r of producto" [value]="r.id">
                        {{ r.descripcion }}
                    </option>
                </select>
            </div>


            <!-- Compose form -->
            <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="clientForm">

                <mat-form-field style="width: 580px">
                    <mat-label>Cantidad</mat-label>
                    <input matInput formControlName="cantidad"/>
                </mat-form-field>


                <!-- Actions -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-6">
                    <div class="flex space-x-2 items-center mt-4 sm:mt-0 ml-auto">
                        <button mat-stroked-button color="warn" (click)="cancelForm()">Cancelar</button>
                        <button mat-stroked-button color="primary" (click)="saveForm()">
                            Guardar
                        </button>
                    </div>
                </div>
            </form>
        </div>


    `,
})
export class ProductoVendidosNewComponent implements OnInit {
    @Input() title: string = '';
    @Input() factura: Factura[] = [];
    @Input() pan: number;
    @Input() producto: Producto[] = [];
    abcForms: any;
    selectedProduct: any = {};
    clientForm = new FormGroup({
        nombreVen: new FormControl('', [Validators.required]),
        cantidad: new FormControl('', [Validators.required]),
        precioUnitario: new FormControl('', [Validators.required]),
        productoId: new FormControl('', [Validators.required]),
    });

    constructor(private _matDialog: MatDialogRef<ProductoVendidosNewComponent>,) {
}



    ngOnInit() {
        this.abcForms = abcForms;
        console.log('Dato de pan recibido:', this.pan);
        console.log('Datos de factura recibidos:', this.factura);
        console.log('Datos de producto recibidos:', this.producto);

        if (this.pan) {
            this.clientForm.controls['nombreVen'].setValue(this.pan.toString());
        }

        this.clientForm.controls['productoId'].valueChanges.subscribe(productId => {
            const selectedProduct = this.producto.find(prod => prod.id === Number(productId));
            if (selectedProduct) {
                this.clientForm.controls['precioUnitario'].setValue(selectedProduct.precio.toString());
            }
        });
    }

    onSelectChange(id: string): void {
        const selectedId = Number(id);
        this.selectedProduct = this.producto.find(producto => producto.id === selectedId);
        this.clientForm.controls['productoId'].setValue(id); // Pasa el id como string
    }


    public saveForm(): void {
        if (this.clientForm.valid) {
            this._matDialog.close(this.clientForm.value);
        }
    }

    getNextNumero(): number {
        if (this.factura.length === 0) {
            return 1; // Retorna 1 si la lista de facturas está vacía
        }
        const numeros = this.factura.map(f => Number(f.nombreVen) || 0);
        const maxNumero = Math.max(...numeros);
        return maxNumero + 1;
    }

    public cancelForm(): void {
        this._matDialog.close('');
    }


}
