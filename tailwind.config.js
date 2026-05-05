export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: '#10212b',
          green: '#146c43',
          gold: '#e2aa2f',
          sky: '#2d8ac8',
          coral: '#d95d4f',
        },
      },
      boxShadow: {
        soft: '0 18px 50px rgba(16, 33, 43, 0.08)',
      },
    },
  },
  plugins: [],
}
