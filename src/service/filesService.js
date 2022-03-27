import fs from 'fs-extra';
import sizeOf from 'image-size';
import { resolve, join, dirname } from "path";
import { fileURLToPath } from "url";
import fastFolderSize from 'fast-folder-size';
import { promisify } from 'util';
import secure from "../helpers/secure.js";
import FileOperationError from "../errors/FileOperationError.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const directory = (user) => {
	function getRouteFile(route, name) {
		let processRoute = secure.process(route);
		let filePath = { dir: resolve(processRoute) };
		if (name) {
			filePath.dir = join(filePath.dir, secure.process(name));
			filePath.name = secure.process(name);
			filePath.route = processRoute;
		}
		if (user.routes.filter(r => filePath.dir.startsWith(resolve(r))).length === 0) {
			throw new Error("Ruta invalida para el usuario");
		}
		filePath.actions = user.actions
		return filePath;
	}

	function listFiles({ route }) {
		let { dir, actions } = getRouteFile(route)
		let dirFiles = fs.readdirSync(dir) || []
		let files = dirFiles.map(file => {
			try {
				let innerFile = join(dir, file)
				let fileOwnData = fs.statSync(innerFile)
				let data = {
					isDirectory: fileOwnData.isDirectory(),
					name: file,
					size: fileOwnData.size,
					creation: fileOwnData.ctime,
					modification: fileOwnData.mtime
				}
				if (dirFiles.length < 500) {
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
		return { message: "Information collected", files, actions }
	}

	async function getFolderInformation({ name, route }) {
		let { dir } = getRouteFile(route, name)
		let fileOwnData = fs.statSync(dir)
		const fastFolderSizeAsync = promisify(fastFolderSize)
		const bytes = await fastFolderSizeAsync(dir)
		return {

			message: "Information collected",
			data: {
				isDirectory: true,
				size: bytes,
				creation: fileOwnData.ctime,
				modification: fileOwnData.mtime
			}
		}
	}

	function fileAsText(route) {
		let text = fs.readFileSync(route, { encoding: 'utf8' })
		return secure.digest(text)
	}

	function setPlainFile({ route, name, text }) {
		fs.writeFileSync(getRouteFile(route, name).dir, secure.process(text))
		return { message: "Folder created" }
	}

	function copyFiles(data, move = false) {
		let { files } = data;
		let errors = [];
		let { dir } = getRouteFile(data.route);
		files.forEach(file => {
			try {
				let { route, name } = file;
				let fileDir = getRouteFile(route, name);
				fs[move ? "renameSync" : "copySync"](fileDir.dir, join(dir, fileDir.name));
			} catch (e) {
				errors.push({ route: fileDir.route, name: fileDir.name, message: e.message });
			}
		});
		if (errors.length > 0) {
			throw new FileOperationError({ message: "Some files had problems", errors });
		}
		return { message: `Files ${move ? "moved" : "copied"}` };
	}

	function renameElement(data) {
		let { name, route, newName } = data
		let { dir } = getRouteFile(route)
		fs.renameSync(join(dir, secure.process(name)), join(dir, secure.process(newName)))
		return { message: "Files modified" }
	}

	function newFolder({ name, route }) {
		let { dir } = getRouteFile(route, name)
		if (fs.existsSync(dir)) {
			throw new FileOperationError({ message: "Folder already exist", errors, status: 400 });
		}
		fs.mkdirSync(dir);
		return { message: "Folder created" }
	}

	function newTextFile({ name, route }) {
		fs.writeFileSync(getRouteFile(route, name).dir, "")
		return { message: "File created" }
	}

	function fileUpload({ route }, files = []) {
		let errors = []
		let { dir } = getRouteFile(route)
		if (files.length === 0) {
			throw new FileOperationError({ message: "Files not found", errors, status: 400 });
		}
		files.forEach(file => {
			let destination = join(dir, file.originalname)
			if (!fs.existsSync(destination)) {
				let origin = join(__dirname, "../tmp", file.originalname)
				fs.move(origin, destination, function (err) {
					if (err) {
						errors.push({ name: file.originalname, message: err.message })
					}
				}
				)
			} else {
				errors.push({ route: destination, name: file.originalname, message: "File already exist" })
			}
		});
		if (errors.length > 0) {
			throw new FileOperationError({ message: "Some files had problems", errors })
		}
		return { message: "Files added" }
	}

	function deleteElement(data) {
		let { files } = data
		let errors = []
		files.forEach(file => {
			let { route, name } = file
			let pathData = getRouteFile(route, name)
			try {
				fs.lstatSync(pathData.dir).isDirectory() ? fs.rmdirSync(pathData.dir) : fs.unlinkSync(pathData.dir)
			} catch (err) {
				errors.push({ route: pathData.route, name: pathData.name, message: err.message })
			}
		})
		if (errors.length > 0) {
			throw new FileOperationError({ message: "Some files had problems", errors })
		}
		return { message: "Files deleted" }
	}

	function download(files = [], zip) {
		files.forEach(f => {
			let dataPath = getRouteFile(f.route, f.name);
			if (f.isDirectory) {
				zip = zip.directory(dataPath.dir, dataPath.name);
			} else {
				zip = zip.file(dataPath.dir, { name: dataPath.name });
			}
		});
		return zip;
	}

	return {
		getRouteFile,
		listFiles,
		getFolderInformation,
		fileAsText,
		setPlainFile,
		add: {
			folder: newFolder,
			plain: newTextFile,
			file: fileUpload
		},
		renameElement,
		copy: copyFiles,
		move: data => copyFiles(data, true),
		deleteElement,
		download
	}
}

export default directory