import '../../utils/axios';

import React, { useState, useEffect } from 'react';
import Icon from '../../images/saldo.png';

// Import utilities
import { tailwindConfig, hexToRGB, formatValue } from '../../utils/Utils';
import axios from 'axios';

import ModalSaidas from './ModalSaidas';

function Saldo({year, month, setUpdateSaidas, updateSaldo, setUpdateSaldo, setUpdateCategorias}) {

  const [isOpen, setIsOpen] = useState(false);

  const [total, setTotal] = useState(0);
  const [totalFormatado, setTotalFormatado] = useState("R$ 0");
  
  useEffect(() => {
    if(month === 0 || year === 0) {
      return;
    }

    if(updateSaldo || month) {
      carregaTotal();
      setUpdateSaldo(false);
    }
  }, [year, month, updateSaldo])

  async function carregaTotal() {
    const data = (await axios.get('/saldo/'+month+'/total', {
      params: {
        year: year
      }
    })).data[0];
    
    const totalSaldo = formatValue(data.Saldo);

    setTotal(data.Saldo);
    setTotalFormatado(totalSaldo);
  }

  function handleAbrirModal() {
    setIsOpen(true);
  }

  const chartData = {
    labels: [
      '12-01-2020', '01-01-2021', '02-01-2021',
      '03-01-2021', '04-01-2021', '05-01-2021',
      '06-01-2021', '07-01-2021', '08-01-2021',
      '09-01-2021', '10-01-2021', '11-01-2021',
      '12-01-2021', '01-01-2022', '02-01-2022',
      '03-01-2022', '04-01-2022', '05-01-2022',
      '06-01-2022', '07-01-2022', '08-01-2022',
      '09-01-2022', '10-01-2022', '11-01-2022',
      '12-01-2022', '01-01-2023',
    ],
    datasets: [
      // Indigo line
      {
        data: [
          622, 622, 426, 471, 365, 365, 238,
          324, 288, 206, 324, 324, 500, 409,
          409, 273, 232, 273, 500, 570, 767,
          808, 685, 767, 685, 685,
        ],
        fill: true,
        backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.indigo[500],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
          pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
          pointHoverBackgroundColor: tailwindConfig().theme.colors.indigo[500],
          pointBorderWidth: 0,
          pointHoverBorderWidth: 0,          
          clip: 20,
      },
      // Gray line
      {
        data: [
          732, 610, 610, 504, 504, 504, 349,
          349, 504, 342, 504, 610, 391, 192,
          154, 273, 191, 191, 126, 263, 349,
          252, 423, 622, 470, 532,
        ],
        borderColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.slate[500])}, 0.25)`,
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.slate[500])}, 0.25)`,
        pointHoverBackgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.slate[500])}, 0.25)`,
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
      },
    ],
  };

  return (
    <>
      <ModalSaidas isUpdate={false} isOpen={isOpen} setIsOpen={setIsOpen} currentMonth={month} setUpdateSaldo={setUpdateSaldo} setUpdateSaidas={setUpdateSaidas} setUpdateCategorias={setUpdateCategorias} />
      <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <div className="px-5 pt-5">
          <header className="flex justify-between items-start mb-2">
            <img src={Icon} width="56" height="56" className='w-[56px] h-[56px] object-contain' alt="Icon 02" />
          </header>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Saldo</h2>
          <div className="flex items-start pb-5">
            <div className={`text-3xl font-bold ${total < 0 ? 'text-red-500' : 'text-green-500'} dark:${total < 0 ? 'text-red-500' : 'text-green-500'} mr-2`}>{totalFormatado}</div>
            {/*<div className="text-sm font-semibold text-white px-1.5 bg-amber-500 rounded-full">-14%</div>*/}
          </div>
        </div>
        {
          /*
            <div className="grow max-sm:max-h-[128px] max-h-[128px]">
              <LineChart data={chartData} width={389} height={128} />
            </div>
          */
        }
      </div>
      <div className="sm:flex sm:justify-between sm:items-center mb-8 mt-5">
        {/* Right: Actions */}
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {/* Add view button */}
          <button onClick={() => handleAbrirModal()} className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
              <span className="hidden xs:block">Adicionar saída</span>
          </button>                
        </div>

      </div>
    </>
  );
}

export default Saldo;
