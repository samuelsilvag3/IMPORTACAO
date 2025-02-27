import {readdir, rm, rename, createReadStream} from 'fs'
import path from 'path'
import util from 'util'

export class Arquivos{

  async limpadiretorio(diretorio){
    const ReadDirPromisify = util.promisify(readdir)
    try{
        await ReadDirPromisify(path.normalize(diretorio)).then(res => {
            res.forEach(clean => {
              let apagar = path.join(path.normalize(diretorio), clean)
              rm(apagar, (err) => {
                  if(err){
                      console.error('Erro ao apagar arquivos:', err)
                  }
              })
            }) 
        })
    }catch(err){
        console.error('Erro ao excluir arquivo: ', err)
    }finally{
        return true
    }
  }

  async listaarquivos(diretorio){
    const ReadDirPromisify = util.promisify(readdir)
    try{
        let listaarquivos = await ReadDirPromisify(path.normalize(diretorio)).then(res => {
            return res
        })
        return listaarquivos
    }catch(err){
        console.error('Erro na leitura do diretorio: ', err)
    }
  }

  async conteudoarquivo(arquivo){
    try{
        const caminho = path.join('Y:/FrotaFlex', arquivo)
        const conteudo = createReadStream(caminho)
        return conteudo
    }catch(err){
        console.log(err)
    }
  }

  async conteudodespesa(arquivo){
    try{
        const caminho = path.normalize(arquivo)
        console.log(caminho)
        const conteudo = createReadStream(caminho)
        return conteudo
    }catch(err){
        console.log(err)
    }
  }
}

export default Arquivos