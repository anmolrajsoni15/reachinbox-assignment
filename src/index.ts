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

app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to OAuth Demo</h1>
        <a href="/auth/google">Sign in with Google</a>
    `);
});

app.get('/auth/google', (req, res) => {
    const authUrl = googleOAuth.getAuthorizationUrl();
    res.redirect(authUrl);
});

app.get('/auth/google/callback', async (req, res) => {
    try {
        const code = req.query.code as string;
        const tokens = await googleOAuth.getTokensFromCode(code);
        const userInfo = await googleOAuth.getUserInfo(tokens.access_token);
        

        console.log(tokens.access_token);

        await startEmailProcessing(tokens);

        res.send(`
            <h1>Login Successful!</h1>
            <h2>User Info:</h2>
            <pre>${JSON.stringify(userInfo, null, 2)}</pre>
        `);
    } catch (error) {
        console.log(error);
        res.redirect('/error');
    }
});


const PORT=process.env.PORT ?? 8080
app.listen(PORT,()=>{
    console.log("Server started on port",PORT);
});