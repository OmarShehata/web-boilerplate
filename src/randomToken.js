import { promisify } from 'util'
import { randomBytes } from 'crypto'

export async function makeRandomToken() {
    const bytes = await promisify(randomBytes)(256)
    return bytes.toString('hex')
}