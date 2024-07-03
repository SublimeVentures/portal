export function findFilter(filters, key, value) {
  return filters.find(f => {
      if (['isSell'].includes(key)) {
          return f.filter[key] === value;
      }
      return f.filter[key] !== undefined;
  });
};
