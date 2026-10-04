const http = require("http");
const querystring = require("querystring");

const PORT = process.argv[2] || 3001;
const NODE_ID = process.argv[3] || "1";

const COLORS = {
    "1": {
        name: "ROJO",
        color: "#ef4444",
        background: "#fee2e2"
    },
    "2": {
        name: "VERDE",
        color: "#22c55e",
        background: "#dcfce7"
    },
    "3": {
        name: "AZUL",
        color: "#2563eb",
        background: "#dbeafe"
    }
};

const node = COLORS[NODE_ID] || COLORS["1"];

// =========================
// DATOS DEL CRUD
// =========================

let usuarios = [
    {
        id: 1,
        nombre: "María López",
        correo: "maria@gmail.com",
        edad: 20
    },
    {
        id: 2,
        nombre: "Carlos Pérez",
        correo: "carlos@gmail.com",
        edad: 22
    }
];

let siguienteId = 3;

// =========================
// FUNCIONES AUXILIARES
// =========================

function paginaBase(contenido, titulo = "Login") {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${titulo} - Nodo ${NODE_ID}</title>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
            min-height: 100vh;
            background: ${node.background};
            color: #333;
        }

        .node {
            background: ${node.color};
            color: white;
            padding: 16px;
            text-align: center;
            font-size: 18px;
            font-weight: bold;
        }

        .container {
            width: 95%;
            max-width: 1000px;
            margin: 30px auto;
        }

        .card {
            background: white;
            padding: 25px;
            border-radius: 14px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.10);
            margin-bottom: 20px;
        }

        h1 {
            color: ${node.color};
            margin-bottom: 8px;
        }

        h2 {
            margin-bottom: 18px;
        }

        .subtitle {
            color: #666;
            margin-bottom: 25px;
        }

        label {
            display: block;
            margin-bottom: 7px;
            font-weight: bold;
        }

        input {
            width: 100%;
            padding: 12px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 15px;
        }

        button,
        .btn {
            display: inline-block;
            padding: 11px 18px;
            border: none;
            border-radius: 8px;
            background: ${node.color};
            color: white;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            text-decoration: none;
        }

        button:hover,
        .btn:hover {
            opacity: 0.88;
        }

        .btn-delete {
            background: #dc2626;
        }

        .btn-edit {
            background: #f59e0b;
        }

        .btn-secondary {
            background: #555;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th,
        td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
            text-align: left;
        }

        th {
            background: ${node.background};
            color: ${node.color};
        }

        .actions {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .demo {
            margin-top: 20px;
            padding: 12px;
            background: #f5f5f5;
            border-radius: 8px;
            text-align: center;
            color: #555;
            font-size: 13px;
        }

        .success {
            padding: 12px;
            margin-bottom: 20px;
            background: #dcfce7;
            color: #166534;
            border-radius: 8px;
        }

        .error {
            padding: 12px;
            margin-bottom: 20px;
            background: #fee2e2;
            color: #991b1b;
            border-radius: 8px;
        }

        @media (max-width: 700px) {
            table {
                font-size: 13px;
            }

            th,
            td {
                padding: 8px;
            }
        }
    </style>
</head>

<body>

    <div class="node">
        Atendido por: NODO ${NODE_ID} - ${node.name}
        | Puerto ${PORT}
    </div>

    ${contenido}

</body>
</html>
`;
}

function loginPage(error = "") {
    return paginaBase(`
        <div class="container">

            <div class="card" style="max-width: 430px; margin: 40px auto;">

                <h1 style="text-align:center;">
                    Login
                </h1>

                <p class="subtitle" style="text-align:center;">
                    Inicia sesión para acceder al CRUD
                </p>

                ${error ? `<div class="error">${error}</div>` : ""}

                <form method="POST" action="/login">

                    <label>Usuario</label>

                    <input
                        type="text"
                        name="usuario"
                        placeholder="Ingrese su usuario"
                        required
                    >

                    <label>Contraseña</label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Ingrese su contraseña"
                        required
                    >

                    <button type="submit" style="width:100%;">
                        Ingresar
                    </button>

                </form>

                <div class="demo">
                    Usuario de prueba:
                    <strong>admin / admin123</strong>
                </div>

            </div>

        </div>
    `, "Login");
}

function panelPage() {
    let filas = "";

    if (usuarios.length === 0) {
        filas = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No existen usuarios registrados.
                </td>
            </tr>
        `;
    } else {
        filas = usuarios.map(usuario => `
            <tr>
                <td>${usuario.id}</td>
                <td>${usuario.nombre}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.edad}</td>

                <td>
                    <div class="actions">

                        <a
                            class="btn btn-edit"
                            href="/usuarios/editar?id=${usuario.id}"
                        >
                            Editar
                        </a>

                        <form
                            method="POST"
                            action="/usuarios/eliminar"
                            style="display:inline;"
                        >
                            <input
                                type="hidden"
                                name="id"
                                value="${usuario.id}"
                            >

                            <button
                                type="submit"
                                class="btn-delete"
                            >
                                Eliminar
                            </button>
                        </form>

                    </div>
                </td>
            </tr>
        `).join("");
    }

    return paginaBase(`
        <div class="container">

            <div class="card">

                <h1>Panel de administración</h1>

                <p class="subtitle">
                    Login + CRUD de usuarios
                </p>

                <div class="success">
                    Sesión iniciada correctamente como
                    <strong>admin</strong>.
                </div>

                <div style="margin-bottom:20px;">
                    <a class="btn" href="/usuarios/nuevo">
                        + Crear usuario
                    </a>

                    <a
                        class="btn btn-secondary"
                        href="/logout"
                        style="margin-left:8px;"
                    >
                        Cerrar sesión
                    </a>
                </div>

            </div>

            <div class="card">

                <h2>Lista de usuarios</h2>

                <table>

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Edad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${filas}
                    </tbody>

                </table>

            </div>

        </div>
    `, "CRUD Usuarios");
}

