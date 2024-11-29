import pg from 'pg'
const {Pool} = pg

async function connect() {
    // if (global.connection){
    //     return global.connection.connect()
    // }
    const pool = new Pool({
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'rs97150979',
        database: 'SSW2'
    })
    //retorna pool de conexões
    const client = await pool.connect();
    client.release();
    global.connection = pool;
    return pool.connect();
}

async function selectPassagens(consulta) {
    const client = await connect();
    const res = await client.query(consulta);
    return res.rows;
}

async function insertPassagens(Passagem){
    let valorcorrigido
    const client = await connect()
    const sql = 'INSERT INTO public."Passagens"("Placa","Valor","Tipo") VALUES ($1,$2,$3);'
    if(Number.isNaN(Passagem.Valor)){
        valorcorrigido = 0
    }else{
        valorcorrigido = Passagem.Valor
    }
    const values = [Passagem.Placa, valorcorrigido, Passagem.Tipo]
    return await client.query(sql, values)
    //return { Unidade: 'SJR', Placa: 'KHX2J04', Total: 264.71 }
}

async function deletePassagens(){
    const client = await connect()
    const sql = 'DELETE FROM public."Passagens"'
    return await client.query(sql)
}
 
export default { selectPassagens, insertPassagens, deletePassagens }