import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import { abcForms } from '../../../../../../../environments/generals';
import { Inventario } from '../../models/inventario';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {NgApexchartsModule} from "ng-apexcharts";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import {InventarioService} from "../../../../../../providers/services/setup/inventario.service";
import {map, Observable} from "rxjs";
import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexTitleSubtitle
} from "ng-apexcharts";
import {InventarioDetalle} from "../../models/inventarioDetalle";
import {InventariodetalleService} from "../../../../../../providers/services/setup/inventariodetalle.service";
import {Producto} from "../../models/producto";
export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
};



@Component({
    selector: 'app-inventario-list',
    imports: [CommonModule, RouterOutlet, MatButtonModule, MatIconModule, NgApexchartsModule],
    standalone: true,
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <!-- Encabezado principal -->
            <div class="flex justify-between items-center mb-2 bg-slate-300 text-black p-4 rounded">
                <h2 class="text-2xl font-bold">
                    <span class="text-primary">Detalle De Inventarios</span>
                </h2>

            </div>

            <div  class="bg-white rounded overflow-hidden shadow-lg">
                <div class="p-2 overflow-scroll px-0">
                    <table class="w-full table-fixed">
                        <thead class="bg-primary-600 text-white">
                            <tr>
                                <th class="w-1/6 table-head text-center px-5 border-r">#</th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Codigo De Transaccion
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Fecha
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Entrada
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Salida
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Costo Total
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Precio De Compra
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            id="pdfTable" class="bg-white"
                            *ngFor="let r of clients; let i = index">
                            <tr class="hover:bg-gray-100">
                                <td class="w-1/6 p-2 text-center border-b">
                                    {{ i }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.codigo_transaccion }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.fecha | date:'dd/MM/yyyy' }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.entrada }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.salida }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.costo_total }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.precio_de_compra }}
                                </td>



                                <td class="w-2/6 p-2 text-center border-b text-sm">
                                    <div class="flex justify-center space-x-3">
                                        <mat-icon class="text-green-500 hover:text-green-600 cursor-pointer"
                                                  (click)="downloadPDF()">picture_as_pdf</mat-icon>

                                        <mat-icon class="text-rose-500 hover:text-rose-600 cursor-pointer"
                                            (click)="goDelete(r.id)">delete_sweep</mat-icon>
                                       <!-- <mat-icon
                                            class="text-sky-400 hover:text-sky-600 cursor-pointer"
                                            (click)="goAssign(r.id)"
                                            >swap_horiz
                                        </mat-icon>-->
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        </div>

        <br>
        <br>
            <style>
                /* Estilos para el contenedor del encabezado */
                .encabezado {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #4A90E2; /* Cambia el color de fondo según prefieras */
                    color: white; /* Color del texto */
                    padding: 20px; /* Espaciado interno */
                    border-radius: 10px; /* Bordes redondeados */
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra suave */
                    margin-bottom: 20px; /* Espaciado externo */
                }

                /* Estilos para el título */
                .texto-titulo {
                    font-size: 24px; /* Tamaño del texto */
                    font-weight: bold; /* Negrita */
                }
            </style>

    `,
})
export class ClientListComponent implements OnInit {
    abcForms: any;
    @Input() clients: Inventario[] = [];
    @Input() detalle: InventarioDetalle[] = [];
    @Input() producto: Producto[] = [];
    selectedClient: any ={};
    @Output() eventNew = new EventEmitter<boolean>();
    @Output() entrada = new EventEmitter<boolean>();
    @Output() eventEdit = new EventEmitter<number>();
    @Output() eventDelete = new EventEmitter<number>();
    @Output() eventAssign = new EventEmitter<number>();

    @ViewChild("chart") chart: ChartComponent;
    chartOptions$: Observable<Partial<ChartOptions>>;

    constructor(private _matDialog: MatDialog,
                private inventarioService: InventarioService,
                private inventariodetalleService: InventariodetalleService
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
    public goAumentacion(): void {
        this.entrada.emit(true);
    }

    getProductoNombre(id: number): string {
        const producto = this.producto.find(p => p.id === id);
        return producto? producto.descripcion : 'Producto no encontrado';
    }
    public downloadPDF(): void {
        const DATA = document.getElementById('pdfTable');
        if (DATA) {
            html2canvas(DATA).then(canvas => {
                const fileWidth = 208;
                const fileHeight = (canvas.height * fileWidth) / canvas.width;
                const FILEURI = canvas.toDataURL('image/png');
                const PDF = new jsPDF('p', 'mm', 'a4');
                const position = 0;
                PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
                PDF.save('reporte-inventario.pdf');
            });
        } else {
            console.error('Elemento no encontrado');
        }
    }

}
