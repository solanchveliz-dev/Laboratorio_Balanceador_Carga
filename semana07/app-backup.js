const http = require("http");

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

const server = http.createServer((req, res) => {

    // =========================
    // PING
    // =========================
    if (req.url === "/ping") {

        res.writeHead(200, {
            "Content-Type": "text/plain; charset=utf-8"
        });

        console.log(`[NODO ${NODE_ID} - ${node.name}] GET /ping`);

        res.end(`NODO ${NODE_ID} - ${node.name}\n`);
        return;
    }

    // =========================
    // LOGIN / INTERFAZ
    // =========================
    if (req.url === "/" || req.url === "/login") {

        res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end(`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>NODO ${NODE_ID} - ${node.name}</title>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: ${node.background};
        }

        .container {
            width: 100%;
            max-width: 430px;
            padding: 20px;
        }

        .node {
            background: ${node.color};
            color: white;
            padding: 16px;
            text-align: center;
            border-radius: 14px 14px 0 0;
            font-size: 20px;
            font-weight: bold;
        }

        .card {
            background: white;
            padding: 35px;
            border-radius: 0 0 14px 14px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.12);
        }

        h1 {
            color: ${node.color};
            text-align: center;
            margin-bottom: 10px;
        }

        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 25px;
        }

        label {
            display: block;
            margin-bottom: 7px;
            font-weight: bold;
            color: #333;
        }

        input {
            width: 100%;
            padding: 12px;
            margin-bottom: 18px;
            border: 1px solid #ccc;
            border-radius: 8px;
            font-size: 15px;
        }

        button {
            width: 100%;
            padding: 13px;
            border: none;
            border-radius: 8px;
            background: ${node.color};
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        }

        button:hover {
            opacity: 0.9;
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
    </style>
</head>

<body>

    <div class="container">

        <div class="node">
            Atendido por: NODO ${NODE_ID} - ${node.name}
            (puerto ${PORT})
        </div>

        <div class="card">

            <h1>NODO ${NODE_ID} - ${node.name}</h1>

            <p class="subtitle">
                Iniciar sesión
            </p>

            <form>
                <label>Usuario</label>
                <input
                    type="text"
                    placeholder="Ingrese su usuario"
                >

                <label>Contraseña</label>
                <input
                    type="password"
                    placeholder="Ingrese su contraseña"
                >

                <button type="submit">
                    Ingresar
                </button>
            </form>

            <div class="demo">
                Prueba: <strong>admin / admin123</strong>
            </div>

        </div>

    </div>

</body>
</html>
        `);

        return;
    }

    // =========================
    // RUTA NO ENCONTRADA
    // =========================

    res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8"
    });

    res.end("Ruta no encontrada\n");
});

server.listen(PORT, () => {
    console.log(
        `NODO ${NODE_ID} - ${node.name} escuchando en http://localhost:${PORT}`
    );
});