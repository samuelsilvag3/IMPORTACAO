import PlanilhaJson from './PlanilhaJson.js'
const caminho = 'X:/Pedagios/Sem Parar.xls'
import db from './DB.js'
import dotenv from 'dotenv'
import Lancamento from './IncluiDespesa.js'
import arquivo from './Arquivo.js'
import express from 'express'
const PORT = process.env.PORT || 3000;

async function LancaPedagio(){
    dotenv.config()
    let Planilha = new PlanilhaJson()
    let lancamento = new Lancamento()
    let filehandler = new arquivo()
    try{
        let totais = await Planilha.importaplanilha(caminho,0)
        let envtotais = {}
        envtotais.fatura = totais[0].DESCRIÇÃO.trim()
        envtotais.emissao = totais[2].DESCRIÇÃO.slice(0,10)
        console.log(envtotais.emissao)
        envtotais.vencimento = totais[3].DESCRIÇÃO.slice(0,10)
        envtotais.valor = new Number(totais[4].DESCRIÇÃO.replace('R$','').replace(',','').trim()) //comparar total de passagens com valor da fatura
        //Insere Passagens TAG
        let extrato = await Planilha.importaplanilha(caminho,1)
        for(let i=0; i< extrato.length; i++){
            const passagem = {'Placa': extrato[i].PLACA, 'Valor': Number(extrato[i].VALOR.replace('R$','').replace(',','').trim()), 'Tipo': 'Passagem'}
            const result = await db.insertPassagens(passagem)
            //console.log(result.rowCount)
        }

        //Insere ESTACIONAMENTOS
        let estacionamentos = await Planilha.importaplanilha(caminho,5)
        for(let i=0; i< estacionamentos.length; i++){
            const estacionamento = {'Placa': estacionamentos[i].PLACA, 'Valor': Number(estacionamentos[i].VALOR.replace('R$','').replace(',','').trim()), 'Tipo': 'Estacionamento'}
            const result4 = await db.insertPassagens(estacionamento)
            //console.log(result.rowCount)
        }

        //Insere Vale Pedagio
        let valepedagio = await Planilha.importaplanilha(caminho,6)
        for(let i=0; i< valepedagio.length; i++){
            const valeped = {'Placa': valepedagio[i].PLACA, 'Valor': Number(valepedagio[i].VALOR.replace('R$','').replace(',','').trim()), 'Tipo': 'ValePedagio'}
            const result2 = await db.insertPassagens(valeped)
            //console.log(result2.rowCount)
        }

        //Insere Mensalidades
        let Mensalidades = await Planilha.importaplanilha(caminho,9)
        for(let i=0; i< Mensalidades.length; i++){
            const mensalidade = {'Placa': Mensalidades[i].PLACA, 'Valor': Number(Mensalidades[i].VALOR.replace('R$','').replace(',','').trim()), 'Tipo': 'Mensalidade'}
            const result6 = await db.insertPassagens(mensalidade)
            //console.log(result2.rowCount)
        }

        //Insere Creditos
        let creditos = await Planilha.importaplanilha(caminho,11)
        for(let i=0; i< creditos.length; i++){
            const credito = {'Placa': creditos[i].PLACA, 'Valor': Number(creditos[i].VALOR.replace('R$','').replace(',','').trim())*-1, 'Tipo': 'Creditos'}
            const result3 = await db.insertPassagens(credito)
            //console.log(result3.rowCount)
        }

        //Obtem valor rateado por filial
        let sqlrateiofilial = `
        SELECT public."PlacaUnidade"."Unidade", sum(public."Passagens"."Valor") as "Total"
	    FROM public."Passagens" Join public."PlacaUnidade"
	    on public."PlacaUnidade"."Placa" = public."Passagens"."Placa"
	    group by public."PlacaUnidade"."Unidade"
	    order by public."PlacaUnidade"."Unidade";
        `
        //Obtem rateios por filial e placa
        let sqlrateioplaca = `
        SELECT public."PlacaUnidade"."Unidade", public."PlacaUnidade"."Placa", sum(public."Passagens"."Valor") as "Total"
	    FROM public."Passagens" Join public."PlacaUnidade"
	    on public."PlacaUnidade"."Placa" = public."Passagens"."Placa"
	    group by public."PlacaUnidade"."Placa"
	    order by public."PlacaUnidade"."Placa";
        `
        const rateiofilial = await db.selectPassagens(sqlrateiofilial)
        console.log(rateiofilial)

        const rateioplaca = await db.selectPassagens(sqlrateioplaca)
        console.log(rateioplaca)

        await lancamento.Lancamento(envtotais,rateiofilial, rateioplaca)

        //Limpa dados da tabela
        const result4 = await db.deletePassagens()
        //console.log(result4.rowCount)
        await filehandler.limpadiretorio('X:/Pedagios')
    }catch(err){
        console.error(err)
    }
}

async function LancaAbastecimentos(placas){
    try{
        for(const [Key, Value] of Object.entries(placas)){
            //const result = await db.insertPassagens(passagem)
            //console.log(result.rowCount)
        }
    }catch(err){
        console.log(err)
    }
}

const App = express()
App.use(bodyParser.json())

App.post('/', (req, res) => {
    const teste = req.body
    console.log(teste)
    LancaPedagio()
    res.sendStatus(200);
})

App.post('/Trevo', (req, res) => {
    const teste = req.body
    console.log(teste)
    LancaAbastecimentos(req.body)
    res.sendStatus(200);
})

App.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})