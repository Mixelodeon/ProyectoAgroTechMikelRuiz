// Importar la funcion para mostrar mensajes.
import { showMessage } from './showMessage.js';

// Variable que sera exportable y almacenara la instancia del mapa
export let mapInstance = null; 
// Constante exportable que contendra las coordenadas del usuario
export const userCoords = { lat: null, lon: null };
// Obtener el contenedor del mapa por su id
export const mapContainer = document.getElementById('map');
// Imprimir por consola mensaje avisando que el script se a cargado con exito
console.log("Leaflet initialized");

// Funcion para obtener las coordenadas del usuario 
export function getUserCoords() {
    return new Promise((resolve, reject) => {
        // Comprueba que las coordenadas existan
        if (userCoords.lat !== null && userCoords.lon !== null) {
            // Si las coordenadas existen, se devuelven
            resolve(userCoords); 
        } else { 
            // Si las coordenadas no existen, se usa la api de geolocalizacion
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Las coordenadas de latitud y longitud son almacenadas en variables
                    userCoords.lat = position.coords.latitude;
                    userCoords.lon = position.coords.longitude;
                    // Se imprimen por consola para verficar su funcionamiento
                    console.log(`Coordenadas obtenidas: ${userCoords.lat}, ${userCoords.lon}`);
                    // Se resuelve la promesa con las coordenadas del usuario
                    resolve(userCoords);
                },
                (error) => {
                    // En caso de error al obtener las coordenadas, se muestra por consola y se rechaza la promesa
                    console.error('Error obteniendo coordenadas:', error);
                    reject(error);
                }
            );
        }
    });
}

// Funcion para inicializar el mapa
export function inicializarMapa() {
    // Verifica que el contenedor del mapa exista
    if (!mapContainer) {
        // Si no existe se avisa por consola y se controla con un return
        console.error("No se encontró el contenedor del mapa.");
        return;
    }
    // Mostrar el contenedor del mapa
    mapContainer.style.display = 'block';

    // Obtener la ubicación del usuario haciendo uso de la funcion anterior
    getUserCoords()
        .then(({ lat, lon }) => {
            // Si no se a generado una instancia del mapa entra en esta condicion
            if (!mapInstance) {
                // Se avisa por consola de que se esta generando una nueva instancia del mapa
                console.log("Creando nueva instancia del mapa...");
                // Se genera una instancia del mapa en el contenedor correspondientes con las coordenadas del usuario y un zoom del 13
                mapInstance = L.map('map').setView([lat, lon], 13);
                // Se añade la capa de openStreetMap oara mostrar el mapa
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    // Se establece un nivel maximo de zoom
                    maxZoom: 19,
                    // Atribución obligatoria de OpenStreetMap 
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(mapInstance); // Se añade la capa al mapa

                // Agregar un marcador en la ubicacion del usuario.
                let marker = L.marker([lat, lon]).addTo(mapInstance);
            } else {
                // Si el mapa ya ha sido creado, se actualiza la vista con las nuevas coordenadas  
                console.log("Actualizando la vista del mapa...");
                mapInstance.setView([lat, lon], 13);
            }
    }).catch(error => {
        // Se controlan los posibles errores y se avisa al usuario de ello
        console.error("Error al obtener coordenadas:", error);
        showMessage("No se pudo obtener la ubicación.", "error");
    });
}
