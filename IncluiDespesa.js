import {Builder, Browser, By, until, Key} from 'selenium-webdriver'
import Login from './Login.js'
import LancaRateio from './Lancamento.js'
import DadosLancamento from './DadosLancamento.js'
import Ratear from './RateioPlaca.js'
import DadosRateioPlaca from './DadosRateioPlaca.js'

export class IncluiDespesas{
    async Lancamento(totais, rateios, rateioplaca){
        let login = new Login()
        let lancarateio = new LancaRateio()
        let dadoslanc = new DadosLancamento()
        let ratear = new Ratear()
        let dadosrateioplaca = new DadosRateioPlaca()
        let driver = await new Builder().forBrowser(Browser.EDGE).build()
        let lancamentos = {}
        let TotalRateio = 0
        let TotalRateioPositivo = 0
        
        rateios.forEach(rateio => {
            TotalRateio += rateio.Total
        })
        rateios.forEach(rateio => {
            if(rateio.Total > 0){
                TotalRateioPositivo += rateio.Total
            }
        })
        let percdif = 1 - ((TotalRateioPositivo - TotalRateio)/TotalRateioPositivo)
        try{
            //Realiza Login no SSW
            await driver.get('https://sistema.ssw.inf.br/bin/ssw0422')
            const JanelaInicial = await driver.getWindowHandle()
            await login.LoginSSW(driver)
            await driver.wait(until.titleIs('Menu Principal :: SSW Sistema de Transportes'), 30000)
            //Acessar Tela de Programação de Despesas
            let opcao = await driver.findElement(By.xpath('//*[@id="3"]'))
            await opcao.sendKeys('475')
            await opcao.sendKeys(Key.ENTER)
            await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2, 30000)
            let janelas = await driver.getAllWindowHandles()
            janelas.forEach(async handle => {
                if(handle !== JanelaInicial){
                    await driver.switchTo().window(handle)
                }
            })
            await driver.wait(until.titleIs('475 - Programação de Despesas :: SSW Sistema de Transportes'), 30000)
            let jan475 = await driver.getWindowHandle()

            //Laço - filiais para ratear
            for(let i = 0; i < rateios.length; i++){
                if(rateios[i].Total > 0){
                    await lancarateio.Incluir(driver, rateios[i].Unidade)
                    //Muda para tela de preenchimento dos dados do lancamento
                    await driver.wait(async () => (await driver.getAllWindowHandles()).length === 3, 30000)
                    janelas = await driver.getAllWindowHandles()
                    janelas.forEach(async handle => {
                        if((handle !== JanelaInicial) && (handle !== jan475)){
                            await driver.switchTo().window(handle)
                        }
                    })
                    let totalajustado = rateios[i].Total * percdif
                    await driver.sleep(3000)
                    await dadoslanc.Preencher(driver, totais, totalajustado, i)
                    await driver.sleep(3000)
                    await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2, 30000)
                    await driver.switchTo().window(jan475)
                    //confirmar mensagem de inclusao
                    let confirmacao = await driver.findElement(By.xpath('//*[@id="errormsglabel"]'))
                    let lancamento = await confirmacao.getText()
                    lancamentos[rateios[i].Unidade] = lancamento.slice(15,21)
                    let btnok = await driver.findElement(By.xpath('//*[@id="0"]'))
                    await btnok.click()
                    await driver.wait(until.elementIsNotVisible(await driver.findElement(By.xpath('//*[@id="errormsg"]'))), 30000)
                }
            }
            
            if(Object.entries(lancamentos).length > 0){
                console.log(lancamentos)
                
                let btnfechar = await driver.findElement(By.xpath('//*[@id="7"]'))
                await btnfechar.click()
                await driver.wait(async () => (await driver.getAllWindowHandles()).length === 1, 30000)
                await driver.switchTo().window(JanelaInicial)
                let sigla = await driver.findElement(By.xpath('//*[@id="2"]'))
                for(const [Key, Value] of Object.entries(lancamentos)){
                    await sigla.clear()
                    await sigla.sendKeys(Key.toString())
                    opcao = await driver.findElement(By.xpath('//*[@id="3"]'))
                    await opcao.sendKeys('577')
                    await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2, 30000)
                    janelas = await driver.getAllWindowHandles()
                    janelas.forEach(async handle => {
                        if(handle !== JanelaInicial){
                            await driver.switchTo().window(handle)
                        }
                    })
                    await driver.wait(until.titleIs('577 - Debitar Despesa a Veículos :: SSW Sistema de Transportes'), 30000)
                    let jan577 = await driver.getWindowHandle()
                    await ratear.Incluir(driver, Value)
                    janelas = await driver.getAllWindowHandles()
                    janelas.forEach(async handle => {
                        if((handle !== JanelaInicial) && (handle !== jan577)){
                            await driver.switchTo().window(handle)
                        }
                    })
                    await driver.sleep(1000)
                    for(let i=0; i < rateioplaca.length; i++){
                        //testar se é positivo e multiplicar pelo % de diferença
                        if(rateioplaca[i].Unidade === Key){
                            if(rateioplaca[i].Total > 0){
                                let ratear = rateioplaca[i].Total * percdif
                                await dadosrateioplaca.Incluir(driver, rateioplaca[i].Placa, ratear.toString())
                            }
                        }
                    }
                    let btnfinalizar = await driver.findElement(By.xpath('//*[@id="5"]'))
                    await btnfinalizar.click()
                    await driver.sleep(3000)
                    janelas = await driver.getAllWindowHandles()
                    console.log(janelas.length)
                    if(janelas.length === 3){
                        let pnlerro = await driver.findElement(By.xpath('//*[@id="errormsg"]'))
                        if(pnlerro.isDisplayed()){
                            console.log('Diferenca no valor do rateio')
                            let continua = await driver.findElement(By.xpath('//*[@id="0"]'))
                            await continua.click()
                        }
                    }
                    await driver.wait(async () => (await driver.getAllWindowHandles()).length === 2, 30000)
                    await driver.switchTo().window(jan577)
                    let btnfechar = await driver.findElement(By.xpath('//*[@id="btn_fec"]'))
                    await btnfechar.click()
                    await driver.wait(async () => (await driver.getAllWindowHandles()).length === 1, 30000)
                    await driver.switchTo().window(JanelaInicial)
                    await driver.wait(until.titleIs('Menu Principal :: SSW Sistema de Transportes'), 30000)
                }
            }
        }catch(err){
            console.error('Erro na Inclusao dos Lanlçamentos:', err)
        }finally{
            console.log('Finally')
            await driver.quit()
        }
    }
}

export default IncluiDespesas