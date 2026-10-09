type RouteHandler = (request: Request) => Promise<Response>;

const allowedOrigin = "http://localhost:3001"; // TODO replace with the origin

const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Expose-Headers": "Content-Length",
  Vary: "Origin",
};

/**
 * Add CORS headers to the responses of the given Route Handler.
 * @param handler - Route Handler
 * @returns Route Handler which returns the responses with CORS headers
 */
export const withCors = (handler: RouteHandler): RouteHandler => async (request) => {
  const response = await handler(request);
  const headers = new Headers(response.headers);

  for (const [ name, value ] of Object.entries(corsHeaders)) {
    headers.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

/**
 * Route Handler for the CORS preflight requests.
 * @returns Response for the preflight request
 */
export const preflight = async (): Promise<Response> => new Response(null, {
  status: 204,
  headers: {
    ...corsHeaders,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Max-Age": "600",
  },
});
