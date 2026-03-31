export const cookies = {
    getOptions: () => {
        return {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000 // 1 hour
        };
    },

    set: (res, options, name, value) => {
        res.cookie(name, value, {...cookies.getOptions(), ...options});
    },

    clear: (res, options, name) => {
        res.clearCookie(name, {...cookies.getOptions(), ...options});
    },

    get: (req, name) => {
        return req.cookies[name];
    }

}