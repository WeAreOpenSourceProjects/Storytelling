module.exports = {
  production: true,
  backend: {
    protocol: process.env.PROTOCOL || 'http',
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 4002,
    endpoints: {
      basePath: process.env.ENDPOINTS_BASE_PATH || 'api',
      signup: process.env.ENDPOINTS_SIGNUP || 'auth/signup',
      signin: process.env.ENDPOINTS_SIGNIN || 'auth/signin',
      boxes: process.env.ENDPOINTS_BOXES || 'boxes',
      presentations: process.env.ENDPOINTS_PRESENTATIONS || 'presentations',
      users: process.env.ENDPOINTS_USERS || 'users',
      slides: process.env.ENDPOINTS_SLIDES || 'slides',
      images: process.env.ENDPOINTS_IMAGES || 'images',
      search: process.env.ENDPOINTS_SEARCH || 'search/slides',
      banner: process.env.ENDPOINTS_BANNER || 'banner'
    }
  }
};
