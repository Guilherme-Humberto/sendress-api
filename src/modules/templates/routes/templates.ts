import express, { Request, Response } from 'express'
import ListTemplates from '../services/ListTemplates'
import AWSListTemplates from '../services/AWSListTemplates'
import CreateEmailTemplate from '../services/CreateEmailTemplate'
import DeleteTemplate from '../services/DeleteTemplate'
import UpdateTemplate from '../services/UpdateTemplates'

const templateRouter = express.Router()

templateRouter.get('/listAll', async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid
        const listTemplates = await ListTemplates.execute({
            userId: { id: Number(userId) }
        })

        return res.json(listTemplates)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

templateRouter.get('/aws/listAll', async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid
        const listAwsTemplates = await AWSListTemplates.execute({
            userId: { id: Number(userId) }
        })

        return res.json(listAwsTemplates)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

templateRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid
        const templateData = req.body

        const template = await CreateEmailTemplate.execute({
            data: templateData,
            userId: { id: Number(userId) }
        })
        return res.json(template)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

templateRouter.delete('/delete', async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid
        const templateId = req.headers.templateid

        await DeleteTemplate.execute({
            templateId: { id: Number(templateId) },
            userId: { id: Number(userId) }
        })
        return res.json({ status: true, message: 'Template deleted' })
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

templateRouter.put('/update', async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid
        const templateId = req.headers.templateid
        const templateData = req.body

        const updateTemplate = await UpdateTemplate.execute({
            templateId: { id: Number(templateId) },
            userId: { id: Number(userId) },
            data: templateData
        })

        return res.json(updateTemplate)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

export { templateRouter }