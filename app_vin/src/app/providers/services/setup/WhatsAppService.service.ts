import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WhatsAppService {
    constructor() {}

    generateWhatsAppLink(phoneNumber: string): string {
        const message = encodeURIComponent('¡Hola!\n' +
            'Queríamos informarte que tu factura ya está lista. ¡Gracias por tu compra! Esperamos verte pronto.\n' +
            '\n' +
            'Saludos cordiales,\n' +
            'Grifo Incapacarita.');
        return `https://wa.me/${phoneNumber}?text=${message}`;
    }
}
