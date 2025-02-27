// Importar funciones necesarias de firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
//  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "./app/auth";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
// Importar la funcion para mostrar mensajes personalizados.
import { showMessage } from './showMessage.js';
// Importar div del mapa para poder manipularlo al iniciar sesion.
import { inicializarMapa, mapContainer } from './leaflet.js';
// Funciones del script openMeteo, para poder mostrar al usuario datos del clima
import { obtenerClima, mostrarClima } from './openMeteo.js';
// Importar funcion de dataTables.js, para poder mostrar la tabla con datos meteorologicos al cliente.
import { inicializarTabla } from "./dataTables.js";

// Configuracion de mi firebase.
const firebaseConfig = {
    apiKey: "AIzaSyAkJxweqbeqrQtH1QNGnu6nTqW53sCUEfo",
    authDomain: "autentificacionfirebasemikel.firebaseapp.com",
    projectId: "autentificacionfirebasemikel",
    storageBucket: "autentificacionfirebasemikel.firebasestorage.app",
    messagingSenderId: "253524724298",
    appId: "1:253524724298:web:7b9778cc3edb09e97974b3"
};

// Inicializar configuracion de firebase en una variable.
const app = initializeApp(firebaseConfig);
// Obtener y devolver servicio de autentificacion de firebase.
const auth = getAuth(app);

console.log(`Firebase initialized`);

// Comprobar el correcto funcionamiento de la configuracion.
// console.log("Objeto app: " + app);

// Elementos del DOM:
// Obtener contenedor de presentacion
let contenedorPresentacion = document.getElementById("contenedorPresentacion");
// Obtener todos los elementos del Registro:
let botonRegistro = document.getElementById("botonRegistro");
let formRegistro = document.getElementById("registro-form");
let divRegistro = document.getElementById("divRegistro");
let cerrarRegistro = document.getElementById("cerrarRegistro");

// Obtener los elementos del Login:
let botonLogin = document.getElementById("botonLogin");
let formLogin = document.getElementById("login-form");
let divLogin = document.getElementById("divLogin");
let cerrarLogin = document.getElementById("cerrarLogin");
let irCambioPassword = document.getElementById("irCambioPassword");

// Obtener elementos para la recuperacion de contraseñas:
let divRecuPassword = document.getElementById("divRecuPassword");
let botonCambiarPassword = document.getElementById("botonCambiarPassword");
let botoncerrarRecu = document.getElementById("cerrarRecu");


// Obtener el boton de cierre de sesion:
let botonLogout = document.getElementById("botonLogout");

// Obtener el div de la tabla donde se volcaran los datos meteorologicos:
let contenedorTabla = document.getElementById("contenedorTabla");

// Obtener el boton para usar la API de tensorFlow:
let botonTensorFlow = document.getElementById("botonTensorFlow");

// Boton para salir de tensorFlow y volver al mapa:
let botonVolverMapa = document.getElementById("botonVolverMapa");

// Declarar variables que se usaran mas adelante:
let botonDataTables = null;
let botonMostrarMapa;

// Evento que se llevara acabo cuando el usuario decida registrarse
botonRegistro.addEventListener("click", () => {
    // Mostrar el formulario de registro
    divRegistro.style.display = "block";
    // Ocultar los botones de registro y login para evitar conflictos
    botonLogin.style.display = "none";
    botonRegistro.style.display = "none";
    // Ocultar contenedor de presentacion
    contenedorPresentacion.style.display = "none";
});

// Evento para reguistrar un usuario al enviar el formulario
formRegistro.addEventListener("submit", (e) => {
    // Evitar que se recargue la página
    e.preventDefault();
    // Recoger los datos del formulario
    let email = document.getElementById("registro-email").value;
    let password = document.getElementById("registro-password").value;
    // Llamar a la función de registro
    registrar(email, password);
});

// Evento por si el usuario decide salir del registro, vuelve a la pantalla principal
cerrarRegistro.addEventListener("click", () => {
    // Resetea los campos del formulario para evitar errores de datos no enviados
    formRegistro.reset(); 
    // Ocultar y mostrar botones para volver al menu principal
    divRegistro.style.display = "none";
    botonLogin.style.display = "block";
    botonRegistro.style.display = "block";
    botonTensorFlow.style.display = "none"
    contenedorPresentacion.style.display = "block";
});

