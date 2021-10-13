import AWS from 'aws-sdk'
import awsConfig from '@config/aws-sqs'

AWS.config.update({ 
    accessKeyId: awsConfig.access_key, 
    secretAccessKey: awsConfig.secret_key, 
    region: awsConfig.region 
});

const queueService = new AWS.SQS();
export { queueService }