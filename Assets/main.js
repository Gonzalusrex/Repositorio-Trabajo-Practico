//Secion de Scripts para la creacion de usuarios
let users = JSON.parse(localStorage.getItem("users")) || [];

const registerBtn = document.getElementById("registerBtn");

//si existe el boto nde registro aniade el evento click para escribir los nuevos usuarios//

if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        const user = document.getElementById("regUser").value.trim().toLowerCase();
        const pass = document.getElementById("regPass").value.trim();

        if (!user || !pass) {
            alert("Complete todos los campos");
            return;
        }

        if (!isValidEmail(user)) {
            alert("Ingrese un correo electrónico válido");
            return;
        }

        const exists = users.some(u => u.user === user);
        if (exists) {
            alert("El usuario ya existe");
            return;
        }

        users.push({ user, pass });
        localStorage.setItem("users", JSON.stringify(users));

        alert("Usuario creado correctamente");
        window.location.href = "login.html";
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}









// Seccion de Scripts para el manejo del saldo en diferentes vistas //

let balance = Number(localStorage.getItem("balance")) || 0;


function saveBalance() {
    localStorage.setItem("balance", balance);
}

function renderBalance() {
    const balanceElements = document.querySelectorAll(".balance-actual");

    balanceElements.forEach(el => {
        el.textContent = `$${balance}`;
    });
}


const depositBtn = document.getElementById("depositBtn");
const montodeposito = document.getElementById("montodeposito");

if (depositBtn) {
    depositBtn.addEventListener("click", () => {
        const monto = Number(montodeposito.value);

        if (monto <= 0 || isNaN(monto)) {
            alert("Ingrese un monto válido");
            return;
        }

        balance += monto;
        saveBalance();
        renderBalance();

        montodeposito.value = "";
    });
}


renderBalance();












//Seccion de scripts para vista de Contactos//

let contactos = JSON.parse(localStorage.getItem("contactos")) || [];


//Obtener elementos del DOM//

const addBtn = document.getElementById("addContact");
const nameInput = document.getElementById("contactName");
const apellidoInput = document.getElementById("contactLastName");
const bankInput = document.getElementById("contactBank");
const table = document.getElementById("contactTable");



// Muestra los contactos Existentes //

function renderContactos() {
    table.innerHTML = "";

    contactos.forEach((contact, index) => {
        table.innerHTML += `
            <tr>
                <td>${contact.nombre}</td>
                <td>${contact.apellido}</td>
                <td>${contact.banco}</td>
                <td>
                    <button class="btn btn-danger btn-sm"
                        onclick="deleteContact(${index})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}

function deleteContact(index) {
    contactos.splice(index, 1);
    saveContactos();
    renderContactos();
}

function saveContactos() {
    localStorage.setItem("contactos", JSON.stringify(contactos));
}

// Agregar contactos y valida que se llenen los campos//
if (addBtn) {
    addBtn.addEventListener("click", () => {
        const nombre = nameInput.value.trim();
        const apellido = apellidoInput.value.trim();
        const banco = bankInput.value.trim();

        if (nombre === "" || apellido === "" || banco === "") {
            alert("Complete todos los campos");
            return;
        }


        // Validar si ya existe el contacto//

        const exists = contactos.some(
            contact => contact.nombre === nombre
        );

        if (exists) {
            return alert("El contacto ya existe");
        }

        contactos.push({ nombre, apellido, banco });
        saveContactos();
        renderContactos();

        nameInput.value = "";
        apellidoInput.value = "";
        bankInput.value = "";
    });
}

// linea para mostrar el array de contactos en la vista //
renderContactos();



//---- Transferencias -----//
