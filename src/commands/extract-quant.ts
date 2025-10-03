type TTrade = {
  instrument: string;
  position: string;
  size: string;
  date: string;
  profit: string;
  roi: string;
};

function extractQuant() {
  const tableContainer = document.querySelector('#close_positions #closed_history_body');
  const data: TTrade[] = [];

  if (tableContainer) {
    const rows = tableContainer.querySelectorAll('a'); // Select the anchor elements as rows
    rows.forEach(row => {
      const cells: NodeListOf<HTMLDivElement> | [] = row.querySelectorAll('div'); // Select the child div elements as cells
      const rowData: TTrade = {
        instrument: '',
        position: '',
        size: '',
        date: '',
        profit: '',
        roi: ''
      };

      if (cells.length === 0) {
        return;
      } else {
        rowData.instrument = cells[0].textContent?.trim() || '';
        rowData.position = cells[1].textContent?.trim() || '';
        rowData.size = cells[2].textContent?.trim() || '';
        rowData.date = cells[3].textContent?.trim() || '';
        rowData.profit = cells[4].textContent?.trim() || '';
        rowData.roi = cells[5].textContent?.trim() || '';
      }
      data.push(rowData);
    });
  }

  return data;
}

function totalPerDay() {
  const trades = extractQuant();
  const totals: { [date: string]: number } = {};

  trades.forEach(trade => {
    const date = trade.date;
    const cleanedProfit = trade.profit.split(' ')[0].replace(/,/g, '');
    const profit = parseFloat(
      `${cleanedProfit[0]}${cleanedProfit.substring(2)}}`.replace('+', '')
    ) || 0;
    if (!totals[date]) {
      totals[date] = 0;
    }
    totals[date] += profit;
  });

  return Object.entries(totals).map(([date, total]) => ({ date, total }));
}

export {
  extractQuant,
  totalPerDay
};