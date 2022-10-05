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
    debug: (message, name) => {
      console.debug('debug', name, message);
    },
    addParamsToQuery(obj) {
      const ret = obj || {};
      const entries = Object.entries(this.$store.state.searchFilters);
      const { apiParams } = this.$store.state;

      const dict = {
        author: 'searchAuthors',
        passage: 'searchPassages',
        usecase: 'searchUsecases',
        place: 'searchPlaces',
      };
      const subDict = {
        ethnonym: 'searchEthnonyms',
        name: 'searchNames',
        phrase: 'searchPhrases',
        region: 'searchRegions',
      };

      entries.forEach(([key, val]) => {
        if (typeof val === 'object') {
          Object.entries(val).forEach(([subKey, subVal]) => {
            if (!subVal) {
              console.log('subentry', subKey, subVal);
              ret[subDict[subKey]] = 'false';
            } else delete ret[subDict[subKey]];
          });
        } else if (!val) {
          console.log('entry bool', key, val);
          ret[dict[key]] = 'false';
        } else delete ret[dict[key]];
      });
      if (apiParams.hasUsecase !== 'true') ret.hasUsecase = apiParams.hasUsecase;
      else delete ret.hasUsecase;
      if (!apiParams.intersect) ret.intersect = 'false';
      else delete ret.intersect;
      if (apiParams.slider !== 'passage') ret.slider = 'text';
      else delete ret.slider;

      // console.log('addParams', entries, ret);
      return ret;
    },
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
    getOptimalName: (obj) => obj?.name_en || obj?.name_antik || obj?.name_lat || obj?.name || obj?.name_fr || obj?.name_it || obj?.name_gr,
    getIdFromUrl: (url) => url.replace(/\D/g, ''),
    lightenColor(color, fade) {
      if (!color) return color;
      const numArray = color.replace('#', '').match(/.{2}/g).map((hex) => parseInt(hex, 16));
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
      return arr.filter((x, i, self) => i === self.findIndex((t) => {
        const uneq = (key) => t[key] !== x[key];
        return !newKeys.some(uneq);
      }));
    },
    intersectArrays: (arr1, arr2, key) => arr1.filter((x) => arr2.some((y) => x[key] === y[key])),
    removeRoot: (label) => label.split(/, (\[|<)/)[0],
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
    hasUsecase() {
      return this.$store.state.apiParams.hasUsecase;
    },
  },
};
