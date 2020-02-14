export default {
  fuzzySearchOptions: {
    shouldSort: true,
    threshold: 0.2,
    location: 0,
    distance: 100,
    maxPatternLength: 150,
    minMatchCharLength: 1,
    keys: ['name', 'lat', 'lon']
  }
};