import { Inventario } from '../models/inventario';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InventarioNewComponent } from '../components/form/inventario-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventarioEditComponent } from '../components/form/inventario-edit.component';
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ClientListComponent} from "../components";
import {ClientService} from "../../../../../providers/services/setup/client.service";
import {InventarioService} from "../../../../../providers/services/setup/inventario.service";
import {EntradaNewComponent} from "../components/form/entrada-new.component";
import {InventariodetalleService} from "../../../../../providers/services/setup/inventariodetalle.service";
import {InventarioDetalle} from "../models/inventarioDetalle";
import {float} from "html2canvas/dist/types/css/property-descriptors/float";

@Component({
    selector: 'app-clients-container',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ClientListComponent,
        InventarioNewComponent,
        InventarioEditComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-inventario-list
            class="w-full"
            [clients]="clients"
            (eventNew)="eventNew($event)"
            (entrada)="evententra($event)"
            (eventEdit)="eventEdit($event)"
            (eventDelete)="eventDelete($event)"
        ></app-inventario-list>
    `,
})
export class InventarioContainerComponent implements OnInit {
    public error: string = '';
    public clients: Inventario[] = [];
    public detalle: InventarioDetalle[] = [];
    public client = new Inventario();

    constructor(
        private _clientService: InventarioService,
        private _confirmDialogService:ConfirmDialogService,
        private _matDialog: MatDialog,
        private _inventarioService: InventariodetalleService
    ) {}

    ngOnInit() {
        this.getClients();
        this.getDetalle()

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
    getDetalle(): void {
        this._inventarioService.getAll$().subscribe(
            (response) => {
                console.log(response);
                this.detalle = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const clienteForm = this._matDialog.open(InventarioNewComponent);
            clienteForm.componentInstance.title = 'Nuevo Product' || null;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.saveClient(result);
                }
            });
        }
    }
    public evententra($event: boolean): void {
        if ($event) {
            const clienteForm = this._matDialog.open(EntradaNewComponent);
            clienteForm.componentInstance.title = 'Nuevo Product' || null;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.savedetalle(result);
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
    /*{
    "codigo_transaccion":"002",
    "entrada": 0,
    "salida": 100,
    "precio_de_compra":"100",
    "inventario": {
        "id": 1
    },
    "producto":{
        "id": 1
    }
    codigo_transaccion
:
"1"
entrada
:
"1"
inventario_id
:
"1"
precio_de_compra
:
"1"
productoId
:
"1"
salida
:
"1"
}*/

    savedetalle(data: any): void {
        const paramsproducto:any = {};
        const paramsinventario:any ={};
        const params:any ={};
        paramsinventario.id = parseInt(data.inventario_id);
        paramsproducto.id = parseInt(data.productoId);
        //pasamos un objeto
        params.producto = paramsproducto;
        params.inventario = paramsinventario;
        params.codigo_transaccion = data.codigo_transaccion;
        params.entrada = parseFloat(data.entrada);
        params.salida = parseFloat(data.salida);
        params.precio_de_compra = data.precio_de_compra;
        this._inventarioService.add$(params).subscribe((response) => {
            if (response) {
                this.getDetalle()
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

    openModalEdit(data: Inventario) {
        console.log(data);
        if (data) {
            const clienteForm = this._matDialog.open(InventarioEditComponent);
            clienteForm.componentInstance.title =`Editar <b>${data.descripcion||data.id} </b>`;
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
