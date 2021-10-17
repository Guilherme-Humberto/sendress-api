
// TODO: Criar agenda [x]
// TODO: Atualizar agenda [x]
// TODO: Listar todos as agenda [x]
// TODO: Deletar agenda [x]

import express, { Request, Response } from 'express'
import CreateSchedule from '../services/CreateSchedule'
import ListSchedule from '../services/ListSchedule'
import UpdateSchedule from '../services/UpdateSchedule'
import DeleteSchedule from '../services/DeleteSchedule'
import { authMiddleware } from '@core/http/middlewares/authorization'

const scheduleRouter = express.Router()

scheduleRouter.use(authMiddleware)

scheduleRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const scheduleData = req.body
        const userId = req.headers.userid

        const schedule = await CreateSchedule.execute({
            data: scheduleData,
            userId: { id: Number(userId) }
        })

        return res.send(schedule)

    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

scheduleRouter.get('/listAll', async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid

        const schedule = await ListSchedule.execute({
            userId: { id: Number(userId) }
        })

        return res.send(schedule)

    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

scheduleRouter.put('/update/:id', async (req: Request, res: Response) => {
    try {
        const scheduleData = req.body
        const userId = req.headers.userid
        const scheduleId = req.headers.scheduleid

        const schedule = await UpdateSchedule.execute({
            data: scheduleData,
            userId: { id: Number(userId) },
            scheduleId: { id: Number(scheduleId) }
        })

        return res.send(schedule)

    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

scheduleRouter.delete('/delete/:id', async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid
        const scheduleId = req.headers.scheduleid

        const schedule = await DeleteSchedule.execute({
            userId: { id: Number(userId) },
            scheduleId: { id: Number(scheduleId) }
        })

        return res.send(schedule)

    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})