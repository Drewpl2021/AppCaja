import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-new-factura',
    standalone: true,
    template: `


<div class="main">
    <div class="body">
        <div class="invoice">
            <div class="header" style="display: flex;">
                <div style="margin-right: 150px">
                <p style="font-size: 25px; "><strong>GRIFO INCAPACARITA S.A.C.</strong></p>
                <p style="font-size: 15px; ">CARRETERA PANAMERICANA KM 265 AREQUIPA - JULIACA</p>
                <p style="font-size: 15px;">Teléfono: 942-456-780</p>
                </div>
                <div style="margin-top: -20px">
                    <img src="https://img.freepik.com/vector-premium/icono-gasolinera-concepto-combustible_11481-928.jpg" alt="Logo"
                         style="width: 150px; height: 150px;">
                </div>

            </div>

            <div class="details">
                <div style="display: flex; ">
                    <div style="flex: 1; font-size: 17px;"><strong>Nombre:</strong> JORGE </div>
                    <div style="flex: 1; font-size: 17px; text-align: left;"><strong>N° Factura:</strong> CAJA01</div>
                </div>

                <div style="display: flex; margin-top: -15px">
                    <div style="flex: 1; font-size: 17px;"><strong>RUC/DNI:</strong> 75218458</div>
                    <div style="flex: 1; font-size: 17px; text-align: left;"><strong>Fecha:</strong> 01/01/2024</div>

                </div>
                <div style="display: flex; margin-top: -15px">
                    <div style="flex: 1; font-size: 17px;"><strong>Dirección:</strong> Jr. las malvinas 720</div>
                </div>
            </div>

            <table>
                <thead>
                <tr>
                    <th>Cantidad</th>
                    <th>Producto</th>
                    <th>Precio Unitario</th>
                    <th>IGV</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Producto 1</td>
                    <td>2</td>
                    <td>$10.00</td>
                    <td>$10.00</td>
                    <td>$20.00</td>
                </tr>
                <tr>
                    <td>Producto 2</td>
                    <td>1</td>
                    <td>$15.00</td>
                    <td>$10.00</td>
                    <td>$15.00</td>
                </tr>
                <tr>
                    <td>Producto 3</td>
                    <td>3</td>
                    <td>$7.50</td>
                    <td>$10.00</td>
                    <td>$22.50</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td colspan="4" class="total">Total</td>
                    <td>$57.50</td>
                </tr>
                </tfoot>
            </table>

            <div class="footer">
                <p>Gracias por su compra</p>
            </div>
        </div>
    </div>
</div>


    <style>
        .main{
            width: 900px;
            height: 820px;

        }

        .body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 0;


        }

        .invoice {
            max-width: 800px;
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

export class NewFacturaComponent {
    @Input() title: string = 'Nuevo Factura';
}
