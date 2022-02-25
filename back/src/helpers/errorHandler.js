const secure = require("../helpers/secure")

const errorHandler = (err, req, res, next) => {
	console.log(err)
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
}

module.exports = errorHandler