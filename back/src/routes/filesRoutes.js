const router = require('express').Router()

const secure = require("../helpers/secure")
const path = require("path")
const sharp = require('sharp')
const archiver = require('archiver');
const authValidation = require("../helpers/authValidation")

router.post('/api/files', authValidation, (req, res) => res.send(req.appOperator.listFiles((req.body))))

router.get('/api/image', (req, res) => {
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

router.get('/api/files', authValidation, (req, res) => {
	let { name, txt } = req.query
	let route = req.appOperator.getRouteFile(decodeURIComponent(name))?.dir
	res.setHeader('Content-Disposition', `inline`);
	if (txt === "true") {
		res.send(req.appOperator.fileAsText(route))
	} else {
		res.sendFile(route)
	}
})

router.post('/api/files/add', authValidation, (req, res) => {
	let type = req.body.type || ""
	let func = req.appOperator.add[type]
	if (!func) {
		return res.status(400).send({ status: 400, message: "Type unidentified" })
	}
	let resp = func(req.body, req.files)
	return res.status(resp.status).send(resp)
})

router.post('/api/files/information', authValidation, async (req, res) => {
	let resp = await req.appOperator.getFolderInformation(req.body)
	res.status(resp.status).send(resp)
})

router.post('/api/files/edit', authValidation, (req, res) => {
	let resp = req.appOperator.renameElement(req.body)
	res.status(resp.status).send(resp)
})

router.post('/api/files/editText', authValidation, (req, res) => {
	let resp = req.appOperator.setPlainFile(req.body)
	res.status(resp.status).send(resp)
})

router.post('/api/files/copy', authValidation, (req, res) => {
	let resp = req.appOperator.copy(req.body)
	res.status(resp.status).send(resp)
})

router.post('/api/files/move', authValidation, (req, res) => {
	let resp = req.appOperator.move(req.body)
	res.status(resp.status).send(resp)
})

router.post('/api/files/delete', authValidation, (req, res) => {
	let resp = req.appOperator.deleteElement(req.body)
	res.status(resp.status).send(resp)
})

router.post('/api/files/download', authValidation, (req, res) => {
	let { files = [] } = req.body
	if (files.length === 1 && !files[0].isDirectory) {
		let file = files[0]
		res.download(req.appOperator.getRouteFile(file.route, file.name).dir)
	} else {
		res.set('Content-Type', 'application/zip');
		res.set('Content-Disposition', 'attachment; filename=file.zip');
		let zip = archiver('zip');
		zip.pipe(res);
		req.appOperator.download(files, zip)
		zip.finalize()
	}
})

module.exports = router