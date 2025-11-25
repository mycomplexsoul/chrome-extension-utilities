/**
 * Example usage in a content script console:
 *
 * const order = extractAmazonOrder();
 * if (order) {
 *   const txt = generateAccountingMovements(order);
 *   console.log(txt);
 * }
 *
 * The extractors use heuristics and may need adjustment for different Amazon locales.
 */

type TAmazonItem = {
  title: string;
  quantity: number;
  price: number; // per unit
};

type TAmazonOrder = {
  orderId: string;
  orderDate: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  items: TAmazonItem[];
};

function parseCurrency(text: string): number {
  if (!text) return 0;
  // remove currency symbols and non numeric characters except dot and comma
  const cleaned = text.replace(/[^0-9.,-]/g, '').trim();
  if (cleaned === '') return 0;
  // assume comma as thousand separator and dot as decimal if both present
  if (cleaned.indexOf(',') !== -1 && cleaned.indexOf('.') !== -1) {
    // if last '.' is after last ',', treat . as decimal
    const lastDot = cleaned.lastIndexOf('.');
    const lastComma = cleaned.lastIndexOf(',');
    if (lastDot > lastComma) {
      return parseFloat(cleaned.replace(/,/g, '')) || 0;
    }
    // otherwise comma is decimal
    return parseFloat(cleaned.replace(/\./g, '').replace(/,/g, '.')) || 0;
  }
  // only commas: treat comma as decimal if there's exactly one comma and <=2 digits after it
  if (cleaned.indexOf(',') !== -1 && cleaned.indexOf('.') === -1) {
    const parts = cleaned.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      return parseFloat(parts.join('.')) || 0;
    }
    return parseFloat(cleaned.replace(/,/g, '')) || 0;
  }
  return parseFloat(cleaned) || 0;
}

