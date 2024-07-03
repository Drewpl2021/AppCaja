import { Routes } from '@angular/router';
import {PersonalContainerComponent} from "./containers/personal-container.component";
import {PersonalComponent} from "./personal.component";

export default [

  {
    path     : '',
    component: PersonalComponent,
    children: [
      {
        path: '',
        component: PersonalContainerComponent,
        data: {
          title: 'Personales'
        }
      },
    ],
  },
] as Routes;
