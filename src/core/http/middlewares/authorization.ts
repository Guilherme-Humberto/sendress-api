import { IGetUserAuthInfoRequest } from '@shared/index'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const secretJWT = String(process.env.SECRET_JWT_FORMAT)

const authMiddleware = (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    const authHeader = req.headers.authorization
    
    if(!authHeader) {
        return res.status(401).send({ error: 'No token provided' })
    }

    const parts = authHeader.split(' ')

    if(parts.length !== 2) {
        return res.status(401).send({ error: 'Token error' })
    }

    const [scheme, token] = parts

    if(!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Token malformatted' })
    }

    jwt.verify(token, secretJWT, (err, decoded) => {
        if(err) return res.status(401).send({ error: 'Token invalid' })

        const request = req as IGetUserAuthInfoRequest

        request.userId = decoded?.id
        return next()
    })
}

export { authMiddleware }