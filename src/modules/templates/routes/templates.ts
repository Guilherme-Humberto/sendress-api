import express, { Request, Response } from 'express'
import ListTemplates from '../services/ListTemplates'
import CreateEmailTemplate from '../services/CreateEmailTemplate'

const templateRouter = express.Router()

templateRouter.get('/listAll', async (req: Request, res: Response) => {
    try {

        const listTemplates = await ListTemplates.execute()
        return res.json(listTemplates)
    } catch ({ message }) {
        return res.status(400).send({ message })
    }
})

templateRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid

        const listTemplates = await CreateEmailTemplate.execute()
        return res.json(listTemplates)
    } catch ({ message }) {
        return res.status(400).send({ message })
    }
})

export { templateRouter }