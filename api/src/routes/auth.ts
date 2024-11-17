import express from 'express';
const router = express.Router();
import { randomBytes } from 'node:crypto';

// Create state store
const states = new Set();

const providers = {
    discord: {
        scope: 'openid email identify'
    },
    authentik: {
        scope: 'openid email profile'
    }
};

// Example auth endpoint
router.post('/login', (req, res) => {
  // Logic for user login
  res.send("User logged in");
});

router.post('/register', (req, res) => {
  // TODO: Logic for user registration
  res.send("User registered");
});


router.get('/oidc/:provider', async (req, res) => {
    const provider = req.params.provider;

    // TODO: Validate the provider
    if (!provider || !Object.keys(providers).includes(provider)) {
        res.status(400).send({'error': 'invalid_provider', 'message': 'provider is not supported'})
    }
    
    // Generate a random state
    const state = randomBytes(32).toString('base64url'); //TODO: GENERATE CRYPTOGRAPHIC NONCE
    
    // Prepare the parameters for the authorization request
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: Deno.env.get(`${provider.toUpperCase()}_CLIENT_ID`) as string,
        redirect_uri: `${Deno.env.get("AUTH_URL")}/api/auth/oidc/callback/${provider}`,
        scope: providers[provider as keyof typeof providers].scope,
        state: state,
        prompt: 'consent',
        include_granted_scopes: 'true',
    });

    // Construct the full authorization URL
    const authorizationUrl = Deno.env.get(`${provider.toUpperCase()}_AUTHORIZE_URL`) + `?${params.toString()}`;

    // TODO: Store the state in the session or a secure store for validation later (not shown here)
    states.add(state);

    // Redirect the user to the authorization endpoint
    res.redirect(authorizationUrl);
})

router.get('/oidc/callback/:provider', async (req, res) => {
    const { code, state } = req.query;
    // TODO: Validate the input contains state and code

    const provider = req.params.provider;

    // TODO: Validate the provider
    if (!provider || !Object.keys(providers).includes(provider)) {
        res.status(400).send({'error': 'invalid_provider', 'message': 'provider is not supported'})
    }

    // TODO: Validate the state
    // if (states.has(state)) {
    //     states.delete(state); // Remove state after validation
    // } else {
    //     //console.log(req);
    //     console.log(states);
    //     console.log(state);
    //     res.status(400).send({'error': 'invalid_request', 'message': 'The request is missing a required parameter, includes an invalid parameter value, or is otherwise malformed.'});
    // }

    // Prepare the data for the token exchange
    const body = new URLSearchParams({
        code: code as string,
        client_id: Deno.env.get(`${provider.toUpperCase()}_CLIENT_ID`) as string,
        client_secret: Deno.env.get(`${provider.toUpperCase()}_CLIENT_SECRET`) as string,
        redirect_uri: `${Deno.env.get("AUTH_URL")}/api/auth/oidc/callback/${provider}`,
        grant_type: 'authorization_code'
    });

    // TODO: Add error handling on fetch
    const response = await fetch(
        Deno.env.get(`${provider.toUpperCase()}_TOKEN_URL`) as string, {
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body.toString(),
        }
    )

    const data = await response.json();
    
    res.cookie('access_token', data.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: data.expires_in * 1000
    });

    res.cookie('id_token', data.id_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: data.expires_in * 1000
    });
    res.send(data)

    //res.redirect(`${Deno.env.get("FRONTEND_URL")}/forge`)
    //res.redirect('/forge')
})

export default router;