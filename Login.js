import {By} from 'selenium-webdriver'

export class Login{

    async LoginSSW(driver){
        try{
            //Dados de Login
            let dominio = await driver.findElement(By.name('f1'))
            let cpf = await driver.findElement(By.name('f2'))
            let usuario = await driver.findElement(By.name('f3'))
            let senha = await driver.findElement(By.name('f4'))
            let BtnLogin = await driver.findElement(By.id('5'))
            await driver.manage().setTimeouts({implicit: 30000})
            dominio.sendKeys('ALL')
            cpf.sendKeys('33779439867')
            usuario.sendKeys('powerbi')
            senha.sendKeys('123')
            await driver.sleep(2000)
            BtnLogin.click()
        }
        catch(err){
            console.log('Erro ao enviar informacoes de Login')
            console.log(err)
        }
    }
}

export default Login