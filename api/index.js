// Vercel Serverless Function Handler
// Using dynamic import because backend uses ES modules ("type": "module")

let appPromise = null;

async function getApp() {
    if (!appPromise) {
        appPromise = import('../backend/server.js').then(m => m.default);
    }
    return appPromise;
}

export default async function handler(req, res) {
    const app = await getApp();
    return app(req, res);
}
