import PlanilhaJson from './PlanilhaJson.js'
const caminho = 'Y:/Pedagios/Sem Parar.xlsx'
import db from './DBHandle.js'

async function LancaPedagio(){
    let Planilha = new PlanilhaJson()
    let dbhandler = new db()
    try{
        let totais = await Planilha.importaplanilha(caminho,0)
        let fatura = totais[0].DESCRIÇÃO.trim()
        let emissao = new Date(totais[2].DESCRIÇÃO.trim()).toLocaleDateString()
        let vencimento = new Date(totais[3].DESCRIÇÃO.trim()).toLocaleDateString()
        let valor = new Number(totais[4].DESCRIÇÃO.replace('R$','').replace(',','').trim())
        let passagens = new Number(totais[19].__EMPTY_2.replace('R$','').replace(',','').trim())
        let reducao = (valor - passagens) / passagens
        let extrato = await Planilha.importaplanilha(caminho,1)
        console.log(extrato[0])
        
        dbhandler.consulta(
            `INSERT INTO public."Passagens"(
            "Placa", "Valor", "Tipo")
            VALUES ('${extrato[1].PLACA}', ${Number(extrato[1].VALOR.replace('R$','').replace(',','').trim())}, 'Passagem')`
        )
    }catch(err){
        console.error(err)
    }
}

LancaPedagio()