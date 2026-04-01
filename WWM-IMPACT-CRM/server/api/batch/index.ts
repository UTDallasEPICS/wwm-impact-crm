import { defineEventHandler, setResponseStatus } from 'h3'

// Batch operations only support POST; other methods blocked.
export default defineEventHandler((event) => {
  setResponseStatus(event, 405)
  return { error: 'Method Not Allowed' }
})
