import { Router } from 'express'
import jsonwebtoken from "jsonwebtoken"
import CONFIG from '../constants/config.js';
import authValidation from '../helpers/authValidation.js';
import secure from '../helpers/secure.js'
import { getUserByName, updateUserBookmarks } from "../service/userService.js"

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
			{ expiresIn: CONFIG.expiresIn },
			(err, token) => {
				res.status(200).send({
					status: 200,
					token,
					routes: foundUser.initialFolder,
					rol: foundUser.rol,
					bookmarks: foundUser.bookmarks
				})
			})
	} else {
		res.status(403).send({ status: 403, message: "Invalid User or Password" })
	}
})

router.post(`${parentPath}/bookmarks`, authValidation, async (req, res) => {
	let { user, bookmarks } = req.body
	try{
		await updateUserBookmarks(user.user, bookmarks)
		res.send({status: 200, message: "Bookmarks updated" })
	}catch(e){
		res.status(500).send({ status: 500, message: e.message })
	}
})

export default router