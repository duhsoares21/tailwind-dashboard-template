import 'axios';
import axios from "axios";

export async function categoriaNome(categoriaID) {
	const data = (await axios.get("/categorias/"+categoriaID)).data[0];
	const categoriaNome = data.categoria;
	
	return categoriaNome;
}

export function adicionaUmMes(date) {
    const newDate = new Date(date);
    let currentMonth = newDate.getMonth();

    currentMonth++;

    if (currentMonth > 11) {
        newDate.setMonth(0);
        newDate.setFullYear(newDate.getFullYear() + 1);
    } else {
        newDate.setMonth(currentMonth);
    }

    return newDate;
}

function generateRandomColor(opacity) {
    return 'rgba(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + opacity + ')';
}
  
export function generateRandomColors(numBars, opacity) {
    var colors = [];
    for (var i = 0; i < numBars; i++) {
        colors.push(generateRandomColor(opacity));
    }
    return colors;
}

export function generateColorVariations(baseColor, numVariations, opacity) {
    var colors = [];
    var baseRGB = hexToRgb(baseColor);
    for (var i = 0; i < numVariations; i++) {
      // Generate variations by slightly modifying the RGB values
      var variationRGB = {
        r: (baseRGB.r + 90 * i) % 256,
        g: (baseRGB.g + 100 * i) % 256,
        b: (baseRGB.b + 50 * i) % 256,
      };
      colors.push('rgba(' + variationRGB.r + ',' + variationRGB.g + ',' + variationRGB.b + ',' + opacity + ')');
    }
    return colors;
  }
  
  function hexToRgb(hex) {
    var bigint = parseInt(hex.slice(1), 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return { r: r, g: g, b: b };
  }