import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WhatsAppService {
    constructor() {}

    generateWhatsAppLink(phoneNumber: string, message: string): string {
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    }
}
