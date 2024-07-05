import { Inventario } from '../models/inventario';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InventariodetalleNewComponent } from '../components/form/inventariodetalle-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventariodetalleEditComponent } from '../components/form/inventariodetalle-edit.component';
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ClientListComponent} from "../components";
import {ClientService} from "../../../../../providers/services/setup/client.service";
import {InventarioService} from "../../../../../providers/services/setup/inventario.service";
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
        InventariodetalleNewComponent,
        InventariodetalleEditComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-inventario-list
            class="w-full"
            [clients]="clients"
            (eventNew)="eventNew($event)"
            (eventEdit)="eventEdit($event)"
            (eventDelete)="eventDelete($event)"
        ></app-inventario-list>
    `,
})
export class InventariodetalleContainerComponent implements OnInit {
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
    }
    getClients(): void {
        this._inventarioService.getAll$().subscribe(
            (response) => {
                console.log(response);
                this.clients = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }


    public eventNew($event: boolean): void {
        if ($event) {
            const clienteForm = this._matDialog.open(InventariodetalleNewComponent);
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

    openModalEdit(data: Inventario) {
        console.log(data);
        if (data) {
            const clienteForm = this._matDialog.open(InventariodetalleEditComponent);
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
