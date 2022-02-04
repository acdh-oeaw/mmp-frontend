export default {
  methods: {
    debug: (message, name) => {
      console.log('debug', name, message);
    },
    getOptimalName: (obj) => obj.name_en || obj.name_lat || obj.name || obj.name_fr || obj.name_it || obj.name_gr,
    getIdFromUrl: (url) => url.replace(/\D/g, ''),
    // this worked first try please clap
    removeDuplicates: (arr, keys) => arr.filter((x, i, self) => i === self.findIndex((t) => {
      const uneq = (key) => t[key] !== x[key];
      return !keys.some(uneq);
    })),
    removeRoot: (label) => label.split(',')[0],
    shorten: (str, n) => (str.length > n ? `${str.substring(0, n)}...` : str),
  },
  computed: {
    fullscreen() {
      return this.$route.name.includes('Fullscreen');
    },
    drawerWidth() {
      const widths = {
        xs: '100vw',
        sm: '100vw',
        md: '50vw',
      };
      return widths[this.$vuetify.breakpoint.name] || '33vw';
    },
  },
};
