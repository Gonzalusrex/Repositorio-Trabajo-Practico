function addTransaction(transaction) {
    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
}


let users = JSON.parse(localStorage.getItem("users")) || [];


// Scripts para Login //
const loginbtn = document.getElementById("loginbtn"); // esto permite que el boton con clase loginbtn pueda ser utilizado 

// Se aniade el evento click al boton loginbtn, lee los campos en los input con clase loginuser y login pass. luego verifica que alguno de estos no este vacio !user, !pass.  Luego de validar redirige a la vista de menu.html //
if (loginbtn) {
    loginbtn.addEventListener("click", () => {
        const user = document.getElementById("loginUser").value.trim().toLowerCase();
        const pass = document.getElementById("loginPass").value.trim();

        if (!user || !pass) {
            alert("Complete todos los campos");
            return;
        }

        const validUser = users.find(
            u => u.user === user && u.pass === pass
        );

        if (!validUser) {
            alert("Usuario o contraseña incorrectos");
            return;
        }

        localStorage.setItem("loggedUser", user);
        window.location.href = "menu.html";
    });
}




//Secion de Scripts para la creacion de usuarios


const registerBtn = document.getElementById("registerBtn");

//si existe el boton de registro aniade el evento click para escribir los nuevos usuarios//

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
                <button class="btn btn-danger btn-sm form-control eliminarcontacto"
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
if (table) {
    renderContactos();
}



//---- Transferencias -----//

const destinatario = document.getElementById("destinatario");

if (destinatario) {
    const contactos = JSON.parse(localStorage.getItem("contactos")) || [];

    destinatario.innerHTML = `<option value="">Seleccione contacto</option>`;

    contactos.forEach((c, index) => {
        destinatario.innerHTML += `
            <option value="${index}">
                ${c.nombre} ${c.apellido} - ${c.banco}
            </option>
        `;
    });
}


const transferBtn = document.getElementById("transferBtn");
const amountInput = document.getElementById("monto-transferencia");

if (transferBtn) {
    transferBtn.addEventListener("click", () => {
        const contactos = JSON.parse(localStorage.getItem("contactos")) || [];
        const selectedIndex = destinatario.value;
        const amount = Number(amountInput.value);

        if (selectedIndex === "" || amount <= 0) {
            alert("Seleccione contacto y monto válido");
            return;
        }

        if (amount > balance) {
            alert("Saldo insuficiente");
            return;
        }

        const contact = contactos[selectedIndex];

        // ---Descontar saldo---//
        balance -= amount;
        saveBalance();
        renderBalance();

        //-- Guardar transacción --//
        transactions.push({
            type: "transfer",
            to: `${contact.nombre} ${contact.apellido}`,
            bank: contact.banco,
            amount,
            date: new Date().toLocaleString()
        });

        localStorage.setItem("transactions", JSON.stringify(transactions));

        alert("Transferencia realizada con éxito");
        amountInput.value = "";
    });
}

//--- Scripts para la vista de Historial de transacciones ---//







// --- Historial de transacciones ---

function renderTransactions() {
    const transactionsTable = document.getElementById("transactionsTable");
    if (!transactionsTable) return;

    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    transactionsTable.innerHTML = "";

    transactions.forEach(t => {
        transactionsTable.innerHTML += `
            <tr>
                <td>${t.type === "deposit" ? "Cuenta propia" : t.to}</td>
                <td>${t.type === "deposit" ? "-" : t.bank}</td>
                <td style="color:${t.type === "deposit" ? "green" : "red"}">
                    ${t.type === "deposit" ? "+" : "-"}$${t.amount}
                </td>
                <td>${t.date}</td>
            </tr>
        `;
    });
}

// Render inicial al cargar la vista
renderTransactions();
