import app from '../src/app.js';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { MontadoraFactory } from './factories/MontadoraFactory.js';
import { VeiculoFactory } from './factories/VeiculoFactory.js';
import { clearDatabase } from './utils/clearDatabase.js';
import { ClienteFactory } from './factories/ClienteFactory.js';

describe('API de montadoras', () => {
    beforeEach(async () => {
        await MontadoraFactory.create('Toyota', 'Japão');
        await MontadoraFactory.create('FORD', 'USA');

        vi.clearAllMocks();
    });

    afterEach(async () => {
        await clearDatabase();

        vi.resetAllMocks();
    });

    it('deve criar uma montadora com sucesso.', async () => {
        const response = await request(app)
            .post('/montadoras')
            .send({ nome: 'Hyundai', pais: 'Coreia do Sul' });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('insertId');
    });

    it('deve gerar erro ao criar uma montadora com nome inválido.', async () => {
        const response = await request(app)
            .post('/montadoras')
            .send({ nome: 'Hy', pais: 'Coreia do Sul' });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error');
    });

    it('deve listar corretamente as montadoras criadas.', async () => {
        const response = await request(app)
            .get('/montadoras')

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(2)
    });

    it('deve gerar erro ao listar as montadoras com a rota errada.', async () => {
        const response = await request(app)
            .get('/montadora')

        expect(response.status).toBe(404);
    });

    it('deve editar corretamente uma montadora existente.', async () => {

        const mont = await MontadoraFactory.create("Valdo", "Br");

        const response = await request(app)
            .put('/montadoras?id=' + mont.id)
            .send({ nome: 'Hyundai', pais: 'Coreia do Sul' });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('affectedRows')
    });

    it('deve gerar erro ao editar uma montadora inexistente.', async () => {

        const mont = await MontadoraFactory.create("Valdo", "Br");

        const response = await request(app)
            .put('/montadoras?id=9999')
            .send({ nome: 'Hyundai', pais: 'Coreia do Sul' });

        expect(response.status).toBe(404);
    });

    it('deve excluir corretamente uma montadora existente.', async () => {

        const mont = await MontadoraFactory.create("Valdo", "Br");

        const response = await request(app)
            .delete('/montadoras/' + mont.id)

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('affectedRows')
    });

    it('deve gerar erro ao excluir uma montadora inexistente.', async () => {

        const response = await request(app)
            .delete('/montadoras/')

        expect(response.status).toBe(404);
    });
});






describe('API de veiculos', () => {
    beforeEach(async () => {
        const cli = await ClienteFactory.create("Coutinho", "49227077863", "13178505", "rua Inacio Nogueira de Moura", "Jardim do Trevo", "Sumaré", "SP", "378", "complemento");

        const mont = await MontadoraFactory.create("Valdo", "Br");

        await VeiculoFactory.create('uno', 'fnng3401', '1999', 'preto', '10000', cli.id, mont.id);

        vi.clearAllMocks();
    });

    afterEach(async () => {
        await clearDatabase();

        vi.resetAllMocks();
    });

    it('deve criar um veiculo com sucesso.', async () => {

        const cli = await ClienteFactory.create("Coutinho", "49227077863", "13178505", "rua Inacio Nogueira de Moura", "Jardim do Trevo", "Sumaré", "SP", "378", "complemento");

        const mont = await MontadoraFactory.create("Valdo", "Br");

        const response = await request(app)
            .post('/veiculos')
            .send({ modelo: 'uno', placa: 'fnng3401', ano: '1999', cor: 'preto', valor: '10000', idCliente: cli.id, idMontadora: mont.id });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('insertId');
    });

    it('deve gerar erro ao criar um veiculo com montadora inexistente.', async () => {

        const cli = await ClienteFactory.create("Coutinho", "49227077863", "13178505", "rua Inacio Nogueira de Moura", "Jardim do Trevo", "Sumaré", "SP", "378", "complemento");

        const response = await request(app)
            .post('/veiculos')
            .send({ modelo: 'uno', placa: 'fnng3401', ano: '1999', cor: 'preto', valor: '10000', idCliente: cli.id, idMontadora: '9999' });

        expect(response.status).toBe(500);
    });

    it('deve gerar erro ao criar um veiculo com cliente inexistente.', async () => {

        const mont = await MontadoraFactory.create("Valdo", "Br");

        const response = await request(app)
            .post('/veiculos')
            .send({ modelo: 'uno', placa: 'fnng3401', ano: '1999', cor: 'preto', valor: '10000', idCliente: '9999', idMontadora: mont.id });

        expect(response.status).toBe(500);
    });

    it('deve editar corretamente um veiculo existente.', async () => {

        const cli = await ClienteFactory.create("Coutinho", "49227077863", "13178505", "rua Inacio Nogueira de Moura", "Jardim do Trevo", "Sumaré", "SP", "378", "complemento");

        const mont = await MontadoraFactory.create("Valdo", "Br");

        const veic = await VeiculoFactory.create('uno', 'fnng3401', '1999', 'preto', '10000', cli.id, mont.id);

        const response = await request(app)
            .put('/veiculos?id=' + veic.id)
            .send({ modelo: 'uno', placa: 'fnng3401', ano: '1999', cor: 'preto', valor: '10000', idCliente: cli.id, idMontadora: mont.id });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('affectedRows')
    });

    it('deve gerar erro ao editar um veiculo com dados inválidos.', async () => {

        const cli = await ClienteFactory.create("Coutinho", "49227077863", "13178505", "rua Inacio Nogueira de Moura", "Jardim do Trevo", "Sumaré", "SP", "378", "complemento");

        const mont = await MontadoraFactory.create("Valdo", "Br");

        const veic = await VeiculoFactory.create('uno', 'fnng3401', '1999', 'preto', '10000', cli.id, mont.id);

        const response = await request(app)
            .put('/veiculos?id=' + veic.id)
            .send({ modelo: 'uno', placa: 'fnng3401', ano: '1999', cor: 'preto', valor: '10000', idCliente: cli.id, idMontadora: '9999' });

        expect(response.status).toBe(500);
    });

    it('deve excluir corretamente um veiculo existente.', async () => {

        const cli = await ClienteFactory.create("Coutinho", "49227077863", "13178505", "rua Inacio Nogueira de Moura", "Jardim do Trevo", "Sumaré", "SP", "378", "complemento");

        const mont = await MontadoraFactory.create("Valdo", "Br");

        const veic = await VeiculoFactory.create('uno', 'fnng3401', '1999', 'preto', '10000', cli.id, mont.id);

        const response = await request(app)
            .delete('/veiculos/' + veic.id)

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('affectedRows')
    });

    it('deve gerar erro ao excluir um veiculo inexistente.', async () => {

        const response = await request(app)
            .delete('/veiculos/')

        expect(response.status).toBe(404);
    });

    it('deve listar corretamente os veiculos criados.', async () => {
        const response = await request(app)
            .get('/veiculos')

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1)
    });

    it('deve gerar erro ao listar os veiculos com a rota errada.', async () => {
        const response = await request(app)
            .get('/veiculo')

        expect(response.status).toBe(404);
    });
});





