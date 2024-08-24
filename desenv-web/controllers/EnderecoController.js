const { Endereco } = require('../models');
const https = require('https');

// Criação de um novo endereço
exports.createEndereco = async (req, res) => {
    try {
        const { Cep, Logradouro, Numero, Complemento, Bairro, Cidade, Estado, MunicipioIBE } = req.body;

        const novoEndereco = await Endereco.create({
            Cep,
            Logradouro,
            Numero,
            Complemento,
            Bairro,
            Cidade,
            Estado,
            MunicipioIBGE,
        });

        req.status(201).json(novoEndereco);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar endereço', details: error.message });
    }
};

// Leitura de todos os endereços
exports.getAllEnderecos = async (req, res) => {
    try {
        const enderecos = await Endereco.findAll();
        res.status(200).json(enderecos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar endereços', details: error.message });
    }
};

// Leitura de um endereço por ID
exports.getEnderecoById = async (req, res) => {
    try {
        const { Id } = req.params;
        const endereco = await Endereco.findByPk(Id);

        if (!endereco) {
            return res.status(404).json({error: 'Endereço não encontrado'});
        }

        res.status(200).json(endereco);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar endereço', details: error.message });
    }
};

// Atualização de um endereço
exports.updateEndereco = async (req, res) => {
    try {
        const { Id } = req.params;
        const { Cep, Logradouro, Numero, Complemento, Bairro, Cidade, Estado, MunicipioIBGE } = req.body;
        const endereco = await Endereco.findByPk(Id);

        if (!endereco) {
            return res.status(404).json({ error: 'Endereço não encontrado '});
        }

        endereco.Cep = Cep;
        endereco.Logradouro = Logradouro;
        endereco.Numero = Numero;
        endereco.Complemento = Complemento;
        endereco.Bairro = Bairro;
        endereco.Cidade = Cidade;
        endereco.Estado = Estado;
        endereco.MunicipioIBGE = MunicipioIBGE;

        await endereco.save();

        res.status(200).json(endereco);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar endereço', details: error.message });
    }
}

// Exclusão de um endereço
exports.deleteEndereco = async (req, res) => {
    try {
        const { Id } = req.params;
        const endereco = await Endereco.findByPk(Id);

        if (!endereco) {
            return res.status(404).json({ error: 'Endereço não encontrado '});
        }

        await endereco.destroy();

        res.status(204).send(); // Sem conteúdo, pois foi deletado com sucesso
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar endereço', details: error.message });
    }
}

// Função auxiliar para fazer requisição HTTPS
function getViaCepData(cep) {
    return new Promise((resolve, reject) => {
        const cleanCep = cep.replace(/\D/g, '');
        const url = `https://viacep.com.br/ws/${cleanCep}/json/`;

        https.get(url, (resp) => {
            let data = '';

            // Recebe os dados
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // Quando a resposta está completa
            resp.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } catch (error) {
                    reject(error);
                }
            });

        }).on('error', (err) => {
            reject(err);
        });
    });
}

// Criação de um novo endereço a partir do CEP
exports.createEnderecoByCep = async (req, res) => {
    const { cep } = req.params;

    try {
        // Faz a requisição para a API ViaCEP
        const responseData = await getViaCepData(cep);

        if (responseData.erro) {
            return res.status(400).json({ error: 'CEP não encontrado' });
        }

        const { logradouro, bairro, localidade, uf, complemento } = responseData;

        // Cria o novo endereço no banco de dados
        const novoEndereco = await Endereco.create({
            Cep: cep.replace(/\D/g, ''),
            Logradouro: logradouro,
            Bairro: bairro,
            Cidade: localidade,
            Estado: uf,
            Complemento: complemento,
            Numero: null,  // Pode ser nulo ou um valor padrão
            MunicipioIBGE: null  // Pode ser nulo ou um valor padrão
        });

        res.status(201).json(novoEndereco);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar endereço a partir do CEP', details: error.message });
    }
};