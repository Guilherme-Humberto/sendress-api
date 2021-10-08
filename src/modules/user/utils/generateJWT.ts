import jwt from 'jsonwebtoken'
const secretJWT = String(process.env.SECRET_JWT_FORMAT)

export const generateJwt = (user: string) => {
    return jwt.sign({ userId: user }, secretJWT, {
        expiresIn: '1d'
    })
}