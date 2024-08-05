import PlanilhaJson from './PlanilhaJson.js'
const caminho = 'Y:/Pedagios/Sem Parar.xlsx'
import client from './DB.js'

async function LancaPedagio(){
    let Planilha = new PlanilhaJson()
    try{
        let totais = await Planilha.importaplanilha(caminho,0)
        let fatura = totais[0].DESCRIÇÃO.trim()
        let emissao = new Date(totais[2].DESCRIÇÃO.trim()).toLocaleDateString()
        let vencimento = new Date(totais[3].DESCRIÇÃO.trim()).toLocaleDateString()
        let valor = new Number(totais[4].DESCRIÇÃO.replace('R$','').replace(',','').trim())
        let passagens = new Number(totais[19].__EMPTY_2.replace('R$','').replace(',','').trim())
        let reducao = (valor - passagens) / passagens
        let extrato = await Planilha.importaplanilha(caminho,1)
        for(let i=1; i< 2; i++){
            client.query(
                `INSERT INTO public."Passagens"(
                "Placa", "Valor", "Tipo")
                VALUES ('${extrato[i].PLACA}', ${Number(extrato[i].VALOR.replace('R$','').replace(',','').trim())}, 'Passagem')`,
                (err, res) => {
                    if(err){
                        console.error(err)
                    }else{
                        //console.log(res.rows.length)
                        console.log(res.rowCount)
                    }
                    //client.end()
                }
            )
        }
        
    }catch(err){
        console.error(err)
    }
}

LancaPedagio()