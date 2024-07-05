import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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




@Component({
    selector: 'app-clients-new',
    standalone: true,
    imports: [
        FormsModule,
        MatIconModule,
        MatButtonModule,
        ReactiveFormsModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    template: `
        <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
            <!-- Header -->
            <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8" style="background-color: lightseagreen; color: white">
                <div class="text-lg font-medium">Declarar Detalle</div>
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
                    <mat-label>Codigo Transaccion</mat-label>
                    <input matInput formControlName="codigo_transaccion" />
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Entrada</mat-label>
                    <input matInput formControlName="entrada" />
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Salida</mat-label>
                    <input matInput formControlName="salida" />
                </mat-form-field>
                <mat-form-field>
                    <mat-label>Precio Compra</mat-label>
                    <input matInput formControlName="precio_de_compra" />
                </mat-form-field>
                <mat-form-field>
                    <mat-label>ID de Inventario</mat-label>
                    <input matInput formControlName="inventario_id">
                </mat-form-field>
                <mat-form-field>
                    <mat-label>ID de Producto</mat-label>
                    <input matInput formControlName="productoId">
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
    `,
})
export class EntradaNewComponent implements OnInit {
    @Input() title: string = '';
    abcForms: any;
    @Output() detalleAdded = new EventEmitter<any>();
    clientForm = new FormGroup({
        codigo_transaccion: new FormControl('', [Validators.required]),
        entrada: new FormControl('', [Validators.required]),
        salida: new FormControl('', [Validators.required]),
        precio_de_compra: new FormControl('', [Validators.required]),
        productoId: new FormControl('', [Validators.required]),
        inventario_id: new FormControl('', [Validators.required]),
    });

    constructor(private _matDialog: MatDialogRef<EntradaNewComponent>) {}

    ngOnInit() {
        this.abcForms = abcForms;
        this.generateTransactionCode();
    }

    public saveForm(): void {
        if (this.clientForm.valid) {
            this._matDialog.close(this.clientForm.value);
            this.detalleAdded.emit(this.clientForm.value); // Emitir el evento con los datos del nuevo detalle
        }
    }


    public cancelForm(): void {
        this._matDialog.close('');
    }
    generateTransactionCode(): void {
        // Suponiendo que tienes una forma de obtener el número total de transacciones
        // Por ejemplo, si tienes un servicio que te permite obtener ese número, lo usarías aquí.
        // Para este ejemplo, simplemente incrementaremos un número basado en un valor ficticio.
        // Deberías reemplazar esto con tu lógica para obtener el próximo código de transacción.

        const totalTransactions = 100; // Este valor debería ser dinámico
        const nextTransactionCode = `S${totalTransactions + 1}`;

        // Actualizar el valor del campo codigo_transaccion en el formulario
        this.clientForm.patchValue({
            codigo_transaccion: nextTransactionCode
        });
    }


}
