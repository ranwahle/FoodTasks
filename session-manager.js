export function createToken() {
    const rand = function() {
        return Math.random().toString(36).substr(2); // remove `0.`
    };

    const token = function() {
        return rand() + rand(); // to make it longer
    };

    return token();
}

const sessions = {};

export const timeout = +process.env.sessionTimeout || 10000000;

export function getSessionByToken(token) {
    const session = sessions[token];
    if (session) {
        if (Date.now() > session.lastAccessed + timeout) {
            delete session[token];
            return null;
        }
        session.lastAccessed = Date.now();
    }
    return session || null;
}

export function createSession() {

    let newToken = createToken();
    while(sessions[newToken]) {
        newToken = createToken();
    }

    const newSession = {token: newToken, lastAccessed: Date.now()};


    sessions[newSession.token] = newSession;

    return newSession;
}

export const sessionMiddleware = (req, res, next) => {

    const sessionCookie = 'SESSION_COOKIE';
    const token = req.cookies[sessionCookie];

    let currentSession = getSessionByToken(token);

    if (!currentSession ) {
        const newSession = createSession();
        res.cookie(sessionCookie, newSession.token, {maxAge: timeout, httpOnly: true})
        currentSession = newSession;

    }
    req.session = currentSession;

    next();
}

