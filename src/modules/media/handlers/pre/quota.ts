import { Request, ResponseToolkit } from "hapi"

export default async (request: Request, h: ResponseToolkit) => {
	const account = request.auth.credentials.user
	console.log({ account })
	return h.continue
}
