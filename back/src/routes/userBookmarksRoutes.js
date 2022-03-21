import { Router } from 'express'
import authValidation from '../helpers/authValidation.js';
import {
    updateBookmark,
    addBookmarkGroup,
    deleteBookmarkGroup,
    editBookmarkGroup,
    getUserByName,
    updateProp
} from "../service/userService.js"

const router = Router();
const parentPath = '/api/user/bookmarks'

router.get(`${parentPath}`, authValidation, async (req, res) => {
    let { user } = req.body
    let foundUser = getUserByName(user.user);
    res.send({ status: 200, message: "Bookmarks retrieved", files: foundUser.bookmarks })
})

router.post(`${parentPath}`, authValidation, async (req, res) => {
    let { user, bookmarks } = req.body
    try {
        await updateProp(user.user, "bookmarks", bookmarks)
        res.send({ status: 200, message: "Bookmarks updated" })
    } catch (e) {
        res.status(500).send({ status: 500, message: e.message, secure: e.secure })
    }
})

router.post(`${parentPath}/update`, authValidation, async (req, res) => {
    let { user, bookmark } = req.body
    try {
        await updateBookmark(user.user, bookmark)
        res.send({ status: 200, message: "Bookmarks updated" })
    } catch (e) {
        res.status(500).send({ status: 500, message: e.message, secure: e.secure })
    }
})

router.post(`${parentPath}/groups`, authValidation, async (req, res) => {
    let { user, bookmarkGroup } = req.body
    try {
        await addBookmarkGroup(user.user, bookmarkGroup)
        res.send({ status: 200, message: "Bookmarks updated" })
    } catch (e) {
        res.status(500).send({ status: 500, message: e.message, secure: e.secure })
    }
})

router.post(`${parentPath}/groups/edit`, authValidation, async (req, res) => {
    let { user, bookmarkGroup } = req.body
    try {
        await editBookmarkGroup(user.user, bookmarkGroup)
        res.send({ status: 200, message: "Bookmarks updated" })
    } catch (e) {
        res.status(500).send({ status: 500, message: e.message, secure: e.secure })
    }
})

router.post(`${parentPath}/groups/delete`, authValidation, async (req, res) => {
    let { user, bookmarkGroup } = req.body
    try {
        let userUpdated = await deleteBookmarkGroup(user.user, bookmarkGroup)
        res.send({ status: 200, message: "Bookmarks updated", files: userUpdated.bookmarks })
    } catch (e) {
        res.status(500).send({ status: 500, message: e.message, secure: e.secure })
    }
})

export default router