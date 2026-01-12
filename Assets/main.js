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


 //Funciones js para vista de contactos//





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
