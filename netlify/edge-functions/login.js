const COOKIE_NAME = "criatura_auth";

const LOGIN_HTML = (error = false) => `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Criatura</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;1,400&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      min-height: 100vh;
      background: #2C2820;
      color: #D8D0BE;
      font-family: 'EB Garamond', Georgia, serif;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      padding: 2rem;
      width: 100%;
      max-width: 360px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .title {
      font-size: 48px;
      font-weight: 400;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: #D8D0BE;
      margin-bottom: 2.5rem;
    }
    form {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      width: 100%;
    }
    input[type="password"] {
      width: 100%;
      background: transparent;
      border: 1px solid #8888A0;
      color: #D8D0BE;
      font-family: 'EB Garamond', Georgia, serif;
      font-size: 18px;
      padding: 0.75rem 1.25rem;
      text-align: center;
      outline: none;
      letter-spacing: 0.15em;
      transition: border-color 0.2s;
    }
    input[type="password"]::placeholder {
      color: #5A4E3E;
      letter-spacing: 0.15em;
    }
    input[type="password"]:focus {
      border-color: #C07840;
    }
    button {
      background: none;
      border: none;
      color: #C07840;
      font-family: 'EB Garamond', Georgia, serif;
      font-size: 15px;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      cursor: pointer;
      padding: 0.5rem 1rem;
      transition: opacity 0.2s;
    }
    button:hover { opacity: 0.7; }
    .error {
      font-style: italic;
      font-size: 15px;
      color: #884420;
      letter-spacing: 0.08em;
      min-height: 1.5rem;
    }
    .footer {
      font-style: italic;
      font-size: 13px;
      letter-spacing: 0.2em;
      color: #445088;
      margin-top: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <p class="title">Criatura</p>
    <form method="POST" action="/login">
      <input type="password" name="password" placeholder="palavra-passe" autofocus autocomplete="current-password">
      <p class="error">${error ? "palavra-passe incorrecta" : ""}</p>
      <button type="submit">Entrar</button>
    </form>
    <p class="footer">site em construção</p>
  </div>
</body>
</html>`;

export default async function handler(req, context) {
  const password = Deno.env.get("SITE_PASSWORD");
  const url = new URL(req.url);

  // Serve login page (GET)
  if (url.pathname === "/login" && req.method === "GET") {
    return new Response(LOGIN_HTML(false), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  // Handle login form (POST)
  if (url.pathname === "/login" && req.method === "POST") {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const provided = params.get("password");

    if (provided === password) {
      return new Response(null, {
        status: 302,
        headers: {
          location: "/",
          "set-cookie": `${COOKIE_NAME}=1; Path=/; HttpOnly; SameSite=Lax`,
        },
      });
    }

    return new Response(LOGIN_HTML(true), {
      status: 401,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  // Check auth cookie on all other requests
  const cookie = req.headers.get("cookie") || "";
  if (cookie.includes(`${COOKIE_NAME}=1`)) {
    return context.next();
  }

  // Redirect to login
  return new Response(null, {
    status: 302,
    headers: { location: "/login" },
  });
}
