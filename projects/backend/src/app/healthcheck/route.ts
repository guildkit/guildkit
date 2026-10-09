/**
 * Health check
 * @tag healthcheck
 * @response 200
 * @responseDescription The server is running
 */
export const GET = async (): Promise<Response> => new Response("Active!");
