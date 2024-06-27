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
    ],
    template: `
        <app-clients-list
            class="w-full"
            [clients]="clients"
            [factura]="factura"
            [producto]="producto"
            (eventNew)="eventNew($event)"
            (eventEdit)="eventEdit($event)"

            (eventDelete)="eventDelete($event)"
        ></app-clients-list>


    `,
})
export class ProductoVendidosContainerComponent implements OnInit {
    public error: string = '';
    public clients: ProductoVendidos[] = [];
    public factura: Factura[] = [];
    public producto: Producto[] = [];
    public client = new ProductoVendidos();

    constructor(
        private _clientService: ProductoVendidosService,
        private _facturaService: FacturaService,
        private _productoService: ProductoService,
        private _confirmDialogService:ConfirmDialogService,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit() {
        this.getClients();
        this.getFactura();
        this.getProducto();
    }



    getClients(): void {
        this._clientService.getAll$().subscribe(
            (response) => {
                console.log(response);
                this.clients = response;
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


    public eventNew($event: boolean): void {
        if ($event) {
            const clienteForm = this._matDialog.open(ProductoVendidosNewComponent);
            clienteForm.componentInstance.title = 'Nuevo Product' || null;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.saveClient(result);
                }
            });
        }
    }

    saveClient(data: Object): void {
        this._clientService.add$(data).subscribe((response) => {
        if (response) {
            this.getClients()
        }
        });
    }


    eventEdit(idClient: number): void {
        const listById = this._clientService
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
        this._clientService.update$(idClient,data).subscribe((response) => {
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
            this._clientService.delete$(idClient).subscribe((response) => {
                this.clients = response;
            });
            this.getClients();
        }).catch(() => {
        });

    }













}



