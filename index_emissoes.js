import db from './DB.js'
import arquivo from './Arquivo.js'
import Papa from 'papaparse'

async function LancaAbastecimentos(){
    let filehandler = new arquivo()
    try{
        let conteudo = await filehandler.conteudodespesa('Y:/Relatorios/entregas.csv')
        try{
            Papa.parse(conteudo, {
                delimiter: ';',
                complete: async function(results){
                    const dados = results.data
                    console.log('Incluindo Emissoes: ', dados.length)
                    dados.forEach(async linha => {
                        if(linha[0] == '2'){
                            let CTRC = {
                                'CTRC': linha[1],
                                'Uni_orig': linha[2],
                                'Uni_dest': linha[17],
                                'Cnpj_Pagador': Number(linha[6].slice(0,14)),
                                'Nome_Pagador': linha[7].slice(0,30)
                            }
                            let resultado2 = await db.insertCTRC(CTRC)
                        }
                    })
                }
            })
        }catch(err){
            console.error(err)
        }finally{
            setTimeout(() => {
                console.log('Pausa de 60 segundos concluída!')
                process.kill(process.pid, 'SIGTERM')
            }, 60000)
            process.on('SIGTERM', () => {                    
                console.log('Finally')
            })
        }
    }catch(err){
        console.error(err)
    }finally{
        await filehandler.limpadiretorio('Y:/FrotaFlex')
    }
}

LancaAbastecimentos()