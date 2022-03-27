import { Router } from 'express'
import adminValidation from '../helpers/adminValidation.js';
import { getUsers, addUser, deleteUser, editUser } from "../service/userService.js"

const router = Router();
const parentPath = '/api/admin'

router.get(`${parentPath}/users/list`, adminValidation, async (req, res) => {
    res.send({ status: 200, message: "Users retrieved", users: getUsers().map(u => ({ ...u, key: null })) })
})

router.post(`${parentPath}/users/add`, adminValidation, async (req, res) => {
    try {
        await addUser(req.body.userData)
        res.send({ status: 200, message: "User added" })
    } catch (e) {
        res.status(500).send({ status: 500, message: e.message, secure: e.secure })
    }
})

router.post(`${parentPath}/users/edit`, adminValidation, async (req, res) => {
    try {
        await editUser(req.body.userData)
        res.send({ status: 200, message: "User edited" })
    } catch (e) {
        res.status(500).send({ status: 500, message: e.message, secure: e.secure })
    }
})

router.post(`${parentPath}/users/delete`, adminValidation, async (req, res) => {
    try {
        let { userData, user } = req.body
        if (userData.user === user.user) {
            return res.status(400).send({ status: 400, message: "The user must not delete itself" })
        }
        await deleteUser(userData.user)
        res.send({ status: 200, message: "User added" })
    } catch (e) {
        res.status(500).send({ status: 500, message: e.message, secure: e.secure })
    }
})


export default router