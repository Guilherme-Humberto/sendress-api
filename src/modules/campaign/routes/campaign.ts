import express, { Request, Response } from 'express'
import { CampaignOutPut } from 'shared'
import CreateCampaign from '../services/CreateCampaign'
import ListCampaign from '../services/ListCampaign'
import DeleteCampaign from '../services/DeleteCampaign'
import UpdateCampaign from '../services/UpdateCampaign'
import { authMiddleware } from '@core/http/middlewares/authorization'

const campaignRouter = express.Router()

campaignRouter.use(authMiddleware)

campaignRouter.post('/create', async (req: Request, res: Response) => {
    try {
        const campaignData: CampaignOutPut = req.body
        const userId = req.headers.userid

        const campaign = await CreateCampaign.execute({
            data: campaignData,
            userId: { id: Number(userId) }
        })
        return res.send(campaign)

    } catch ({ message }) {
        return res.status(400).send({ message })
    }
})

campaignRouter.get('/listAll', async (req, res: Response) => {
    try {
        const userId = req.headers.userid

        const campaign = await ListCampaign.execute({
            userId: { id: Number(userId) }
        })
        return res.send(campaign)

    } catch ({ message }) {
        return res.status(400).send({ message })
    }
})

campaignRouter.delete('/delete/:id', async (req: Request, res: Response) => {
    try {
        const campaignParams = req.params.id
        const userId = req.headers.userid

        const campaign = await DeleteCampaign.execute({
            params: { id: Number(campaignParams) },
            userId: { id: Number(userId) }
        })
        return res.send(campaign)

    } catch ({ message }) {
        return res.status(400).send({ message })
    }
})

campaignRouter.put('/update/:id', async (req: Request, res: Response) => {
    try {
        const campaignBody = req.body
        const campaignParams = req.params
        const userId = req.headers.userid

        const campaign = await UpdateCampaign.execute({
            data: campaignBody,
            userId: { id: Number(userId) },
            params: { id: Number(campaignParams.id) }
        })
        return res.send(campaign)

    } catch ({ message }) {
        return res.status(400).send({ message })
    }
})

export { campaignRouter }