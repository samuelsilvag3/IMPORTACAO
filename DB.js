import pg from 'pg'
import 'dotenv/config'
const {Pool} = pg

async function connect() {
    if (global.connection){
        return global.connection.connect()
    }
    const pool = new Pool({
        host: process.env.ENDPOINT,
        port: process.env.PORTA,
        user: process.env.USUARIO,
        password: process.env.SENHA,
        database: process.env.DB_NAME
    })
    //retorna pool de conexões
    const client = await pool.connect();
    client.release();
    global.connection = pool;
    return pool.connect();
}

async function insertAbastecimentos(Abastecimento){
    const client = await connect()
    const sql = 'INSERT INTO public."Abastecimentos"("Placa", "Odometro", "Quantidade", "Valor", "Nota", "Data", "Produto", "Motorista") VALUES ($1,$2,$3,$4,$5,$6,$7,$8);'
    const values = [Abastecimento.Placa, Abastecimento.Odometro, Abastecimento.Quant, Abastecimento.Valor, Abastecimento.Nota, Abastecimento.Data, Abastecimento.Produto, Abastecimento.Motorista]
    return await client.query(sql, values)
}

async function insertFaturas(Fatura){
    const client = await connect()
    const sql = 'INSERT INTO public."Faturas"("Fatura", "Nota", "Emissao", "Vencimento", "Lancado", "Fornecedor") VALUES ($1,$2,$3,$4,$5,$6);'
    const values = [Fatura.NumFat, Fatura.NumNF, Fatura.Emissao, Fatura.Vcto, false, Fatura.Fornecedor]
    return await client.query(sql, values)
}

async function insertCTRC(ctrcs) {
    const client = await connect()
    const batchSize = 1000; // Tamanho do lote para cada inserção
    
    try {
        await client.query('BEGIN'); // Inicia uma transação
        
        for (let i = 0; i < ctrcs.length; i += batchSize) {
            const batch = ctrcs.slice(i, i + batchSize);
            const values = batch.map((ctrc, index) => 
                `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`
            ).join(',');
            
            const params = batch.flatMap(ctrc => [
                ctrc.CTRC,
                ctrc.Uni_orig,
                ctrc.Uni_dest,
                ctrc.Cnpj_Pagador,
                ctrc.Nome_Pagador
            ]);
            
            const sql = `INSERT INTO public."Emissoes"("CTRC", "Uni_orig", "Uni_dest", "Cnpj_Pagador", "Nome_Pagador") VALUES ${values};`;
            await client.query(sql, params);
        }
        
        await client.query('COMMIT'); // Confirma a transação
        return { success: true, message: 'Dados inseridos com sucesso' };
        
    } catch (err) {
        await client.query('ROLLBACK'); // Reverte a transação em caso de erro
        console.error('Erro ao fazer o Insert dos CTRCs:', err);
        throw err;
    } finally {
        client.release(); // Libera o cliente de volta para o pool
    }
}

async function insertFornecedores(fornecedores) {
    const client = await connect()
    const batchSize = 1000; // Tamanho do lote para cada inserção
    
    try {
        await client.query('BEGIN'); // Inicia uma transação
        
        for (let i = 0; i < fornecedores.length; i += batchSize) {
            const batch = fornecedores.slice(i, i + batchSize);
            const values = batch.map((forn, index) => 
                `($${index * 5 + 1}, $${index * 5 + 2}, $${index * 5 + 3}, $${index * 5 + 4}, $${index * 5 + 5})`
            ).join(',');
            
            const params = batch.flatMap(forn => [
                forn.CNPJ,
                forn.Razao_Social,
                forn.Nome_Fantasia,
                forn.Municipio,
                forn.Especialidade
            ]);
            const sql = `INSERT INTO public."Fornecedor"("Id", "Razao_Social", "Nome_Fantasia", "Municipio", "Especialidade") VALUES ${values};`
            await client.query(sql, params);
        }
        
        await client.query('COMMIT'); // Confirma a transação
        return { success: true, message: 'Dados inseridos com sucesso' };
        
    } catch (err) {
        await client.query('ROLLBACK'); // Reverte a transação em caso de erro
        console.error('Erro ao fazer o Insert dos Fornecedores:', err);
        throw err;
    } finally {
        client.release(); // Libera o cliente de volta para o pool
    }
}

async function insertLancamento(despesas) {
    const client = await connect()
    const batchSize = 1000; // Tamanho do lote para cada inserção
    
    try {
        await client.query('BEGIN'); // Inicia uma transação
        
        for (let i = 0; i < despesas.length; i += batchSize) {
            const batch = despesas.slice(i, i + batchSize);
            const values = batch.map((desp, index) => 
                `($${index * 12 + 1}, $${index * 12 + 2}, $${index * 12 + 3}, $${index * 12 + 4}, $${index * 12 + 5}, $${index * 12 + 6}, $${index * 12 + 7}, $${index * 12 + 8}, $${index * 12 + 9}, $${index * 12 + 10}, $${index * 12 + 11}, $${index * 12 + 12})`
            ).join(',');
            const params = batch.flatMap(desp => [
                desp.Lancamento,
                desp.Nota,
                desp.Evento,
                desp.DescricaoEvento,
                desp.Historico,
                desp.Usuario,
                desp.Emissao,
                desp.Vencimento,
                desp.Parcela,
                desp.ValorParcela,
                desp.Filial,
                desp.CNPJFornecedor,
            ]);
            const sql = `INSERT INTO public."Despesa"("Lancamento", "Nota", "Evento", "DescricaoEvento", "Historico", "Usuario", "Emissao", "Vencimento", "Parcela", "ValorParcela", "Filial", "CNPJFornecedor") VALUES ${values};`
            await client.query(sql, params);
        }
        
        await client.query('COMMIT'); // Confirma a transação
        return { success: true, message: 'Dados inseridos com sucesso' };
        
    } catch (err) {
        await client.query('ROLLBACK'); // Reverte a transação em caso de erro
        console.error('Erro ao fazer o Insert dos Lancamentos:', err);
        throw err;
    } finally {
        client.release(); // Libera o cliente de volta para o pool
    }
}

export default { insertAbastecimentos, insertFaturas, insertFornecedores, insertLancamento, insertCTRC }