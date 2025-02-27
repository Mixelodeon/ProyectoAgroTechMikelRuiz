// Importar la funcion de obtener clima desde opnemeteo.js
import { obtenerClima } from "./openMeteo.js";

// Obtener el contenedor de tabla del HTML
let contenedorTabla = document.getElementById("contenedorTabla");

// Funcion exportable que permite inicializar la tabla de datos
export async function inicializarTabla() {
    // Esperar a obtener los datos del clima
    const clima = await obtenerClima();
    
    // Si el clima no existe, se controla el error y se avisa de el en consola
    if (!clima) {
        console.error("No se pudo obtener los datos del clima.");
        return;
    }

    // Obtener la tabla del HTML
    let tablaExistente = document.getElementById("tablaClima");
    // Si la tabla no existe se creara
    if (!tablaExistente) {
        // Crear la tabla solo si no existe
        let tabla = document.createElement("table");
        // Dar id a la tabla
        tabla.setAttribute("id", "tablaClima");
        // Ocultar de primeras la tabla
        tabla.setAttribute("display", "none");
        // Añadir una clase a la tabla
        tabla.classList.add("display"); 
        // Añadir la tabla a su correspondiente contenedor
        contenedorTabla.appendChild(tabla);
    }

    // Inicializar DataTables con los datos del clima
    $("#tablaClima").DataTable({
        // Elimina la tabla anterior si existe
        destroy: true,
        // Desactiva la paginacion, para que la tabla se vea mas limpia
        paging: false, 
        // Desactivar la barra de busqueda de la tabla
        searching: false, 
        // Ocultar el texto mostrando x de x entrada
        info: false, 
        // Desactivar la opcion de ordenar columnas
        ordering: false,
        // Introducir los datos meteorologicos en la tabla
        data: [
            [
                clima.temperatura + "°C",
                clima.viento + " km/h",
                clima.humedad + "%",
                clima.precipitaciones
            ]
        ],
        // Dar un titulo a cada columna de la tabla
        columns: [
            { title: "Temperatura" },
            { title: "Velocidad del viento" },
            { title: "Humedad" },
            { title: "Precipitaciones" }
        ]
    });
}
