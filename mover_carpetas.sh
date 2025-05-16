#!/bin/bash

cd /p_wrk1/gestorUsuarioNginx
rm -fr angularFrontEnd correosgestor  javaBackEnd  nginx   pagosDiariosNode  reportesnode


cd /p_wrk1/GestorUsuarioFront-user2/gestorUsuariosFront
rm -fr node_modules

# Definir las rutas fijas
ORIGENA="/p_wrk1/GestorUsuarioFront-user2/gestorUsuariosFront"
ORIGENJ="/p_wrk1/GestorUsuarioBack-user1/gestorUsuarios-Back"
ORIGENP="/p_wrk1/GestorCoordinador/pagosDiariosNode/"
ORIGENR="/p_wrk1/GestorCoordinador/reportesnode/"
ORIGENN="/p_wrk1/GestorCoordinador/nginx/"
ORIGENC="/p_wrk1/GestorCoordinador/correosgestor/"
DESTINO="/p_wrk1/gestorUsuarioNginx"

# Verificar si la carpeta origen existe
if [ ! -d "$ORIGENA" ]; then
  echo "Error: La carpeta ORIGENA '$ORIGEN' no existe."
  exit 1
fi

# Verificar si la carpeta origen existe
if [ ! -d "$ORIGENJ" ]; then
  echo "Error: La carpeta ORIGENJ '$ORIGEN' no existe."
  exit 1
fi

# Verificar si la carpeta destino existe, si no, crearla
if [ ! -d "$DESTINO" ]; then
  echo "La carpeta destino '$DESTINO' no existe. Creándola..."
  mkdir -p "$DESTINO"
fi

# Copiar la carpeta frontend y renombrarla
cp -r "$ORIGENA" "$DESTINO/angularFrontEnd"
if [ "$?" -eq 0 ]; then
  echo "Carpeta frontend copiada exitosamente a '$DESTINO/angularFrontEnd'."
else
  echo "Error al copiar la carpeta frontend."
  exit 1
fi

# Copiar la carpeta backend y renombrarla
cp -r "$ORIGENJ" "$DESTINO/javaBackEnd"
if [ "$?" -eq 0 ]; then
  echo "Carpeta backend copiada exitosamente a '$DESTINO/javaBackEnd'."
else
  echo "Error al copiar la carpeta backend."
  exit 1
fi

# Copiar la carpeta pagosdiarios y renombrarla
cp -r "$ORIGENP" "$DESTINO"
if [ "$?" -eq 0 ]; then
  echo "Carpeta pagosdiarios copiada exitosamente a '$DESTINO/javaBackEnd'."
else
  echo "Error al copiar la carpeta pagosdiarios."
  exit 1
fi

# Copiar la carpeta reporte y renombrarla
cp -r "$ORIGENR" "$DESTINO"
if [ "$?" -eq 0 ]; then
  echo "Carpeta reporte copiada exitosamente a '$DESTINO/javaBackEnd'."
else
  echo "Error al copiar la carpeta reporte."
  exit 1
fi

# Copiar la carpeta nginx y renombrarla
cp -r "$ORIGENN" "$DESTINO"
if [ "$?" -eq 0 ]; then
  echo "Carpeta nginx copiada exitosamente a '$DESTINO/javaBackEnd'."
else
  echo "Error al copiar la carpeta nginx."
  exit 1
fi

# Copiar la carpeta correo y renombrarla
cp -r "$ORIGENC" "$DESTINO"
if [ "$?" -eq 0 ]; then
  echo "Carpeta correo copiada exitosamente a '$DESTINO/javaBackEnd'."
else
  echo "Error al copiar la carpeta correo."
  exit 1
fi

cd /p_wrk1/gestorUsuarioNginx/angularFrontEnd/
rm -fr node_modules .git .gitignore .angular .vscode
echo "OK angularFrontEnd"

cd /p_wrk1/gestorUsuarioNginx/javaBackEnd/
rm -fr .git .gitignore .idea .metadata .vscode target .classpath .factorypath
echo "OK javaBackEnd"

cd /p_wrk1/gestorUsuarioNginx/javaBackEnd/bin/
rm -fr .gitignore .metadata .mvn .project .settings
echo "OK javaBackEnd/bin"


chmod -R 777 /p_wrk1/gestorUsuarioNginx

cd /p_wrk1/gestorUsuarioNginx/javaBackEnd/src/main/resources/
rm -fr application2.properties application.properties
echo "OK inicia borrado"

cd /p_wrk1/gestorUsuarioNginx
cp -r application.properties /p_wrk1/gestorUsuarioNginx/javaBackEnd/src/main/resources/

cd /p_wrk1/gestorUsuarioNginx/correosgestor/
rm -fr node_modules

cd /p_wrk1/gestorUsuarioNginx/pagosDiariosNode/
rm -fr node_modules

cd /p_wrk1/gestorUsuarioNginx/reportesnode/
rm -fr node_modules
echo "OK termina borrado"

cd /p_wrk1/
chmod -R 777 gestorUsuarioNginx
cp -r gestorUsuarioNginx /P_HelpVoz/p_6.3.2_Proceso/6.3.2.1_Entregas/GestorClientes/gestormigracion/2025/V6.11.0/src/
echo "OK Permisos 1"

cd /P_HelpVoz/p_6.3.2_Proceso/6.3.2.1_Entregas/GestorClientes/gestormigracion/2025/V6.11.0/src/
chmod -R 777 gestorUsuarioNginx
echo "OK Permisos 2"








