package com.example.msfyv.util;

import com.example.msfyv.entity.Factura;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.Font;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;
public class PdfUtils {
    public static ByteArrayOutputStream generatePdfStream(List<Factura> facturas
    ) throws DocumentException {
        Document document = new Document();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, outputStream);
        document.open();
        // Write column names
        // Map<String, Object> firstRow = queryResults.get(0);
        for (Factura factura : facturas) {
            Font boldFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
            document.add(new Paragraph("ID: " + factura.getId(), boldFont));
            document.add(new Paragraph("Fecha y hora: " + factura.getFecha_hora(), boldFont));
            document.add(new Paragraph("Cantidad: " + factura.getCantidad(), boldFont));
            document.add(new Paragraph("Precio base total: " + factura.getPrecioBaseTotal(), boldFont));
            document.add(new Paragraph("IGV: " + factura.getIgv(), boldFont));
            document.add(new Paragraph("Total: " + factura.getTotal(), boldFont));
            document.add(new Paragraph("Estado: " + factura.getEstado(), boldFont));
            document.add(new Paragraph("Cliente ID: " + factura.getClienteId(), boldFont));
        }
        document.add(new Paragraph("\n"));
        // Write data rows
        /*for (Map<String, Object> row : queryResults) {
            for (Object value : row.values()) {
                Paragraph paragraph = new Paragraph(value.toString());
                document.add(paragraph);
            }
            document.add(new Paragraph("\n"));
        }*/
        document.close();
        return outputStream;
    }
}
