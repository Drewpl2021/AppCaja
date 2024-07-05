    import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';

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
    import {FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
    import {ClientService} from "../../../../../../providers/services/setup/client.service";
    import {MatFormFieldModule} from "@angular/material/form-field";
    import {MatInputModule} from "@angular/material/input";
    import {ProductoService} from "../../../../../../providers/services/setup/producto.service";
    import {ToastrService} from "ngx-toastr";
    import {FacturaService} from "../../../../../../providers/services/setup/factura.service";
    import {WhatsAppService} from "../../../../../../providers/services/setup/WhatsAppService.service";
    import {HttpClient, HttpEventType} from "@angular/common/http";
    import {jsPDF} from "jspdf";
    import html2canvas from "html2canvas";

    @Component({
        selector: 'app-clients-list',
        imports: [CommonModule, RouterOutlet, MatButtonModule, MatIconModule, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
        standalone: true,
        template: `
            <div   class="" style="display: flex">
                 <div>
                <div style="flex: 1; font-size: 17px; text-align: left;">
                    <strong style="font-size: 25px;">Tipo de Documento:</strong>
                    <div style="margin-top: 10px;">
                        <label style="margin-right: 15px; cursor: pointer;">
                            <input type="radio" name="tipoDocumento" value="boleta" [(ngModel)]="tipoDocumento" (change)="onTipoDocumentoChange()" /> Boleta
                        </label>
                        <label style="margin-right: 15px; cursor: pointer;">
                            <input type="radio" name="tipoDocumento" value="factura" [(ngModel)]="tipoDocumento" (change)="onTipoDocumentoChange()" /> Factura
                        </label>
                    </div>
                </div><br>
                <br>
                <div style="flex: 1; font-size: 17px; text-align: left;">
                    <strong style="font-size: 25px;">Enviar por WhatsApp:</strong><br><br>
                    <div class="input-group mb-3"  >
                        <span  class="input-group-text" id="basic-addon1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
    </svg>
                        </span>
                        <input type="text" class="form-control"[(ngModel)]="phoneNumber" placeholder="Numero de teléfono" aria-label="Username" aria-describedby="basic-addon1">
                    </div>
                    <div class=" btn btn-secondary ">
                        <button  (click)="openWhatsAppChat()">Abrir chat de WhatsApp</button>
                    </div>
                </div><br><br>
                     <div style="flex: 1; font-size: 17px; text-align: left;">
                         <strong style="font-size: 25px;">Añadir Cliente:</strong>

                     </div>
                     <div (click)="goNewCliente()" style="margin-top: 10px;" class="btn btn-secondary d-flex align-items-center justify-content-center w-48">
                         <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-person-plus me-2" viewBox="0 0 16 16">
                             <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                             <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"/>
                         </svg>
                         <span>Nuevo Cliente</span>
                     </div>

                 </div>



            <div class="main " style="margin-left: 180px; ">
                <div class="body" >
                    <div class="invoice" style="background-color: white;">
                        <div class="header" style="display: flex;">
                            <div style="margin-right: 150px">
                                <p style="font-size: 25px; "><strong>GRIFO INCAPACARITA S.A.C.</strong></p>
                                <p style="font-size: 15px; ">CARRETERA PANAMERICANA KM 265 AREQUIPA - JULIACA</p>
                                <p style="font-size: 15px;">Teléfono: 942-456-780</p>
                            </div>
                            <div style="margin-top: -20px; margin-left: 170px">
                                <img
                                    src="https://img.freepik.com/vector-premium/icono-gasolinera-concepto-combustible_11481-928.jpg"
                                    alt="Logo"
                                    style="width: 150px; height: 150px;">
                            </div>

                        </div>

                        <div class="details" >
                            <div style="display: flex; ">


                                        <div style="flex: 1; font-size: 17px;" >
                                            <strong>Nombre: </strong>
                                            <select (change)="onSelectChange($event.target.value)">
                                                <option *ngFor="let r of clientes" [value]="r.id">
                                                    {{ r.nombreRazonSocial }}
                                                </option>
                                            </select>
                                        </div>

                                        <div  style="flex: 1; font-size: 17px; text-align: left;">
                                            <strong>N° de Comprobante:</strong> {{ getSerie() }} - {{ getNextNumero() }}
                                        </div>

                            </div>

                            <div style="display: flex; margin-top: -15px">
                                <div style="flex: 1; font-size: 17px;">
                                    <strong>DNI/RUC:</strong> {{ selectedClient?.dni_ruc || '' }}
                                </div>

                                <div style="flex: 1; font-size: 17px; text-align: left;">
                                    <strong>Fecha:</strong> {{ fechaHoy }}
                                </div>

                            </div>
                            <div style="display: flex; margin-top: -15px">
                                <div style="flex: 1; font-size: 17px;">
                                    <strong>Dirección:</strong> {{ selectedClient?.direccion || '' }}
                                </div>

                            </div>
                        </div>
                        <button mat-flat-button style="background-color: lightseagreen; color: white" (click)="goNew()">
                            <mat-icon [svgIcon]="'heroicons_outline:plus'"></mat-icon>
                            <span class="ml-2">Añadir Productos</span>
                        </button>
                            <br><br>
                        <table class="w-full table-fixed">
                            <thead class=" text-white" style="background-color: lightseagreen">
                            <tr>
                                <th class="w-1/6 table-head text-center px-5 border-r">#</th>
                                <th class="w-2/6 table-header text-center px-5 border-r">Cantidad</th>
                                <th class="w-2/6 table-header text-center px-5 border-r">Unidad de Medida</th>
                                <th class="w-2/6 table-header text-center px-5 border-r">Descripción</th>
                                <th class="w-2/6 table-header text-center px-5 border-r">Precio Unitario</th>
                                <th class="w-2/6 table-header text-center">Total</th>
                                <th class="w-2/6 table-header text-center">Acciones</th>
                            </tr>
                            </thead>
                            <tbody class="bg-white" *ngFor="let r of getFilteredClients(); let i  = index">
                                <tr class="hover:bg-gray-100">
                                    <td class="w-1/6 p-2 text-center border-b">{{ i  + 1 }}</td>
                                    <td class="w-2/6 p-2 text-start border-b text-sm">{{ r.cantidad }}</td>
                                    <td class="w-2/6 p-2 text-start border-b text-sm">{{ getProductoUni(r.productoId) }} </td>
                                    <td class="w-2/6 p-2 text-start border-b text-sm">{{ getProductoNombre(r.productoId) }} </td>
                                    <td class="w-2/6 p-2 text-start border-b text-sm">{{ r.precioUnitario }} </td>
                                    <td class="w-2/6 p-2 text-start border-b text-sm">{{ r.total }}</td>
                                    <td class="w-2/6 p-2 text-center border-b text-sm">
                                        <div class="flex justify-center space-x-3">
                                            <mat-icon class="text-amber-400 hover:text-amber-500 cursor-pointer" (click)="goEdit(r.id)">edit</mat-icon>
                                            <mat-icon class="text-rose-500 hover:text-rose-600 cursor-pointer" (click)="goDelete(r.id)">delete_sweep</mat-icon>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colspan="5" class="total">Sub. Total</td>
                                <td>{{ getSubTotal() | number: '1.2-2' }}</td>
                            </tr>
                            <tr>
                                <td colspan="5" class="total">IGV</td>
                                <td>{{ getIGV() | number: '1.2-2' }}</td>
                            </tr>
                            <tr>
                                <td colspan="5" class="total">Total</td>
                                <td>{{ getTotalSum() | number: '1.2-2' }}</td>
                            </tr>
                            </tfoot>


                        </table>


                        <div class="footer">
                            <p>Gracias por su compra</p>
                        </div>
                        <form class="flex flex-col flex-auto p-6 sm:p-8 overflow-y-auto" [formGroup]="productoform"  >
                            <button mat-flat-button style="background-color: lightseagreen; color: white" (click)="Guardar()"> Generar Factura </button>
                        </form>
                    </div>

                </div>

            </div>


            </div>




            <style>
                .main {
                    width: 1000px;
                    height: 800px;

                }


                .body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    padding: 0;


                }

                .invoice {
                    max-width: 1000px;
                    margin: auto;
                    padding: 20px;
                    border: 1px solid #eee;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                }

                .footer {
                    text-align: center;
                }

                .details {
                    margin-bottom: 20px;

                }

                .details div {
                    margin-bottom: 10px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }

                table, th, td {
                    border: 1px solid #ddd;
                }

                th, td {
                    padding: 8px;
                    text-align: left;
                }

                .total {
                    text-align: right;
                    font-weight: bold;
                }
            </style>

        `,

    })
    export class ClientListComponent implements OnInit {
        abcForms: any;
        public error: string = '';
        navigation: FuseNavigationItem[];
        tipoDocumento: string = 'boleta';
        selectedClient: any = {};
        siguienteNumero: number ;
        pan: number;
        serie: string;
        @Input() clients: ProductoVendidos[] = [];
        @Input() factura: Factura[] = [];
        @Input() producto: Producto[] = [];
        @Input() clientes: Clientes[] = [];
        @Output() eventNew = new EventEmitter<{ pan: number, success: boolean }>();
        @Output() eventNewCliente = new EventEmitter<boolean>();
        @Output() eventEdit = new EventEmitter<number>();
        @Output() facturaNew = new EventEmitter<boolean>();
        @Output() eventDelete = new EventEmitter<number>();
        @Output() eventAssign = new EventEmitter<number>();
        fechaHoy: string;
        showMenu: boolean = false;
        phoneNumber: string = '';
        file: File | null = null;
        can: string;


        constructor(private _matDialog: MatDialog,
                    private pdfViewerService: PdfViewerService,
                    private pdfGeneratorService: PDFGeneratorService,
                    private router: Router, // Inyecta el Router aquí
                    private clienteService: ClientService,
                    private _productoService: ProductoService,
                    private facturaService: FacturaService,
                    private toastr: ToastrService,
                    private http: HttpClient,
                    private whatsappService: WhatsAppService,

        ) {}



        productoform = new FormGroup({
            nombreVen: new FormControl('', [Validators.required]),
            serie: new FormControl('', [Validators.required]),
            clienteId: new FormControl('', [Validators.required]),
            personalId: new FormControl('1', [Validators.required]),

        });




    saveClient(data: Object): void {
        this.facturaService.add$(data).subscribe((response) => {
            if (response) {
                this.getClientes();
                this.toastr.success('Guardado exitosamente',"",{
                    timeOut: 5000, // Duración en milisegundos
                    progressBar: true,
                    closeButton: true
                }); // muestra el mensaje de éxito
            }
        });
    }

        getClientes(): void {
            this.facturaService.getAll$().subscribe(
                (response) => {
                    console.log(response);
                    this.factura = response;
                },
                (error) => {
                    this.error = error;
                }
            );
        }




        ngOnInit() {
            this.abcForms = abcForms;
            const hoy = new Date();
            this.fechaHoy = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;
            this.pan = this.getNextNumero();
            this.productoform.controls['nombreVen'].setValue(this.pan.toString()); // Convierte pan a string


        }
        onTipoDocumentoChange(): void {
            const serie = this.getSerie();
            this.productoform.controls['serie'].setValue(serie); // Actualiza el campo "serie"
        }
        ngOnChanges(changes: SimpleChanges) {
            if (changes.factura) {
                this.pan = this.getNextNumero();
                this.productoform.controls['nombreVen'].setValue(this.pan.toString()); // Convierte pan a string
                console.log('El número más alto es:', this.pan - 1); // Muestra el número más alto en la consola
            }
        }

        getProductoNombre(id: number): string {
            const producto = this.producto.find(p => p.id === id);
            return producto ? producto.descripcion : 'Producto no encontrado';
        }

        getProductoUni(id: number): string {
            const producto = this.producto.find(p => p.id === id);
            return producto ? producto.unidades_medida : 'Producto no encontrado';
        }


        getFilteredClients() {
            const nextNumero = this.getNextNumero();
            return this.clients.filter(client => Number(client.nombreVen) === nextNumero);
        }


        getNextNumero(): number {
            const numeros = this.factura.map(f => Number(f.nombreVen));
            const maxNumero = Math.max(...numeros);
            const pan = maxNumero + 1;
            return pan ;
        }
        getTotalSum(): number {
            const totalSum = this.getFilteredClients().reduce((sum, client) => sum + Number(client.total), 0);
            return parseFloat(totalSum.toFixed(2)); // Redondea a dos decimales y devuelve como número
        }


        getSubTotal(): number {
            const subTotal = this.getTotalSum() / 1.18;
            return parseFloat(subTotal.toFixed(2)); // Convierte la cadena de nuevo a número
        }

        getIGV(): number {
            const igv = this.getTotalSum() - this.getSubTotal();
            return parseFloat(igv.toFixed(2)); // Convierte la cadena de nuevo a número
        }


        getSerie(): string {
            return this.tipoDocumento === 'boleta' ? 'EB01' : 'E001';
        }
        onSelectChange(id: string): void {
            const selectedId = Number(id);
            this.selectedClient = this.clientes.find(cliente => cliente.id === selectedId);
            this.productoform.controls['clienteId'].setValue(id); // Pasa el id como string
        }



        //Aqui estan los servicios de editar/Eliminar
        public goNew(): void {
            this.eventNew.emit({ pan: this.pan, success: true });
        }

        public goNewCliente(): void {
            this.eventNewCliente.emit(true);

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
        openWhatsAppChat(): void {
            if (this.phoneNumber) {
                const whatsappLink = this.whatsappService.generateWhatsAppLink(
                    this.phoneNumber
                );
                window.open(whatsappLink, '_blank');
                this.phoneNumber = ''; // Resetea el campo de entrada
            } else {
                this.toastr.warning('Ingrese el Numero de Teléfono', 'Alerta', {
                    timeOut: 5000, // Duración en milisegundos
                    progressBar: true,
                    closeButton: true,
                });
            }
        }


        //Aqui se guarda la factura y se descarga el pdf
        Guardar() {
            if (this.productoform.valid) {
                const data = this.productoform.value;

                if (this.getFilteredClients().length === 0) {
                    this.toastr.warning('No hay productos para guardar', 'Alerta', {
                        timeOut: 5000,
                        progressBar: true,
                        closeButton: true
                    });
                    return;
                }

                this.saveClient(data);
                this.productoform.reset();

                const doc = new jsPDF();
                const totalSum = this.getTotalSum();
                const total = this.getTotalSum().toFixed(2);
                const totalSumTexto = NumeroALetras.convertir(totalSum);
                const tipoDocumento = this.tipoDocumento; // Añade esta línea

                // Define el contenido del PDF según el tipo de documento
                const htmlContentBoleta = `
   <body>
        <div class="container" style="font-size: 12px">
            <div class="header">
                <div class="left">
                    <strong>CABANA SULCA CRISTIAN</strong><br>
                    CARRETERA PANAMERICANA KM 265 AREQUIPA - JULIACA<br>
                    CABANILLAS - SAN ROMAN - PUNO<br>
                    <p>______________________________________________________________________________________________________</p><br>
                    Fecha de Vencimiento <strong style="color: white">aaaaa.</strong><strong>: </strong><br>
                    Fecha de Emisión <strong style="color: white">aaaaa..aaa</strong><strong>: ${this.fechaHoy }</strong><br>
                    Señor(es) <strong style="color: white">aaaaaaaaaaaaa.aa</strong><strong>:  ${this.selectedClient.nombreRazonSocial}<br></strong>
                    DNI <strong style="color: white">aaaaaaaaaaaaaaaaaaaa</strong><strong>: ${this.selectedClient.dni_ruc}<br></strong>
                    Dirección del Cliente <strong style="color: white">aaaaaaa</strong><strong>: ${this.selectedClient.direccion}<br></strong>
                    Tipo de Moneda <strong style="color: white">abr....eaaaaa</strong><strong>: SOLES<br></strong>
                    Observación <strong style="color: white">fsasf.aaaa.....as.</strong>: <br>
                </div>
                <div class="right text-center" style="border: 2px solid black; height: 70px">
                    <strong>BOLETA DE VENTA ELECTRONICA<br>
                    RUC: 10754860486<br>
                    ${data.serie} - ${data.nombreVen}</strong><br>
                </div>
            </div>
            <div class="content" >
                <table style="font-size: 14px">
                    <tr>
                        <th>Cantidad</th>
                        <th>Unidad Medida</th>
                        <th>Descripción</th>
                        <th>Valor Unitario(*)</th>
                        <th>Descuento(*)</th>
                        <th>Importe de Venta(**)</th>

                    </tr>
                    ${this.getFilteredClients().map(client => `
                        <tr>
                            <td class="text-center">${client.cantidad}</td>
                            <td class="text-center">${this.getProductoUni(Number(client.productoId))}</td>
                            <td class="text-center">${this.getProductoNombre(Number(client.productoId))}</td>
                            <td class="text-center">${client.precioUnitario}</td>
                            <td class="text-center">0.00</td>
                            <td class="text-center">${total}</td>
                        </tr>
                        `).join('')}
                </table>
                <div >
                    <table>
                        <tr >
                            <td class="text-right" style="width: 2500px"><strong style="color: white">ssss</strong>Otros Cargos :</td>
                            <td class="text-right">S/ 0.00<strong style="color: white">s</strong></td>
                        </tr>
                        <tr>
                            <td class="text-right" style="margin-bottom: 150px">Otros Tributos :</td>
                            <td class="text-right">S/ 0.00<strong style="color: white">s</strong></td>
                        </tr>
                        <tr class="text-right">
                            <td class="text-right" style="margin-bottom: 150px">ICBPER :</td>
                            <td class="text-right"  >
                                <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00<strong style="color: white">s</strong></div>
                            </td>
                        </tr>
                        <tr class="text-right">
                            <td class="text-right" style="margin-bottom: 150px">Importe Total :</td>
                            <td class="text-right">S/ ${total}<strong style="color: white">s</strong></td><br><br>
                        </tr>
                        <tr>
                           <td><strong style="color: white">ABreteeee</strong></td>
                        </tr>
                    </table>
                </div>
            </div>
        <div class="footer">
               <div style="width: 100%; text-align: right;">
                    <strong>SON: ${totalSumTexto}</strong>
                </div>
                <br>


       <div style="width: 100%; display: flex; justify-content: flex-end;">
           <tr>
                <td colspan="2" style="padding: 5px; text-align: left; border: 1px solid black;">
                    (*) Sin impuestos.<br><br>
                    (**) Incluye impuestos, de ser Op. Gravada.
                </td>
            </tr>
        <table style="border-collapse: collapse;">
            <tr>
                <td class="text-right" style="margin-bottom: 150px">Op. Gravada :</td>
                <td class="text-right" >
                    <div style="border: 1px solid black; width: 250px; height: 30px; ">S/ ${this.getSubTotal()} <strong style="color: white">s</strong></div>
                </td>
            </tr>
            <tr>
                <td class="text-right" >Op. Exonerada :</td>
                <td class="text-right" >
                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00<strong style="color: white">s</strong></div>
                </td>
            </tr>
            <tr>
                <td class="text-right" >Op. Inafecta :</td>
                <td class="text-right" >
                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00<strong style="color: white">s</strong></div>
                </td>
            </tr>
            <tr>
                <td class="text-right" >ISC :</td>
                <td class="text-right" >
                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00<strong style="color: white">s</strong></div>
                </td>
            </tr>
            <tr>
                <td class="text-right" >IGV :</td>
                <td class="text-right"  >
                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ ${this.getIGV()}<strong style="color: white">s</strong></div>
                </td>
            </tr>
             <tr>
                <td class="text-right" >ICBPER :</td>
                <td class="text-right"  >
                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00<strong style="color: white">s</strong></div>
                </td>
            </tr>
            <tr>
                <td class="text-right" >Otros Cargos :</td>
                <td class="text-right" >
                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00 <strong style="color: white">s</strong></div>
                </td>
            </tr>
            <tr>
                <td class="text-right" >Otros Tributos :</td>
                <td class="text-right" >
                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00 <strong style="color: white">s</strong></div>
                </td>
            </tr>
            <tr>
                <td class="text-right" >Monto de Redondeo :</td>
                <td class="text-right" >
                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00 <strong style="color: white">s</strong></div>
                </td>
            </tr>
            <tr>
                <td class="text-right" >Importe Total :</td>
                <td class="text-right" >
                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ ${total} <strong style="color: white">s</strong></div>
                </td>
            </tr>

       </table>

    </div>

                </div>
                <div class="text-center" style="border: 2px solid black; height: 75px">
                    <p>Esta es una representación impresa de la Boleta de Venta Electrónica, generada en el Sistema de la SUNAT. El Emisor Electrónico puede verificarla utilizando su clave SOL, el Adquirente o Usuario puede consultar su validez en SUNAT Virtual: <a href="http://www.sunat.gob.pe" target="_blank">www.sunat.gob.pe</a>, en Opciones en Clave SOL/ Consulta de Validez del CPE.</p>
                </div>
            </div>
        </div>
    </body>


     <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 10px;
            }
            .container {
                border: 1px solid black;
                padding: 10px;
                width: 700px;
                margin: auto;
            }
            .header, .footer, .content {
                width: 100%;
            }
            .header .left, .header .right, .footer .left, .footer .right {
                display: inline-block;
                vertical-align: top;
            }
            .header .left {
                width: 60%;
            }
            .header .right {
                width: 35%;
                text-align: right;
            }
            .content {
                border-top: 1px solid black;
                border-bottom: 1px solid black;
                margin-top: 10px;
                margin-bottom: 10px;
            }
            .content table {
                width: 100%;
                border-collapse: collapse;
            }
            .content th, .content td {
                border: none;
                padding: 5px;
                text-align: left;
            }
            .footer .left {
                width: 60%;
            }
            .footer .right {
                width: 35%;
                text-align: right;
            }
            .total {
                font-weight: bold;
            }
        </style>`;



                const htmlContentFactura = `
                <body>
                <br>
        <div class="container" style="font-size: 12px">
            <div class="header">
                <div class="left">
                    <strong>CABANA SULCA CRISTIAN</strong><br>
                    CARRETERA PANAMERICANA KM 265 AREQUIPA - JULIACA<br>
                    CABANILLAS - SAN ROMAN - PUNO<br>
                    <p>______________________________________________________________________________________________________</p><br>
                    Fecha de Vencimiento <strong style="color: white">aaaaa.</strong><strong>: </strong><br>
                    Fecha de Emisión <strong style="color: white">aaaaa..aaa</strong><strong>: ${this.fechaHoy }</strong><br>
                    Señor(es) <strong style="color: white">aaaaaaaaaaaaa.aa</strong><strong>:  ${this.selectedClient.nombreRazonSocial}<br></strong>
                    RUC <strong style="color: white">aaaaaaaaaaaaaaaaaaaa</strong><strong>: ${this.selectedClient.dni_ruc}<br></strong>
                    Dirección del Cliente <strong style="color: white">aaaaaaa</strong><strong>: ${this.selectedClient.direccion}<br></strong>
                    Tipo de Moneda <strong style="color: white">abr....eaaaaa</strong><strong>: SOLES<br></strong>
                    Observación <strong style="color: white">fsasf.aaaa.....as.</strong>: <br>
                </div>
                <div class="right text-center" style="border: 2px solid black; height: 70px">
                    <strong>FACTURA ELECTRONICA<br>
                    RUC: 10754860486<br>
                    ${data.serie} - ${data.nombreVen}</strong><br>
                </div>
            </div><br>
            <div class="">
                <table style="font-size: 14px; border-collapse: collapse; width: 100%;">
                    <tr>
                        <th style="border: 1px solid black; padding: 5px;">Cantidad</th>
                        <th style="border: 1px solid black; padding: 5px;">Unidad Medida</th>
                        <th style="border: 1px solid black; padding: 5px; width: 350px">Descripción</th>
                        <th style="border: 1px solid black; padding: 5px;">Valor Unitario(*)</th>
                    </tr>
                    ${this.getFilteredClients().map(client => `
                        <tr>
                            <td class="text-center" style="border: 1px solid black; padding: 5px;">${client.cantidad}</td>
                            <td class="text-center" style="border: 1px solid black; padding: 5px;">${this.getProductoUni(Number(client.productoId))}</td>
                            <td class="text-center" style="border: 1px solid black; padding: 5px;">${this.getProductoNombre(Number(client.productoId))}</td>
                            <td class="text-center" style="border: 1px solid black; padding: 5px;">${client.precioUnitario}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
               <br>


            <div class="footer">
                <div style="width: 100%; display: flex; justify-content: flex-end;">
                   <div style="display: flex; margin-top: 100px" class="text-right">
                        <div  style="">
                            Valor de Venta de Operaciones Gratuitas
                        </div>:
                        <div >
                            <div style="border: 1px solid black; width: 150px; margin-right: 50px; height: 30px">
                            <p>S/ 0.00</p>
                            </div>
                        </div>
                   </div>



                    <div style="border: 1px solid black;">
                        <table style="border-collapse: collapse;">
                            <tr>
                                <td class="text-right" style="margin-bottom: 150px">Sub Total: Ventas </td>
                                <td class="text-right" >
                                    <div style="border: 1px solid black; width: 250px; height: 30px; ">S/ ${this.getSubTotal()} <strong style="color: white">s</strong></div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-right" >Anticipos :</td>
                                <td class="text-right" >
                                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00<strong style="color: white">s</strong></div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-right" >Descuentos:</td>
                                <td class="text-right" >
                                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00<strong style="color: white">s</strong></div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-right" >Valor Venta:</td>
                                <td class="text-right" >
                                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ ${this.getSubTotal()}<strong style="color: white">s</strong></div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-right" >ISC :</td>
                                <td class="text-right"  >
                                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00<strong style="color: white">s</strong></div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-right" >IGV :</td>
                                <td class="text-right"  >
                                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ ${this.getIGV()}<strong style="color: white">s</strong></div>
                                </td>
                            </tr>
                             <tr>
                                <td class="text-right" >ICBPER :</td>
                                <td class="text-right"  >
                                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00<strong style="color: white">s</strong></div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-right" >Otros: Cargos </td>
                                <td class="text-right" >
                                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00 <strong style="color: white">s</strong></div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-right" >Otros: Tributos </td>
                                <td class="text-right" >
                                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00 <strong style="color: white">s</strong></div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-right" >Monto de: Redondeo </td>
                                <td class="text-right" >
                                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ 0.00 <strong style="color: white">s</strong></div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-right" >Importe: Total </td>
                                <td class="text-right" >
                                    <div style="border: 1px solid black; width: 250px; height: 30px"">S/ ${total} <strong style="color: white">s</strong></div>
                                </td>
                            </tr>

                       </table>
                       <strong style="color: white">''</strong>
                    </div>
                </div>
                <br><br>
            </div><br><br>
                <div class="text-center" style="border: 2px solid black; height: 75px">
                    <p>Esta es una representación impresa de la factura electrónica, generada en el Sistema de SUNAT. Puedeverificarla utilizando su clave SOL.
</p>
                </div>
        </div>

    </body>


     <style>
            body {
                font-family: Arial, sans-serif;
                font-size: 10px;
            }
            .container {
                border: 1px solid black;
                padding: 10px;
                width: 700px;
                margin: auto;
            }
            .header, .footer, .content {
                width: 100%;
            }
            .header .left, .header .right, .footer .left, .footer .right {
                display: inline-block;
                vertical-align: top;
            }
            .header .left {
                width: 60%;
            }
            .header .right {
                width: 35%;
                text-align: right;
            }
            .content {
                border-top: 1px solid black;
                border-bottom: 1px solid black;
                margin-top: 10px;
                margin-bottom: 10px;
            }

            .content th, .content td {
                border: none;
                padding: 5px;
                text-align: left;
            }
            .footer .left {
                width: 60%;
            }
            .footer .right {
                width: 35%;
                text-align: right;
            }
            .total {
                font-weight: bold;
            }
        </style>

          `;

                const htmlContent = tipoDocumento === 'boleta' ? htmlContentBoleta : htmlContentFactura;

                const clientName = this.getSerie() || 'serie';
                const clientLast = this.pan || 'serie';

                doc.html(htmlContent, {
                    callback: (doc) => {
                        const fileName = tipoDocumento === 'boleta' ? `Boleta_${clientName}-${clientLast}.pdf` : `Factura_${clientName}-${clientLast}.pdf`;
                        doc.save(fileName);
                    },
                    x: 10,
                    y: 10,
                    html2canvas: {
                        scale: 0.27
                    }
                });
            } else {
                this.toastr.warning('Rellene todos los campos por favor', 'Alerta', {
                    timeOut: 5000,
                    progressBar: true,
                    closeButton: true
                });
            }
        }

    }
    //leer numero
    class NumeroALetras {
        private static unidades: string[] = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];
        private static decenas: string[] = ['', 'DIEZ', 'VEINTE', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA'];
        private static centenas: string[] = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS'];

        private static decenasY(num: number): string {
            if (num < 10) return this.unidades[num];
            else if (num <= 19) {
                const especiales = ['ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE'];
                return especiales[num - 11];
            } else {
                const decena = Math.floor(num / 10);
                const unidad = num % 10;
                return this.decenas[decena] + (unidad > 0 ? ' Y ' + this.unidades[unidad] : '');
            }
        }

        public static convertir(num: number): string {
            if (num === 0) return 'CERO';

            let numStr = '';
            let parteEntera = Math.floor(num);
            const parteDecimal = Math.round((num - parteEntera) * 100);

            if (parteEntera > 0) {
                const centenas = Math.floor(parteEntera / 100);
                const decenas = parteEntera % 100;

                if (centenas > 0) {
                    numStr += this.centenas[centenas];
                }

                if (decenas > 0) {
                    numStr += (numStr ? ' ' : '') + this.decenasY(decenas);
                }
            }

            let textoDecimal = parteDecimal.toString().padStart(2, '0');
            return `${numStr.trim()} Y ${textoDecimal}/100 SOLES`;
        }
    }
