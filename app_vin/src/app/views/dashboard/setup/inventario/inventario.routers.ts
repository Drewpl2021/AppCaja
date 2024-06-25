import { Routes } from '@angular/router';
import {ProductContainerComponent} from "./containers/product-container.component";
import {InventarioComponent} from "./inventario.component";

export default [

    {
        path     : '',
        component: InventarioComponent,
        children: [
            {
                path: '',
                component: ProductContainerComponent,
                data: {
                    title: 'PRODUCTOS'
                }
            },
        ],
    },
] as Routes;
