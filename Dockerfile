# Utilisez une image de base pour Java
FROM openjdk:17-jdk-alpine

# Définit le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copie le fichier jar généré dans l'image Docker
COPY target/SahtyApp1-0.0.1-SNAPSHOT.jar SahtyApp1-0.0.1-SNAPSHOT.jar

# Expose le port sur lequel l'application écoute
EXPOSE 8082

# Commande pour lancer l'application
ENTRYPOINT ["java", "-jar", "/SahtyApp1-0.0.1-SNAPSHOT.jar"]
