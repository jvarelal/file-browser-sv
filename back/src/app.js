//Express
const express = require('express')
const jwt = require("jsonwebtoken")
const cors = require('cors')
const multer = require('multer')
const config = require("../config.json")
//util
const path = require("path")
const directory = require('./directory.js')
const sharp = require('sharp')
const archiver = require('archiver');

const app = express()
const storage = multer.diskStorage({
	destination: path.join(__dirname, "tmp"),
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	}
})
const tokenKey = "file_Browser"

//middleware
app.use(cors())
app.use(express.json())
app.use(multer({ storage }).array("file", config.fileBrowser.maxNumberFilesUpload))

app.post('/api/login', (req, res) => {
	let { user, key } = req.body
	let date = new Date().toDateString()
	let foundUser = config.users.find(u => u.user === user)
	if (user && foundUser && foundUser.user === user && foundUser.key === key) {
		jwt.sign({ user, date }, tokenKey, { expiresIn: config.expiresSession }, (err, token) => {
			res.status(200).send({
				status: 200,
				token,
				routes: foundUser.initialFolder
			})
		})
	} else {
		res.status(403).send({
			status: 403,
			message: "Usuario o password invalidos"
		})
	}
})

const checkLogin = (req, res, next) => {
	let token = (req.headers["authorization"] || "").split(" ")[1]
	if (token) {
		jwt.verify(token, tokenKey, (error, authData = {}) => {
			let foundUser = config.users.find(u => u.user === authData.user)
			if (error || !foundUser) {
				res.status(401).send({ status: 401, message: "Session invalid" })
			} else {
				next()
			}
		})
	} else {
		res.status(401).send({ status: 401, message: "Not logged" })
	}
}

app.post('/api/files', checkLogin, (req, res) => {
	try {
		res.send({
			status: 200,
			files: directory.listFiles(req.body.route)
		})
	} catch (e) {
		res.status(500).send({
			status: 500,
			message: e.message
		})
	}
})

app.get('/api/files', (req, res) => {
	try {
		let name = req.query.name
		let preview = req.query.preview
		let txt = req.query.txt
		let route = directory.getCurrentRoute(decodeURIComponent(name))
		res.setHeader('Content-Disposition', `inline`);
		if (preview && !isNaN(preview)) {
			let pvSize = parseInt(preview)
			let type = route.split(".")
			sharp(route)
				.resize(pvSize)
				.toBuffer()
				.then(data => {
					res.setHeader('Content-Type', `image/${type[type.length - 1]}`);
					res.end(data);
				})
				.catch(err => res.status(500).send({ status: 500, message: err.message }));
		} else if (txt === "true") {
			res.send(directory.fileAsText(route))
		} else {
			res.sendFile(route)
		}
	} catch (e) {
		console.log(e)
		return res.status(500).send("Server error")
	}
})

app.post('/api/files/add', checkLogin, (req, res) => {
	let type = req.body.type || ""
	let func = directory.add[type]
	if (!func) {
		return res.status(400).send({ status: 400, message: "Type unidentified" })
	}
	let resp = func(req.body, req.files)
	return res.status(resp.status).send(resp)
})

app.post('/api/files/information', checkLogin, async (req, res) => {
	let resp = await directory.information(req.body)
	res.status(resp.status).send(resp)
})

app.post('/api/files/edit', checkLogin, (req, res) => {
	let resp = directory.rename(req.body)
	res.status(resp.status).send(resp)
})

app.post('/api/files/editText', checkLogin, (req, res) => {
	let resp = directory.editText(req.body)
	res.status(resp.status).send(resp)
})

app.post('/api/files/copy', checkLogin, (req, res) => {
	let resp = directory.copy(req.body)
	res.status(resp.status).send(resp)
})

app.post('/api/files/move', checkLogin, (req, res) => {
	let resp = directory.move(req.body)
	res.status(resp.status).send(resp)
})

app.post('/api/files/delete', checkLogin, (req, res) => {
	let resp = directory.delete(req.body)
	res.status(resp.status).send(resp)
})

app.post('/api/files/download', checkLogin, (req, res) => {
	let { files = [] } = req.body
	if (files.length === 1 && !files[0].isDirectory) {
		let file = files[0]
		res.download(directory.getRouteFile(file.route, file.name).dir)
	} else {
		res.set('Content-Type', 'application/zip');
		res.set('Content-Disposition', 'attachment; filename=file.zip');
		let zip = archiver('zip');
		zip.pipe(res);
		directory.download(files, zip)
		zip.finalize()
	}
})

app.listen(config.port, () => {
	console.log(`File Browser running ${config.port}`)
})
