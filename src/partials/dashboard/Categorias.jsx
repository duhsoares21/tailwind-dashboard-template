import '../../utils/axios';
import React, { useEffect, useState } from 'react';
import DoughnutChart from '../../charts/DoughnutChart';

// Import utilities
import axios from 'axios';
import { tailwindConfig } from '../../utils/Utils';
import { categoriaNome, generateColorVariations, generateRandomColors } from '../../utils/helper';

function Categorias({year, month, updateCategorias, setUpdateCategorias}) {

  const [chartData, setChartData] = useState(null); 

  useEffect(() => {

    if(month === 0 || year === 0) {
      return;
    }

    if(updateCategorias) {
      carregaCategorias();
      setUpdateCategorias(false);
    }

  }, [year, month, updateCategorias])

  useEffect(() => {
    if(chartData !== null) { 
      //console.log(chartData);
    }
  }, [chartData])

  async function carregaCategorias() {
    const items = (await axios.get('/categorias/'+month+'/porcentagem', {
      params: {
        year: year
      }
    })).data;

    let categorias = [];
    let percentages = [];

    await Promise.all(items.map(async item => {
      categorias.push(await categoriaNome(item.categoria));
      percentages.push(parseFloat(item.percentage));

    }));
    
    const lista = {
      labels: categorias,
      datasets: [
        {
          label: 'Percentual dos gastos (%)',
          data: percentages,
          backgroundColor: generateColorVariations('#0bb6fa', percentages.length, 0.2),
          borderColor: generateColorVariations('#0bb6fa', percentages.length, 1),
          borderWidth: 2,
        },
      ],
    };

    setChartData(lista);
  }

  return (
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Categorias com os maiores gastos (%)</h2>
      </header>
      {
        (chartData !== null) ?
          <DoughnutChart data={chartData} width={389} height={260} updateCategorias={updateCategorias} />
        :
          <></>
      }
    </div>
  );
}

export default Categorias;