// Evento de logeo, cuando el usuario pulse el boton para logearse le llevara al formulario
botonLogin.addEventListener("click", () => {
    // Mostrar el formulario de login
    divLogin.style.display = "block";
    // Ocultar los botones de registro y login para evitar conflictos
    botonLogin.style.display = "none";
    botonRegistro.style.display = "none";
    // Ocultar contenedor de presentacion
    contenedorPresentacion.style.display = "none";
});

// Evento para cuando se envie el formulario de logeo
formLogin.addEventListener("submit", (e) => {
    // Evitar la carga por defecto
    e.preventDefault();
    // Obtener los campos de email y password
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;
    // Llamada a la funcion de logeo, pasandole el correo y contraseña por parametros
    login(email, password);
});

// Evento por si el usuario decide salir del logeo.
cerrarLogin.addEventListener("click", () => {
    // Ocultar y mostrar botones para volver al menu principal.
    divLogin.style.display = "none";
    botonLogin.style.display = "block";
    botonRegistro.style.display = "block";
    botonLogout.style.display = "none";
    // Mostrar contenedor de presentacion
    contenedorPresentacion.style.display = "block";
});

// Evento para que el usuario pueda logearse despues de recuperar la contraseña
botoncerrarRecu.addEventListener("click", () => {
    // Ocultar el contenedor de recuperacion
    divRecuPassword.style.display = "none";
    // Mostrar el login
    divLogin.style.display = "block";
});

// Evento para cuando se pulse el boton de cerrar sesion. 
// Llama a la funcion logout y oculta el boton de cerrar sesion.
botonLogout.addEventListener("click", () => {
    logout();
    document.getElementById("botonLogout").style.display = "none";
});

// Función para registrar un usuario usando firebase
function registrar(email, password) {
    // Funcion de firebase para crear un nuevo usuario con correo y contraseña.
    // El parametro auth es una instancia de autentificacion de firebase.
    createUserWithEmailAndPassword(auth, email, password)
        // Una vez el usuario se registra le inicia sesion automaticamente, para comprobar el correcto funcionamiento de la cuenta
        .then((userCredential) => {
            // Se muestra en consola que el usuario sse ha registrado con exito
            console.log("Usuario registrado correctamente:", userCredential.user.email);
            // Cerrar la sesion una vez registrado, para obligar al usuario a pasar por inicio de sesion
            signOut(auth).then(() => {
                console.log("Sesión cerrada correctamente, el usuario debe iniciar sesión");
            });
            // Ocultar el formulario de registro después del registro exitoso, para que el usuario inicie sesion
            divRegistro.style.display = "none";
            // Volver al menu principal
            botonLogin.style.display = "block";
            botonRegistro.style.display = "block";
        })
        // Manejo de errores
        .catch((error) => {
            // Declara una constante con el mensaje del error.
            const errorMessage = error.message;
            // Se muestra en consola el error obtenido al intentar registrar.
            console.log(`Error al registrar: ${errorMessage}`);
            // Si el correo ya existe
            if(error.code === 'auth/email-already-in-use'){
                showMessage("Este correo ya ha sido registrado", "error");
            }
            // Si el correo no es valido entra en esta condicion
            else if(error.code === 'auth/invalid-email'){
                showMessage("Este correo no es valido", "error");
            }
            // Si la contraseña no es valida entra en esta condicion
            else if(error.code === 'auth/weak-password'){
                showMessage("Contraseña demasiado débil", "error");
            }
            // Manejar un posible error desconocido
            else if(error.code){
                showMessage(error.message, "error");
            }
        });
}

