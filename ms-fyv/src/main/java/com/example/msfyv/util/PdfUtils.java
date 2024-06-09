package com.example.msfyv.util;

import com.example.msfyv.entity.Factura;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;

import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import java.util.List;

public class PdfUtils {
    public static ByteArrayOutputStream generatePdfStream(List<Factura> facturas
    ) throws DocumentException {
        Document document = new Document();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, outputStream);
        document.open();

        PdfPTable table = new PdfPTable(7);
        table.setWidthPercentage(100);
        Font smallFont = new Font(Font.FontFamily.HELVETICA, 8, Font.NORMAL);
        Font largeFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL);
        Font boldFont = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD);
        table.addCell(new PdfPCell(new Phrase("Codigo", largeFont)));
        table.addCell(new PdfPCell(new Phrase("Descripcion", largeFont)));
        table.addCell(new PdfPCell(new Phrase("UM", largeFont)));
        table.addCell(new PdfPCell(new Phrase("Cantidad", largeFont)));
        table.addCell(new PdfPCell(new Phrase("Valor Unitario", largeFont)));
        table.addCell(new PdfPCell(new Phrase("Valor IGV", largeFont)));
        table.addCell(new PdfPCell(new Phrase("Total", largeFont)));
        float[] columnWidths = {1f, 3f, 1f, 1f, 1f, 1f, 1f};
        table.setWidths(columnWidths);PdfPTable singleColumnTable = new PdfPTable(1);
        for (int i = 0; i < 1; i++) {
            singleColumnTable.addCell("Celda ");
        }


        // Write column names
        // Map<String, Object> firstRow = queryResults.get(0);
        for (Factura factura : facturas) {
            document.add(new Paragraph("GASOLINERA INKAPACARITA ", boldFont));
            document.add(new Paragraph("Av. Las Flores 123, Piso 8, Edificio Central, Lima, Perú", smallFont));
            document.add(new Paragraph("contacto@tecnosoluciones.com.pe", smallFont));
            document.add(new Paragraph("  ", boldFont));
            document.add(new Paragraph("  ", boldFont));
            document.add(singleColumnTable);
        }
        for (Factura factura : facturas) {
            document.add(new Paragraph("CLIENTE                       :"+factura.getClienteId() +"                                                 " + "FECHA DE EMISION                      :  "+  factura.getFecha_hora(), largeFont));
            document.add(new Paragraph("DOC: IDENTIDAD         :"+factura.getClienteId() + "                                                 " +"ORAGANIZACION DE VENTAS    : GRIFO INKAPACARITA", largeFont));
            document.add(new Paragraph("DIRECCION                  :"+factura.getClienteId() + "                                                 "+"TIPO DE MODENA                         : SOL", largeFont));

            document.add(new Paragraph("  ", boldFont));
            document.add(table);
            document.add(new Paragraph("          "+factura.getId()   +
                    "                                                    "+factura.getProductoId()+
                    "                        "+"NIU"+
                    "              "+factura.getCantidad()+
                    "                  "+factura.getProductoId()+
                    "                 "+factura.getIgv()+
                    "                "+factura.getTotal(), largeFont));



        }
        Rectangle rectangle = new Rectangle(50, 50, 500, 500);

        document.add(new Paragraph("\n"));
        document.add(rectangle);
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