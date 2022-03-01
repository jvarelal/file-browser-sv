const router = require('express').Router()
const jwt = require("jsonwebtoken")
const secure = require('../helpers/secure')
const config = require("../../config.json")

router.post('/api/login', (req, res) => {
	let { user, key } = req.body
	user = secure.process(user)
	key = secure.process(key)
	let foundUser = config.users.find(u => u.user === user)
	if (user && foundUser && foundUser.user === user && foundUser.key === key) {
		jwt.sign({ user }, config.tokenKey, { expiresIn: config.expiresSession }, (err, token) => {
			res.status(200).send({ status: 200, token, routes: foundUser.initialFolder.map(r => secure.digest(r)) })
		})
	} else {
		res.status(403).send({ status: 403, message: "Invalid User or Password" })
	}
})

module.exports = router