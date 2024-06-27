import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PdfViewerService {

    private apiUrl = 'factura/pdf';

    constructor(private http: HttpClient) { }

    downloadPdf(id: number): Observable<Blob> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get(url, { responseType: 'blob' });
    }
}
