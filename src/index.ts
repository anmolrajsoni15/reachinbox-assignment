import express from "express";
import dotenv from "dotenv";
import { GoogleOAuthService } from "./services/google.oauth.service";
import { startEmailProcessing } from "./worker";

dotenv.config();

const app = express();

const googleOAuth = new GoogleOAuthService(
  process.env.GOOGLE_CLIENT_ID ?? "",
  process.env.GOOGLE_CLIENT_SECRET ?? "",
  process.env.GOOGLE_REDIRECT_URI ?? ""
);

app.get("/", (req, res) => {
  res.send(`
    <html>
        <head>
            <title>ReachInbox Assignment</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background-color: #f0f0f0;
                }
                .container {
                    text-align: center;
                    background: white;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #333;
                }
                a {
                    display: inline-block;
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    color: white;
                    background-color: #4285f4;
                    border-radius: 4px;
                    text-decoration: none;
                }
                a:hover {
                    background-color: #357ae8;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Welcome to ReachInbox Assignment Demo</h1>
                <a href="/auth/google">Sign in with Google</a>
                <a href="/auth/google">Sign in with Outlook</a>
            </div>
        </body>
    </html>
`);
});

app.get("/auth/google", (req, res) => {
  const authUrl = googleOAuth.getAuthorizationUrl();
  res.redirect(authUrl);
});

app.get("/auth/google/callback", async (req, res) => {
  try {
    const code = req.query.code as string;
    const tokens = await googleOAuth.getTokensFromCode(code);
    const userInfo = await googleOAuth.getUserInfo(tokens.access_token);

    console.log(tokens.access_token);

    await startEmailProcessing(tokens);

    res.send(`
            <html>
            <head>
            <title>Login Successful</title>
            <style>
            body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
            }
            .container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            }
            h1 {
            color: #333;
            margin-bottom: 1rem;
            }
            .user-info {
            display: flex;
            flex-direction: column;
            align-items: center;
            }
            .user-info img {
            border-radius: 50%;
            margin-bottom: 1rem;
            width: 100px;
            height: 100px;
            object-fit: cover;
            }
            .user-info h2 {
            margin: 0.5rem 0;
            color: #555;
            }
            .user-info h3 {
            margin: 0.5rem 0;
            color: #777;
            }
            .user-info pre {
            text-align: left;
            background: #f4f4f4;
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
            width: 100%;
            max-width: 400px;
            margin-top: 1rem;
            color: #333;
            }
            .user-info .verified {
            color: green;
            font-weight: bold;
            }
            </style>
            </head>
            <body>
            <div class="container">
            <h1>Login Successful!</h1>
            <div class="user-info">
            <img src="${userInfo?.picture}" alt="User Picture">
            <h2>${userInfo.name}</h2>
            <h3>${userInfo.email} ${
      userInfo.verified_email ? '<span class="verified">(Verified)</span>' : ""
    }</h3>
            <pre>${JSON.stringify(userInfo, null, 2)}</pre>
            </div>
            </div>
            </body>
            </html>
        `);
  } catch (error) {
    console.log(error);
    res.redirect("/error");
  }
});

const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
