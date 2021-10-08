import Stripe from 'stripe'
import stripeConfig from '@config/stripe'

const stripe = () => (
    new Stripe(stripeConfig.secret_key, { apiVersion: '2020-08-27'})
)

export { stripe }