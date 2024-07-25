import XLSX from 'xlsx'
import path from 'path'

export class PlanilhaJson{

    async importaplanilha(arquivo, planilha){
        try{
            const workbook = XLSX.readFile(path.normalize(arquivo))
            let firstsheetname = workbook.SheetNames[planilha]
            let firstworksheet = workbook.Sheets[firstsheetname]
            let data = XLSX.utils.sheet_to_json(firstworksheet, {raw: false})
            return data
        }catch(err){
            console.error(err)
        }
    }
}

export default PlanilhaJson