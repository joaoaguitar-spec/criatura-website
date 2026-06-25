export default async function handler(req, context) {
  const password = Deno.env.get("SITE_PASSWORD");

  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    const encoded = authHeader.replace("Basic ", "");
    const decoded = atob(encoded);
    const [, providedPassword] = decoded.split(":");

    if (providedPassword === password) {
      return context.next();
    }
  }

  return new Response("Unauthorized", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="CRIATURA"',
    },
  });
}
