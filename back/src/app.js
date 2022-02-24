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
const secure = require('./util/secure')

const app = express()
const storage = multer.diskStorage({
	destination: path.join(__dirname, "tmp"),
	filename: (req, file, cb) => cb(null, file.originalname)
})
//middleware
app.use(cors())
app.use(express.json())
app.use(multer({ storage }).array("file", config.fileBrowser.maxNumberFilesUpload))

//login
app.post('/api/login', (req, res) => {
	let { user, key } = req.body
	user = secure.process(user)
	key = secure.process(key)
	let foundUser = config.users.find(u => u.user === user)
	if (user && foundUser && foundUser.user === user && foundUser.key === key) {
		jwt.sign({ user }, config.tokenKey, { expiresIn: config.expiresSession }, (err, token) => {
			res.status(200).send({ status: 200, token, routes: foundUser.initialFolder })
		})
	} else {
		res.status(403).send({ status: 403, message: "Invalid User or Password" })
	}
})

const checkLogin = (req, res, next) => {
	let token = req.method === "POST" ?
		(req.headers["authorization"] || "").split(" ")[1] :
		secure.process(decodeURIComponent(req.query.tmp));
	if (token) {
		jwt.verify(token, config.tokenKey, (error, authData = {}) => {
			let foundUser = config.users.find(u => u.user === authData.user)
			if (error || !foundUser) {
				res.status(401).send({ status: 401, message: "Invalid Session" })
			} else {
				req.body.user = foundUser
				req.appOperator = directory(foundUser)
				next()
			}
		})
	} else {
		res.status(401).send({ status: 401, message: "Not logged" })
	}
}

//files
app.post('/api/files', checkLogin, (req, res) => res.send(req.appOperator.listFiles((req.body))))

app.get('/api/files', checkLogin, (req, res) => {
	let { name, preview, txt } = req.query
	let route = req.appOperator.getRouteFile(decodeURIComponent(name))?.dir
	res.setHeader('Content-Disposition', `inline`);
	if (preview && !isNaN(preview)) {
		let pvSize = parseInt(preview)
		let type = route.split(".")
		sharp(route).resize(pvSize).toBuffer().then(data => {
			res.setHeader('Content-Type', `image/${type[type.length - 1]}`);
			res.end(data);
		}).catch(err => res.status(500).send({ status: 500, message: "File problem" }));
	} else if (txt === "true") {
		res.send(req.appOperator.fileAsText(route))
	} else {
		res.sendFile(route)
	}
})

app.post('/api/files/add', checkLogin, (req, res) => {
	let type = req.body.type || ""
	let func = req.appOperator.add[type]
	if (!func) {
		return res.status(400).send({ status: 400, message: "Type unidentified" })
	}
	let resp = func(req.body, req.files)
	return res.status(resp.status).send(resp)
})

app.post('/api/files/information', checkLogin, async (req, res) => {
	let resp = await req.appOperator.getFolderInformation(req.body)
	res.status(resp.status).send(resp)
})

app.post('/api/files/edit', checkLogin, (req, res) => {
	let resp = req.appOperator.renameElement(req.body)
	res.status(resp.status).send(resp)
})

app.post('/api/files/editText', checkLogin, (req, res) => {
	let resp = req.appOperator.setPlainFile(req.body)
	res.status(resp.status).send(resp)
})

app.post('/api/files/copy', checkLogin, (req, res) => {
	let resp = req.appOperator.copy(req.body)
	res.status(resp.status).send(resp)
})

app.post('/api/files/move', checkLogin, (req, res) => {
	let resp = req.appOperator.move(req.body)
	res.status(resp.status).send(resp)
})

app.post('/api/files/delete', checkLogin, (req, res) => {
	let resp = req.appOperator.deleteElement(req.body)
	res.status(resp.status).send(resp)
})

app.post('/api/files/download', checkLogin, (req, res) => {
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

app.use((err, req, res, next) => {
	let respError = {
		status: 500,
		message: secure.digest(err.message),
		secure: true
	}
	if (err.errors) {
		respError.errors = err.errors.map((e) => ({
			route: secure.digest(e.route),
			name: secure.digest(e.name),
			message: secure.digest(e.message)
		}))
	}
	return res.status(respError.status).send(respError)
})

app.use("/", express.static(path.join(__dirname, "public")))

app.listen(config.port, () => {
	console.log(`File Browser running ${config.port}`)
})
