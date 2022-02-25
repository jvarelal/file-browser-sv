const router = require('express').Router()

const secure = require("../helpers/secure")
const path = require("path")
const sharp = require('sharp')
const authValidation = require("../helpers/authValidation")
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
    let route = req.appOperator.getRouteFile(decodeURIComponent(name))?.dir
    res.send(req.appOperator.fileAsText(route))
})

router.get(`${parentPath}/raw`, authValidation, (req, res) => {
    let { name } = req.query
    let route = req.appOperator.getRouteFile(decodeURIComponent(name))?.dir
    res.setHeader('Content-Disposition', `inline`);
    res.sendFile(route)
})

module.exports = router