function formularioUsuario(usuario = null) {

    const editando = usuario !== null;

    return paginaBase(`
        <div class="container">

            <div class="card" style="max-width:600px; margin:auto;">

                <h1>
                    ${editando ? "Editar usuario" : "Crear usuario"}
                </h1>

                <p class="subtitle">
                    ${editando
                        ? "Modifica los datos del usuario."
                        : "Ingresa los datos del nuevo usuario."
                    }
                </p>

                <form
                    method="POST"
                    action="${editando
                        ? "/usuarios/editar"
                        : "/usuarios/crear"
                    }"
                >

                    ${
                        editando
                        ? `
                            <input
                                type="hidden"
                                name="id"
                                value="${usuario.id}"
                            >
                        `
                        : ""
                    }

                    <label>Nombre</label>

                    <input
                        type="text"
                        name="nombre"
                        value="${editando ? usuario.nombre : ""}"
                        placeholder="Ingrese el nombre"
                        required
                    >

                    <label>Correo</label>

                    <input
                        type="email"
                        name="correo"
                        value="${editando ? usuario.correo : ""}"
                        placeholder="Ingrese el correo"
                        required
                    >

                    <label>Edad</label>

                    <input
                        type="number"
                        name="edad"
                        value="${editando ? usuario.edad : ""}"
                        placeholder="Ingrese la edad"
                        min="1"
                        required
                    >

                    <button type="submit">
                        ${editando ? "Guardar cambios" : "Crear usuario"}
                    </button>

                    <a
                        href="/panel"
                        class="btn btn-secondary"
                        style="margin-left:8px;"
                    >
                        Cancelar
                    </a>

                </form>

            </div>

        </div>
    `, editando ? "Editar usuario" : "Crear usuario");
}

function parseBody(req) {

    return new Promise((resolve, reject) => {

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            resolve(querystring.parse(body));
        });

        req.on("error", reject);
    });
}

function redireccionar(res, ruta) {

    res.writeHead(302, {
        Location: ruta
    });

    res.end();
}

// =========================
// SERVIDOR
// =========================

