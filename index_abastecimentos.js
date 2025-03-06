import db from './DB.js'
import arquivo from './Arquivo.js'
import Papa from 'papaparse'

async function LancaAbastecimentos(){
    const diretorio = 'Y:/FrotaFlex'
    let filehandler = new arquivo()
    try{
        let arquivos = await filehandler.listaarquivos(diretorio)
        arquivos.forEach(async nomearquivo => {
            let conteudo = await filehandler.conteudoarquivo(diretorio, nomearquivo)
            const fatura = {}
            try{
                Papa.parse(conteudo, {
                    delimiter: ',',
                    complete: async function(results){
                        console.log(results)
                        const dados = results.data
                        fatura["NumFat"] = dados[7][7]
                        fatura["Emissao"] = dados[7][10]
                        fatura["Vcto"] = dados[7][13]
                        fatura["NumNF"] = dados[9][5]
                        fatura["Fornecedor"] = dados[2][6]
                        dados.forEach(async linha => {
                            if(linha[0] == 'CF'){
                                console.log(`Odometro: ${linha[33].replace('.','').replace('.','').replace(',00','').replace(',0','').trim()}`)
                                let Abastecimento = {
                                    'Placa': linha[26], 
                                    'Data': linha[8], 
                                    'Produto': linha[18],
                                    'Quant': Number(linha[23].replace('.','').replace(',','.').trim()), 
                                    'Motorista': linha[28], 
                                    'Odometro': Number(linha[33].replace('.','').replace('.','').replace(',00','').replace(',0','').trim()), 
                                    'Valor': Number(linha[39].replace('.','').replace(',','.').trim()), 
                                    'Nota': linha[5]
                                }
                                //let resultado = await db.insertAbastecimentos(Abastecimento)
                            }
                        })
                        console.log('Incluindo Fatura')
                        //let resultado2 = await db.insertFaturas(fatura)
                    }
                })
            }catch(err){
                console.error(err)
            }finally{
                setTimeout(() => {
                    console.log('Pausa de 10 segundos concluída!')
                    process.kill(process.pid, 'SIGTERM')
                }, 10000)
                process.on('SIGTERM', () => {                    
                    console.log('Finally')
                })
            }
        })
    }catch(err){
        console.error(err)
    }finally{
        await filehandler.limpadiretorio('Y:/FrotaFlex')
    }
}

LancaAbastecimentos()