export function getUniqueItems(inputArray) {
  const uniqueValues = new Set();
  return inputArray.filter(item => {
    if (!uniqueValues.has(item.value)) {
      uniqueValues.add(item.value);
      return true;
    }
    return false;
  });
}

export function formatDate(inputDate) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(inputDate).toLocaleDateString(undefined, options);
  return formattedDate;
}