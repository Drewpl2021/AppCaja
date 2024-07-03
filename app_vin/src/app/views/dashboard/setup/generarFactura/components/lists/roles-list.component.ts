import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';

import { abcForms } from '../../../../../../../environments/generals';
import { ProductoVendidos } from '../../models/productoVendidos';
import { CommonModule } from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {Factura} from "../../models/factura";
import {Producto} from "../../models/producto";
import {PdfViewerService} from "../../../../../../providers/services";
import {PDFGeneratorService} from "../pdf";
import {ProductoVendidosNewComponent} from "../form/productoVendidos-new.component";
import {NewFacturaComponent} from "../form/factura-new.component";
import {Clientes} from "../../models/clientes";
import {FuseNavigationItem} from "../../../../../../../@fuse/components/navigation";
import {FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {ClientService} from "../../../../../../providers/services/setup/client.service";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ProductoService} from "../../../../../../providers/services/setup/producto.service";
import {ToastrService} from "ngx-toastr";
import {FacturaService} from "../../../../../../providers/services/setup/factura.service";

@Component({
    selector: 'app-clients-list',
    imports: [CommonModule, RouterOutlet, MatButtonModule, MatIconModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
    standalone: true,
    template: `

        <div style="flex: 1; font-size: 17px; text-align: left;">
            <strong>Tipo de Documento:</strong>
            <div style="margin-top: 10px;">
                <label style="margin-right: 15px; cursor: pointer;">
                    <input type="radio" name="tipoDocumento" value="boleta" [(ngModel)]="tipoDocumento" (change)="onTipoDocumentoChange()" /> Boleta
                </label>
                <label style="margin-right: 15px; cursor: pointer;">
                    <input type="radio" name="tipoDocumento" value="factura" [(ngModel)]="tipoDocumento" (change)="onTipoDocumentoChange()" /> Factura
                </label>
            </div>
        </div>




        <div class="main " style="margin-left: 330px">
            <div class="body" >
                <div class="invoice" style="background-color: white;">
                    <div class="header" style="display: flex;">
                        <div style="margin-right: 150px">
                            <p style="font-size: 25px; "><strong>GRIFO INCAPACARITA S.A.C.</strong></p>
                            <p style="font-size: 15px; ">CARRETERA PANAMERICANA KM 265 AREQUIPA - JULIACA</p>
                            <p style="font-size: 15px;">Teléfono: 942-456-780</p>
                        </div>
                        <div style="margin-top: -20px">
                            <img
                                src="https://img.freepik.com/vector-premium/icono-gasolinera-concepto-combustible_11481-928.jpg"
                                alt="Logo"
                                style="width: 150px; height: 150px;">
                        </div>

                    </div>

                    <div class="details" >
                        <div style="display: flex; ">


                                    <div style="flex: 1; font-size: 17px;" >
                                        <strong>Nombre: </strong>
                                        <select (change)="onSelectChange($event.target.value)">
                                            <option *ngFor="let r of clientes" [value]="r.id">
                                                {{ r.nombreRazonSocial }}
                                            </option>
                                        </select>
                                    </div>

                                    <div  style="flex: 1; font-size: 17px; text-align: left;">
                                        <strong>N° de Comprobante:</strong> {{ getSerie() }} - {{ getNextNumero() }}
                                    </div>

                        </div>

                        <div style="display: flex; margin-top: -15px">
                            <div style="flex: 1; font-size: 17px;">
                                <strong>DNI/RUC:</strong> {{ selectedClient?.dni_ruc || '' }}
                            </div>

                            <div style="flex: 1; font-size: 17px; text-align: left;">
                                <strong>Fecha:</strong> {{ fechaHoy }}
                            </div>

                        </div>
                        <div style="display: flex; margin-top: -15px">
                            <div style="flex: 1; font-size: 17px;">
                                <strong>Dirección:</strong> {{ selectedClient?.direccion || '' }}
                            </div>
                        </div>
                    </div>
                    <button mat-flat-button style="background-color: lightseagreen; color: white" (click)="goNew()">
                        <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
                        <span class="ml-2">Nuevo Factura</span>
                    </button>
                        <br><br>
                    <table class="w-full table-fixed">
                        <thead class=" text-white" style="background-color: lightseagreen">
                        <tr>
                            <th class="w-1/6 table-head text-center px-5 border-r">#</th>
                            <th class="w-2/6 table-header text-center px-5 border-r">Cantidad</th>
                            <th class="w-2/6 table-header text-center px-5 border-r">Producto</th>
                            <th class="w-2/6 table-header text-center px-5 border-r">Precio Unitario</th>
                            <th class="w-2/6 table-header text-center">Total</th>
                            <th class="w-2/6 table-header text-center">Acciones</th>
                        </tr>
                        </thead>
                        <tbody class="bg-white" *ngFor="let r of getFilteredClients(); let i = index">
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/6 p-2 text-center border-b">{{ i }}</td>
                            <td class="w-2/6 p-2 text-start border-b text-sm">{{ r.cantidad }}</td>
                            <td class="w-2/6 p-2 text-start border-b text-sm">{{ getProductoNombre(r.productoId) }} </td>
                            <td class="w-2/6 p-2 text-start border-b text-sm">{{ r.precioUnitario }} </td>
                            <td class="w-2/6 p-2 text-start border-b text-sm">{{ r.total }}</td>
                            <td class="w-2/6 p-2 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">
                                    <mat-icon class="text-amber-400 hover:text-amber-500 cursor-pointer" (click)="goEdit(r.id)">edit</mat-icon>
                                    <mat-icon class="text-rose-500 hover:text-rose-600 cursor-pointer" (click)="goDelete(r.id)">delete_sweep</mat-icon>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colspan="4" class="total">Sub. Total</td>
                            <td>{{ getSubTotal() | number: '1.2-2' }}</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="total">IGV</td>
                            <td>{{ getIGV() | number: '1.2-2' }}</td>
                        </tr>
                        <tr>
                            <td colspan="4" class="total">Total</td>
                            <td>{{ getTotalSum() | number: '1.2-2' }}</td>
                        </tr>
                        </tfoot>


                    </table>


                    <div class="footer">
                        <p>Gracias por su compra</p>
                    </div>
                    <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="productoform"  >

                    <button mat-flat-button style="background-color: lightseagreen; color: white" (click)="Guardar()" > Generar Factura </button></form>
                </div>

            </div>
        </div>





        <style>
            .main {
                width: 900px;
                height: 820px;

            }

            .body {
                font-family: Arial, sans-serif;
                margin: 20px;
                padding: 0;


            }

            .invoice {
                max-width: 800px;
                margin: auto;
                padding: 20px;
                border: 1px solid #eee;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            }

            .footer {
                text-align: center;
            }

            .details {
                margin-bottom: 20px;

            }

            .details div {
                margin-bottom: 10px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }

            table, th, td {
                border: 1px solid #ddd;
            }

            th, td {
                padding: 8px;
                text-align: left;
            }

            .total {
                text-align: right;
                font-weight: bold;
            }
        </style>

    `,

})
export class ClientListComponent implements OnInit {
    abcForms: any;
    public error: string = '';
    navigation: FuseNavigationItem[];
    tipoDocumento: string = 'boleta';
    selectedClient: any = {};
    siguienteNumero: number ;
    pan: number;
    serie: string;
    @Input() clients: ProductoVendidos[] = [];
    @Input() factura: Factura[] = [];
    @Input() producto: Producto[] = [];
    @Input() clientes: Clientes[] = [];
    @Output() eventNew = new EventEmitter<boolean>();
    @Output() eventEdit = new EventEmitter<number>();
    @Output() facturaNew = new EventEmitter<boolean>();
    @Output() eventDelete = new EventEmitter<number>();
    @Output() eventAssign = new EventEmitter<number>();
    fechaHoy: string;
    showMenu: boolean = false;

    constructor(private _matDialog: MatDialog,
                private pdfViewerService: PdfViewerService,
                private pdfGeneratorService: PDFGeneratorService,
                private router: Router, // Inyecta el Router aquí
                private clienteService: ClientService,
                private _productoService: ProductoService,
                private facturaService: FacturaService,
                private toastr: ToastrService,

    ) {}



    productoform = new FormGroup({
        nombreVen: new FormControl('', [Validators.required]),
        serie: new FormControl('', [Validators.required]),
        clienteId: new FormControl('', [Validators.required]),
        personalId: new FormControl('1', [Validators.required]),

    });


    public Guardar(): void {
        if (this.productoform.valid) { // Si el formulario es válido
            const data = this.productoform.value;
            this.saveClient(data);
            this.productoform.reset(); // resetea el formulario
        } else {
            this.toastr.warning('Rellene todos los campos por favor', 'Alerta', {
                timeOut: 5000, // Duración en milisegundos
                progressBar: true,
                closeButton: true
            });
        }
    }

saveClient(data: Object): void {
    this.facturaService.add$(data).subscribe((response) => {
        if (response) {
            this.getClientes();
            this.toastr.success('Guardado exitosamente',"",{
                timeOut: 5000, // Duración en milisegundos
                progressBar: true,
                closeButton: true
            }); // muestra el mensaje de éxito
        }
    });
}

    getClientes(): void {
        this.facturaService.getAll$().subscribe(
            (response) => {
                console.log(response);
                this.factura = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }




    ngOnInit() {
        this.abcForms = abcForms;
        const hoy = new Date();
        this.fechaHoy = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;
        this.pan = this.getNextNumero();
        this.productoform.controls['nombreVen'].setValue(this.pan.toString()); // Convierte pan a string


    }
    onTipoDocumentoChange(): void {
        const serie = this.getSerie();
        this.productoform.controls['serie'].setValue(serie); // Actualiza el campo "serie"
    }
    ngOnChanges(changes: SimpleChanges) {
        if (changes.factura) {
            this.pan = this.getNextNumero();
            this.productoform.controls['nombreVen'].setValue(this.pan.toString()); // Convierte pan a string
            console.log('El número más alto es:', this.pan - 1); // Muestra el número más alto en la consola
        }
    }

    getProductoNombre(id: number): string {
        const producto = this.producto.find(p => p.id === id);
        return producto ? producto.nombre : 'Producto no encontrado';
    }


    getFilteredClients() {
        const nextNumero = this.getNextNumero();
        return this.clients.filter(client => Number(client.nombreVen) === nextNumero);
    }


    getNextNumero(): number {
        const numeros = this.factura.map(f => Number(f.nombreVen));
        const maxNumero = Math.max(...numeros);
        const pan = maxNumero + 1;
        return pan ;
    }
    getSubTotal(): number {
        return this.getTotalSum() / 1.18;
    }
    getIGV(): number {
        return this.getTotalSum() - this.getSubTotal();
    }

    getTotalSum(): number {
        return this.getFilteredClients().reduce((sum, client) => sum + Number(client.total), 0);
    }

    getSerie(): string {
        return this.tipoDocumento === 'boleta' ? 'BAJA' : 'FAJA';
    }
    onSelectChange(id: string): void {
        const selectedId = Number(id);
        this.selectedClient = this.clientes.find(cliente => cliente.id === selectedId);
        this.productoform.controls['clienteId'].setValue(id); // Pasa el id como string
    }




    public goNew(): void {
        this.eventNew.emit(true);

    }

    public NuevaFactura(): void {
        this.facturaNew.emit(true);

    }

    public goEdit(id: number): void {
        this.eventEdit.emit(id);
    }


    public goDelete(id: number): void {
        this.eventDelete.emit(id);
    }

    public goAssign(id: number): void {
        this.eventAssign.emit(id);
    }

    // Simula la carga de datos de clients


    generatePDF(clientId: number): void {
        const pdfContentId = 'pdf-content-' + clientId;
        const pdfContent = document.getElementById(pdfContentId) as HTMLElement;

        if (pdfContent) {
            pdfContent.style.display = 'block';

            setTimeout(() => {
                this.pdfGeneratorService.generatePDF(pdfContentId);
                pdfContent.style.display = 'none';
            }, 500); // Ajustar el retraso si es necesario
        } else {
            console.error('PDF content element not found:', pdfContentId);

        }
    }






}

