
// TODO: create segment [x]
// TODO: update segment [x]
// TODO: listAll segment [x] 
// TODO: deleteMany segment [x] 
// TODO: delete by id segment [x]

import express, { Response } from 'express'
import CreateSegment from '../services/CreateSegment'
import ListSegment from '../services/ListSegment'
import DeleteSegment from '../services/DeleteSegment'
import DeleteSegmentMany from '../services/DeleteSegmentMany'
import UpdateSegment from '../services/UpdateSegment'
import { authMiddleware } from '@core/http/middlewares/authorization'

const segmentRouter = express.Router()

segmentRouter.use(authMiddleware)

segmentRouter.post('/create', async (req, res: Response) => {
    try {
        const segmentData = req.body
        const userId = req.headers.userid

        const segment = await CreateSegment.execute({
            data: segmentData,
            userId: { id: Number(userId) }
        })
        return res.send(segment)

    } catch ({ message }) {
        return res.status(400).send({ message })
    }
})

segmentRouter.get('/listAll', async (req, res: Response) => {
    try {
        const userId = req.headers.userid

        const segment = await ListSegment.execute({
            userId: { id: Number(userId) }
        })
        return res.send(segment)
    } catch ({ message }) {
        return res.send({ error: message })
    }
})

segmentRouter.delete('/delete/:id', async (req, res: Response) => {
    try {
        const segmentId = req.params.id
        const userId = req.headers.userid

        const segment = await DeleteSegment.execute({
            params: { id: Number(segmentId) },
            userId: { id: Number(userId) }
        })
        return res.send(segment)
    } catch ({ message }) {
        return res.status(400).send({ message })
    }
})

segmentRouter.delete('/deleteMany', async (req, res: Response) => {
    try {
        const userId = req.headers.userid

        const segment = await DeleteSegmentMany.execute({
            userId: { id: Number(userId) }
        })
        return res.send(segment)
    } catch ({ message }) {
        return res.status(400).send({ message })
    }
})

segmentRouter.put('/update/:id', async (req, res: Response) => {
    try {
        const segmentData = req.body
        const segmentId = req.params.id
        const userId = req.headers.userid

        const segment = await UpdateSegment.execute({
            data: segmentData,
            userId: { id: Number(userId) },
            params: { id: Number(segmentId) },
        })
        return res.send(segment)
    } catch ({ message }) {
        return res.status(400).send({ message })
    }
})

export { segmentRouter }