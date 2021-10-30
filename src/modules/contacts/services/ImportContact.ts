import { Readable } from 'stream'
import readline from 'readline'
import { prisma } from "config/prisma"
import { ContactOutPut } from "shared"
import { validateContact } from '../validations/contact'
import { validationCsvFile } from '../validations/validateCSV'

interface Props { file: Express.Multer.File; userId: { id: number }; typeModel: string }

const handleSaveContacts = async (contact: ContactOutPut, listId: number, userId: number) => (
    await prisma.contact.create({ data: { ...contact, segmentId: listId, userId } })
)

const handleSaveSegment = async (list: string, userId: number) => (
    await prisma.segment.create({ data: { title: list, userId } })
)
const handleSegmentCheck = async (list: string) => (
    await prisma.segment.findUnique({
        where: { title: list }
    })
)

const handleContactsAlredyExists = async (contacts: any[], userId: number) => {
    const contactsAlredyRegistered: ContactOutPut[] = []

    const registerContacts = contacts.map(async (contact: ContactOutPut) => {
        const checkIsValidContact = validateContact(contact)

        const contactFounds = await prisma.contact.findUnique({
            where: { email: contact.email }
        })

        if (contactFounds) {
            return contactsAlredyRegistered.push(contactFounds as unknown as ContactOutPut)
        }

        const segmentExists = await handleSegmentCheck(String(contact.segmentId).length <= 0 ? 'Default' : String(contact.segmentId))

        if (!segmentExists) {
            const segmentSave = await handleSaveSegment(String(contact.segmentId), userId)
            if (checkIsValidContact.status) {
                return await handleSaveContacts(contact, Number(segmentSave.id), userId);
            }
        }

        if (checkIsValidContact.status) {
            return await handleSaveContacts(contact, Number(segmentExists?.id), userId);
        }

        return checkIsValidContact
    })
    return {
        registerContactsResponse: await Promise.all(registerContacts),
        contactsExists: contactsAlredyRegistered
    }
}

class ImportContact {
    async execute({ file, userId, typeModel }: Props) {
        const user = await prisma.user.findUnique({
            where: { id: userId.id }
        })

        if (!user) throw new Error("User not found");

        if (!user?.verified && user?.status === 'DISABLED')
            throw new Error("User without permission")

        const isValidFile = validationCsvFile(file as Express.Multer.File)

        if (isValidFile.ok && typeModel === 'cold-emails') {
            const readableFile = new Readable()
            readableFile.push(file?.buffer)
            readableFile.push(null)

            const contactsLine = readline.createInterface({
                input: readableFile
            })

            let contactsArr = [], formatContactsArr: ContactOutPut[] = []

            for await (let line of contactsLine) {
                const contactsLineSplit = line.split(',');
                contactsArr.push({
                    name: contactsLineSplit[0],
                    email: contactsLineSplit[1],
                    phone: contactsLineSplit[2],
                    business: contactsLineSplit[3],
                    segmentId: String(contactsLineSplit[4])
                })
            }

            formatContactsArr = contactsArr.slice(1, contactsArr.length)

            const {
                contactsExists,
                registerContactsResponse
            } = await handleContactsAlredyExists(formatContactsArr, userId.id)

            const compareIfContactsExists = contactsExists.length >= registerContactsResponse.length
            const getContactsBodyOnResponse = registerContactsResponse
                .filter(contact => typeof contact === 'object')

            return { data: compareIfContactsExists ? true : getContactsBodyOnResponse }
        }

        if (isValidFile.ok && typeModel === 'send-email') {
            const readableFile = new Readable()
            readableFile.push(file?.buffer)
            readableFile.push(null)

            const contactsLine = readline.createInterface({
                input: readableFile
            })

            let contactsArr = [], formatContactsArr: Omit<ContactOutPut, 'name' | 'phone' | 'business'>[] = []

            for await (let line of contactsLine) {
                const contactsLineSplit = line.split(',');
                contactsArr.push({
                    email: contactsLineSplit[0],
                    segmentId: String(contactsLineSplit[1])
                })
            }

            formatContactsArr = contactsArr.slice(1, contactsArr.length)

            const {
                contactsExists,
                registerContactsResponse
            } = await handleContactsAlredyExists(formatContactsArr, userId.id)

            const compareIfContactsExists = contactsExists.length >= registerContactsResponse.length
            const getContactsBodyOnResponse = registerContactsResponse
                .filter(contact => typeof contact === 'object')

            return { data: compareIfContactsExists ? true : getContactsBodyOnResponse }
        }
    }
}

export default new ImportContact()