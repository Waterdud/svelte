import * as api from 'api.js';

export async function post(req, res) {
    try {
        const user = req.body;

        const response = await api.post('users/register', user);

        if (!response.errors && response.user) {
            if (!req.session) req.session = {};
            req.session.user = response.user;
        }

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(500);
        res.end(JSON.stringify({ errors: { server: [error.message] } }));
    }
}