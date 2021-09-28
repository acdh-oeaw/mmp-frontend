export default {
  methods: {
    getIdFromUrl: (url) => url.replace(/\D/g, ''),
    removeDuplicates: (arr, terms) => arr.filter((item, index, self) => index === self.findIndex((t) => {
      const uneq = (term) => t[term] !== item[term];
      return !terms.some(uneq);
    })),
    removeRoot: (label) => label.split(',')[0],
    shorten: (str, n) => (str.length > n ? `${str.substring(0, n)}...` : str),
  },
};