const server = http.createServer(async (req, res) => {

    try {

        // =========================
        // PING
        // =========================

        if (req.url === "/ping") {

            res.writeHead(200, {
                "Content-Type": "text/plain; charset=utf-8"
            });

            console.log(
                `[NODO ${NODE_ID} - ${node.name}] GET /ping`
            );

            res.end(
                `NODO ${NODE_ID} - ${node.name}\n`
            );

            return;
        }

        // =========================
        // LOGIN - MOSTRAR
        // =========================

        if (
            req.method === "GET" &&
            (req.url === "/" || req.url === "/login")
        ) {

            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });

            res.end(loginPage());

            return;
        }

        // =========================
        // LOGIN - PROCESAR
        // =========================

        if (
            req.method === "POST" &&
            req.url === "/login"
        ) {

            const data = await parseBody(req);

            const usuario = data.usuario;
            const password = data.password;

            if (
                usuario === "admin" &&
                password === "admin123"
            ) {

                res.writeHead(302, {
                    "Set-Cookie": "sesion=admin; Path=/",
                    "Location": "/panel"
                });

                res.end();

                return;
            }

            res.writeHead(401, {
                "Content-Type": "text/html; charset=utf-8"
            });

            res.end(
                loginPage(
                    "Usuario o contraseña incorrectos."
                )
            );

            return;
        }

        // =========================
        // CERRAR SESIÓN
        // =========================

        if (req.url === "/logout") {

            res.writeHead(302, {
                "Set-Cookie": "sesion=; Max-Age=0; Path=/",
                "Location": "/login"
            });

            res.end();

            return;
        }

        // =========================
        // PANEL
        // =========================

        if (
            req.method === "GET" &&
            req.url === "/panel"
        ) {

            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });

            res.end(panelPage());

            return;
        }

        // =========================
        // FORMULARIO CREAR
        // =========================

        if (
            req.method === "GET" &&
            req.url === "/usuarios/nuevo"
        ) {

            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });

            res.end(formularioUsuario());

            return;
        }

        // =========================
        // CREAR USUARIO
        // =========================

        if (
            req.method === "POST" &&
            req.url === "/usuarios/crear"
        ) {

            const data = await parseBody(req);

            const nuevoUsuario = {

                id: siguienteId++,

                nombre: data.nombre,

                correo: data.correo,

                edad: Number(data.edad)

            };

            usuarios.push(nuevoUsuario);

            console.log(
                `[NODO ${NODE_ID}] Usuario creado:`,
                nuevoUsuario
            );

            redireccionar(res, "/panel");

            return;
        }

        // =========================
        // FORMULARIO EDITAR
        // =========================

        if (
            req.method === "GET" &&
            req.url.startsWith("/usuarios/editar")
        ) {

            const url = new URL(
                req.url,
                `http://localhost:${PORT}`
            );

            const id = Number(
                url.searchParams.get("id")
            );

            const usuario = usuarios.find(
                u => u.id === id
            );

            if (!usuario) {

                res.writeHead(404, {
                    "Content-Type":
                        "text/plain; charset=utf-8"
                });

                res.end("Usuario no encontrado");

                return;
            }

            res.writeHead(200, {
                "Content-Type":
                    "text/html; charset=utf-8"
            });

            res.end(
                formularioUsuario(usuario)
            );

            return;
        }

        // =========================
        // EDITAR USUARIO
        // =========================

        if (
            req.method === "POST" &&
            req.url === "/usuarios/editar"
        ) {

            const data = await parseBody(req);

            const id = Number(data.id);

            const usuario = usuarios.find(
                u => u.id === id
            );

            if (!usuario) {

                res.writeHead(404, {
                    "Content-Type":
                        "text/plain; charset=utf-8"
                });

                res.end("Usuario no encontrado");

                return;
            }

            usuario.nombre = data.nombre;

            usuario.correo = data.correo;

            usuario.edad = Number(data.edad);

            console.log(
                `[NODO ${NODE_ID}] Usuario actualizado:`,
                usuario
            );

            redireccionar(res, "/panel");

            return;
        }

        // =========================
        // ELIMINAR USUARIO
        // =========================

        if (
            req.method === "POST" &&
            req.url === "/usuarios/eliminar"
        ) {

            const data = await parseBody(req);

            const id = Number(data.id);

            const posicion = usuarios.findIndex(
                u => u.id === id
            );

            if (posicion === -1) {

                res.writeHead(404, {
                    "Content-Type":
                        "text/plain; charset=utf-8"
                });

                res.end("Usuario no encontrado");

                return;
            }

            const eliminado =
                usuarios.splice(posicion, 1)[0];

            console.log(
                `[NODO ${NODE_ID}] Usuario eliminado:`,
                eliminado
            );

            redireccionar(res, "/panel");

            return;
        }

        // =========================
        // RUTA NO ENCONTRADA
        // =========================

        res.writeHead(404, {
            "Content-Type":
                "text/plain; charset=utf-8"
        });

        res.end("Ruta no encontrada\n");

    } catch (error) {

        console.error(error);

        res.writeHead(500, {
            "Content-Type":
                "text/plain; charset=utf-8"
        });

        res.end("Error interno del servidor");
    }

});

// =========================
// INICIAR SERVIDOR
// =========================

server.listen(PORT, () => {

    console.log(
        `NODO ${NODE_ID} - ${node.name} escuchando en http://localhost:${PORT}`
    );

});