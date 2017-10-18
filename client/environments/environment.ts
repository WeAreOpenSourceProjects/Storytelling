// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The users-list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
    production: false,
    backend: {
        protocol: 'http',
        host: '127.0.0.1',
        port: '3000',
        endpoints: {
            signup: '/api/auth/signup',
            signin: '/api/auth/signin',
            forgotPassword : '/api/auth/forgot',
            resetPassword : '/api/auth/reset',
            articles : '/api/articles',
            users : '/api/users',
            slides: '/api/slides',
            slidesFix: '/api/slidesFix',
            images: '/api/images',
            imagesServer : '/api/imagesServer',
            search : '/api/search/slides',
            banner : '/api/banner'
        }
    }
};
