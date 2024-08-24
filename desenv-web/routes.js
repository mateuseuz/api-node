const express = require('express');
const enderecoController = require('./controllers/EnderecoController');
const router = express.Router();

router.post('/enderecos', enderecoController.createEndereco);
router.post('/enderecos/cep/:Cep', enderecoController.createEnderecoFromCep);
router.get('/enderecos', enderecoController.getAllEnderecos);
router.get('/enderecos/:Id', enderecoController.getEnderecoById);
router.put('/enderecos/:Id', enderecoController.updateEndereco);
router.delete('/enderecos/:Id', enderecoController.deleteEndereco);

module.exports = router;