import PG from 'pg'

const {Client} = PG
const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'rs97150979',
    database: 'SSW2',
})
client.connect()
.then(() => console.log('Conectado com sucesso'))
.catch(err => console.error('Erro ao conectar banco de dados', err.stack))   

export default client