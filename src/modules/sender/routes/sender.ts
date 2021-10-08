import { authMiddleware } from '@core/http/middlewares/authorization'
import express, { Request, Response } from 'express'
import CreateSender from '../services/CreateSender'
import ListSender from '../services/ListSender'

const senderRouter = express.Router()

senderRouter.use(authMiddleware)

senderRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const senderData = req.body
        const userId = req.headers.userid

        const sender = await CreateSender.execute({
            data: senderData,
            userId: { id: Number(userId) }
        })
        return res.send(sender)
    } catch ({ message }) {
        return res.status(400).send({ message })
    }
})

senderRouter.get('/listAll', async (req: Request, res: Response) => {
    try {
        const segment = await ListSender.execute()
        return res.send(segment)
    } catch ({ message }) {
        return res.status(400).send({ message })
    }
})

export { senderRouter }