/* Encriptador
Este encriptador cambiará cada caracter por otro en el rango de caracteres que son imprimibles.
Independientemente del tamaño de la llave, el caracter siempre estar[a] sobre este rango
gracias a la implementacion de divisiones, sumas y restas sobre el caracter base y el ultimo caracter.

Variables
caracterBase = primer caracter sobre el cual se encriptará el texto
ultimoCaracter = ultimo caracter sobre el cual se encriptará el texto
caracterParaKey = caracter utilizado para separar la key del texto encriptado para desencriptarlo

Key
La llave es la suma de todos los caracteres ascii del texto a encriptar. La llave puede contener
cualquier valor, pero los caracteres siempre estarán en el mismo rango. Esta llave hace que
la encriptación sea dinámica ya que cambia cuando el texto cambia.
*/

let texto = "";
let textoEncriptado = "";
let caracterParaKey = 126;
let caracterBase = 32; // Primer caracter que se considera para encriptar. No quiero espacios
let ultimoCaracter = 125;
let numeroCaracteres = ultimoCaracter - caracterBase;

function asignarTextoElemento(elemento, texto) {
    let label = document.querySelector(elemento);
    label.value = texto;
    return;
}

function convertirTexto() {
    let textoNormal = document.getElementById('mensaje').value;
    let textoEncriptar = document.getElementById('mensaje-encriptado').value;

    if (texto !== textoNormal) {
        // Encriptar el texto
        textoNormal = encryptText(textoNormal);
        asignarTextoElemento("#mensaje-encriptado", textoNormal);
    }
    else if (textoEncriptado !== textoEncriptar) {
        // Desencriptar el texto
        textoEncriptar = decryptText(textoEncriptar);
        asignarTextoElemento("#mensaje", textoEncriptar);
    }

    // Repetir codigo porque la palabra almacenada es la anterior a la actual. Por eso
    // existían problemas como escribir 2 veces la letra, etc.
    texto = document.getElementById('mensaje').value;
    textoEncriptado = document.getElementById('mensaje-encriptado').value;

}

function encryptText(plainText) {
    let result = "";
    if (plainText.length > 0) {
        let key = checkSum(plainText);
        for (let i = 0; i < plainText.length; i++) {
            // Restamos el caracter menos el caracter base
            let charCode = plainText.charCodeAt(i) - caracterBase;
            // Obtenemos un indice que sera entre 0 y el numero de caracteres que queramos. Empezando desde el caracter base
            let index = (key + charCode) % (numeroCaracteres + 1);
            // Sumamos el indice mas el caracter base
            result += String.fromCharCode(index + caracterBase);
        }
        result += encryptKey(key);
    }
    return result;
}

function decryptText(cipherText) {
    let result = "";
    let key = decryptKey(cipherText);
    for (let i = 0; i < cipherText.length; i++) {
        if (cipherText.charCodeAt(i) === caracterParaKey) {
            break;
        }
    
        let charCode = cipherText.charCodeAt(i) - caracterBase;
        let index = (key - charCode) % (numeroCaracteres + 1);
        let caracter = 0;
        if (index <= 0) // Sumaremos a partir del caracter base
            caracter = caracterBase - index; // Como es negativo, se va a sumar
        else // Restaremos a partir del caracter 126 para que empiece desde el caracter 125 = ultimoCaracter
            caracter = 126 - index;

        result += String.fromCharCode(caracter);
    }
    return result;
}

function encryptKey(key) {
    let encryptedKey = String.fromCharCode(caracterParaKey); // Caracter para separar el texto de la llave
    while (key >= 1) {
        let c = (key % 10) + caracterBase;
        encryptedKey += String.fromCharCode(c);
        key = key / 10;
    }
    return encryptedKey;
}

function decryptKey(code) {
    let isKey = false;
    let key = 0;
    let potencia = 1;
    for (let i = 0; i < code.length; i++){
        if (isKey) {
            key += (code.charCodeAt(i) - caracterBase) * potencia;
            potencia *= 10;
        }

        if (code.charCodeAt(i) === caracterParaKey)
            isKey = true;
    }
    return key;
}

function checkSum(code) {
    let sum = 0;
    for(let i = 0; i < code.length; i++) {
        sum += code.charCodeAt(i);
    }
    return sum;
}

function copyText(item) {
    let textArea = document.getElementById(item);
    navigator.clipboard.writeText(textArea.value)
        .then(() => {
            showAlert("Texto copiado!");
        })
        .catch(err => {
            console.error('Error al copiar el texto: ', err);
        });
}

// Función para mostrar la alerta
function showAlert(message) {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.classList.remove('hidden');
    alert.classList.add('visible');
}

// Función para ocultar la alerta
function hideAlert() {
    const alert = document.getElementById('alert');
    alert.classList.remove('visible');
    alert.classList.add('hidden');
}

// Alertas, cuando doy clic sobre la ventana se cierra la notificacion 
document.addEventListener('DOMContentLoaded', (event) => {
    // Añade el evento de clic para ocultar la alerta
    document.addEventListener('click', hideAlert);

    // Para probar, mostrar la alerta al cargar la página (puedes eliminar esto)
    //showAlert("Prueba"); 
});

// Eventos. Cuando se modifique el texto de los textarea siempre se va a encriptar automaticamente.
document.getElementById('mensaje').addEventListener('input', convertirTexto);
document.getElementById('mensaje-encriptado').addEventListener('input', convertirTexto);
