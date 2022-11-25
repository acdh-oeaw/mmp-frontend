export default {
  data: () => ({
    keyColors: {
      graph: {
        Keyword: '#039BE5', // blue darken-1
        Ethnonym: '#00897B', // teal darken-1
        Name: '#FFB300', // amber darken-1
        Region: '#43A047', // green darken-1
        Author: '#FF0000', // red
        Unsicher: '#808080', // grey
      },
      chips: {
        Keyword: 'blue lighten-4',
        Ethnonym: 'teal lighten-4',
        Name: 'amber lighten-4',
        Region: 'green lighten-4',
        Unsicher: 'grey',
      },
    },
  }),
  methods: {
    displayTimeRange: (start, end) => {
      if (!start && !end) return 'unknown';
      if (start === end) return start;
      return `${start || 'unknown'} - ${end || 'unknown'}`;
    },
    getChipColorFromGroup(group) {
      const colors = {
        Author: 'red lighten-3',
        Passage: 'teal lighten-4',
        Keyword: 'blue lighten-4',
        'Use Case': 'amber lighten-3',
        Place: 'green lighten-3',
      };
      return colors[group];
    },
    getOptimalName: (obj) =>
      obj?.name_en ||
      obj?.name_antik ||
      obj?.name_lat ||
      obj?.name ||
      obj?.name_fr ||
      obj?.name_it ||
      obj?.name_gr,
    lightenColor(color, fade) {
      if (!color) return color;
      const numArray = color
        .replace('#', '')
        .match(/.{2}/g)
        .map((hex) => parseInt(hex, 16));
      return `rgba(${numArray.join(',')}, ${fade})`;
    },
    // this worked first try please clap
    removeDuplicates: (arr, keys) => {
      let newKeys;
      switch (typeof keys) {
        case 'number':
          newKeys = [keys.toString()];
          break;
        case 'string':
          newKeys = [keys];
          break;
        default:
          newKeys = keys;
          break;
      }
      return arr.filter(
        (x, i, self) =>
          i ===
          self.findIndex((t) => {
            const uneq = (key) => t[key] !== x[key];
            return !newKeys.some(uneq);
          })
      );
    },
    intersectArrays: (arr1, arr2, key) => arr1.filter((x) => arr2.some((y) => x[key] === y[key])),
    removeRoot: (label) => label.split(/, (\[|<)/)[0],
    shorten: (str, n) => (str.length > n ? `${str.substring(0, n)}...` : str),
  },
  computed: {
    isFullScreen() {
      return this.$route.name.includes('Fullscreen');
    },
    parentRoute() {
      return this.$route.matches.at(-2);
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
