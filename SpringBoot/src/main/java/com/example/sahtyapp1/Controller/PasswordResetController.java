package com.example.sahtyapp1.Controller;

import com.example.sahtyapp1.ServiceImpl.PasswordService;
import com.example.sahtyapp1.ServiceImpl.UtilisateurDetailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
    @RequestMapping("/pass")
    public class PasswordResetController {
        @Autowired
        private UtilisateurDetailServiceImpl utilisateurDetailService;
        @Autowired
        private PasswordService passwordEncoderService;

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
    }


