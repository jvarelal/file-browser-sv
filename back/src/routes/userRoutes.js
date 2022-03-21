import { Router } from 'express'
import jsonwebtoken from "jsonwebtoken"
import CONFIG from '../constants/config.js';
import authValidation from '../helpers/authValidation.js';
import secure from '../helpers/secure.js'
import { getUserByName, updateProp } from "../service/userService.js"

const router = Router();
const parentPath = '/api/user'

router.post(`${parentPath}/login`, (req, res) => {
	let { user, key } = req.body
	user = secure.process(user)
	key = secure.process(key)
	let foundUser = getUserByName(user);
	if (user && foundUser && foundUser.user === user && secure.process(foundUser.key) === key) {
		jsonwebtoken.sign(
			{ user },
			CONFIG.tokenKey,
			{ expiresIn: foundUser.sessionTime },
			(err, token) => {
				if (err) {
					return res.status(500).send({ message: "Can not login: " + err.message })
				}
				return res.status(200).send({
					status: 200,
					token,
					routes: foundUser.routes,
					rol: foundUser.rol,
					bookmarks: foundUser.bookmarks,
					sessionTime: foundUser.sessionTime,
					bookmarksGroup: foundUser.bookmarksGroup
				})
			})
	} else {
		res.status(403).send({ status: 403, message: "Invalid User or Password" })
	}
})

router.post(`${parentPath}/changeSession`, authValidation, async (req, res) => {
	let { user, sessionTime } = req.body
	try {
		await updateProp(user.user, "sessionTime", sessionTime)
		res.send({ status: 200, message: "Session time updated" })
	} catch (e) {
		res.status(500).send({ status: 500, message: e.message, secure: e.secure })
	}
})

router.post(`${parentPath}/changekey`, authValidation, async (req, res) => {
	let { user, key, prevKey } = req.body
	try {
		let previousPassword = secure.process(user.key)
		prevKey = secure.process(prevKey)
		if (previousPassword !== prevKey) {
			throw new Error("Current Password invalid")
		}
		await updateProp(user.user, "key", key)
		res.send({ status: 200, message: "Password updated" })
	} catch (e) {
		res.status(500).send({ status: 500, message: e.message, secure: e.secure })
	}
})

export default router