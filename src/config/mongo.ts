interface MongoConfig {
    url: string;
}
  
export default {
    url: process.env.DATABASE_URL
} as MongoConfig;