import { Request } from "express"
import { Prisma } from "@prisma/client"
import { SQS } from 'aws-sdk'

export interface CampaignOutPut extends Prisma.CampaignGroupByOutputType { }
export interface SenderOutPut extends Prisma.SenderGroupByOutputType { }
export interface UserProps extends Prisma.UserCreateInput { }
export interface UserPropsOutputType extends Prisma.UserGroupByOutputType { }
export interface SegmentProps extends Prisma.SegmentCreateManyInput { }
export interface LeadCreateInput extends Prisma.LeadCreateInput { }
export interface LeadCreateManyInput extends Prisma.LeadCreateManyInput { }

export interface LeadOutPut {
    name: string;
    email: string;
    phone: string;
    business: string;
    segmentId: string | number;
}

export interface IGetUserAuthInfoRequest extends Request {
  userId: string
}

export interface SendMessagesProps { params: SQS.SendMessageBatchRequest }
export interface PurgeQueueProps { params: SQS.PurgeQueueRequest }
export interface ReceiveMessageProps { params: SQS.ReceiveMessageRequest }
export interface DeleteMessagesProps { params: SQS.DeleteMessageRequest }
export interface DeleteMessagesProps { params: SQS.DeleteMessageRequest }