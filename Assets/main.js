// script para agregar contactos en vista contactos //
let contacts = [];


const addBtn = document.getElementById("addContact");
const nameInput = document.getElementById("contactName");
const bankInput = document.getElementById("contactBank");
const table = document.getElementById("contactTable");

if (addBtn) {
    addBtn.addEventListener("click", () => {
        const nombre = nameInput.value.trim();
        const banco = bankInput.value.trim();

        if (nombre === "" || banco === "") {
            return alert("Complete todos los campos");
        }

        // Validar si ya existe el contacto
        const exists = contacts.some(
            contact => contact.nombre === nombre
        );

        if (exists) {
            return alert("El contacto ya existe");
        }

        contacts.push({ nombre, banco });

        nameInput.value = "";
        bankInput.value = "";

        renderContacts();
    });
}
