import db from './DB.js'
import arquivo from './Arquivo.js'
import Papa from 'papaparse'

async function LancaAbastecimentos(){
    const diretorio = 'Y:\RedeCastelo'
    let filehandler = new arquivo()
    try{
        const Emissao = new Date() //.toLocaleDateString()
        let contador = 0
        let Vencimento = new Date()
        while(contador < 5){
            Vencimento.setDate(Vencimento.getDate() + 1)
            if(Vencimento.getDay() !== 0){
                contador++
            }
        }
        let arquivos = await filehandler.listaarquivos(diretorio)
        arquivos.forEach(async nomearquivo => {
            let conteudo = await filehandler.conteudoarquivo(diretorio, nomearquivo)
            const fatura = {}
            try{
                Papa.parse(conteudo, {
                    delimiter: ';',
                    complete: async function(results){
                        console.log('Entrou!!')
                        const dados = results.data
                        fatura["NumFat"] = nomearquivo.replace('.csv','')
                        fatura["Emissao"] = Emissao.toLocaleDateString()
                        fatura["Vcto"] = Vencimento.toLocaleDateString()
                        fatura["NumNF"] = nomearquivo.replace('.csv','')
                        fatura["Fornecedor"] = dados[1][1]
                        dados.forEach(async linha => {
                            if(linha[0] == '55386106000167'){
                                let Abastecimento = {
                                    'Placa': linha[9], 
                                    'Data': linha[2].slice(0,10), 
                                    'Produto': linha[5].slice(0,20),
                                    'Quant': Number(linha[6]),
                                    'Motorista': linha[11].slice(0,20),
                                    'Odometro': Number(linha[10]), 
                                    'Valor': Number(linha[8]), 
                                    'Nota': nomearquivo.replace('.csv','')
                                }
                                console.log(Abastecimento)
                                let resultado = await db.insertAbastecimentos(Abastecimento)
                            }
                        })
                        console.log(fatura)
                        let resultado2 = await db.insertFaturas(fatura)
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