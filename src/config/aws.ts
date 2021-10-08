interface AWSConfig {
    access_key: string;
    secret_key: string;
    region: string
}

export default {
    access_key: process.env.AWS_ACCESS_KEY_ID,
    secret_key: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
} as AWSConfig;