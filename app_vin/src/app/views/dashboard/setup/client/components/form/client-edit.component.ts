import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {abcForms} from '../../../../../../../environments/generals';
import {Client} from '../../models/client';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-client-edit',
  standalone: true,
  imports: [FormsModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSlideToggleModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="flex flex-col max-w-240 md:min-w-160 max-h-screen -m-6">
      <!-- Header -->
      <div class="flex flex-0 items-center justify-between h-16 pr-3 sm:pr-5 pl-6 sm:pl-8 "style="background-color: lightseagreen; color: white">
        <div class="text-lg font-medium" [innerHTML]="title"></div>
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
                <mat-label>Nombre o Razon Social</mat-label>
                <input matInput formControlName="nombreRazonSocial" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>Direccion</mat-label>
                <input matInput formControlName="direccion" />
            </mat-form-field>
            <mat-form-field>
                <mat-label>DNI/RUC</mat-label>
                <input matInput formControlName="dni_ruc" />
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
  `
})
export class ClientEditComponent implements OnInit {
    clientForm = new FormGroup({
        nombreRazonSocial: new FormControl('', [Validators.required]),
        direccion: new FormControl('', [Validators.required]),
        dni_ruc: new FormControl('', [Validators.required]),
    });
  @Input() title: string = '';
  @Input() client = new Client();
  abcForms: any;

  constructor(
      private formBuilder: FormBuilder,
      private _matDialog: MatDialogRef<ClientEditComponent>,
  ) {
  }

  ngOnInit() {
    this.abcForms = abcForms;

    if (this.client) {
        console.log(this.client);
        console.log("vacio: ",this.clientForm.value);
      this.clientForm.patchValue(this.client);
        console.log("llenado: ",this.clientForm.value);
    }
  }

  public saveForm(): void {
    if (this.clientForm.valid) {
      this._matDialog.close(this.clientForm.value);
    }
  }

  public cancelForm(): void {
    this._matDialog.close('');
  }
}
