import {By, until, Key} from 'selenium-webdriver'

export class DadosLancamento{

    async Preencher(driver, fatura, valorrateio, serie){
        try{
            let cnpj = await driver.findElement(By.xpath('//*[@id="2"]'))
            let iptserie = await driver.findElement(By.xpath('//*[@id="4"]'))
            let numdoc = await driver.findElement(By.xpath('//*[@id="5"]'))
            let valordoc = await driver.findElement(By.xpath('//*[@id="15"]'))
            let dataemi = await driver.findElement(By.xpath('//*[@id="16"]'))
            let iptvencimento = await driver.findElement(By.xpath('//*[@id="34"]'))
            //let valorparc = await driver.findElement(By.xpath('//*[@id="37"]'))
            let gravar = await driver.findElement(By.xpath('//*[@id="47"]'))
            let historico = await driver.findElement(By.xpath('//*[@id="40"]'))
            let valorarred = Math.round(valorrateio * 100) / 100
            //console.log(valorarred)
            await cnpj.sendKeys('04088208000165')
            await iptserie.sendKeys(serie)
            await numdoc.sendKeys(fatura.fatura.slice(0,8))
            await valordoc.sendKeys(valorarred.toString())
            console.log(fatura.emissao.replace('/', '').slice(0,4))
            await dataemi.sendKeys(fatura.emissao.replace('/', '').slice(0,4))
            await dataemi.sendKeys(Key.ENTER)

            //verifica final de semana
            await iptvencimento.sendKeys(fatura.vencimento.replace('/', '').slice(0,4))
            await iptvencimento.sendKeys(Key.ENTER)
            //await valorparc.sendKeys(valorarred.toString())
            await historico.sendKeys('LANCAMENTO DE PEDAGIOS GERADO POR AUTOMACAO')
            await gravar.click()
            console.log('Gravou lancamento')
            await driver.sleep(3000)
            //verificar se tem 2 janelas e verificar se houve mensagem de erro - dia util
            let janelas = await driver.getAllWindowHandles()
            console.log(janelas.length)
            if(janelas.length ===3){
                let msgerr = await driver.findElement(By.xpath('//*[@id="errormsg"]'))
                if(msgerr.isDisplayed()){
                    let btnok = await driver.findElement(By.xpath('//*[@id="0"]'))
                    await btnok.click()
                    await gravar.click()
                    await driver.sleep(3000)
                }                
            }
            janelas = await driver.getAllWindowHandles()
            console.log(janelas.length)
            if(janelas.length ===3){
                let msgerr2 = await driver.findElement(By.xpath('//*[@id="errormsg"]'))
                if(msgerr2.isDisplayed()){
                    let btnok2 = await driver.findElement(By.xpath('//*[@id="0"]'))
                    await btnok2.click()
                }                
            }
        }
        catch(err){
            console.log('Erro ao Preencher Dados do Lancamento')
            console.log(err)
        }
    }
}

export default DadosLancamento