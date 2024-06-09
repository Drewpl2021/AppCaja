package com.example.msfyv.controller;

import com.example.msfyv.entity.Factura;
import com.example.msfyv.feign.ProductoFeign;
import com.example.msfyv.service.FacturaService;
import com.example.msfyv.util.PdfUtils;
import com.example.msfyv.util.UserExcelExporter;
import com.itextpdf.text.DocumentException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/factura")
public class FacturaController {

    @Autowired
    private FacturaService facturaService;

    @GetMapping()
    public ResponseEntity<List<Factura>> list(){

        return ResponseEntity.ok().body(facturaService.listar());
    }

    @PostMapping()
    public ResponseEntity<Factura> save(@RequestBody Factura factura){
        if (factura.getClienteId() == null) {
            return ResponseEntity.badRequest().build();
        }
        // Llamar al servicio para guardar el pedido
        Factura nuevafactura = facturaService.guardar(factura);

        // Devolver el pedido guardado en la respuesta
        return ResponseEntity.ok(facturaService.guardar(factura));
    }

    @PutMapping()
    public ResponseEntity<Factura> update(@RequestBody Factura factura){
        return ResponseEntity.ok(facturaService.actualizar(factura ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Factura> listById(@PathVariable(required = true) Integer id){
        return ResponseEntity.ok().body(facturaService.listarPorId(id).get());
    }

    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable(required = true) Integer id){ facturaService.eliminarPorId(id);
        return "Eliminado Correctamente :3";
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> exportPdf() throws IOException, DocumentException {
        // List<Map<String, Object>> queryResults = myService.executeQuery(request);
        ByteArrayOutputStream pdfStream = PdfUtils.generatePdfStream(facturaService.listar()
        );
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=query_results.pdf");
        headers.setContentLength(pdfStream.size());
        return new ResponseEntity<>(pdfStream.toByteArray(), headers, HttpStatus.OK);
    }
    @GetMapping("/excel")
    public void exportToExcel(HttpServletResponse response) throws IOException {
        response.setContentType("application/octet-stream");
        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=users_" + currentDateTime + ".xlsx";
        response.setHeader(headerKey, headerValue);

        List<Factura> facturas = facturaService.listar();

        UserExcelExporter excelExporter = new UserExcelExporter(facturas);

        excelExporter.export(response);
    }
}
