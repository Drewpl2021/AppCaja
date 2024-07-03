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
            (eventNew)="eventNew($event)"
            (eventEdit)="eventEdit($event)"

            (eventDelete)="eventDelete($event)"
        ></app-clients-list>
    `,
})
export class ProductoContainerComponent implements OnInit {
    public error: string = '';
    public clients: Producto[] = [];
    public client = new Producto();

    constructor(
        private _clientService: ProductoService,
        private _confirmDialogService: ConfirmDialogService,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit() {
        this.getClients();
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

    openModalEdit(data: Producto) {
        console.log(data);
        if (data) {
            const clienteForm = this._matDialog.open(ProductoEditComponent);
            clienteForm.componentInstance.title =`Editar <b>${data.nombre || data.id} </b>`;
            clienteForm.componentInstance.client = data;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.editClient(data.id, result);
                }
            });
        }
    }

    editClient(idClient: number, data: Object) {
        this._clientService.update$(idClient, data).subscribe((response) => {
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

