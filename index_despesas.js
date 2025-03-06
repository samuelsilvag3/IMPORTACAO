import db from './DB.js'
import arquivo from './Arquivo.js'
import Papa from 'papaparse'

async function LancaAbastecimentos(){
    let filehandler = new arquivo()
    try{
        let conteudo = await filehandler.conteudodespesa('Y:/Relatorios/despesas.csv')
        let fornecedores = {}
        try{
            Papa.parse(conteudo, {
                delimiter: ';',
                complete: async function(results){
                    const dados = results.data
                    dados.forEach(async linha => {
                        if(linha[0] == '5'){
                            fornecedores[linha[7].slice(0,14)] = {
                                'Razao_Social': linha[8].slice(0,30),
                                'Nome_Fantasia': linha[8].slice(0,30),
                                'Municipio': linha[10],
                                'Especialidade': linha[15].slice(0,30)
                            }
                        }
                    })
                    console.log('Incluindo fornecedores: ', fornecedores.length)
                    for(const [Key, Value] of Object.entries(fornecedores)){
                        let fornecedor = {'Id': Number(Key), 'Razao_Social': Value.Razao_Social, 'Nome_Fantasia': Value.Nome_Fantasia, 'Municipio': Value.Municipio, 'Especialidade': Value.Especialidade, 'Filial': '', 'Evento': 0}
                        let resultado = await db.insertFornecedores(fornecedor)
                    }
                    console.log('Incluindo Lancamentos: ', dados.length / 2)
                    dados.forEach(async linha => {
                        if(linha[0] == '5'){
                            let lancamento = {
                                'Lancamento': linha[2],
                                'Nota': linha[19].trim(),
                                'Evento': Number(linha[4]),
                                'DescricaoEvento': linha[5].slice(0,30),
                                'Historico': linha[6].slice(0,30),
                                'Usuario': linha[28],
                                'Emissao': linha[30],
                                'Vencimento': linha[29],
                                'Parcela': Number(linha[3]),
                                'ValorParcela': Number(linha[23].trim().replace('.','').replace(',','.')),
                                'Filial': linha[34],
                                'CNPJFornecedor': Number(linha[7].slice(0,14))
                            }
                            let resultado2 = await db.insertLancamento(lancamento)
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