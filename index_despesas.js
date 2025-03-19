import db from './DB.js'
import arquivo from './Arquivo.js'
import Papa from 'papaparse'

async function LancaAbastecimentos(){
    let filehandler = new arquivo()
    try{
        let conteudo = await filehandler.conteudodespesa('Y:/Mural/despesas.csv')
        try{
            Papa.parse(conteudo, {
                delimiter: ';',
                complete: async function(results){
                    const dados = results.data
                    let fornecedores = []
                    dados.forEach(async linha => {
                        if(linha[0] == '5'){
                            const found = fornecedores.find((element) => element.CNPJ == linha[7].slice(0,14))
                            if(!found){
                                const fornecedor = {
                                    'CNPJ': linha[7].slice(0,14),
                                    'Razao_Social': linha[8].slice(0,30),
                                    'Nome_Fantasia': linha[8].slice(0,30),
                                    'Municipio': linha[10],
                                    'Especialidade': linha[15].slice(0,30)
                                }
                                fornecedores.push(fornecedor)
                            }
                        }
                    })
                    console.log('Incluindo fornecedores: ')
                    let resultado = await db.insertFornecedores(fornecedores)
                    let lancamentos = []
                    dados.forEach(async linha => {
                        if(linha[0] == '5'){
                            const lancamento = {
                                'Lancamento': linha[2].trim(),
                                'Nota': linha[19].trim(),
                                'Evento': Number(linha[4]),
                                'DescricaoEvento': linha[5].slice(0,30),
                                'Historico': linha[6].slice(0,30),
                                'Usuario': linha[28].trim(),
                                'Emissao': linha[30],
                                'Vencimento': linha[29],
                                'Parcela': Number(linha[3]),
                                'ValorParcela': Number(linha[23].trim().replace('.','').replace(',','.')),
                                'Filial': linha[34],
                                'CNPJFornecedor': Number(linha[7].slice(0,14))
                            }
                            lancamentos.push(lancamento)
                        }
                    })
                    console.log('Incluindo Lancamentos: ')
                    let resultado2 = await db.insertLancamento(lancamentos)
                }
            })
        }catch(err){
            console.error(err)
        }finally{
            setTimeout(() => {
                console.log('Pausa de 60 segundos concluída!')
                process.kill(process.pid, 'SIGTERM')
            }, 600000)
            process.on('SIGTERM', () => {                    
                console.log('Finally')
            })
        }
    }catch(err){
        console.error(err)
    }finally{
        //await filehandler.limpadiretorio('Y:/FrotaFlex')
		console.log('Finally2')
    }
}

LancaAbastecimentos()