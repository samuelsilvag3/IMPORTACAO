import {By, until} from 'selenium-webdriver'

export class DadosRateioPlaca{

    async Incluir(driver, placa, valor){
        try{
            let iptplaca = await driver.findElement(By.xpath('//*[@id="2"]'))
            let iptvalor = await driver.findElement(By.xpath('//*[@id="3"]'))
            let btnincluir = await driver.findElement(By.xpath('//*[@id="4"]'))
            await iptplaca.clear()
            await iptplaca.sendKeys(placa)
            await driver.sleep(2000)
            await iptvalor.clear()
            await iptvalor.sendKeys(valor.toString())
            await driver.sleep(2000)
            await btnincluir.click()
            await driver.sleep(3000)
            // await driver.wait(until.elementIsVisible(await driver.findElement(By.xpath('//*[@id="procimg"]'))), 30000)
            // await driver.wait(until.elementIsNotVisible(await driver.findElement(By.xpath('//*[@id="procimg"]'))), 30000)
        }
        catch(err){
            console.error('Erro ao enviar informações do Rateio das placas', err)
        }
    }
}

export default DadosRateioPlaca