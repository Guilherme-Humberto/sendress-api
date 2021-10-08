import express from 'express';

import { segmentRouter } from '@modules/segment/routes/segment'
import { leadRouter } from '@modules/lead/routes/lead'
import { campaignRouter } from '@modules/campaign/routes/campaign'
import { senderRouter } from '@modules/sender/routes/sender'
import { userRouter } from '@modules/user/routes/user'
import { templateRouter } from '@modules/templates/routes/templates';

const v1Routes = express.Router()

v1Routes.use('/campaign', campaignRouter)
v1Routes.use('/lead', leadRouter)
v1Routes.use('/sender', senderRouter)
v1Routes.use('/segment', segmentRouter)
v1Routes.use('/user', userRouter)
v1Routes.use('/templates', templateRouter)

export default v1Routes