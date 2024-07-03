import { ProductoVendidos } from '../models/productoVendidos';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductoVendidosNewComponent } from '../components/form/productoVendidos-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoVendidosEditComponent } from '../components/form/productoVendidos-edit.component';
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ClientListComponent} from "../components";
import {ClientService} from "../../../../../providers/services/setup/client.service";
import {ProductoVendidosService} from "../../../../../providers/services/setup/productoVendidos.service";
import {Factura} from "../models/factura";
import {FacturaService} from "../../../../../providers/services/setup/factura.service";
import {Producto} from "../models/producto";
import {ProductoService} from "../../../../../providers/services/setup/producto.service";
import {PdfViewerService} from "../../../../../providers/services";
import {NewFacturaComponent} from "../components/form/factura-new.component";
import {Clientes} from "../models/clientes";

import { ClipboardModule } from 'ngx-clipboard';
import {ClientNewComponent} from "../components/form/client-new.component";

@Component({
    selector: 'app-clients-container',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ClientListComponent,
        ProductoVendidosNewComponent,
        ProductoVendidosEditComponent,
        FormsModule,
        ReactiveFormsModule,
        NewFacturaComponent,
    ],
    template: `
        <app-clients-list
            class="w-full"
            [clients]="clients"
            [factura]="factura"
            [producto]="producto"
            [clientes]="clientes"

            (eventNew)="eventNew($event)"
            (eventNewCliente)="eventNewCliente($event)"
            (eventEdit)="eventEdit($event)"
            (eventDelete)="eventDelete($event)"
        ></app-clients-list>






    `,
})
export class GenerarFacturaContainerComponent implements OnInit {
    public error: string = '';
    public clients: ProductoVendidos[] = [];
    public factura: Factura[] = [];
    public clientes: Clientes[] = [];
    public producto: Producto[] = [];
    public client = new ProductoVendidos();

    constructor(
        private _vendidosService: ProductoVendidosService,
        private _facturaService: FacturaService,
        private _clientesService: ClientService,
        private _productoService: ProductoService,
        private _confirmDialogService:ConfirmDialogService,
        private _matDialog: MatDialog,
        private pdfViewerService: PdfViewerService,
    ) {}




    downloadPdf(id: number) {
        this.pdfViewerService.downloadPdf(id).subscribe(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'query_results.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }




    ngOnInit() {
        this.getClients();
        this.getFactura();
        this.getProducto();
        this.getnombre();
    }



    getClients(): void {
        this._vendidosService.getAll$().subscribe(
            (response) => {
                console.log(response);
                this.clients = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }
    getnombre(): void {
        this._clientesService.getAll$().subscribe(
            (response) => {
                console.log(response);
                this.clientes = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }



    getProducto(): void {
        this._productoService.getAll$().subscribe(
            (response) => {
                console.log(response);
                this.producto = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    getFactura(): void {
        this._facturaService.getAll$().subscribe(
            (response) => {
                console.log(response);
                this.factura = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNewCliente($event: boolean): void {
        if ($event) {
            const clienteForm = this._matDialog.open(ClientNewComponent);
            clienteForm.componentInstance.title = 'Nuevo Product' || null;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.guardarClient(result);
                }
            });
        }
    }
    guardarClient(data: Object): void {
        this._clientesService.add$(data).subscribe((response) => {
            if (response) {
                this.getnombre()
            }
        });
    }

    public eventNew(event: { pan: number, success: boolean }): void {
        if (event.success) {
            const clienteForm = this._matDialog.open(ProductoVendidosNewComponent, {
                data: { pan: event.pan }
            });
            clienteForm.componentInstance.pan = event.pan; // Asegúrate de pasar el dato correctamente
            clienteForm.componentInstance.title = 'Nuevo Producto' || null;
            clienteForm.componentInstance.factura = this.factura;
            clienteForm.componentInstance.producto = this.producto;

            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.saveClient(result);
                }
            });
        }
    }


    saveClient(data: Object): void {
        this._vendidosService.add$(data).subscribe((response) => {
        if (response) {
            this.getClients()
        }
        });
    }
    //public NuevaFactura($event: boolean): void {
    //    if ($event) {
    //        const clienteForm = this._matDialog.open(NewFacturaComponent);
    //        clienteForm.afterClosed().subscribe((result: any) => {
    //            if (result) {
    //                this.saveClient(result);
    //            }
    //        });
    //    }
    //}


    eventEdit(idClient: number): void {
        const listById = this._vendidosService
            .getById$(idClient)
            .subscribe(async (response) => {
                this.client = (response) || {};
                this.openModalEdit(this.client);
                listById.unsubscribe();
            });
    }

    openModalEdit(data: ProductoVendidos) {
        console.log(data);
        if (data) {
            const clienteForm = this._matDialog.open(ProductoVendidosEditComponent);
            clienteForm.componentInstance.title =`Editar <b>${data.nombreVen||data.id} </b>`;
            clienteForm.componentInstance.client = data;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.editClient( data.id,result);
                }
            });
        }
    }

    editClient( idClient: number,data: Object) {
        this._vendidosService.update$(idClient,data).subscribe((response) => {
            if (response) {
                this.getClients()
            }
        });
    }


    public eventDelete(idClient: number) {
        this._confirmDialogService.confirmDelete(
            {
                // title: 'Confirmación Personalizada',
                // message: `¿Quieres proceder con esta acción ${}?`,
            }
        ).then(() => {
            this._vendidosService.delete$(idClient).subscribe((response) => {
                this.clients = response;
            });
            this.getClients();
        }).catch(() => {
        });



    }













}



