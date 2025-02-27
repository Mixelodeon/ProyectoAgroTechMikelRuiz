// Importar el contenedor del mapa del script leaflet.js
import { mapContainer } from './leaflet.js';

// Inicializo la variable del contenedor a nulo para asi poder exportarla a otros archivos:
export let contenedorTensorFlow = null;

// Obtener botones del html
let botonTensorFlow = document.getElementById("botonTensorFlow");
let botonVolverMapa = document.getElementById("botonVolverMapa");
let botonDataTables = document.getElementById("botonDataTables");
let contenedorTabla;
let botonMostrarMapa;

// Funcion para crear el contenedor de tensorFlow
function crearContenedor() { 
    // Creacion del contenedor pirncipal
    contenedorTensorFlow = document.createElement("div");
    // Dar un ide al contenedor recien creado
    contenedorTensorFlow.setAttribute("id", "contenedorTensorFlow");

    // Crear título
    let titulo = document.createElement("h2");
    // Dar un texto al titulo
    titulo.textContent = "Sube una imagen para clasificarla:";
    // Añadir el titulo al contenedor
    contenedorTensorFlow.appendChild(titulo);

    // Crear input para subir una imagen
    let inputImagen = document.createElement("input");
    // Indicar que el input sera de tipo imagen
    inputImagen.setAttribute("type", "file");
    // Añadir un id al input
    inputImagen.setAttribute("id", "imageUploader");
    // Solo permite subir archivos de imagenes
    inputImagen.setAttribute("accept", "image/*");
    // El input aparecera oculto de primeras
    inputImagen.style.display = "none";
    // Crear botón que permitira subir imagenes
    let botonSubir = document.createElement("button");
    // Dar un id al boton
    botonSubir.setAttribute("id", "botonSubir");
    // Dar texto al boton
    botonSubir.textContent = "Subir";

    //Evento para que el botón active el input de archivos
    botonSubir.addEventListener("click", function() {
        // Simula un click en el input, esto hara que se abra la ventana de seleccion de archivos
        inputImagen.click();
    });
    
    // Agregar elementos al contenedor
    contenedorTensorFlow.appendChild(inputImagen);
    contenedorTensorFlow.appendChild(botonSubir);

    // Crear salto de línea y añadirlo al contenedor
    contenedorTensorFlow.appendChild(document.createElement("br"));

    // Crear imagen oculta, la cual permitira al usuario ver la imagen que decida subir
    let imagen = document.createElement("img");
    // Añadir un id a la imagen
    imagen.setAttribute("id", "image");
    // Añadir un ancho maximo de la imagen
    imagen.setAttribute("width", "300");
    // Permanece la imagen en oculto hasta que se indique
    imagen.style.display = "none"; 
    // Añadir la imagen al contenedor
    contenedorTensorFlow.appendChild(imagen);

    // Crear párrafo para mostrar resultado
    let resultado = document.createElement("p");
    // Se le añade un id aol parrafo
    resultado.setAttribute("id", "result");
    // Añade el parrafo al contenedor
    contenedorTensorFlow.appendChild(resultado);

    // Agregar el contenedor al body
    document.body.appendChild(contenedorTensorFlow);
}
// Evento para cuando el usuario haga click en el boton pueda usar tensorFlow
botonTensorFlow.addEventListener("click", function() {
    // Se oculta el contenedor del mapa
    mapContainer.style.display = "none";
    // Se oculta el boton para acceder a tensorFlow
    botonTensorFlow.style.display = "none";
    // Se muestra el boton que permite volver al mapa
    botonVolverMapa.style.display = "block";
    // Si el boton no existe lo obtengo y lo almaceno en una variable, esto lo hago por un error 
    // en el que el boton se ponia en valor nulo y no me dejaba manipularlo
    if(!botonDataTables){
        botonDataTables = document.getElementById("botonDataTables");
    }
    // Si el boton existe se oculta
    if(botonDataTables){
        botonDataTables.style.display = "none";
    }
    // Si el contenedor de la tabla no existe, se obtiene y se almacena en una variable
    if(!contenedorTabla){
        contenedorTabla = document.getElementById("contenedorTabla");
    }
    // Si el contenedor de la tabla existe se oculta
    if(contenedorTabla){
        contenedorTabla.style.display = "none";
    }
    // Si el boton no existe se obtiene y se almacena en una variable
    if(!botonMostrarMapa){
        botonMostrarMapa = document.getElementById("botonMostrarMapa");
    }
    // Si el boton existe se oculta
    if(botonMostrarMapa){
        botonMostrarMapa.style.display = "none";
    }
    // Obtener elemento de la imagen y almacenarlo en una variable
    let imgElement = document.getElementById("image");
    // Obtener el resultado y almacenarlo en una variable
    let result = document.getElementById("result");

    // Se borra el resultado y la imagen en las siguientes condiciones, para cuando el usuario sale de tensorFlow
    // con una imagen cargada, y al volver asi no existira ninguna imagen ni resultado cargados
    // Si la imagen existe, ocultarla y borrar su src.
    if (imgElement) {
        imgElement.style.display = "none";
        imgElement.src = "";
    }
    // Si el resultado existe se borra.
    if (result) {
        result.style.display = "none";
    }
    // Obtener el contenedor en el que se almacena tensorFlow y guardarlo en una variable
    let contenedor = document.getElementById("contenedorTensorFlow");

    // Si el contenedor no existe, créalo
    if (!contenedor) {
        // Llamada a la funcion que crea el contenedor
        crearContenedor();
        // Obtener el contenedor y almacenarlo en una variable
        contenedor = document.getElementById("contenedorTensorFlow"); 
        // Añadir un evento "change" al input con id 'ìmageUploadre'
        // Este evento se llevara acabo en el momento que el usuario suba una imagen
        document.getElementById('imageUploader').addEventListener('change', async function(event) {
            // Obtener el archivo seleccionado por el usuario
            const file = event.target.files[0];
            // Si no selecciona ningun archivo se detiene la ejecucion
            if (!file) {
                return;
            }
            // Se obtiene el elemento de la imagen y se almacena en una variable
            const imgElement = document.getElementById('image');
            // Se actualiza la url de la imagen, por lo que se añade la nueva imagen
            imgElement.src = URL.createObjectURL(file);
            // Se muestra la imagen
            imgElement.style.display = 'block';
            // Carga el modelo de mobileNet de tensorFlow
            const model = await mobilenet.load();
            // Se usa el modelo para clasificar la imagen subida
            const predictions = await model.classify(imgElement);
            // Se muestra el resultado de la clasificacion
            document.getElementById('result').innerText = `Predicción: ${predictions[0].className} con ${Math.round(predictions[0].probability * 100)}% de confianza`;
        });
    }

    // Alternar visibilidad del contenedor
    // Esto lo hago por un error que si estaba viendo la tabla de datos meteorologicos y queria acceder a tensorFlow,
    // el contenedor no aparecia
    if (contenedor.style.display === "none" || contenedor.style.display === "") {
        contenedor.style.display = "block";
    } else {
        contenedor.style.display = "none";
    }
});

