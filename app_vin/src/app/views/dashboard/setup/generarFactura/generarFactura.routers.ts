import { Routes } from '@angular/router';
import {GenerarFacturaContainerComponent} from "./containers/generarFactura-container.component";
import {GenerarFacturaComponent} from "./generarFactura.component";

export default [

  {
    path     : '',
    component: GenerarFacturaComponent,
    children: [
      {
        path: '',
        component: GenerarFacturaContainerComponent,
        data: {
          title: 'nuevaFactura'
        }
      },
    ],
  },
] as Routes;
