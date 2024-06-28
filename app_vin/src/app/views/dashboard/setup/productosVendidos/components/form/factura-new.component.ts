import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-new-factura',
    standalone: true,
    template: `
    <h1>{{ title }}</h1>
    <!-- Contenido del nuevo factura -->

  `,

})

export class NewFacturaComponent {
    @Input() title: string = 'Nuevo Factura';
}
