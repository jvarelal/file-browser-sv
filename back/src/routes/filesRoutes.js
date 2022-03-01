import { Router } from 'express'
import archiver from 'archiver';
import authValidation from "../helpers/authValidation.js";

const router = Router();
const parentPath = '/api/files'

router.post(parentPath, authValidation, (req, res) => res.send(req.appOperator.listFiles((req.body))))

router.post(`${parentPath}/add`, authValidation, (req, res) => {
	let type = req.body.type || ""
	let func = req.appOperator.add[type]
	if (!func) {
		return res.status(400).send({ status: 400, message: "Type unidentified" })
	}
	let resp = func(req.body, req.files)
	return res.send(resp)
})

router.post(`${parentPath}/information`, authValidation, async (req, res) => {
	let resp = await req.appOperator.getFolderInformation(req.body)
	res.send(resp)
})

router.post(`${parentPath}/edit`, authValidation, (req, res) => {
	let resp = req.appOperator.renameElement(req.body)
	res.send(resp)
})

router.post(`${parentPath}/editText`, authValidation, (req, res) => {
	let resp = req.appOperator.setPlainFile(req.body)
	res.send(resp)
})

router.post(`${parentPath}/copy`, authValidation, (req, res) => {
	let resp = req.appOperator.copy(req.body)
	res.send(resp)
})

router.post(`${parentPath}/move`, authValidation, (req, res) => {
	let resp = req.appOperator.move(req.body)
	res.send(resp)
})

router.post(`${parentPath}/delete`, authValidation, (req, res) => {
	let resp = req.appOperator.deleteElement(req.body)
	res.send(resp)
})

router.post(`${parentPath}/download`, authValidation, (req, res) => {
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

export default router