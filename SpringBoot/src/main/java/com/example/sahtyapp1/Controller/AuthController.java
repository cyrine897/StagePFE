package com.example.sahtyapp1.Controller;

import com.example.sahtyapp1.Entity.*;
import com.example.sahtyapp1.Repository.*;
import com.example.sahtyapp1.Security.FileUtils;
import io.github.classgraph.Resource;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import org.springframework.core.io.UrlResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import com.example.sahtyapp1.Request.LoginRequest;
import com.example.sahtyapp1.Request.SignUpRequest;
import com.example.sahtyapp1.Response.JwtResponse;
import com.example.sahtyapp1.Response.MessageResponse;
import com.example.sahtyapp1.Security.JwtUtils;
import com.example.sahtyapp1.ServiceImpl.*;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;

import org.apache.logging.log4j.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.apache.logging.log4j.Logger;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
@ResponseBody
@RestController
@Slf4j
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    private JavaMailSender emailSender;

    @Autowired
    private final  UtilisateurRepo utilisateurRepo;

    @Autowired
    private  UserRoleMedRepo userRoleMedRepo;

    @Autowired
    private UserRolePharmRepo userRolePharmRepo;


    @Autowired
    private final  RoleRepo roleRepo;

    @Autowired
    private final  PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    DossierMedicaleServiceImpl dossierMedicaleService;
    @Autowired
    private UtilisateurDetailServiceImpl utilisateurDetailService;
    @Autowired
    private PasswordService passwordEncoderService;
    @Autowired
    private ConsultationServiceImpl consultationService;
    @Autowired
    DossierMediRepo dossierMediRepo;

    public AuthController(UtilisateurRepo utilisateurRepo, RoleRepo roleRepo, PasswordEncoder passwordEncoder ) {
        this.utilisateurRepo = utilisateurRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
    }
    private static final Logger logger = (Logger) LogManager.getLogger(AuthController.class);


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        passwordEncoderService.generateResetToken(email);
        return ResponseEntity.ok("Reset token sent to your email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        if (passwordEncoderService.resetPassword(token, newPassword)) {
            return ResponseEntity.ok("Password successfully reset.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token.");
        }
    }
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Utilisateur> createUtilisateur(@RequestBody Utilisateur utilisateur) {
        // your logic to handle the request
        return ResponseEntity.ok(utilisateur);
    }

   @GetMapping("/profile")
   public ResponseEntity<?> getUserProfile(@RequestParam String email) {
       try {
           Utilisateur utilisateur = utilisateurDetailService.findByEmail(email);
           if (utilisateur != null) {
               return ResponseEntity.ok(utilisateur);
           } else {
               return ResponseEntity.notFound().build();
           }
       } catch (Exception e) {
           // Log the exception for further investigation
           logger.error("Error retrieving user profile for email: " + email, e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving user profile.");
       }
   }
    @GetMapping("/utilisateurs")
    public List<Utilisateur> getUtilisateurByRoleMed(@RequestParam String rolee) {

       return utilisateurDetailService.getUtilisateursAvecRoleMedecin(rolee);
    }




    @PutMapping(value = "/updateProfile/{email}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Utilisateur> updateProfile(@PathVariable String email, @RequestParam(required = false) Long idDossier, @RequestBody Utilisateur utilisateur) {
        try {
            Utilisateur existingUser = utilisateurDetailService.updateUtilisateur(email, utilisateur);
            if (existingUser != null) {
                if (idDossier != null) {
                    DossierMedical dossierMedical = dossierMediRepo.findById(idDossier).orElse(null);
                    if (dossierMedical == null) {
                        dossierMedical = new DossierMedical();
                        dossierMedical.setIdDossier(idDossier);
                    }
                    // Update dossierMedical properties with utilisateur values
                    if (utilisateur.getDossierMedical() != null) {
                        dossierMedical.setNumeroUrgence(utilisateur.getDossierMedical().getNumeroUrgence());
                        dossierMedical.setNomUrgence(utilisateur.getDossierMedical().getNomUrgence());
                        dossierMedical.setTaille(utilisateur.getDossierMedical().getTaille());
                        dossierMedical.setPoids(utilisateur.getDossierMedical().getPoids());
                        dossierMedical.setActivitePhysique(utilisateur.getDossierMedical().getActivitePhysique());
                        dossierMedical.setConsommation(utilisateur.getDossierMedical().getConsommation());

                        dossierMedical.setFileName(utilisateur.getDossierMedical().getFileName());
                        dossierMedical.setAnticedentsMedicaments(utilisateur.getDossierMedical().getAnticedentsMedicaments());
                        dossierMedical.setDateVaccination(utilisateur.getDossierMedical().getDateVaccination());
                        dossierMedical.setVaccination(utilisateur.getDossierMedical().getVaccination());
                        dossierMedical.setFilePath(utilisateur.getDossierMedical().getFilePath());
                    }
                    dossierMedical.setUtilisateur(existingUser);
                    existingUser.setDossierMedical(dossierMedical);
                    dossierMediRepo.save(dossierMedical);
                } else if (existingUser.getDossierMedical() == null) {
                    DossierMedical dossierMedical = new DossierMedical();
                    dossierMedical.setUtilisateur(existingUser);
                    existingUser.setDossierMedical(dossierMedical);
                    dossierMediRepo.save(dossierMedical);
                }
                return ResponseEntity.ok(existingUser);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception stack trace for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UtilisateurDetailsImpl userDetails = (UtilisateurDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        JwtResponse jwtResponse = new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(jwtResponse);
    }

/*   @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody SignUpRequest signUpRequest) {
        // Check if the role requested exists in the database
        Set<Role> roles = new HashSet<>();

        if (signUpRequest.getRole() != null && !signUpRequest.getRole().isEmpty()) {
            signUpRequest.getRole().forEach(role -> {
                switch (role) {
                    case "admin":
                        roleRepo.findByName(ERole.Admin).ifPresent(roles::add);
                        break;
                    case "patient":
                        roleRepo.findByName(ERole.Patient).ifPresent(roles::add);
                        break;
                    case "medecin":
                        roleRepo.findByName(ERole.Medecin).ifPresent(roles::add);
                        break;
                    case "pharmacien":
                        roleRepo.findByName(ERole.Pharmacien).ifPresent(roles::add);
                        break;
                    default:
                        // Handle unknown roles
                        break;
                }
            });
        } else {
            // If no role is specified, assign a default role (e.g., ROLE_USER)
            roleRepo.findByName(ERole.Role_User).ifPresent(roles::add);
        }

        // Check if username is already taken
        if (utilisateurRepo.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Check if email is already in use
        if (utilisateurRepo.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }



        // Create new user's account
        Utilisateur utilisateur = new Utilisateur(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword()));

        utilisateur.setAdresse(signUpRequest.getAdresse());
        utilisateur.setNom(signUpRequest.getNom());
        utilisateur.setPrenom(signUpRequest.getPrenom());
        utilisateur.setDate_naissance(signUpRequest.getDate_naissance());
        utilisateur.setRolee(signUpRequest.getRolee());
        utilisateur.setRoles(roles);

        utilisateurRepo.save(utilisateur);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }


*/

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody SignUpRequest signUpRequest) {
        // Check if username is already taken
        if (utilisateurRepo.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Check if email is already in use
        if (utilisateurRepo.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        Utilisateur utilisateur = new Utilisateur(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword()));

        utilisateur.setAdresse(signUpRequest.getAdresse());
        utilisateur.setNom(signUpRequest.getNom());
        utilisateur.setPrenom(signUpRequest.getPrenom());
        utilisateur.setDate_naissance(signUpRequest.getDate_naissance());
        utilisateur.setRolee(signUpRequest.getRolee());
        utilisateurRepo.save(utilisateur);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!", utilisateur.getIdUser()));
    }


    @PostMapping("/register/role/medecin")
    public ResponseEntity<?> registerRoleMedecin(@RequestParam Long idUser, @RequestBody SignUpRequest signUpRequest) {

        Optional<Utilisateur> utilisateurOptional = utilisateurRepo.findById(idUser);
        if (!utilisateurOptional.isPresent()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User not found.", null));
        }

        if (userRoleMedRepo.existsByPieceIdentiteMed(signUpRequest.getPieceIdentiteMed())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: PieceIdentiteMed is already in use!"));
        }

        Utilisateur utilisateur = utilisateurOptional.get();
        UserRoleMed userRoleMed = utilisateur.getUserRoleMed();

        // Create new UserRoleMed if not present
        if (userRoleMed == null) {
            userRoleMed = new UserRoleMed();
            utilisateur.setUserRoleMed(userRoleMed);
        }

        // Set Medecin details
        userRoleMed.setNumerodelicencedeMed(signUpRequest.getNumerodelicencedeMed());
        userRoleMed.setCopiedelalicencedeMed(signUpRequest.getCopiedelalicencedeMed());
        userRoleMed.setDiplomesMed(signUpRequest.getDiplomesMed());
        userRoleMed.setAdresseMed(signUpRequest.getAdresseMed());
        userRoleMed.setNumeroTelephoneMed(signUpRequest.getNumeroTelephoneMed());
        userRoleMed.setPositionMed(signUpRequest.getPositionMed());
        userRoleMed.setQualificationsMed(signUpRequest.getQualificationsMed());
        userRoleMed.setNomMed(signUpRequest.getNomMed());
        userRoleMed.setDateObtentionDeLaLicenceMed(signUpRequest.getDateObtentionDeLaLicenceMed());
        userRoleMed.setPieceIdentiteMed(signUpRequest.getPieceIdentiteMed());

        // Save the utilisateur and userRoleMed
        utilisateurRepo.save(utilisateur);  // Save Utilisateur to persist association
        userRoleMedRepo.save(userRoleMed);  // Save UserRoleMed

        return ResponseEntity.ok(new MessageResponse("Medecin details saved successfully!", utilisateur.getIdUser()));
    }

    @PostMapping("/register/role/pharmacien")
    public ResponseEntity<?> savePharmacienDetails(@RequestParam Long idUser, @Valid @RequestBody SignUpRequest signUpRequest) {
        Utilisateur utilisateur = utilisateurRepo.findById(idUser)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!utilisateur.getRolee().equalsIgnoreCase("PHARMACIEN")) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User is not a Pharmacien."));
        }

        UserRolePharm userRolePharm = new UserRolePharm();
        userRolePharm.setNumerodelicencedePharm(signUpRequest.getNumerodelicencedePharm());
        userRolePharm.setCopiedelalicencedePharm(signUpRequest.getCopiedelalicencedePharm());
        userRolePharm.setDiplomesPharm(signUpRequest.getDiplomesPharm());
        userRolePharm.setAdressePharm(signUpRequest.getAdressePharm());
        userRolePharm.setNumeroTelephonePharm(signUpRequest.getNumeroTelephonePharm());
        userRolePharm.setPositionPharm(signUpRequest.getPositionPharm());
        userRolePharm.setQualificationsPharm(signUpRequest.getQualificationsPharm());
        userRolePharm.setNomPharm(signUpRequest.getNomPharm());
        userRolePharm.setDateObtentionDeLaLicencePharm(signUpRequest.getDateObtentionDeLaLicencePharm());
        userRolePharm.setPieceIdentitPharm(signUpRequest.getPieceIdentitPharm());

        utilisateur.setUserRolePharm(userRolePharm);
        userRolePharmRepo.save(userRolePharm);

        return ResponseEntity.ok(new MessageResponse("Pharmacien details saved successfully!", utilisateur.getIdUser()));
    }


   /* @PostMapping(value = "/register", consumes = "application/json")
    public ResponseEntity<?> register(
            @Valid @RequestBody SignUpRequest signUpRequest,
            @RequestPart(value = "diplômeMed", required = false) MultipartFile diplômeMed,
            @RequestPart(value = "copiedelalicenceMed", required = false) MultipartFile copiedelalicenceMed,
            @RequestPart(value = "diplômesPharm", required = false) MultipartFile diplômesPharm,
            @RequestPart(value = "copiedelalicencePharm", required = false) MultipartFile copiedelalicencePharm) {

        // Check if username is already taken
        if (utilisateurRepo.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Check if email is already in use
        if (utilisateurRepo.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        Utilisateur utilisateur = new Utilisateur(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                passwordEncoder.encode(signUpRequest.getPassword()));

        utilisateur.setAdresse(signUpRequest.getAdresse());
        utilisateur.setNom(signUpRequest.getNom());
        utilisateur.setPrenom(signUpRequest.getPrenom());
        utilisateur.setDate_naissance(signUpRequest.getDate_naissance());
        utilisateur.setRolee(signUpRequest.getRolee());

        utilisateurRepo.save(utilisateur);

        try {
            if (signUpRequest.getRolee().equalsIgnoreCase("MEDECIN")) {
                UserRoleMed userRoleMed = new UserRoleMed();
                userRoleMed.setNumérodelicencedeMed(signUpRequest.getNumérodelicencedeMed());

                if (diplômeMed != null && !diplômeMed.isEmpty()) {
                    userRoleMed.setDiplômesMed(diplômeMed.getBytes());
                }

                if (copiedelalicenceMed != null && !copiedelalicenceMed.isEmpty()) {
                    userRoleMed.setCopiedelalicencedeMed(copiedelalicenceMed.getBytes());
                }

                utilisateur.setUserRoleMed(userRoleMed);
                userRoleMedRepo.save(userRoleMed);

            } else if (signUpRequest.getRolee().equalsIgnoreCase("PHARMACIEN")) {
                UserRolePharm userRolePharm = new UserRolePharm();
                userRolePharm.setNumérodelicencedePharm(signUpRequest.getNumérodelicencedePharm());

                if (diplômesPharm != null && !diplômesPharm.isEmpty()) {
                    userRolePharm.setDiplômesPharm(diplômesPharm.getBytes());
                }

                if (copiedelalicencePharm != null && !copiedelalicencePharm.isEmpty()) {
                    userRolePharm.setCopiedelalicencedePharm(copiedelalicencePharm.getBytes());
                }

                utilisateur.setUserRolePharm(userRolePharm);
                userRolePharmRepo.save(userRolePharm);

            } else {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Role not recognized."));
            }

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new MessageResponse("Error: Unable to process the file upload."));
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }*/

   /* @GetMapping("/utilisateurs")
    public List<Utilisateur> getUsersByRole(@RequestParam String rolee) {
        return utilisateurDetailService.getUsersByRole(rolee);
    }*/



    @GetMapping("/utilisateursByEmail")
    public Utilisateur getUsersByEmail(@RequestParam String email) {
        return utilisateurDetailService.getUsersByEmail(email);
    }

    @PutMapping("/verify-medecin/{idUser}")
    public ResponseEntity<Utilisateur> verifyMedecin(@PathVariable Long idUser) {
        try {
            Utilisateur utilisateur = utilisateurDetailService.findById(idUser); // Méthode pour trouver l'utilisateur par ID

            if (utilisateur != null && utilisateur.getRolee() != null) {
                // Vérifiez si le rôle "Medecin" est présent
                boolean isMedecin = utilisateur.getRolee().contains("Medecin");
                utilisateur.setVerifyMedecin(isMedecin);

                // Enregistrez les modifications si nécessaire
                utilisateurDetailService.save(utilisateur);
                if (isMedecin) {
                    sendVerificationEmail(utilisateur.getEmail());
                }

                // Répondre avec l'objet utilisateur mis à jour
                return ResponseEntity.ok(utilisateur);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    private void sendVerificationEmail(String to) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Medecin Verified");
        message.setText("Congratulations! Your verification as a medic has been successful.");

        emailSender.send(message);
    }

    @Autowired
    private EmailService emailService;

    public void generateResetToken(String email) {
        Utilisateur user = utilisateurRepo.findByEmail(email);
        if (user != null) {
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            utilisateurRepo.save(user);
            emailService.sendResetToken(email, token);
        }
    }

    public boolean resetPassword(String token, String newPassword) {
        Utilisateur user = utilisateurRepo.findByResetToken(token);
        if (user != null) {
            user.setPassword(newPassword); // Vous devriez hacher le mot de passe ici
            user.setResetToken(null);
            utilisateurRepo.save(user);
            return true;
        }
        return false;
    }


    //upload photo
    private static final String UPLOAD_DIR = "uploads/";


   /* @PostMapping("/{idUser}/uploadPhoto")
    public ResponseEntity<String> uploadPhoto(@PathVariable Long idUser, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Veuillez sélectionner un fichier à télécharger.");
        }

        try {
            // Créer le répertoire si nécessaire
            File uploadDir = new File(UPLOAD_DIR);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // Sauvegarder le fichier
            byte[] bytes = file.getBytes();
            Path path = Paths.get(UPLOAD_DIR + file.getOriginalFilename());
            Files.write(path, bytes);

            // Mettre à jour l'utilisateur avec le nom du fichier photo
            Optional<Utilisateur> optionalUtilisateur = utilisateurRepo.findById(idUser);
            if (optionalUtilisateur.isPresent()) {
                Utilisateur utilisateur = optionalUtilisateur.get();
                utilisateur.setPhoto(file.getOriginalFilename());
                utilisateurRepo.save(utilisateur);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé.");
            }

            return ResponseEntity.status(HttpStatus.OK).body("Fichier téléchargé avec succès : " + file.getOriginalFilename());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Échec du téléchargement du fichier : " + e.getMessage());
        }
    }*/



    // Méthode pour charger les données binaires de l'image depuis une source
    private byte[] loadUserPhotoBytes(String photoUrl) {
        // Implémentation pour charger les données de l'image, par exemple à partir du système de fichiers
        // Ici, nous donnons un exemple avec un fichier statique
        try {
            Path path = Paths.get(photoUrl);
            return Files.readAllBytes(path);
        } catch (IOException e) {
            throw new RuntimeException("Erreur lors du chargement de l'image", e);
        }
    }
  /* @GetMapping("/{idUser}/photo")
   public void getPhoto(@PathVariable Long idUser, HttpServletResponse response  , Utilisateur utilisateur) {
       Optional<Utilisateur> optionalUtilisateur = utilisateurRepo.findById(idUser);
       if (optionalUtilisateur.isPresent()) {
           Utilisateur utilisateur1 = optionalUtilisateur.get();
           String photoFilename = utilisateur.getPhoto();
           if (photoFilename != null && !photoFilename.isEmpty()) {
               Path path = Paths.get(UPLOAD_DIR + photoFilename);
               if (Files.exists(path) && Files.isReadable(path)) {
                   try {
                       String contentType = Files.probeContentType(path);
                       if (contentType == null) {
                           contentType = "application/octet-stream";
                       }

                       // Définir le type de contenu de la réponse
                       response.setContentType(contentType);

                       // Définir l'en-tête Content-Disposition pour l'affichage inline
                       response.setHeader("Content-Disposition", "inline; filename=\"" + photoFilename + "\"");

                       // Lire le fichier et écrire dans la réponse
                       Files.copy(path, response.getOutputStream());
                       response.getOutputStream().flush();
                   } catch (IOException e) {
                       e.printStackTrace();
                       response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                   }
               } else {
                   response.setStatus(HttpStatus.NOT_FOUND.value());
               }
           } else {
               response.setStatus(HttpStatus.NOT_FOUND.value());
           }
       } else {
           response.setStatus(HttpStatus.NOT_FOUND.value());
       }
   }

*/
    @GetMapping("/photo/{email}")
    public void getPhotoByEmail(@PathVariable String email, HttpServletResponse response) {
        Utilisateur utilisateur = utilisateurRepo.findByEmail(email);
        if (utilisateur != null) {
            String photoFilename = utilisateur.getPhoto();
            if (photoFilename != null && !photoFilename.isEmpty()) {
                Path path = Paths.get(UPLOAD_DIR + photoFilename);
                if (Files.exists(path) && Files.isReadable(path)) {
                    try {
                        String contentType = Files.probeContentType(path);
                        if (contentType == null) {
                            contentType = "application/octet-stream";
                        }

                        // Définir le type de contenu de la réponse
                        response.setContentType(contentType);

                        // Définir l'en-tête Content-Disposition pour l'affichage inline
                        response.setHeader("Content-Disposition", "inline; filename=\"" + photoFilename + "\"");

                        // Lire le fichier et écrire dans la réponse
                        Files.copy(path, response.getOutputStream());
                        response.getOutputStream().flush();
                    } catch (IOException e) {
                        e.printStackTrace();
                        response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
                    }
                } else {
                    response.setStatus(HttpStatus.NOT_FOUND.value());
                }
            } else {
                response.setStatus(HttpStatus.NOT_FOUND.value());
            }
        } else {
            response.setStatus(HttpStatus.NOT_FOUND.value());
        }
    }

    private String getContentType(Path path) throws IOException {
        String contentType = Files.probeContentType(path);
        return contentType != null ? contentType : "application/octet-stream";
    }

    private void copyFileToResponse(Path path, HttpServletResponse response) throws IOException {
        Files.copy(path, response.getOutputStream());
        response.getOutputStream().flush();
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Invalidate the session
        SecurityContextHolder.clearContext();

        // You can also clear any specific tokens or session data here

        // Return an HTTP response with OK status
        return ResponseEntity.ok().build();
    }

  @PostMapping("/upload")
  public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("idUser") Long idUser) throws IOException {
      String uploadImage = dossierMedicaleService.uploadFile(file, idUser);
      return ResponseEntity.status(HttpStatus.OK).body(uploadImage);
  }
  /*  @PostMapping("/uploadFileDiplome")
    public ResponseEntity<String> uploadFileDiplome(@RequestParam("file") MultipartFile file, @RequestParam("idUser") Long idUser) throws IOException {
        // Vérifier si l'utilisateur existe
        Utilisateur utilisateur = utilisateurRepo.findById(idUser)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur not found with id " + idUser));

        // Compresser le fichier avant de le sauvegarder
        byte[] compressedFile = FileUtils.compressFile(file.getBytes());

        // Créer une nouvelle instance de UserRoleMed
        UserRoleMed userRoleMed = new UserRoleMed();
        userRoleMed.setDiplômesMed(compressedFile);
        userRoleMed.setUtilisateur(utilisateur);  // Assurez-vous de lier l'utilisateur ici

        // Sauvegarder l'objet dans la base de données
        userRoleMedRepo.save(userRoleMed);

        // Retourner un message de succès
        return ResponseEntity.ok("File uploaded successfully: " + file.getOriginalFilename());
    }*/


    @GetMapping("/dossiermedical")
    public ResponseEntity<?> getDossierMedicalByEmail(@RequestParam("email") String email) {
        DossierMedical dossierMedical = dossierMedicaleService.getDossierMedicalByEmail(email);
        return ResponseEntity.ok(dossierMedical);
    }

  /*  @PostMapping(value="/save" ,consumes = "application/json", produces = "application/json")
    public ResponseEntity<DossierMedical> saveDossierMedical(
            @RequestParam("file") MultipartFile file,
            @RequestParam("description") String description,
            @RequestParam("fileName") String fileName,
            @RequestParam("type") String type,
            @RequestParam("name") String name,
            @RequestParam("nomUrgence") String nomUrgence,
            @RequestParam("numeroUrgence") String numeroUrgence,
            @RequestParam("taille") Integer taille,
            @RequestParam("poids") Integer poids,
            @RequestParam("anticedentsMedicaments") String anticedentsMedicaments,
            @RequestParam("vaccination") String vaccination,
            @RequestParam("dateVaccination") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateVaccination,
            @RequestParam("filePath") String filePath,

            @RequestParam("idUser") Long idUser) throws IOException {

        Utilisateur utilisateur = utilisateurRepo.findById(idUser)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé avec id : " + idUser));

        DossierMedical dossierMedical = DossierMedical.builder()
                .dossierMedical(file.getBytes())
                .description(description)
                .fileName(fileName)
                .type(type)
                .name(name)
                .nomUrgence(nomUrgence)
                .numeroUrgence(numeroUrgence)
                .taille(taille)
                .poids(poids)
                .anticedentsMedicaments(anticedentsMedicaments)
                .vaccination(vaccination)
                .dateVaccination(dateVaccination)
                .filePath(filePath)

                .utilisateur(utilisateur)
                .build();

        DossierMedical savedDossierMedical = dossierMedicaleService.saveDossierMedical(dossierMedical);

        return ResponseEntity.ok(savedDossierMedical);
    }
    @PostMapping(value="/save/{email}" , consumes = "application/json", produces = "application/json")
    public ResponseEntity<DossierMedical> saveDossierMedicalByEmail(
            @RequestParam("file") MultipartFile file,
            @RequestParam("description") String description,
            @RequestParam("fileName") String fileName,
            @RequestParam("type") String type,
            @RequestParam("name") String name,
            @RequestParam("nomUrgence") String nomUrgence,
            @RequestParam("numeroUrgence") String numeroUrgence,
            @RequestParam("taille") Integer taille,
            @RequestParam("poids") Integer poids,
            @RequestParam("anticedentsMedicaments") String anticedentsMedicaments,
            @RequestParam("vaccination") String vaccination,
            @RequestParam("dateVaccination") @DateTimeFormat(pattern = "yyyy-MM-dd") Date dateVaccination,
            @RequestParam("filePath") String filePath,

            @PathVariable("email") String email) throws IOException {

        Utilisateur utilisateur = utilisateurRepo.findByEmail(email);
        DossierMedical dossierMedical = DossierMedical.builder()
                .description(description)
                .fileName(fileName)
                .type(type)
                .name(name)
                .nomUrgence(nomUrgence)
                .numeroUrgence(numeroUrgence)
                .taille(taille)
                .poids(poids)
                .anticedentsMedicaments(anticedentsMedicaments)
                .vaccination(vaccination)
                .dateVaccination(dateVaccination)
                .filePath(filePath)

                .utilisateur(utilisateur)
                .build();

        DossierMedical savedDossierMedical = dossierMedicaleService.saveDossierMedical(dossierMedical);

        return ResponseEntity.ok(savedDossierMedical);
    }

*/

    @ExceptionHandler(ResponseStatusException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String handleNotFound(ResponseStatusException ex) {
        return ex.getReason();
    }


    @GetMapping("/{fileName}")
    public ResponseEntity<?> downloadFiles(@PathVariable String fileName) {
        List<byte[]> files = dossierMedicaleService.downloadFiles(fileName);

        if (files.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found");
        } else if (files.size() == 1) {
            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(files.get(0));
        } else {
            // Par exemple, retourner une liste d'URLs de fichiers ou une réponse personnalisée
            return ResponseEntity.status(HttpStatus.MULTI_STATUS)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(files);  // Cela pourrait nécessiter une transformation en JSON valide
        }
    }

//Consultation

    @PostMapping("/Addconsultations")
    public ResponseEntity<Consultation> addConsultation(@RequestBody Consultation consultation) {
        Consultation savedConsultation = consultationService.saveConsultation(consultation);
        return ResponseEntity.ok(savedConsultation);
    }
    @GetMapping("/{idUser}/consultations")
    public ResponseEntity<List<Consultation>> getConsultationsByUtilisateur(@PathVariable Long idUser) {
        List<Consultation> consultations = consultationService.getConsultationsByUtilisateur(idUser);
        return ResponseEntity.ok(consultations);
    }

}
