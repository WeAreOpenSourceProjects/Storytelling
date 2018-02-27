export const environment = {
  production: true,
  backend: {
    protocol: 'http',
    host: 'localhost',
    port: 4002,
    endpoints: {
      basePath: 'api',
      signup: 'auth/signup',
      signin: 'auth/signin',
      boxes: 'boxes',
      presentations: 'presentations',
      users: 'users',
      slides: 'slides',
      images: 'images',
      search: 'search/slides',
      banner: 'banner'
    }
  }
};
