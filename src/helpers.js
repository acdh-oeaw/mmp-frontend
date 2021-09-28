export default {
  methods: {
    getIdFromUrl: (url) => url.replace(/\D/g, ''),
    removeDuplicates: (arr, keys) => arr.filter((item, index, self) => index === self.findIndex((t) => {
      const uneq = (key) => t[key] !== item[key];
      return !keys.some(uneq);
    })),
    removeRoot: (label) => label.split(',')[0],
    shorten: (str, n) => (str.length > n ? `${str.substring(0, n)}...` : str),
  },
};
