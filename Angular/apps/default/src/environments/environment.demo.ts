export const environment = {
  production: true,
  api: {
    protocol: 'http',
    host: 'localhost',
    port: '3000',
    endpoints: {
      signup: '/api/auth/signup',
      signin: '/api/auth/signin',
      articles: '/api/articles',
      users: '/api/users',
      slides: '/api/slides',
      slide: 'slide',
      slidesFix: '/api/slidesFix',
      images: '/api/images',
      imagesServer: '/api/imagesServer',
      search: '/api/search/slides',
      banner: '/api/banner'
    }
  }
};
