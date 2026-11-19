import { requireAdmin } from '../../utils/adminSession'
import { folderForTarget, isUploadTarget, savePublicUpload } from '../../utils/adminUpload'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const form = await readMultipartFormData(event)
  if (!form?.length) {
    throw createError({ statusCode: 400, statusMessage: 'Expected multipart form data' })
  }

  const filePart = form.find((part) => part.name === 'file' && part.data?.length)
  if (!filePart?.filename || !filePart.data) {
    throw createError({ statusCode: 400, statusMessage: 'Missing file' })
  }

  const targetRaw = form.find((part) => part.name === 'target')?.data?.toString('utf8') || 'covers'
  const group = form.find((part) => part.name === 'group')?.data?.toString('utf8')

  if (!isUploadTarget(targetRaw)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid upload target' })
  }

  const folder = folderForTarget(targetRaw, group)
  return savePublicUpload({
    folder,
    fileName: filePart.filename,
    data: new Uint8Array(filePart.data),
    target: targetRaw,
    group,
    event,
  })
})