// Función para iniciar sesión con correo y contraseña
function login(email, password) {
    // Funcion de firebase que permite iniciar sesion a un usuario a traves de su correo y contraseña.
    signInWithEmailAndPassword(auth, email, password)
        // Obtiene userCredential, que contiene los datos del usuario autenticado
        .then(async (userCredential) => {
            // Obtener en una constante el nombre del usuario
            const usuario = userCredential.user;
            // Mostrar en consola el usuario que se acaba de logear
            console.log(`Usuario logueado: ${usuario.email}`);
            // Mostrar los botones de cierre de sesion y tensorFlow.
            botonLogout.style.display = "block";
            botonTensorFlow.style.display = "block";
            // Ocultar el contenedor de logeo
            divLogin.style.display = "none";
            // Mostrar un mensaje expontaneo de bienvenida al usuario.
            showMessage("Bienvenido " + usuario.email, "success" );
            // Mostrar el mapa al usuario, despues de 1 segundo.
            setTimeout(() => {
                // Llamada a la funcion que inicializa el mapa
                inicializarMapa();
            }, 1000);
            // setTimeout para esperar 3 segundos y asegurarnos que carguen las coordenadas
            setTimeout(async() => {
                // Obtener el clima en una constante para mostrarle los datos al usuario
                const clima = await obtenerClima();
                // Si existen datos del clima, se llama a la funcion que los muestra
                if(clima){
                    mostrarClima(clima);
                } else{
                    // Si ocurre algun error se le avisa al usuario con un mensaje
                    showMessage("No se pudo obtener la información del clima", "error");
                }
            }, 3000);
            // Llamar a la funcion que controla los diferentes botones con los que interactua el usuario.
            controlDeBotones();     
        })
        // Control de errores
        .catch((error) => {
            // Obtener el codigo del error
            const errorCode = error.code;
            // Obtener el mensaje del error
            const errorMessage = error.message;
            // Mostrar en consola el mensaje de error
            console.log(`Error al loguearse: ${errorMessage}`);
            // Mostrar en consola el codigo de error
            console.log(`Codigo de error: ${errorCode}`);
            // Mostrar el mensaje de error al usuario
            showMessage("Credenciales incorrectas", "error");
        });
}

// Evento por si el usuario decide cambiar de contraseña
irCambioPassword.addEventListener("click", function() {
    // Ocultar el contenedor de logeo y mostrar el de recuperar contraseña
    divLogin.style.display = "none";
    divRecuPassword.style.display = "block";
    
})

// Evento para el botón de cambiar contraseña
botonCambiarPassword.addEventListener("click", () => {
    // Obtener correo, para enviar la recuperacion
    let email = document.getElementById("recu-email").value;
    // Si el correo no es valido, se le avisa al usuario.
    if(!email){
        showMessage("Introduce un correo válido", "error");
        return;
    }
    // Si el correo es valido, se envia el correo al usuario para que cambie su contraseña
    sendPasswordResetEmail(auth, email)
        .then(() => {
            // Se le muestra un mensaje de que el correo a sido enviado
            showMessage("Te enviamos un correo para restablecer tu contraseña.", "success");
        })
        // Si hay algun problema al enviar el correo se controla aqui
        .catch((error) => {
            console.error("Error al enviar correo:", error.message);
            showMessage("No pudimos enviar el correo. Verifica el email.", "error");
        });
});

