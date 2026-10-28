require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/usuario", require("./src/routes/usuarios.routes"));
app.use("/disco", require("./src/routes/discos.routes"));
app.use("/movimentacao", require("./src/routes/movimentacoes.routes"));

if (require.main === module) {
    const porta = process.env.PORT || 3000;
    app.listen(porta, () => console.log(`Online em http://localhost:${porta}`));
}

module.exports = app;
