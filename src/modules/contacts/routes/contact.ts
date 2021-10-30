
// TODO: Criar contato [x]
// TODO: Atualizar contato [x]
// TODO: Listar todos os contato [x] 
// TODO: Deletar contatos em massa [x] 
// TODO: Deletar contato [x] 
// TODO: Importar contatos [x] 

import express, { Request, Response } from 'express'
import multer from 'multer'
import CreateContact from '../services/CreateContact'
import ListContact from '../services/ListContact'
import DeleteContact from '../services/DeleteContact'
import DeleteManyContact from '../services/DeleteManyContact'
import ImportContact from '../services/ImportContact'
import UpdateContact from '../services/UpdateContact'
import { authMiddleware } from '@core/http/middlewares/authorization'

const contactRouter = express.Router()
const multerConfig = multer()

contactRouter.use(authMiddleware)

contactRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const contactData = req.body
        const userId = req.headers.userid
        // const typeModel = req.headers.typemodel

        // if (!typeModel) return res.status(400).send({ error: 'typeModel is required' })

        const contact = await CreateContact.execute({
            data: contactData,
            userId: { id: Number(userId) }
        })
        return res.send(contact)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

contactRouter.get('/listAll', async (req, res: Response) => {
    try {
        const userId = req.headers.userid

        const contact = await ListContact.execute({
            userId: { id: Number(userId) }
        })

        return res.send(contact)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

contactRouter.delete('/delete/:id', async (req: Request, res: Response) => {
    try {
        const contactParams = req.params
        const userId = req.headers.userid

        const contact = await DeleteContact.execute({
            params: { id: Number(contactParams.id) },
            userId: { id: Number(userId) }
        })
        return res.send(contact)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

contactRouter.delete('/deleteMany', async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid

        const contact = await DeleteManyContact.execute({
            userId: { id: Number(userId) }
        })
        return res.send(contact)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

contactRouter.post('/import', multerConfig.single('file'), async (req, res) => {
    try {
        const fileData = req.file
        const userId = req.headers.userid
        const typeModel = req.headers.typemodel

        if (!typeModel) return res.status(400).send({ error: 'typeModel is required' })

        const importResponse = await ImportContact.execute({
            file: fileData as Express.Multer.File,
            userId: { id: Number(userId) },
            typeModel: String(typeModel)
        })

        return res.json(importResponse)

    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

contactRouter.put('/update/:id', async (req: Request, res: Response) => {
    try {
        const contactData = req.body
        const contactParams = req.params
        const userId = req.headers.userid

        const contact = await UpdateContact.execute({
            data: contactData,
            userId: { id: Number(userId) },
            params: { id: Number(contactParams.id) }
        })
        return res.send(contact)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

export { contactRouter }