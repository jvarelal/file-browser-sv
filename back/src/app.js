//Express
import express from 'express'
import cors from 'cors'
import multer, { diskStorage } from 'multer'
//util
import { join, dirname } from "path"
import { fileURLToPath } from "url";
import errorHandler from './helpers/errorHandler.js';
import CONFIG from './constants/config.js';
//routes
import userRoutes from "./routes/userRoutes.js";
import userBookmarksRoutes from "./routes/userBookmarksRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import filesRoutes from "./routes/filesRoutes.js";
import filesViewRoutes from "./routes/filesViewRoutes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express()
const storage = diskStorage({
	destination: join(__dirname, "tmp"),
	filename: (req, file, cb) => cb(null, file.originalname)
})
//settings
app.set("port", CONFIG.port)

//middleware
app.use(cors())
app.use(express.json())
app.use(multer({ storage }).array("file", 10))

//front page
app.use("/", express.static(join(__dirname, "public")))

app.use(userRoutes)
app.use(userBookmarksRoutes)
app.use(filesRoutes)
app.use(filesViewRoutes)
app.use(adminRoutes)

//errors
app.use(errorHandler)

export default app