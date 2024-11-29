import {readdir, rm, rename} from 'fs'
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

  async renomeiaarquivos(diretorio, nomearquivo){
    const ReadDirPromisify = util.promisify(readdir)
    ReadDirPromisify(path.normalize(diretorio)).then(res => {
        res.forEach(renomear => {
            let origem = path.join(diretorio, renomear)
            let destino = path.join(diretorio, nomearquivo)
            rename(origem, destino, (err) => {
                if(err){
                console.error('Erro ao renomear arquivo: ', err)
                }
            })
        })
    })
  }
}

export default Arquivos