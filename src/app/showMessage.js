// Este script configura una función para mostrar mensajes personalizados al usuario utilizando Toastify.
// La funcion recibe dos parametros: 
// - message: El mensaje que se le mostrara al usuario.
// - type: Indica si el mensaje es de tipo exito o error.
export function showMessage(message, type){
    Toastify({
        // Mensaje que se le mostrara al usuario
        text: message,
        // Duracion del mensaje hasta desaparecer
        duration: 3000,
        // Muestra un boton de cierre del mensaje
        close: true,
        // Posicion de la notificacion en la pantalla, en este caso en la parte superior de la pantalla
        gravity: "top", 
        // Posicion horizontal de la notificacion, en este caso en la izquierda
        position: "left", 
        // Evita que la notificación desaparezca si el usuario pasa el cursor sobre ella.
        stopOnFocus: true, 
        style: {
            // Si el mensaje es de exito sale en verde, de lo contrario sale en rojo.
            background: type === "success" ? "green" : "red"
        },
    }).showToast(); // Llama al metodo showToast() para mostrar la notificación en pantalla.
}