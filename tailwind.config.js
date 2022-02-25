module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins']
      },
      backgroundImage: {
        'card-one': 'linear-gradient(to bottom right, #f97316, #db2777)'
      },
      flex: {
        0.2: '0.1',
        0.8: '0.6'
      }
    }
  },
  plugins: []
};
