
// TODO: criar usuário e assinatura [x]
// TODO: atualizar usuário [x]
// TODO: deletar usuário / cancelar assinatura [x] 
// TODO: autenticação de usuários [x] 
// TODO: confirmação de cadastro do usuário [x]
// TODO: trocar senha do usuário [x]

import express, { Request, Response } from 'express'
import SubscriptionUser from '../services/SubscriptionUser'
import CreateSubscription from '../services/CreateSubscription'
import Authentication from '../services/Authentication'
import ConfirmPayment from '../services/ConfirmPayment'
import RetrieveSubscription from '../services/RetrieveSubscription'
import BillingSession from '../services/BillingSession'
import { authMiddleware } from '@core/http/middlewares/authorization'
import UpdateUser from '../services/UpdateUser'
import ForgotPassword from '../services/ForgotPassword'
import { checkSubscriptionSituation } from 'cron/jobs'

const userRouter = express.Router()

// Cadastro do usuário / envio de email para confirmação
userRouter.post('/register', async (req: Request, res: Response) => {
    try {
        const product = req.headers.product

        const user = await SubscriptionUser.execute({
            userData: req.body,
            productId: String(product)
        })

        return res.json(user)
    } catch ({ message }) {
        return res.json({ message })
    }
})

// Atualizar cadastro do usuário
userRouter.put('/update', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid
        const userData = req.body

        const user = await UpdateUser.execute({
            data: { id: Number(userId), userData }
        })

        return res.json(user)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

// Criação da assinatura do usuário
userRouter.get('/subscription', async (req: Request, res: Response) => {
    try {
        const { product, email, confirmation_token } = req.query

        const session = await CreateSubscription.execute({
            data: { email: String(email) },
            productId: String(product),
            confirmation_token: String(confirmation_token)
        })
        
        return res.redirect(`http://localhost:3000/confirm?sessionId=${session.id}`)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

// Autenticação do usuário
userRouter.post('/login', async (req: Request, res: Response) => {
    try {
        const userData = req.body

        const user = await Authentication.execute({
            data: userData,
        })
        return res.send(user)
    } catch ({ message }) {
        return res.send({ message })
    }
})

// Confirmação do cadastrato do usuário
userRouter.get('/confirm', async (req: Request, res: Response) => {
    try {
        const customerEmail = req.query.customer as string
        const sessionId = req.query.session_id as string

        await ConfirmPayment.execute({
            data: { email: customerEmail }, sessionId
        })
        return res.redirect(`${process.env.APP_URL}?withLogin=true`)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

// Retrieve user subscription
userRouter.get('/get_subscription', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid
        const customerId = req.headers.customerId as string

        const subscription = await RetrieveSubscription.execute({
            data: { id: Number(userId), customerId }
        })

        return res.json(subscription)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

// Portal de gerenciamento da assinatura do usuário
userRouter.post('/billing_session', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.headers.userid
        const customerId = req.headers.customerid as string

        const { url: portalSessionUrl } = await BillingSession.execute({
            data: { id: Number(userId), customerId }
        })

        return res.json({ portalSessionUrl })
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

// Resetar senha do usuário
userRouter.post('/forgot_password', async (req: Request, res: Response) => {
    try {
        const data = req.body

        const user = await ForgotPassword.execute({ data })

        return res.json({ user })
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

userRouter.get('/test', async (req: Request, res: Response) => {
    try {
        const users = checkSubscriptionSituation()
        return res.send(users)
    } catch ({ message }) {
        return res.json({ error: message, status: false })
    }
})

export { userRouter }