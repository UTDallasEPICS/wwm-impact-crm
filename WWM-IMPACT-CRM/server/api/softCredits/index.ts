import { defineEventHandler, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
	// Method-specific handlers exist in index.get.ts and index.post.ts
	// This catch-all responds for unsupported methods to keep behavior clear.
	setResponseStatus(event, 405)
	return { error: 'Method Not Allowed' }
})

