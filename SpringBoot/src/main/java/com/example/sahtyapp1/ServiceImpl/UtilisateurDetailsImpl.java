package com.example.sahtyapp1.ServiceImpl;

import com.example.sahtyapp1.Entity.Role;
import com.example.sahtyapp1.Entity.Utilisateur;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

public class UtilisateurDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;
    @NotNull
    private Long id;
    @NotNull
    private String username;
    @NotNull
    private String email;
    @NotBlank
    @NotNull
    private String prenom;
    @NotBlank
    @NotNull
    private String nom;
    @NotBlank
    @NotNull
    @NotEmpty
    private String adresse;

    @NotBlank
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")

    private LocalDate  date_naissance ;
    @NotBlank
    @NotNull
    private Long numero ;
    private String rolee ;

    @NotNull
    @JsonIgnore
    private String password;
    private Set<Role> roles;


    private Collection<? extends GrantedAuthority> authorities;

    public UtilisateurDetailsImpl(Long id, String username, String email, String password,
                                  String prenom, String nom, String adresse,  LocalDate date_naissance, Long numero,
                                  @NotNull Set<Role> roles, Collection<? extends GrantedAuthority> authorities, String rolee) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.prenom = prenom;
        this.nom = nom;
        this.adresse = adresse;
        this.date_naissance=date_naissance;
        this.numero = numero;
        this.roles =roles;
        this.authorities = authorities;
        this.rolee=rolee;
    }

    public static UtilisateurDetailsImpl build(Utilisateur utilisateur) {
        Set<Role> roles = utilisateur.getRoles();
        Collection<? extends GrantedAuthority> authorities = roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toList());

        return new UtilisateurDetailsImpl(
                utilisateur.getIdUser(),
                utilisateur.getUsername(),
                utilisateur.getEmail(),
                utilisateur.getPassword(),
                utilisateur.getPrenom(),
                utilisateur.getNom(),
                utilisateur.getAdresse(),
                utilisateur.getDate_naissance(),
                utilisateur.getNumero(),
                roles,
                authorities ,                 utilisateur.getRolee()
                );
    }






    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public LocalDate getDate_naissance() {
        return date_naissance;
    }

    public void setDate_naissance(LocalDate date_naissance) {
        this.date_naissance = date_naissance;
    }

    public Long getNumero() {
        return numero;
    }

    public void setNumero(Long numero) {
        this.numero = numero;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
        this.authorities = authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UtilisateurDetailsImpl user = (UtilisateurDetailsImpl) o;
        return Objects.equals(id, user.id);
    }

}