describe('API de clientes', () => {
    beforeEach(async () => {
        await ClienteFactory.create("Coutinho", "49227077863", "13178505", "rua Inacio Nogueira de Moura", "Jardim do Trevo", "Sumaré", "SP", "378", "complemento");

        vi.clearAllMocks();
    });

    afterEach(async () => {
        await clearDatabase();

        vi.resetAllMocks();
    });

    it('deve criar um cliente com sucesso.', async () => {

        const response = await request(app)
            .post('/clientes')
            .send({ nome: 'Nicolas', cpf: '49227077863', cep: '13178505', logradouro: 'rua Inacio Nogueira de Moura', bairro: 'Jardim do Trevo',cidade: 'Sumaré', uf: 'SP', numero: '378', complemento: 'Complemento' });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('insertId');
    });

    it('deve gerar erro ao criar um cliente com dados inválidos.', async () => {

        const cli = await ClienteFactory.create("Coutinho", "49227077863", "13178505", "rua Inacio Nogueira de Moura", "Jardim do Trevo", "Sumaré", "SP", "378", "complemento");

        const response = await request(app)
            .post('/clientes')
            .send({ nome: 'Nicolas', cpf: 'as', cep: '13178505', logradouro: 'rua Inacio Nogueira de Moura', bairro: 'Jardim do Trevo',cidade: 'Sumaré', uf: 'SP', numero: '378', complemento: 'Complemento' });

        expect(response.status).toBe(500);
    });

    it('deve editar corretamente um cliente existente.', async () => {

        const cli = await ClienteFactory.create("Coutinho", "49227077863", "13178505", "rua Inacio Nogueira de Moura", "Jardim do Trevo", "Sumaré", "SP", "378", "complemento");

        const response = await request(app)
            .put('/clientes?id=' + cli.id)
            .send({ nome: 'Nicolas', cpf: '49227077863', cep: '13178505', logradouro: 'rua Inacio Nogueira de Moura', bairro: 'Jardim do Trevo',cidade: 'Sumaré', uf: 'SP', numero: '378', complemento: 'Complemento' });


        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('affectedRows')
    });

    it('deve gerar erro ao editar um cliente com dados inválidos.', async () => {

        const cli = await ClienteFactory.create("Coutinho", "49227077863", "13178505", "rua Inacio Nogueira de Moura", "Jardim do Trevo", "Sumaré", "SP", "378", "complemento");

        const response = await request(app)
            .put('/clientes?id=' + cli.id)
            .send({ nome: 'Nicolas', cpf: 'asd', cep: '13178505', logradouro: 'rua Inacio Nogueira de Moura', bairro: 'Jardim do Trevo',cidade: 'Sumaré', uf: 'SP', numero: '378', complemento: 'Complemento' });


        expect(response.status).toBe(500);
    });

    it('deve excluir corretamente um cliente existente.', async () => {

        const cli = await ClienteFactory.create("Coutinho", "49227077863", "13178505", "rua Inacio Nogueira de Moura", "Jardim do Trevo", "Sumaré", "SP", "378", "complemento");

        const response = await request(app)
            .delete('/clientes/' + cli.id)

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('affectedRows')
    });

    it('deve gerar erro ao excluir um cliente inexistente.', async () => {

        const response = await request(app)
            .delete('/clientes/')

        expect(response.status).toBe(404);
    });

    it('deve listar corretamente os clientes criados.', async () => {
        const response = await request(app)
            .get('/clientes')

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveLength(1)
    });

    it('deve gerar erro ao listar os clientes com a rota errada.', async () => {
        const response = await request(app)
            .get('/cliente')

        expect(response.status).toBe(404);
    });
});