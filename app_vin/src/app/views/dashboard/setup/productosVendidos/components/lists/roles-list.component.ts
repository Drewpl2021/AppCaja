import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { abcForms } from '../../../../../../../environments/generals';
import { ProductoVendidos } from '../../models/productoVendidos';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {Factura} from "../../models/factura";
import {Producto} from "../../models/producto";
import {PdfViewerService} from "../../../../../../providers/services";
import {PDFGeneratorService} from "../pdf";

@Component({
    selector: 'app-clients-list',
    imports: [CommonModule, RouterOutlet, MatButtonModule, MatIconModule],
    standalone: true,
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <!-- Encabezado principal -->
            <div class="flex justify-between items-center mb-2 bg-slate-300 text-black p-4 rounded">
                <h2 class="text-2xl font-bold">
                    Lista de <span class="text-primary">Clientes</span>
                </h2>
                <button mat-flat-button [color]="'primary'" (click)="goNew()">
                    <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
                    <span class="ml-2">Nuevo Cliente</span>
                </button>



            </div>


            <div class="bg-white rounded overflow-hidden shadow-lg">
                <div class="p-2 overflow-scroll px-0">
                    <table class="w-full table-fixed">
                        <thead class="bg-primary-600 text-white">
                            <tr>
                                <th class="w-1/6 table-head text-center px-5 border-r">#</th>
                                <th class="w-2/6 table-header text-center">
                                    Serie
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Numero de boleta
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Producto
                                </th>

                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Cantidad
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Total
                                </th>
                                <th class="w-2/6 table-header text-center">
                                    Precio Unitario
                                </th>



                                <th class="w-2/6 table-header text-center">
                                    Acciones
                                </th>
                            </tr>
                        </thead>

                        <tbody
                            class="bg-white"
                            *ngFor="let r of clients; let i = index;">
                            <tr class="hover:bg-gray-100" >
                                <td class="w-1/6 p-2 text-center border-b" >
                                    {{ i }}
                                </td>
                                <td class="w-2/6 p-2 text-center border-b text-sm">
                                    <ng-container *ngFor="let a of producto">
                                        <span *ngIf="r.productoId === a.id">{{ a.nombre }}</span>
                                    </ng-container>
                                </td>
                                <td class="w-2/6 p-2  text-center border-b text-sm">
                                    {{ r.nombreVen }}
                                </td>
                                <td class="w-2/6 p-2  text-center border-b text-sm">
                                    {{ r.cantidad }}
                                </td>
                                <td class="w-2/6 p-2  text-center border-b text-sm">
                                    {{ r.total }}
                                </td>
                                <td class="w-2/6 p-2  text-center border-b text-sm" >
                                    {{ r.precioUnitario }}
                                </td>
                                <td class="w-2/6 p-2  text-center border-b text-sm" *ngFor=" let f of factura;">
                                    {{ f.serie }}
                                </td>


                                <td class="w-2/6 p-2 text-center border-b text-sm">
                                    <div class="flex justify-center space-x-3">
                                        <mat-icon class="text-amber-400 hover:text-amber-500 cursor-pointer"
                                            (click)="goEdit(r.id)">edit</mat-icon>

                                        <mat-icon class="text-rose-500 hover:text-rose-600 cursor-pointer"
                                            (click)="goDelete(r.id)">delete_sweep</mat-icon>
                                       <!-- <mat-icon
                                            class="text-sky-400 hover:text-sky-600 cursor-pointer"
                                            (click)="goAssign(r.id)"
                                            >swap_horiz
                                        </mat-icon>-->
                                        <button
                                                  (click)="generatePDF(r.id)">Generar PDF</button>


                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!--<div class="px-5 py-2 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                        <span class="text-xs xs:text-sm text-gray-900">
                            Showing 1 to 4 of 50 Entries
                        </span>
                        <div class="inline-flex mt-2 xs:mt-0">
                            <button class="text-sm text-primary-50 transition duration-150 hover:bg-primary-500 bg-primary-600 font-semibold py-2 px-4 rounded-l">
                                Prev
                            </button>
                            &nbsp; &nbsp;
                            <button class="text-sm text-primary-50 transition duration-150 hover:bg-primary-500 bg-primary-600 font-semibold py-2 px-4 rounded-r">
                                Next
                            </button>
                        </div>
                    </div>-->
                </div>
            </div>
        </div>









        <div id="pdf-content"  *ngFor="let client of clients">
            <div [id]="'pdf-content-' + client.id" style="display: none;">


                <div style="display:flex;">
                    <div ><h1>titulo de factura</h1></div>

                    <div></div>
                </div>
                <div *ngFor=" let f of factura;">
                    Fecha de emicion:{{f.fecha_hora}}
                </div>


                <h1>Hola mundo</h1>
                <p>Este es un parrafo</p>

                <h2>Lista de Productos</h2>
                <div style="font-size: 50px;" *ngFor="let a of producto">
                    <span *ngIf="client.productoId === a.id">{{ a.nombre }}</span>
                </div>
            </div>
        </div>

        <style>
            #pdf-content {
            font-family: Arial, sans-serif;
            font-size: 50px;

            }

        #pdf-content h1 {
            color: #333;
        }

        #pdf-content p {
            font-size: 14px;
            color: #666;
        }
            .base {
                font-size: 50px;

            }
        </style>
    `,

})
export class ClientListComponent implements OnInit {
    abcForms: any;
    @Input() clients: ProductoVendidos[] = [];
    @Input() factura: Factura[] = [];
    @Input() producto: Producto[] = [];
    @Output() eventNew = new EventEmitter<boolean>();
    @Output() eventEdit = new EventEmitter<number>();
    @Output() eventDelete = new EventEmitter<number>();
    @Output() eventAssign = new EventEmitter<number>();



    constructor(private _matDialog: MatDialog,
                private pdfViewerService: PdfViewerService,
                private pdfGeneratorService: PDFGeneratorService
    ) {}

    ngOnInit() {
        this.abcForms = abcForms;
    }


    public goNew(): void {
        this.eventNew.emit(true);
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

