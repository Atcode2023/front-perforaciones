# ETAPA 1: CONSTRUCCIÓN (BUILD-STAGE)
# Usa una imagen base de Node.js con Alpine para un tamaño reducido
FROM node:lts-alpine AS build-stage

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# **¡IMPORTANTE!** Copia TODOS los archivos del proyecto PRIMERO.
# Esto es necesario para que 'npm install' y su script 'postinstall' (quasar prepare)
# puedan acceder a 'quasar.config.ts' y la estructura del proyecto.
COPY . .

# Instala la CLI de Quasar globalmente
# Nota: Si @quasar/cli ya está en 'devDependencies', puedes omitir este paso
RUN npm install -g @quasar/cli

# Instala las dependencias del proyecto.
# Aquí se ejecuta también el script 'postinstall' (como 'quasar prepare').
RUN npm install

# Comando de construcción de Quasar en modo PWA.
# Asegúrate de haber ejecutado 'quasar mode add pwa' en tu proyecto local.
# Quasar compila la PWA a la carpeta /dist/pwa por defecto.
RUN quasar build -m pwa


# ----------------------------------------------------------------------


# ETAPA 2: PRODUCCIÓN (PRODUCTION-STAGE)
# Usa una imagen de Nginx estable con Alpine para servir solo los archivos estáticos
FROM nginx:stable-alpine AS production-stage

# Copia los artefactos de construcción desde la etapa anterior.
# El contenido de /app/dist/pwa se copia a la ubicación de servicio de Nginx.
COPY --from=build-stage /app/dist/pwa /usr/share/nginx/html

# Expone el puerto por defecto de Nginx
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
