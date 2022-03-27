import secure from "../helpers/secure.js"

const errorHandler = (err, req, res, next) => {
	let respError = {
		status: err.status || 500,
		message: err.secure ? err.message : secure.digest(err.message),
		secure: true
	}
	if (err.errors) {
		respError.errors = err.errors
	}
	return res.status(respError.status).send(respError)
}

export default errorHandler