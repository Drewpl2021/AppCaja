// src/app/services/pdf-generator.service.ts
import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
    providedIn: 'root'
})
export class PDFGeneratorService {

    constructor() { }

    public generatePDF(pdfContentId: string): void {
        const doc = new jsPDF();
        const content = document.getElementById(pdfContentId) as HTMLElement;

        if (content) {
            html2canvas(content).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const imgProps = (doc as any).getImageProperties(imgData);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                doc.save('productos.pdf');
            });
        } else {
            console.error('Content element not found:', pdfContentId);
        }
    }
}
