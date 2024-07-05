import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { abcForms } from '../../../../../../../environments/generals';
import { ProductoVendidos } from '../../models/productoVendidos';
import { CommonModule } from '@angular/common';
import {Router, RouterOutlet} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import {Factura} from "../../models/factura";
import {Producto} from "../../models/producto";
import {PdfViewerService} from "../../../../../../providers/services";
import {PDFGeneratorService} from "../pdf";
import {ProductoVendidosNewComponent} from "../form/productoVendidos-new.component";
import {NewFacturaComponent} from "../form/factura-new.component";
import {Clientes} from "../../models/clientes";
import {FuseNavigationItem} from "../../../../../../../@fuse/components/navigation";
import * as XLSX from 'xlsx';
import * as XLSXStyle from 'xlsx-style';
import { saveAs } from 'file-saver';
import {ToastrService} from "ngx-toastr";
import {ClientService} from "../../../../../../providers/services/setup/client.service";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
    selector: 'app-clients-list',
    imports: [CommonModule, RouterOutlet, MatButtonModule, MatIconModule],
    standalone: true,
    template: `
        <div class="w-full mx-auto p-6 bg-white rounded overflow-hidden shadow-lg">
            <div class="flex justify-between items-center mb-2 bg-slate-300 text-black p-4 rounded">
                <h2 class="font-bold" style="font-size: 30px;">
                    Lista de <span class="" style="color: lightseagreen;">Productos Vendidos</span>
                </h2>
                <button mat-flat-button style="background-color: lightseagreen; color: white" (click)="exportTableToExcel()">
                    <mat-icon>download</mat-icon>
                    <span class="ml-2">Descargar Reporte</span>
                </button>
            </div>

            <div class="bg-white rounded overflow-hidden shadow-lg">
                <div class="p-2 overflow-scroll px-0">
                    <table id="dataTable" class="w-full table-fixed">
                        <thead class="text-white" style="background-color: lightseagreen; font-size: 15px; height: 40px">
                        <tr>
                            <th class="w-1/6 table-head text-center px-5 border-r">#</th>
                            <th class="w-2/6 table-header text-center">
                                Cliente
                            </th>
                            <th class="w-2/6 table-header text-center px-5 border-r">
                                Serie
                            </th>
                            <th class="w-2/6 table-header text-center px-5 border-r">
                                IGV
                            </th>
                            <th class="w-2/6 table-header text-center">
                                Sub Total
                            </th>
                            <th class="w-2/6 table-header text-center px-5 border-r">
                                Total
                            </th>
                            <th class="w-2/6 table-header text-center">
                                Acciones
                            </th>
                        </tr>
                        </thead>
                        <tbody *ngFor="let r of factura; let i = index;">
                        <tr class="hover:bg-gray-100">
                            <td class="w-1/6 p-2 text-center border-b">{{ i + 1 }}</td>
                            <td class="w-2/6 p-2 text-center border-b text-sm">
                                <ng-container *ngFor="let a of clientes">
                                    <span *ngIf="r.clienteId === a.id">{{ a.nombreRazonSocial }}</span>
                                </ng-container>
                            </td>
                            <td class="w-2/6 p-2 text-center border-b text-sm">
                                {{ r.serie }} - {{ r.nombreVen }}
                            </td>
                            <td class="w-2/6 p-2 text-center border-b text-sm">
                                {{ r.igv }} {{ r.igv === 1 ? 'SOL' : 'SOLES' }}
                            </td>
                            <td class="w-2/6 p-2 text-center border-b text-sm">
                                {{ r.subTotal }} {{ r.subTotal === 1 ? 'SOL' : 'SOLES' }}
                            </td>
                            <td class="w-2/6 p-2 text-center border-b text-sm">
                                {{ r.total }} {{ r.total === 1 ? 'SOL' : 'SOLES' }}
                            </td>
                            <td class="w-2/6 p-2 text-center border-b text-sm">
                                <div class="flex justify-center space-x-3">
                                    <mat-icon class="text-amber-400 hover:text-amber-500 cursor-pointer" (click)="goEdit(r.id)">edit</mat-icon>
                                    <mat-icon class="text-rose-500 hover:text-rose-600 cursor-pointer" (click)="goDelete(r.id)">delete_sweep</mat-icon>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
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
    navigation: FuseNavigationItem[];
    @Input() factura: Factura[] = [];
    @Input() producto: Producto[] = [];
    @Input() clientes: Clientes[] = [];
    @Output() eventNew = new EventEmitter<boolean>();
    @Output() eventEdit = new EventEmitter<number>();
    @Output() facturaNew = new EventEmitter<boolean>();
    @Output() eventDelete = new EventEmitter<number>();
    @Output() eventAssign = new EventEmitter<number>();



    constructor(private _matDialog: MatDialog,
                private pdfViewerService: PdfViewerService,
                private pdfGeneratorService: PDFGeneratorService,
                private toastr: ToastrService,
                private clienteService: ClientService,
                private router: Router // Inyecta el Router aquí

    ) {}



    ngOnInit() {
        this.abcForms = abcForms;
        this.getClientes();
    }


    public goNew(): void {
        this.eventNew.emit(true);
    }
    public NuevaFactura(): void {
        this.facturaNew.emit(true);

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
    getClientes(): void {
        this.clienteService.getAll$().subscribe(
            (response) => {
                this.clientes = response;
            },
            (error) => {
                console.error('Error al obtener clientes', error);
            }
        );
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
    // Método para exportar los datos a Excel
    exportTableToExcel(): void {
        // Datos de la tabla
        const dataToExport: any[] = [];
        const tableRows = document.querySelectorAll('#dataTable tbody tr');

        tableRows.forEach(row => {
            const rowData: any = {};
            const cells = row.querySelectorAll('td');
            rowData['#'] = cells[0].textContent;
            rowData['Cliente'] = cells[1].textContent;
            rowData['Serie'] = cells[2].textContent;
            rowData['IGV'] = cells[3].textContent;
            rowData['Sub Total'] = cells[4].textContent;
            rowData['Total'] = cells[5].textContent;
            dataToExport.push(rowData);
        });

        // Resumen de facturas y boletas
        let facturasCount = 0;
        let boletasCount = 0;
        let totalSum = 0;

        this.factura.forEach(fact => {
            if (fact.serie === 'E001') {
                facturasCount++;
            } else if (fact.serie === 'EB01') {
                boletasCount++;
            }
            totalSum += Number(fact.total);

        });

        const summaryData = [
            { 'Boletas Emitidas': boletasCount, 'Facturas Emitidas': facturasCount, 'Total (Soles)': totalSum }
        ];

        // Crear hojas de Excel
        const worksheetData: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
        const worksheetSummary: XLSX.WorkSheet = XLSX.utils.json_to_sheet(summaryData);

        // Aplicar estilos
        const headerStyle = {
            fill: {
                patternType: 'solid',
                fgColor: { rgb: '6C757D' } // Color de fondo gris #6C757D
            },
            font: {
                color: { rgb: 'FFFFFF' }, // Letra blanca
                bold: true
            }
        };

        // Aplicar estilo a los encabezados de worksheetData
        const rangeData = XLSX.utils.decode_range(worksheetData['!ref']!);
        for (let C = rangeData.s.c; C <= rangeData.e.c; ++C) {
            const cell_address = XLSX.utils.encode_cell({ c: C, r: 0 });
            if (!worksheetData[cell_address]) continue;
            if (!worksheetData[cell_address].s) worksheetData[cell_address].s = {};
            worksheetData[cell_address].s = headerStyle;
        }

        // Aplicar estilo a los encabezados de worksheetSummary
        const rangeSummary = XLSX.utils.decode_range(worksheetSummary['!ref']!);
        for (let C = rangeSummary.s.c; C <= rangeSummary.e.c; ++C) {
            const cell_address = XLSX.utils.encode_cell({ c: C, r: 0 });
            if (!worksheetSummary[cell_address]) continue;
            if (!worksheetSummary[cell_address].s) worksheetSummary[cell_address].s = {};
            worksheetSummary[cell_address].s = headerStyle;
        }

        const workbook: XLSX.WorkBook = {
            Sheets: { 'Datos': worksheetData, 'Resumen': worksheetSummary },
            SheetNames: ['Datos', 'Resumen']
        };
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, 'clients');
        this.toastr.success('Exportado exitosamente', '', {
            timeOut: 5000, // Duración en milisegundos
            progressBar: true,
            closeButton: true
        });
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(data, `${fileName}_${new Date().getTime()}${EXCEL_EXTENSION}`);
    }

}
