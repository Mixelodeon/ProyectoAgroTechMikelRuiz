// Importar las coordenadas del usuario del secript leaflet
import { getUserCoords } from './leaflet.js';

// Se guarda en una constante la URL base de la API
const API_URL = "https://api.open-meteo.com/v1/forecast";

// Funcion asincrona para obtener el clima basado en las coordenadas del usuario.
export async function obtenerClima() {
  try{
    // Espera a obtener las coordenadas del usuario
    const { lat, lon } = await getUserCoords();
    // Imprimir las coordenadas del usuario para comprobar que no hay fallos
    console.log(`Obteniendo clima para: ${lat}, ${lon}`);

    // Llamada a la API para obtener datos meteorologicos
    const response = await fetch(
      `${API_URL}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m,precipitation`
    );
    // Convierte la respuesta en un objeto JSON
    const data = await response.json();
    // Imprime la respuesta completa en consola (Lo dejo comentado para tener una consola mas limpia)
    // console.log("Respuesta completa de la API:", data); 
    
    // Verificiar si la API devolvio los datos sobre el clima
    if (data.current_weather) {
      // Verificar si los datos horarios existen y contienen la humedad y las precipitaciones
      if (!data.hourly || !data.hourly.relative_humidity_2m || !data.hourly.precipitation) {
        // Si los datos no existen salta un error
        throw new Error("La API no devolvió los datos esperados (humidity o precipitation).");
      }
      // Se obtienen los datos buscados del clima
      const clima = {
        // Temperatura actual
        temperatura: data.current_weather.temperature,
        // Velocidad del tiempo
        viento: data.current_weather.windspeed,
        // Humedad para la primera hora de la prediccion
        humedad: data.hourly.relative_humidity_2m[0] || "No disponible",
        // Precipitaciones para la primera hora de la prediccion
        precipitaciones: data.hourly.precipitation[0] || "No disponible", 
      };
      // Muestra los datos del clima obtenidos en la consola
      console.log("Datos del clima recibidos: ", clima);
      // Devuelve el objeto con los datos meteorologicos
      return clima;
    } else{
      // Si no se consiguieron los datos del clima se lanza un error
      throw new Error("No a sido posible obtener datos del clima.");
    }
  } catch(error){
    // Se captura cualquier error durante la ejecuccion y se muestra en consola
    console.error("Error obteniendo el clima:" , error);
    // Devuelve null si hay algun error
    return null;
  }
}
// Funcion para mostrar la informacion del clima en la consola
export function mostrarClima(clima) {
    // Verificar que el objeto clima tiene datos validos
    if (clima) {
      // Muestra en consola la temperatura actual
      console.log(`Temperatura: ${clima.temperatura}°C`);
      // Muestra en consola la velocidad del viento
      console.log(`Velocidad del viento: ${clima.viento} km/h`);
      // Muestra en consola el porcentaje de humedad
      console.log(`Humedad: ${clima.humedad}%`);
      // Muestra en consola las precipitaciones
      console.log(`Precipitaciones: ${clima.precipitaciones}`)
    } else{
      // Si el objeto clima no tiene datos validos se avisa en consola
      console.log(`No hay datos de clima disponibles.`)
    }
}