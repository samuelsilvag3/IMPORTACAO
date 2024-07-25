import client from './DB.js'

export class DBHandle{
    async consulta(consult){
        client.query(consult, (err, res) => {
            if(err){
                console.error(err)
            }else{
                console.log(res)
            }
        })
    }
}

export default DBHandle