import "dotenv/config";
import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { games } from "../db/schema";
import {randomBytes} from "crypto";

const router = express.Router();

const providerConfigs = {
    discord: {
        authorize_url: new URL('https://discord.com/oauth2/authorize'),
        token_url: new URL('https://discord.com/api/oauth2/token'),
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        redirect_uri: process.env.AUTH_URL + '/oidc/callback/discord',
        scope: 'email openid identify',
    },
};

function generateState() {
    return randomBytes(32).toString('base64url');
}

function buildAuthorizationUrl(provider, state) {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: provider.client_id,
        redirect_uri: provider.redirect_uri,
        scope: provider.scope,
        state: state,
        prompt: 'consent',
    });
    return `${provider.authorize_url}?${params.toString()}`;
}

async function exchangeToken(provider, code) {
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: provider.client_id,
        client_secret: provider.client_secret,
        redirect_uri: provider.redirect_uri,
        code: code
    });
    const res = await fetch(provider.token_url, {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res;
}

async function setCookies(res, tokens) {
    res.cookie(
        'access_token', 
        tokens.access_token, 
        {
            httpOnly: true,
            maxAge: tokens.expires_in * 1000,
            secure: false, // TODO set to true in prod
            sameSite: 'Lax' 
        }
    )
    res.cookie(
        'id_token', 
        tokens.id_token, 
        {
            httpOnly: true, 
            maxAge: tokens.expires_in * 1000,
            secure: false, // TODO set to true in prod
            sameSite: 'Lax' 
        }
    )
}

router.get("/oidc/discord", async (req, res) => {
    const state = generateState();
    const provider = providerConfigs['discord'];
    // TODO: Store state (e.g., in a session or database)
    const redirectURL = buildAuthorizationUrl(provider, state);
    res.redirect(redirectURL);
})

// Route for handling the OAuth callback
router.get("/oidc/callback/:provider", async (req, res) => {
    const { code, state } = req.query;

    // Ensure code and state are present
    if (!code || !state) {
        res.status(400).send(); // TODO: Error message
        return
    }

    const validState = true // TODO: check if state is inside of store
    if(!validState) {
        res.status(401).send(); // TODO: Error message
    }
    // TODO: Delete state from store

    
    // Token exchange
    const provider = providerConfigs['discord'];
    const tokenResponse = await exchangeToken(provider, code);
    if (!tokenResponse.ok) {
        // TODO: Handle error based on the response status
        const error = await tokenResponse.json();
        res.status(tokenResponse.status).send(error);
        return
    }

    const data = await tokenResponse.json();
    setCookies(res, data)
    res.send(data);
});

export default router;