function extractAmazonOrder(): TAmazonOrder | null {
  // This function attempts to extract common Amazon order page fields.
  // It uses heuristics based on typical Amazon order confirmation / details DOM.

  // common selectors for order id and date in order details page
  let orderId = '';
  const possibleId = document.querySelector("[id*='order-id']") || document.querySelector("a[href*='/gp/your-account/order-details']");
  if (possibleId && possibleId.textContent) orderId = possibleId.textContent.trim();

  // Fallback: look for text "Order #" anywhere
  if (!orderId) {
    const nodes = Array.from(document.querySelectorAll('body *')) as Element[];
    for (const n of nodes) {
      const txt = n.textContent || '';
      const m = txt.match(/Order\s*[#:\u2011]?\s*([A-Z0-9-]+)/i);
      if (m) {
        orderId = m[1];
        break;
      }
    }
  }

  // order date (use provided HTML structure)
  let orderDate = '';
  const dateSpan = document.querySelector('[data-component="orderDate"] span');
  if (dateSpan && dateSpan.textContent) orderDate = dateSpan.textContent.trim();
  if (!orderDate) {
    const txt = document.body.textContent || '';
    const m = txt.match(/Pedido realizado\s*[:\s]*([A-Za-z0-9 ,./-]+)/i) || txt.match(/Order\s+placed\s*:?\s*([A-Za-z0-9 ,./-]+)/i);
    if (m) orderDate = m[1].trim();
  }

  // totals: look for labels
  const allText = document.body.innerText;
  const subtotalMatch = allText.match(/Order\s+Subtotal\s*[:\s]*\n?\s*([$€£¥]?[0-9.,\s]+)/i) || allText.match(/Subtotal\s*[:\s]*([$€£¥]?[0-9.,\s]+)/i);
  const shippingMatch = allText.match(/Shipping\s*(Charge)?\s*[:\s]*([$€£¥]?[0-9.,\s]+)/i);
  const taxMatch = allText.match(/Tax\w*\s*[:\s]*([$€£¥]?[0-9.,\s]+)/i) || allText.match(/Import charges\s*[:\s]*([$€£¥]?[0-9.,\s]+)/i);
  const totalMatch = allText.match(/Order\s+Total\s*[:\s]*([$€£¥]?[0-9.,\s]+)/i) || allText.match(/Total\s*[:\s]*([$€£¥]?[0-9.,\s]+)/i);

  const subtotal = subtotalMatch ? parseCurrency(subtotalMatch[1]) : 0;
  const shipping = shippingMatch ? parseCurrency(shippingMatch[2] || shippingMatch[1]) : 0;
  const tax = taxMatch ? parseCurrency(taxMatch[1]) : 0;
  const total = totalMatch ? parseCurrency(totalMatch[1]) : (subtotal + shipping + tax);

  // Items: use the provided HTML structure selectors
  const items: TAmazonItem[] = [];
  const titleEls = Array.from(document.querySelectorAll('[data-component="itemTitle"] a')) as HTMLAnchorElement[];
  const priceEls = Array.from(document.querySelectorAll('[data-component="unitPrice"] .a-offscreen, [data-component="unitPrice"] .a-price .a-offscreen')) as Element[];
  const qtyEls = Array.from(document.querySelectorAll('.od-item-view-qty span')) as Element[];

  const count = Math.max(titleEls.length, priceEls.length, qtyEls.length);
  for (let i = 0; i < count; i++) {
    const title = (titleEls[i]?.textContent || '').trim();
    const priceText = (priceEls[i]?.textContent || '') || '';
    const price = priceText ? parseCurrency(priceText) : 0;
    const qtyText = (qtyEls[i]?.textContent || '') || '';
    const quantity = qtyText ? parseInt(qtyText.trim(), 10) || 1 : 1;
    if (title) {
      items.push({ title, quantity, price });
    }
  }

  // If still empty, fallback to previous heuristic
  if (items.length === 0) {
    const itemEls = document.querySelectorAll('[id^=orderByItem], .a-fixed-left-grid-inner, .order-item, .item-view');
    if (itemEls && itemEls.length) {
      itemEls.forEach((ie) => {
        const titleEl = ie.querySelector('h3, .a-link-normal, .a-truncate-full, .item-title') || ie.querySelector('span.a-size-medium');
        const title = titleEl?.textContent?.trim() || (ie.textContent || '').trim().split('\n')[0] || '';
        let price = 0;
        let quantity = 1;
        const priceMatch = (ie.textContent || '').match(/[$€£¥]\s*[0-9.,]+/) || (ie.textContent || '').match(/[0-9.,]+\s*(USD|EUR|GBP)?\s*each/i);
        if (priceMatch) price = parseCurrency(priceMatch[0]);
        const qtyMatch = (ie.textContent || '').match(/Qty\.?\s*[:\s]\s*(\d+)/i) || (ie.textContent || '').match(/Quantity\s*[:\s]*?(\d+)/i) || (ie.textContent || '').match(/x\s*(\d+)/i);
        if (qtyMatch) quantity = parseInt(qtyMatch[1], 10) || 1;
        if (title) items.push({ title, quantity, price });
      });
    }
  }

  // If no order id and no items found, assume not an Amazon order page
  if (!orderId && items.length === 0 && total === 0) return null;

  return {
    orderId,
    orderDate,
    subtotal,
    shipping,
    tax,
    total,
    items,
  };
}

function formatCurrencyWithSign(amount: number, currencySymbol = '$') {
  // Return currency formatted string with sign and thousands separators, e.g. -$2,316.97
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(abs);
  return `-${currencySymbol}${formatted}`;
}

function toISODate(rawDate: string) {
  if (!rawDate) return new Date().toISOString().split('T')[0];
  const s = rawDate.trim();
  // Match Spanish format: DD de MMM de YYYY (e.g. "8 de octubre de 2025")
  const m = s.match(/^(\d{1,2})\s+de\s+([A-Za-záéíóúñÑ]+)\s+de\s+(\d{4})$/i);
  if (m) {
    const day = parseInt(m[1], 10);
    const monthName = m[2].toLowerCase();
    const year = parseInt(m[3], 10);
    const months: { [k: string]: number } = {
      enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6,
      julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12,
    };
    const month = months[monthName] || 0;
    if (month >= 1 && month <= 12) {
      const mm = String(month).padStart(2, '0');
      const dd = String(day).padStart(2, '0');
      return `${year}-${mm}-${dd}`;
    }
  }

  // Fallback: try general Date parse
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return s;
}

function generateAccountingMovements(order: TAmazonOrder) {
  // New requested format (one product per line):
  // YYYY-MM-DD | Descripción del artículo de amazon | Monto en formato moneda con signo negativo | "Crédito" | "Amazon" | "Otros" | "" | ""
  const lines: string[] = [];
  const date = toISODate(order.orderDate || new Date().toISOString());

  // Determine a currency symbol if possible by inspecting numbers in page or leaving empty
  // For simplicity we don't detect locale here; we keep symbol empty so output becomes -12.34
  const currencySymbol = '';

  // One line per item
  order.items.forEach((it) => {
    const amount = (it.price || 0) * (it.quantity || 1);
    const desc = (it.title || '').replace(/\s+/g, ' ').trim();
  const amtStr = formatCurrencyWithSign(amount, currencySymbol);
    // Compose pipe-separated line
    const line = `${date} | ${desc} | ${amtStr} | Credito | Amazon | Otros ||`;
    lines.push(line);
  });

  // Print each movement line individually to the console (one per line)
  lines.forEach((l) => console.log(l));

  return lines;
}

export { extractAmazonOrder, generateAccountingMovements, type TAmazonOrder };
