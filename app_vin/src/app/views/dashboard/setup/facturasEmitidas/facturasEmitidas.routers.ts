import { Routes } from '@angular/router';
import {FacturasEmitidasContainerComponent} from "./containers/facturasEmitidas-container.component";
import {FacturasEmitidasComponent} from "./facturasEmitidas.component";

export default [

  {
    path     : '',
    component: FacturasEmitidasComponent,
    children: [
      {
        path: '',
        component: FacturasEmitidasContainerComponent,
        data: {
          title: 'productoVendidos'
        }
      },
    ],
  },
] as Routes;
