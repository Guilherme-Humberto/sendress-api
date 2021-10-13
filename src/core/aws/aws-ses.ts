import AWS from 'aws-sdk'
import awsConfig from '@config/aws-ses'

AWS.config.update({ 
    accessKeyId: awsConfig.access_key, 
    secretAccessKey: awsConfig.secret_key, 
    region: awsConfig.region 
});

const mailService = new AWS.SES({ apiVersion: '2010-12-01' });
export { mailService }