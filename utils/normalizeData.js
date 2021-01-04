export const normalizeData = (data) => {
  const newData = [];
  data.pages.flat().map((page) => {
    page.results.map((item) => {
      newData.push(item);
    });
  });

  return newData;
};
