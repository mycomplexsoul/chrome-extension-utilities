const getLocalStorageUsage = () => {
    let used = 0,
      item = null;
    let data: {
      details: { item: string, used: number, usedInKB: string }[],
      total: number,
      totalInKB: string,
    } = { details: [], total: 0, totalInKB: '0' };

    for (item in localStorage) {
      if (!localStorage.hasOwnProperty(item)) {
        continue;
      }
      used = (localStorage[item].length + item.length) * 2;
      data.total += used;

      data.details.push({
        item,
        used,
        usedInKB: (used / 1024).toFixed(2)
      });
    }

    data.totalInKB = (data.total / 1024).toFixed(2);
    return data;
}

export {
  getLocalStorageUsage,
};