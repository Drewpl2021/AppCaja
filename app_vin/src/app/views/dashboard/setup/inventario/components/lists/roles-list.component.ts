import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

import { abcForms } from '../../../../../../../environments/generals';
import { Inventario } from '../../models/inventario';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {NgApexchartsModule} from "ng-apexcharts";

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
                <h2 class="font-bold" style="font-size: 30px;">
                    Lista de <span style="color: lightseagreen;">Inventario</span>
                </h2>
                <button mat-flat-button style="background-color: lightseagreen; color: white" (click)="goNew()">
                    <mat-icon>post_add</mat-icon>
                    <span class="ml-2">Nuevo Inventario</span>
                </button>
            </div>
            <div class="bg-white rounded overflow-hidden shadow-lg">
                <div class="p-2 overflow-scroll px-0">
                    <table class="w-full table-fixed">
                        <thead class="text-white" style="background-color: lightseagreen; font-size: 15px; height: 40px">
                            <tr>
                                <th class="w-1/6 table-head text-center px-5 border-r">#</th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Descripcion
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Precio Venta
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Stock
                                </th>

                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Stock Maximo
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Stock Minimo
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Estado
                                </th>
                                <th class="w-2/6 table-header text-center px-5 border-r">
                                    Accciones
                                </th>
                            </tr>
                        </thead>

                        <tbody
                            class="bg-white"
                            *ngFor="let r of clients; let i = index">
                            <tr class="hover:bg-gray-100">
                                <td class="w-1/6 p-2 text-center border-b">
                                    {{ i + 1  }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.descripcion }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.precio_venta }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.stock }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.stock_maximo }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.stock_minimo }}
                                </td>
                                <td class="w-2/6 p-2  text-start border-b text-sm">
                                    {{ r.estado }}
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
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
            </div>
        </div>
        <br>
        <br>
        <div class="flex flex-col w-full">
            <div class="container">
                <button mat-flat-button style="background-color: lightseagreen; color: white" (click)="goAumentacion()">
                    <mat-icon>swap_vert</mat-icon>
                    <span class="ml-2">Entrada - Salidas </span>

                </button>
                <br><br>
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header"></div>
                            <br>
                            <br>
                            <div class="card-body">
                                <apx-chart *ngIf="chartOptions$ | async as chartOptions"
                                           [series]="chartOptions.series"
                                           [chart]="chartOptions.chart"
                                           [title]="chartOptions.title"
                                           [xaxis]="chartOptions.xaxis">
                                </apx-chart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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
        this.chartOptions$ = this.inventarioService.getAll$().pipe(
            map(data => {
                return {
                    series: [{
                        name: 'Stock Actual',
                        data: data.map(item => {
                            const stock = parseFloat(item.stock);
                            const stockMaximo = parseFloat(item.stock_maximo);
                            const stockMinimo = parseFloat(item.stock_minimo);

                            return {
                                x: item.descripcion,
                                y: stock,
                                fillColor: stock === stockMaximo ? '#00E396' :
                                    stock === stockMinimo ? '#FF4560' :
                                        '#007BFF'
                            };
                        })
                    }],
                    chart: {
                        type: 'bar',
                        height: 350,
                        background: '#f3f3f3',
                    },
                    colors: ['#FF4560', '#00E396', '#007BFF'], // Colores personalizados para las barras
                    plotOptions: {
                        bar: {
                            distributed: true,
                            borderRadius: 0, // Barras sin bordes redondeados
                            border: {
                                show: false, // Sin bordes
                            },
                            dropShadow: {
                                enabled: false, // Sin sombra
                            }
                        }
                    },
                    fill: {
                        type: 'gradient',
                        gradient: {
                            shade: 'light',
                            type: 'horizontal',
                            shadeIntensity: 0.5,
                            gradientToColors: undefined,
                            inverseColors: true,
                            opacityFrom: 0.85,
                            opacityTo: 0.85,
                            stops: [0, 100]
                        }
                    },
                    title: {
                        text: 'Stock de Productos'
                    },
                    xaxis: {
                        type: 'category',
                        categories: data.map(item => item.descripcion)
                    }
                };
            })
        );
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
}
