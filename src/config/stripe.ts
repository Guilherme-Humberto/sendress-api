interface StripeConfig {
    public_key: string;
    secret_key: string;
}
  
export default {
    public_key: process.env.STRIPE_PUBLIC_KEY,
    secret_key: process.env.STRIPE_SECRET_KEY
} as StripeConfig;