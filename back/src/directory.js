const fs = require('fs-extra')
const sizeOf = require('image-size');
const path = require("path")
const CryptoJS = require("crypto-js")
const config = require("../config.json")
const fastFolderSize = require('fast-folder-size')
const { promisify } = require('util')

const secure = {
	digest: (clearText) => CryptoJS.AES.encrypt(clearText, config.key).toString(),
	process: (text) => CryptoJS.AES.decrypt(text, config.key).toString(CryptoJS.enc.Utf8)
}

function copyFiles(data, move = false) {
	let { files } = data
	let errors = []
	files.forEach(file => {
		try {
			let { route, name } = file
			name = secure.process(name)
			fs[move ? "renameSync" : "copySync"](
				path.join(secure.process(route), name),
				path.join(secure.process(data.route), name)
			)
		} catch (e) {
			errors.push({ route: file.route, name: file.name, message: secure.digest(e.message) })
		}
	})
	if (errors.length > 0) {
		return { status: 500, message: "Some files had problems", errors }
	}
	return { status: 200, message: `Files ${move ? "moved" : "copied"}` }
}

const directory = {

	getCurrentRoute: (dir) => {
		let fullDir = path.resolve(secure.process(dir));
		return fullDir
	},

	getRouteFile: (route, secureName) => {
		let dir = path.join(secure.process(route), secure.process(secureName));
		let name = secure.process(secureName)
		return { dir, name }
	},

	listFiles: (route) => {
		let dir = secure.process(route)
		let files = fs.readdirSync(dir) || []
		return files.map(file => {
			try {
				let innerFile = dir + '/' + file
				let fileOwnData = fs.statSync(innerFile)
				let data = {
					isDirectory: fileOwnData.isDirectory(),
					name: file,
					size: fileOwnData.size,
					creation: fileOwnData.ctime,
					modification: fileOwnData.mtime
				}
				if (files.length < 500) {
					let type = innerFile.split(".")
					type = type[type.length - 1]
					if (type && ['jpg', 'png', 'jpeg'].includes(type.toLowerCase())) {
						let { width, height } = sizeOf(innerFile) || {};
						data = { ...data, width, height }
					}
				}
				return data
			} catch (e) {
				return { name: file }
			}
		})
	},

	information: async (file) => {
		try {
			let route = secure.process(file.route)
			let name = secure.process(file.name)
			let fullPath = path.join(route, name)
			let fileOwnData = fs.statSync(fullPath)
			const fastFolderSizeAsync = promisify(fastFolderSize)
			const bytes = await fastFolderSizeAsync(fullPath)
			return {
				status: 200,
				message: "Information collected",
				data: {
					isDirectory: true,
					size: bytes,
					creation: fileOwnData.ctime,
					modification: fileOwnData.mtime
				}
			}
		} catch (e) {
			return { status: 500, message: "Some files had problems: " + e.message }
		}
	},

	fileAsText: (route) => {
		let text = fs.readFileSync(route, { encoding: 'utf8' })
		return secure.digest(text)
	},

	setPlainFile: (file) => {
		try {
			let dataDir = path.join(secure.process(file.route), secure.process(file.name));
			fs.writeFileSync(dataDir, secure.process(file.text))
			return { status: 200, message: "Folder created" }
		} catch (e) {
			return { status: 500, message: "Error: " + e.message }
		}
	},

	add: {
		folder: (body) => {
			try {
				let { name, route } = body
				route = secure.process(route)
				name = secure.process(name)
				let newPath = path.join(route, name)
				if (!fs.existsSync(newPath)) {
					fs.mkdirSync(newPath);
					return { status: 200, message: "Folder created" }
				}
				return { status: 400, message: "Folder already exist" }
			} catch (e) {
				return { status: 500, message: "Some files had problems: " + e.message }
			}
		},

		plain: (body) => {
			try {
				let { name, route } = body
				route = secure.process(route)
				name = secure.process(name)
				let newPath = path.join(route, name)
				fs.writeFileSync(newPath, "")
				return { status: 200, message: "File created" }
			} catch (e) {
				return { status: 500, message: "Some files had problems: " + e.message }
			}
		},

		file: (body, files = []) => {
			try {
				let { route } = body
				route = secure.process(route)
				let errors = []
				if (files.length === 0) {
					return { status: 400, message: "Files not found" }
				}
				files.forEach(file => {
					let destination = path.join(route, file.originalname)
					if (!fs.existsSync(destination)) {
						fs.move(
							path.join(__dirname, "tmp", file.originalname),
							destination,
							function (err) {
								if (err) {
									errors.push({ name: file.originalname, message: err.message })
								}
							}
						)
					} else {
						errors.push({ name: file.originalname, message: "File already exist" })
					}
				});
				if (errors.length > 0) {
					return { status: 400, message: "Some files had problems", errors }
				}
				return { status: 200, message: "Files added" }
			} catch (e) {
				return { status: 500, message: "Some files had problems: " + e.message }
			}
		}
	},

	rename: (data) => {
		try {
			let { name, route, newName } = data
			route = secure.process(route)
			fs.renameSync(path.join(route, secure.process(name)), path.join(route, secure.process(newName)))
		} catch (e) {
			return { status: 400, message: secure.digest("Some files had problems: " + e.message) }
		}
		return { status: 200, message: "Files modified" }
	},

	copy: copyFiles,

	move: data => copyFiles(data, true),

	delete: (data) => {
		let { files } = data
		let errors = []
		files.forEach(file => {
			try {
				let { route, name } = file
				let filePath = path.join(secure.process(route), secure.process(name))
				fs.lstatSync(filePath).isDirectory() ? fs.rmdirSync(filePath) : fs.unlinkSync(filePath)
			} catch (err) {
				errors.push({ route, name, message: secure.digest(err.message) })
			}
		})
		if (errors.length > 0) {
			return { status: 500, message: "Some files had problems", errors }
		}
		return { status: 200, message: "Files deleted" }
	},

	download: download
}
function download(files = [], zip) {
	files.forEach(f => {
		let dataPath = directory.getRouteFile(f.route, f.name)
		if (f.isDirectory) {
			zip = zip.directory(dataPath.dir, dataPath.name)
		} else {
			zip = zip.file(dataPath.dir, { name: dataPath.name })
		}
	});
	return zip
}

module.exports = directory