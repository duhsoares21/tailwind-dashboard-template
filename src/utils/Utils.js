import resolveConfig from 'tailwindcss/resolveConfig';

export const tailwindConfig = () => {
  // Tailwind config
  return resolveConfig('./src/css/tailwind.config.js')
}

export const hexToRGB = (h) => {
  let r = 0;
  let g = 0;
  let b = 0;
  if (h.length === 4) {
    r = `0x${h[1]}${h[1]}`;
    g = `0x${h[2]}${h[2]}`;
    b = `0x${h[3]}${h[3]}`;
  } else if (h.length === 7) {
    r = `0x${h[1]}${h[2]}`;
    g = `0x${h[3]}${h[4]}`;
    b = `0x${h[5]}${h[6]}`;
  }
  return `${+r},${+g},${+b}`;
};

export const formatValue = (value) => Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 2,
}).format(value);

export const formatDate = (date) => {
  const _date = new Date(date);

  const day = _date.getDate() < 10 ? "0"+_date.getDate() : _date.getDate();
  const month = parseInt(_date.getMonth())+1 < 10 ? "0"+(_date.getMonth()+1) : _date.getMonth()+1;
  const year = _date.getFullYear();

  const formattedDate = day+"/"+month+"/"+year;

  return formattedDate;
}

export const USDate = (date) => {
  const day = date.getDate() < 10 ? "0"+date.getDate() : date.getDate();
  const month = parseInt(date.getMonth())+1 < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
  const year = date.getFullYear();

  const formattedDate = year+"-"+month+"-"+day;

  return formattedDate;
}