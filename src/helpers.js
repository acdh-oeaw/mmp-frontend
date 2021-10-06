export default {
  methods: {
    debug: (message, name) => {
      console.log('debug', name, message);
    },
    getIdFromUrl: (url) => url.replace(/\D/g, ''),
    // this worked first try please clap
    removeDuplicates: (arr, keys) => arr.filter((x, i, self) => i === self.findIndex((t) => {
      const uneq = (key) => t[key] !== x[key];
      return !keys.some(uneq);
    })),
    removeRoot: (label) => label.split(',')[0],
    shorten: (str, n) => (str.length > n ? `${str.substring(0, n)}...` : str),
  },
};
