const router = require('express').Router()

const secure = require("../helpers/secure")
const path = require("path")
const sharp = require('sharp')
const authValidation = require("../helpers/authValidation")
const XLSX = require("xlsx");

const parentPath = '/api/files/view'

router.get(`${parentPath}/image`, (req, res) => {
    let { name, preview } = req.query
    let route = path.resolve(secure.process(decodeURIComponent(name)))
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
    let { name } = req.query
    let dir = req.appOperator.getRouteFile(decodeURIComponent(name))?.dir
    const excel = XLSX.readFile(dir);
    let sheets = excel.SheetNames
    let excelData = sheets.map(sheet => ({
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

module.exports = router