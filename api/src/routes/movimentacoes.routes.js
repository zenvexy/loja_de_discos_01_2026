const router = require("express").Router();
const controller = require("../controllers/movimentacoes.controller");

router.post("/cadastrar", controller.cadastrar);
router.get("/listar", controller.listar);
router.get("/buscar/:id", controller.buscar);
router.put("/atualizar/:id", controller.atualizar);
router.delete("/excluir/:id", controller.excluir);

module.exports = router;
