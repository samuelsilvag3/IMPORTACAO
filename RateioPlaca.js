import {By, until} from 'selenium-webdriver'

export class RateioPlaca{

    async Incluir(driver, lancamento){
        try{
            let iptnlancamento = await driver.findElement(By.xpath('//*[@id="nro_lancto"]'))
            //let btnratear = await driver.findElement(By.xpath('//*[@id="btn_env"]'))
            await iptnlancamento.sendKeys(lancamento)
            await driver.wait(async () => (await driver.getAllWindowHandles()).length === 3, 30000)
        }
        catch(err){
            console.log('Erro ao enviar informações do lançamento')
            console.log(err)
        }
    }
}

export default RateioPlaca