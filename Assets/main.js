
// Funciones generales para transacciones


function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
}

function saveTransactions(transactions) {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function addTransaction(transaction) {
    const transactions = getTransactions();
    transactions.push(transaction);
    saveTransactions(transactions);

    // Si estamos en la página de historial  se actualiza inmediatamente
    renderTransactions();
}



// Manejo de usuarios y login


let users = JSON.parse(localStorage.getItem("users")) || [];

const loginbtn = document.getElementById("loginbtn");

if (loginbtn) {
    loginbtn.addEventListener("click", () => {
        const user = document.getElementById("loginUser").value.trim().toLowerCase();
        const pass = document.getElementById("loginPass").value.trim();

        if (!user || !pass) {
            alert("Complete todos los campos");
            return;
        }

        const validUser = users.find(u => u.user === user && u.pass === pass);

        if (!validUser) {
            alert("Usuario o contraseña incorrectos");
            return;
        }

        localStorage.setItem("loggedUser", user);
        window.location.href = "menu.html";
    });
}



// Registro de usuarios


const registerBtn = document.getElementById("registerBtn");

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


// Manejo del saldo


let balance = Number(localStorage.getItem("balance")) || 0;

function saveBalance() {
    localStorage.setItem("balance", balance.toString());
}

function renderBalance() {
    document.querySelectorAll(".balance-actual").forEach(el => {
        el.textContent = `$${balance.toFixed(2)}`;
    });
}


// Depósitos


const depositBtn = document.getElementById("depositBtn");
const montodeposito = document.getElementById("montodeposito");

if (depositBtn && montodeposito) {
    depositBtn.addEventListener("click", () => {
        const monto = Number(montodeposito.value);

        if (isNaN(monto) || monto <= 0) {
            alert("Ingrese un monto válido mayor a 0");
            return;
        }

        balance += monto;
        saveBalance();
        renderBalance();

        addTransaction({
            type: "deposit",
            amount: monto,
            date: new Date().toLocaleString("es-CL")
        });

        montodeposito.value = "";
        alert("Depósito realizado con éxito");
    });
}

renderBalance(); 


// Contactos


let contactos = JSON.parse(localStorage.getItem("contactos")) || [];

const addBtn = document.getElementById("addContact");
const nameInput = document.getElementById("contactName");
const apellidoInput = document.getElementById("contactLastName");
const bankInput = document.getElementById("contactBank");
const table = document.getElementById("contactTable");

function renderContactos() {
    if (!table) return;
    table.innerHTML = "";

    contactos.forEach((contact, index) => {
        table.innerHTML += `
            <tr>
                <td>${contact.nombre}</td>
                <td>${contact.apellido}</td>
                <td>${contact.banco}</td>
                <td>
                    <button class="btn btn-danger btn-sm eliminarcontacto"
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
    localStorage.setItem("contactos", JSON.stringify(contactos));
    renderContactos();
}

if (addBtn) {
    addBtn.addEventListener("click", () => {
        const nombre   = nameInput.value.trim();
        const apellido = apellidoInput.value.trim();
        const banco    = bankInput.value.trim();

        if (!nombre || !apellido || !banco) {
            alert("Complete todos los campos");
            return;
        }

        const exists = contactos.some(c => c.nombre === nombre && c.apellido === apellido);
        if (exists) {
            alert("Este contacto ya existe");
            return;
        }

        contactos.push({ nombre, apellido, banco });
        localStorage.setItem("contactos", JSON.stringify(contactos));
        renderContactos();

        nameInput.value = "";
        apellidoInput.value = "";
        bankInput.value = "";
    });
}

if (table) {
    renderContactos();
}



// Transferencias


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

if (transferBtn && amountInput) {
    transferBtn.addEventListener("click", () => {
        const contactos = JSON.parse(localStorage.getItem("contactos")) || [];
        const selectedIndex = destinatario.value;
        const amount = Number(amountInput.value);

        if (selectedIndex === "" || isNaN(amount) || amount <= 0) {
            alert("Seleccione un contacto y un monto válido");
            return;
        }

        if (amount > balance) {
            alert("Saldo insuficiente");
            return;
        }

        const contact = contactos[selectedIndex];

        balance -= amount;
        saveBalance();
        renderBalance();

        addTransaction({
            type: "transfer",
            to: `${contact.nombre} ${contact.apellido}`,
            bank: contact.banco,
            amount: amount,
            date: new Date().toLocaleString("es-CL")
        });

        alert("Transferencia realizada con éxito");
        amountInput.value = "";
    });
}


// Historial de transacciones


function renderTransactions() {
    const transactionsTable = document.getElementById("transactionsTable");
    if (!transactionsTable) return;

    const transactions = getTransactions();

    transactionsTable.innerHTML = "";

    transactions.forEach(t => {
        const isDeposit = t.type === "deposit";
        transactionsTable.innerHTML += `
            <tr>
                <td>${isDeposit ? "Depósito" : t.to}</td>
                <td>${isDeposit ? "—" : t.bank}</td>
                <td style="color: ${isDeposit ? "green" : "red"}; font-weight: bold;">
                    ${isDeposit ? "+" : "-"}$${t.amount.toFixed(2)}
                </td>
                <td>${t.date}</td>
            </tr>
        `;
    });

    // Si no hay transacciones
    if (transactions.length === 0) {
        transactionsTable.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center; color:#888;">
                    Aún no hay transacciones registradas
                </td>
            </tr>
        `;
    }
}

renderTransactions();