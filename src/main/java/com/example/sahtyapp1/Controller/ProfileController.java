package com.example.sahtyapp1.Controller;

import com.example.sahtyapp1.Entity.Utilisateur;
import com.example.sahtyapp1.Repository.UtilisateurRepo;
import com.example.sahtyapp1.ServiceImpl.UtilisateurDetailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@ResponseBody
@RestController
@RequestMapping("/api/users")

public class ProfileController {
    @Autowired
    private UtilisateurDetailServiceImpl utilisateurDetailService;

    @Autowired
    UtilisateurRepo utilisateurRepo;
    private static String UPLOAD_DIR = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Veuillez sélectionner un fichier à télécharger.");
        }

        try {
            byte[] bytes = file.getBytes();
            Path path = Paths.get(UPLOAD_DIR + file.getOriginalFilename());
            Files.write(path, bytes);

            return ResponseEntity.status(HttpStatus.OK).body("Fichier téléchargé avec succès : " + file.getOriginalFilename());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Échec du téléchargement du fichier : " + e.getMessage());
        }
    }
}
