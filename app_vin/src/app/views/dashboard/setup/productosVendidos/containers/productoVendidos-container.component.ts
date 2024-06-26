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
            (eventNew)="eventNew($event)"
            (eventEdit)="eventEdit($event)"

            (eventDelete)="eventDelete($event)"
        ></app-clients-list>
    `,
})
export class ProductoVendidosContainerComponent implements OnInit {
    public error: string = '';
    public clients: ProductoVendidos[] = [];
    public client = new ProductoVendidos();

    constructor(
        private _clientService: ClientService,
        private _confirmDialogService:ConfirmDialogService,
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
            clienteForm.componentInstance.title =`Editar <b>${data.nombre_razonSocial||data.id} </b>`;
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
