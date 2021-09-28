export default {
  methods: {
    getIdFromUrl: (url) => url.replace(/\D/g, ''),
    removeRoot: (label) => label.split(',')[0],
    shorten: (str, n) => (str.length > n ? `${str.substring(0, n)}...` : str),
  },
};