// Esta funcion permite controlar los botones para ocultar o mostrar diferentes elementos del HTML.
function controlDeBotones() {
    // Crear el boton de datos de clima si no existe
    if(!botonDataTables){
        // Boton que permite ver los datos del clima
        botonDataTables = document.createElement("button");
        // Se le asigna un id.
        botonDataTables.setAttribute("id", "botonDataTables");
        // Se le da un texto
        botonDataTables.textContent = "Tabla de datos";
        // Se añade el boton
        document.body.appendChild(botonDataTables);
    }
    // Asegurar que se muestre al loguear
    botonDataTables.style.display = "block"; 

    // Crear boton ver mapa si no existe
    if(!botonMostrarMapa){
        // Boton que permite ver el mapa
        botonMostrarMapa = document.createElement("button");
        // Se le da un id
        botonMostrarMapa.setAttribute("id", "botonMostrarMapa");
        // Se añade un texto al boton
        botonMostrarMapa.textContent = "Mostrar Mapa";
        // El boton estara oculto de momento
        botonMostrarMapa.setAttribute("display", "none");
        // Se añade el boton
        document.body.appendChild(botonMostrarMapa);
    }
    // Ocultar al loguear, ya que el mapa ya se muestra    
    botonMostrarMapa.style.display = "none"; 

    // Evento por si el usuario pulsa el boton para ver los datos del tiempo.
    botonDataTables.addEventListener("click", async() => {
        // Octular el contenedor del mapa
        mapContainer.style.display = 'none';
        // Ocultar el boton de datos
        botonDataTables.style.display = "none";
        // Mostrar boton para volver al mapa
        botonMostrarMapa.style.display = "block";
        // Mostrar la tabla con datos meteorologicos
        contenedorTabla.style.display = "block";
        // Inicializar DataTables con los datos meteorológicos
        await inicializarTabla();
    })

    // Evento que permite volver al mapa si el usuario a decidido ir a la tabla de datos o a tensorFlow
    botonMostrarMapa.addEventListener("click", () => {
        // Mostrar el contenedor del mapa
        mapContainer.style.display = 'block';
        // Mostrar el boton de datos
        botonDataTables.style.display = "block";
        // Ocultar boton de mapa
        botonMostrarMapa.style.display = "none";
        // Oculta tabla de dataTables
        contenedorTabla.style.display = "none";
    })

    // Este evento se lleva acabo cuando el usuario pulsa el boton de volver a mostrar mapa, cuando ha estado utilizando tensorFlow o la tabla de datos.
    // Es completamente identico al evento de botonMostrarMapa, pero es otro boton, ya que este boton esta situado en la seccion de botones,
    // los cuales se encuentran en la parte superior de la pagina.
    botonVolverMapa.addEventListener("click", function() {
        // Mostrar el contenedor del mapa
        mapContainer.style.display = 'block';
        // Mostrar el boton de datos
        botonDataTables.style.display = "block";
        // Ocultar boton de mapa
        botonMostrarMapa.style.display = "none";
        // Oculta tabla de dataTables
        contenedorTabla.style.display = "none";
        // Ocultar boton
        botonVolverMapa.style.display = "none";
        // Ocultar boton
        botonTensorFlow.style.display = "block";
        // Ocultar contenedor
        contenedorTensorFlow.style.display = "none";

    })
}

// Función para cerrar sesión
function logout() {
    // Funcion de firebase que cierra la sesion del usuario
    signOut(auth).then(() => {
        // Mostrar por consola que se a cerrado la sesion
        console.log("Sesión cerrada correctamente");
        // Mostrar botones de registro e inicio de sesion
        botonLogin.style.display = "block";
        botonRegistro.style.display = "block";
        // Mostrar mensaje al usuario
        showMessage("Hasta pronto", "success");
        // Ocultar boton de tensorFlow y el mapa
        mapContainer.style.display = 'none';
        botonTensorFlow.style.display = "none";
        // Obtener el valor del contenedor de tensorFlow. 
        let contenedorTensorFlow = document.getElementById("contenedorTensorFlow");
        // Si existe el contenedor de tensorFlow se oculta
        if(contenedorTensorFlow) {
            contenedorTensorFlow.style.display = "none";
        }
        // Si existe el boton de volver al mapa se oculta
        if(botonVolverMapa) {
            botonVolverMapa.style.display = "none";
        }
        // Ocultar los botones creados dinámicamente
        if (botonDataTables) {
            botonDataTables.style.display = "none";
        }
        // Ocultar boton de mostrar mapa
        if (botonMostrarMapa) {
            botonMostrarMapa.style.display = "none";
        }

        // Ocultar contenedor de la tabla si existe
        if (contenedorTabla) {
            contenedorTabla.style.display = "none";
        }
        // Mostrar el contenedor de presentacion
        contenedorPresentacion.style.display = "block";
    }).catch((error) => {
        // Mostrar si existe algun error al cerrar la sesion
        console.log("Error al cerrar sesión", error.message);
        showMessage("Hubo un error al cerrar la sesion", "error");
    });
}
