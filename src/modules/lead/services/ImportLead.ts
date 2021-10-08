import { Readable } from 'stream'
import readline from 'readline'
import { prisma } from "config/prisma"
import { LeadOutPut } from "shared"
import { validateLead } from '../validations/lead'
import { validationCsvFile } from '../validations/validateCSV'

interface Props { file: Express.Multer.File; userId: { id: number }; typeModel: string }

const handleSaveLeads = async (lead: LeadOutPut, listId: number, userId: number) => (
    await prisma.lead.create({ data: { ...lead, segmentId: listId, userId } })
)

const handleSaveSegment = async (list: string, userId: number) => (
    await prisma.segment.create({ data: { title: list, userId } })
)
const handleSegmentCheck = async (list: string) => (
    await prisma.segment.findUnique({
        where: { title: list }
    })
)

const handleLeadsAlredyExists = async (leads: any[], userId: number) => {
    const leadsAlredyRegistered: LeadOutPut[] = []

    const registerLeads = leads.map(async (lead: LeadOutPut) => {
        const checkIsValidLead = validateLead(lead)

        const leadFounds = await prisma.lead.findUnique({
            where: { email: lead.email }
        })

        if (leadFounds) {
            return leadsAlredyRegistered.push(leadFounds as unknown as LeadOutPut)
        }

        const segmentExists = await handleSegmentCheck(String(lead.segmentId).length <= 0 ? 'Default' : String(lead.segmentId))

        if (!segmentExists) {
            const segmentSave = await handleSaveSegment(String(lead.segmentId), userId)
            if (checkIsValidLead.status) {
                return await handleSaveLeads(lead, Number(segmentSave.id), userId);
            }
        }

        if (checkIsValidLead.status) {
            return await handleSaveLeads(lead, Number(segmentExists?.id), userId);
        }

        return checkIsValidLead
    })
    return {
        registerLeadsResponse: await Promise.all(registerLeads),
        leadsExists: leadsAlredyRegistered
    }
}

class ImportLead {
    async execute({ file, userId, typeModel }: Props) {
        const isValidFile = validationCsvFile(file as Express.Multer.File)

        if (isValidFile.ok && typeModel === 'cold-emails') {
            const readableFile = new Readable()
            readableFile.push(file?.buffer)
            readableFile.push(null)

            const leadsLine = readline.createInterface({
                input: readableFile
            })

            let leadsArr = [], formatLeadsArr: LeadOutPut[] = []

            for await (let line of leadsLine) {
                const leadsLineSplit = line.split(',');
                leadsArr.push({
                    name: leadsLineSplit[0],
                    email: leadsLineSplit[1],
                    phone: leadsLineSplit[2],
                    business: leadsLineSplit[3],
                    segmentId: String(leadsLineSplit[4])
                })
            }

            formatLeadsArr = leadsArr.slice(1, leadsArr.length)

            const {
                leadsExists,
                registerLeadsResponse
            } = await handleLeadsAlredyExists(formatLeadsArr, userId.id)

            const compareIfLeadsExists = leadsExists.length >= registerLeadsResponse.length
            const getLeadsBodyOnResponse = registerLeadsResponse
                .filter(lead => typeof lead === 'object')

            return { data: compareIfLeadsExists ? true : getLeadsBodyOnResponse }
        }

        if (isValidFile.ok && typeModel === 'send-email') {
            const readableFile = new Readable()
            readableFile.push(file?.buffer)
            readableFile.push(null)

            const leadsLine = readline.createInterface({
                input: readableFile
            })

            let leadsArr = [], formatLeadsArr: Omit<LeadOutPut, 'name' | 'phone' | 'business'>[] = []

            for await (let line of leadsLine) {
                const leadsLineSplit = line.split(',');
                leadsArr.push({
                    email: leadsLineSplit[0],
                    segmentId: String(leadsLineSplit[1])
                })
            }

            formatLeadsArr = leadsArr.slice(1, leadsArr.length)

            const {
                leadsExists,
                registerLeadsResponse
            } = await handleLeadsAlredyExists(formatLeadsArr, userId.id)

            const compareIfLeadsExists = leadsExists.length >= registerLeadsResponse.length
            const getLeadsBodyOnResponse = registerLeadsResponse
                .filter(lead => typeof lead === 'object')

            return { data: compareIfLeadsExists ? true : getLeadsBodyOnResponse }
        }
    }
}

export default new ImportLead()