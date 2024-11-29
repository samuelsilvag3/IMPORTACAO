import {By, until} from 'selenium-webdriver'

export class Lancamento{

    async Incluir(driver, filial){
        try{
            //Dados do Lancamento
            let componentfilial = await driver.findElement(By.xpath('//*[@id="3"]'))
            let componentevento = await driver.findElement(By.xpath('//*[@id="5"]'))
            await driver.manage().setTimeouts({implicit: 30000})
            await componentfilial.clear()
            await componentfilial.sendKeys(filial)
            await componentevento.clear()
            await componentevento.sendKeys('5403')
        }
        catch(err){
            console.log('Erro ao enviar informações do lançamento')
            console.log(err)
        }
    }
}

export default Lancamento