import { Router } from 'express'
import secure from "../helpers/secure.js"
import { resolve } from "path"
import sharp from 'sharp'
import authValidation from "../helpers/authValidation.js"
import XLSX from "xlsx"

const router = Router();
const parentPath = '/api/files/view'

router.get(`${parentPath}/image`, (req, res) => {
    let { name, preview } = req.query
    let route = resolve(secure.process(decodeURIComponent(name)))
    res.setHeader('Content-Disposition', `inline`);
    if (preview && !isNaN(preview)) {
        let pvSize = parseInt(preview)
        let type = route.split(".")
        sharp(route).resize(pvSize).toBuffer().then(data => {
            res.setHeader('Content-Type', `image/${type[type.length - 1]}`);
            res.end(data);
        }).catch(err => res.status(500).send({ status: 500, message: "File problem" }));
    } else {
        res.sendFile(route)
    }
})

router.get(`${parentPath}/text`, authValidation, (req, res) => {
    let { name } = req.query
    let route = req.appOperator.getRouteFile(decodeURIComponent(name))?.dir
    res.send(req.appOperator.fileAsText(route))
})

router.get(`${parentPath}/excel`, authValidation, (req, res) => {
    const { name } = req.query
    const dir = req.appOperator.getRouteFile(decodeURIComponent(name))?.dir
    const excel = XLSX.readFile(dir);
    const sheets = excel.SheetNames
    const rowAux = (sheetData = {}) => {
        let maxNumberOnCol = Math.max(...sheetData.data.map(r => r.length))
        return { ...sheetData, maxNumberOnCol }
    }
    let excelData = sheets.map(sheet => rowAux({
        sheetName: sheet,
        headers: excel.Sheets[sheet]['!cols'],
        data: XLSX.utils.sheet_to_json(excel.Sheets[sheet], { header: 1 })
    }))
    res.send(excelData)
})

router.get(`${parentPath}/raw`, authValidation, (req, res) => {
    let { name } = req.query
    let route = req.appOperator.getRouteFile(decodeURIComponent(name))?.dir
    res.setHeader('Content-Disposition', `inline`);
    res.sendFile(route)
})

export default router