En este proyecto se hace uso de diferentes APIs como firebase, leaflet, tensorFlow, dataTables, openMeteo y showMessage:
- Firebase: Esta API se usa para implementar un control de usuarios. Perimte registrar usuarios y logaerlos, de esta manera
   se muestran diferentes interfaces al usuario logeado y al no logeado.
- Leaflet: La uso para implementar un mapa con un marcador posicion en la que se encuentra el usuario. Este mapa lo puede usar
  el usaurio para ver zonas de su alrededor. 
- OpenMeteo: Con las coordenadas del usuario y esta API, obtengo los datos meteorologicos como, temperatura, humedad, velocidad del viento
  y precipitaciones de la ubicacion del usuario. 
- TensorFlow: Con esta API se permite al usuario subir imagenes de su dispositivo y que una inteligencia artificial las analice y califique.
  No he implementado que el usuario pueda abrir la camara del movil y sacar fotos.

Manual de uso: 
Para el uso de esta pagina, el usuario vera un mensaje de bienvenida con las tecnologias que implementa el proyecto. El usuario deberá de registrarse,
para obtener una cuenta y asi poder logearse para descubrir el resto de la pagina. Una vez se registre se le devolverá al menu principal para que se logee.
En la opción de inicio de sesión, podrá recuperar la contraseña si la ha olvidado, simplemente debe introducir el correo al que le llegara un mensaje, el cual
le permitirá cambiar su contraseña.
Una vez el usuario ya este logeado, se le mostrara un mapa con un marcador en su posicion. Este mapa es interactivo, por lo que el usuario puede ver diferentes
zonas del mapa. 
El usuario tendrá 3 botones a su disposición:
    - Tabla de datos: Este botón muestra una tabla con los datos meteorológicos de su zona. Una vez se muestre la tabla, aparecerá un botón, el cual le permitirá
                      volver al mapa.
    - Usar tensorFlow: Este boton le llevara a un contenedor donde se le permitirá al usuario subir una imagen para que la analice una IA.
    - Cerrar Sesión: Este botón simplemente permite al usuario cerrar la sesión y volver al menú principal.