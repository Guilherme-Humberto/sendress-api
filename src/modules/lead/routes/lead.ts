
// TODO: Criar lead [x]
// TODO: Atualizar lead [x]
// TODO: Listar todos os lead [x] 
// TODO: Deletar leads em massa [x] 
// TODO: Deletar lead [x] 
// TODO: Importar leads [x] 

import express, { Request, Response } from 'express'
import multer from 'multer'
import CreateLead from '../services/CreateLead'
import ListLead from '../services/ListLead'
import DeleteLead from '../services/DeleteLead'
import DeleteManyLead from '../services/DeleteManyLead'
import ImportLead from '../services/ImportLead'
import UpdateLead from '../services/UpdateLead'
import { authMiddleware } from '@core/http/middlewares/authorization'

const leadRouter = express.Router()
const multerConfig = multer()

leadRouter.use(authMiddleware)

leadRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const leadData = req.body
        const userId = req.headers.userid
        // const typeModel = req.headers.typemodel

        // if (!typeModel) return res.status(400).send({ error: 'typeModel is required' })

        const lead = await CreateLead.execute({
            data: leadData,
            userId: { id: Number(userId) }
        })
        return res.send(lead)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

leadRouter.get('/listAll', async (req, res: Response) => {
    try {
        const userId = req.headers.userid

        const lead = await ListLead.execute({
            userId: { id: Number(userId) }
        })

        return res.send(lead)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

leadRouter.delete('/delete/:id', async (req: Request, res: Response) => {
    try {
        const leadParams = req.params
        const userId = req.headers.userid

        const lead = await DeleteLead.execute({
            params: { id: Number(leadParams.id) },
            userId: { id: Number(userId) }
        })
        return res.send(lead)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

leadRouter.delete('/deleteMany', async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid

        const lead = await DeleteManyLead.execute({
            userId: { id: Number(userId) }
        })
        return res.send(lead)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

leadRouter.post('/import', multerConfig.single('file'), async (req, res) => {
    try {
        const fileData = req.file
        const userId = req.headers.userid
        const typeModel = req.headers.typemodel

        if (!typeModel) return res.status(400).send({ error: 'typeModel is required' })

        const importResponse = await ImportLead.execute({
            file: fileData as Express.Multer.File,
            userId: { id: Number(userId) },
            typeModel: String(typeModel)
        })

        return res.json(importResponse)

    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

leadRouter.put('/update/:id', async (req: Request, res: Response) => {
    try {
        const leadData = req.body
        const leadParams = req.params
        const userId = req.headers.userid

        const lead = await UpdateLead.execute({
            data: leadData,
            userId: { id: Number(userId) },
            params: { id: Number(leadParams.id) }
        })
        return res.send(lead)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

export { leadRouter }