import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;

@RestController
@RequestMapping("/upload")
public class FileUploadController {

    private static final String UPLOAD_DIR = "uploads/";

    @CrossOrigin(origins = "http://localhost:4200") // Cambia esto a la URL de tu frontend
    @PostMapping
    public ResponseEntity<?> uploadFile(MultipartFile file) {
        try {
            // Asegúrate de que el directorio de subida exista
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Guardar el archivo en el servidor
            Path filePath = uploadPath.resolve(file.getOriginalFilename());
            file.transferTo(filePath.toFile());

            String fileUrl = "http://your-server.com/uploads/" + file.getOriginalFilename();
            return ResponseEntity.ok().body(Collections.singletonMap("url", fileUrl));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al subir el archivo");
        }
    }
}
