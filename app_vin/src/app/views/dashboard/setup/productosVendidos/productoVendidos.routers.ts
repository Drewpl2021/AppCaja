import { Routes } from '@angular/router';
import {ProductoVendidosContainerComponent} from "./containers/productoVendidos-container.component";
import {ProductoVendidosComponent} from "./productoVendidos.component";

export default [

  {
    path     : '',
    component: ProductoVendidosComponent,
    children: [
      {
        path: '',
        component: ProductoVendidosContainerComponent,
        data: {
          title: 'Clientes'
        }
      },
    ],
  },
] as Routes;
