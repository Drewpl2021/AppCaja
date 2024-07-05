import { Producto } from '../models/producto';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProductoNewComponent } from '../components/form/producto-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoEditComponent } from '../components/form/producto-edit.component';
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ClientListComponent} from "../components";
import {ClientService} from "../../../../../providers/services/setup/client.service";
import {ProductoService} from "../../../../../providers/services/setup/producto.service";
import {ProductoVendidosNewComponent} from "../../generarFactura/components/form/productoVendidos-new.component";
import {ProveedorService} from "../../../../../providers/services/setup/proveedor.service";
import {Proveedor} from "../models/proveedor";

@Component({
    selector: 'app-clients-container',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ClientListComponent,
        ProductoNewComponent,
        ProductoEditComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-clients-list
            class="w-full"
            [clients]="clients"
            [proveedor]="proveedor"
            (eventNew)="eventNew($event)"
            (eventEdit)="eventEdit($event)"

            (eventDelete)="eventDelete($event)"
        ></app-clients-list>
    `,
})
export class ProductoContainerComponent implements OnInit {
    public error: string = '';
    public clients: Producto[] = [];
    public proveedor: Proveedor[] = [];
    public client = new Producto();

    constructor(
        private _clientService: ProductoService,
        private _proveedor: ProveedorService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit() {
        this.getClients();
        this.getProveedor();
        console.log('Datos de proveedores Enviados:', this.proveedor);
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

    getProveedor(): void {
        this._proveedor.getAll$().subscribe(
            (response) => {
                console.log(response);
                this.proveedor = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const clienteForm = this._matDialog.open(ProductoNewComponent);
            clienteForm.componentInstance.title = 'Nuevo Product' || null;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.saveClient(result);
                }
            });
        }
    }

    saveClient(data: any): void {
        const paramsProveedor : any={};
        const params : any={};
        paramsProveedor.id = parseInt(data.proveedor);
        params.proveedor = paramsProveedor;
        params.nombre = data.nombre;
        params.descripcion = data.descripcion;
        params.precio = data.precio;
        params.stock = data.stock;
        params.unidades_medida = data.unidades_medida;
        console.log(params);
        this._clientService.add$(params).subscribe((response) => {
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


    openModalEdit(data: Producto) {
        console.log(data);
        if (data) {
            const clienteForm = this._matDialog.open(ProductoEditComponent);
            clienteForm.componentInstance.title =`Editar <b>${data.nombre || data.id} </b>`;
            clienteForm.componentInstance.client = data;
            clienteForm.componentInstance.proveedor = this.proveedor;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.editClient(data.id, result);
                }
            });
            console.log('Datos de proveedores enviados:', this.proveedor);
        }
    }

    editClient(idClient: number, data: any) {
        const paramsProveedor : any={};
        const params : any={};
        paramsProveedor.id = parseInt(data.proveedor);
        params.proveedor = paramsProveedor;
        params.nombre = data.nombre;
        params.descripcion = data.descripcion;
        params.precio = data.precio;
        params.stock = data.stock;
        params.unidades_medida = data.unidades_medida;
        console.log(params);
        this._clientService.update$(idClient, params).subscribe((response) => {
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

