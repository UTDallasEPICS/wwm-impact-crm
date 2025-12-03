import { defineEventHandler, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  setResponseStatus(event, 405)
  return { error: 'Method Not Allowed' }
})
