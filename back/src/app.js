//Express
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const config = require("../config.json")
//util
const path = require("path")
const errorHandler = require('./helpers/errorHandler')

const app = express()
const storage = multer.diskStorage({
	destination: path.join(__dirname, "tmp"),
	filename: (req, file, cb) => cb(null, file.originalname)
})

//middleware
app.use(cors())
app.use(express.json())
app.use(multer({ storage }).array("file", config.fileBrowser.maxNumberFilesUpload))

//front page
app.use("/", express.static(path.join(__dirname, "public")))

//routes
app.use(require("./routes/loginRoutes"))
app.use(require("./routes/filesRoutes"))

//errors
app.use(errorHandler)


app.listen(config.port, () => {
	console.log(`File Browser running ${config.port}`)
})
