const validationCsvFile = (file: Express.Multer.File) => {
    if (file?.mimetype !== 'text/csv') {
        return { ok: false }
    }
    return { ok: true }
}

export { validationCsvFile }