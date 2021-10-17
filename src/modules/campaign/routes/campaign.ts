
// TODO: Criar campanha [x]
// TODO: Atualizar campanha [x]
// TODO: Listar todos as campanha [x]
// TODO: Deletar campanha [x]

import express, { Request, Response } from 'express'
import { CampaignOutPut } from 'shared'
import CreateCampaign from '../services/CreateCampaign'
import ListCampaign from '../services/ListCampaign'
import DeleteCampaign from '../services/DeleteCampaign'
import UpdateCampaign from '../services/UpdateCampaign'
import DeleteManyCampaigns from '../services/DeleteManyCampaigns'
import SendCampaigns from '../services/SendCampaigns'
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
        return res.json({ error: message, status: false })
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
        return res.json({ error: message, status: false })
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
        return res.json({ error: message, status: false })
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
        return res.json({ error: message, status: false })
    }
})

campaignRouter.delete('/deleteMany', async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid

        const lead = await DeleteManyCampaigns.execute({
            userId: { id: Number(userId) }
        })
        return res.send(lead)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

// Get campaign id
campaignRouter.post('/send', async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid
        const campaignid = req.headers.campaignid
        const senderid = req.headers.senderid

        const lead = await SendCampaigns.execute({
            userId: { id: Number(userId) },
            campaignId: { id: Number(campaignid) },
            senderId: { id: Number(senderid) }
        })
        return res.send(lead)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

export { campaignRouter }