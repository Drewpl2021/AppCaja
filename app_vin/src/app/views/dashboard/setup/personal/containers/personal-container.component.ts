import { Personal } from '../models/personal';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PersonalNewComponent } from '../components/form/personal-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalEditComponent } from '../components/form/personal-edit.component';
import {ConfirmDialogService} from "../../../../../shared/confirm-dialog/confirm-dialog.service";
import {ClientListComponent} from "../components";
import {PersonalService} from "../../../../../providers/services/setup/personal.service";

@Component({
    selector: 'app-personales-container',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        ClientListComponent,
        PersonalNewComponent,
        PersonalEditComponent,
        FormsModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-personal-list
            class="w-full"
            [personal] ="personales"
            (eventNew)="eventNew($event)"
            (eventEdit)="eventEdit($event)"

            (eventDelete)="eventDelete($event)"
        ></app-personal-list>
    `,
})
export class PersonalContainerComponent implements OnInit {
    public error: string = '';
    public personales: Personal[] = [];
    public client = new Personal();

    constructor(
        private _personalService: PersonalService,
        private _confirmDialogService:ConfirmDialogService,
        private _matDialog: MatDialog,
    ) {}

    ngOnInit() {
        this.getClients();
    }

    getClients(): void {
        this._personalService.getAll$().subscribe(
            (response) => {
                console.log(response);
                this.personales = response;
            },
            (error) => {
                this.error = error;
            }
        );
    }

    public eventNew($event: boolean): void {
        if ($event) {
            const clienteForm = this._matDialog.open(PersonalNewComponent);
            clienteForm.componentInstance.title = 'Nuevo Product' || null;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.saveClient(result);
                }
            });
        }
    }

    saveClient(data: Object): void {
        this._personalService.add$(data).subscribe((response) => {
        if (response) {
            this.getClients()
        }
        });
    }

    eventEdit(idClient: number): void {
        const listById = this._personalService
            .getById$(idClient)
            .subscribe(async (response) => {
                this.client = (response) || {};
                this.openModalEdit(this.client);
                listById.unsubscribe();
            });
    }

    openModalEdit(data: Personal) {
        console.log(data);
        if (data) {
            const clienteForm = this._matDialog.open(PersonalEditComponent);
            clienteForm.componentInstance.title =`Editar <b>${data.nombre||data.id} </b>`;
            clienteForm.componentInstance.client = data;
            clienteForm.afterClosed().subscribe((result: any) => {
                if (result) {
                    this.editClient( data.id,result);
                }
            });
        }
    }

    editClient( idPersonal: number,data: Object) {
        this._personalService.update$(idPersonal,data).subscribe((response) => {
            if (response) {
                this.getClients()
            }
        });
    }


    public eventDelete(idPersonal: number) {
        this._confirmDialogService.confirmDelete(
            {
                // title: 'Confirmación Personalizada',
                // message: `¿Quieres proceder con esta acción ${}?`,
            }
        ).then(() => {
            this._personalService.delete$(idPersonal).subscribe((response) => {
                this.personales = response;
            });
            this.getClients();
        }).catch(() => {
        });

    }
}
