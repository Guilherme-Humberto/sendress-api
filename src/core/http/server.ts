import cluster from 'cluster'
import numCPUS from 'os'
import { app } from './app'
import { logger } from '@config/logger'
const port = process.env.PORT || 3333

if (cluster.isPrimary) {
    for (let i = 0; i < numCPUS.cpus.length; i++) { cluster.fork() }
    cluster.on('exit', () => logger.info(`worker ${process.pid} died`))
} else {
    app.listen(port, () => logger.info(`Server is running on port ${port}\n`))
}