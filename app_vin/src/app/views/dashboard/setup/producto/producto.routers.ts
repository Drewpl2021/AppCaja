import { Routes } from '@angular/router';
import {ProductoContainerComponent} from "./containers/producto-container.component";
import {ProductoComponent} from "./producto.component";

export default [

  {
    path     : '',
    component: ProductoComponent,
    children: [
      {
        path: '',
        component: ProductoContainerComponent,
        data: {
          title: 'Producto'
        }
      },
    ],
  },
] as Routes;
