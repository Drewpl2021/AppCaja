import { Routes } from '@angular/router';
import {InventariodetalleContainerComponent} from "./containers/inventariodetalle-container.component";
import {InventariodetalleComponent} from "./inventariodetalle.component";

export default [

  {
    path     : '',
    component: InventariodetalleComponent,
    children: [
      {
        path: '',
        component: InventariodetalleContainerComponent,
        data: {
          title: 'Inventario Detalle'
        }
      },

    ],
  },
] as Routes;
