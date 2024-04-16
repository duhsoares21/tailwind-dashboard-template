import '../../utils/axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LineChart from '../../charts/LineChart01';
import Icon from '../../images/entradas.png';
import EditMenu from '../../components/DropdownEditMenu';

import { tailwindConfig, hexToRGB, formatValue } from '../../utils/Utils';
import axios from 'axios';
import { adicionaUmMes } from '../../utils/helper';


function Entradas({year, month, setUpdateSaldo, setUpdateCategorias}) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [total, setTotal] = useState(0);

  const [titulo, setTitulo] = useState("");
  const [valor, setValor] = useState(0);

  useEffect(() => {
    if(month === 0 || year === 0) {
      return;
    }

    carregaTotal();
  }, [month, year])

  function handleAbrirModal() {
    setIsOpen(true);
  }

  function handleFecharModal() {
    setIsOpen(false);
  }

  async function cadastraEntrada() {
    const options = {
      method: 'POST',
      url: '/entradas',
      headers: {'Content-Type': 'application/json'},
      data: {
        titulo: titulo,
        valor: valor,
        tipo: 1,
        data: new Date(year+"-"+month+"-"+new Date().getDate()).setMonth(month - 1, 1),
      }
    };
    
    axios.request(options).then(function (response) {
      if(response.status === 204) {
        carregaTotal();
        setUpdateSaldo(true);
        setUpdateCategorias(true);
        setIsOpen(false);
      }
    }).catch(function (error) {
      console.error(error);
    });
  }
  
  async function carregaTotal() {
    const data = (await axios.get('/entradas/'+month+'/total', {
      params: {
        year: year
      }
    })).data[0];
    const totalEntrada = data.total;
    setTotal(totalEntrada);
  }

  const chartData = {
    labels: [
      '12-01-2020',
      '01-01-2021',
      '02-01-2021',
      '03-01-2021',
      '04-01-2021',
      '05-01-2021',
      '06-01-2021',
      '07-01-2021',
      '08-01-2021',
      '09-01-2021',
      '10-01-2021',
      '11-01-2021',
      '12-01-2021',
      '01-01-2022',
      '02-01-2022',
      '03-01-2022',
      '04-01-2022',
      '05-01-2022',
      '06-01-2022',
      '07-01-2022',
      '08-01-2022',
      '09-01-2022',
      '10-01-2022',
      '11-01-2022',
      '12-01-2022',
      '01-01-2023',
    ],
    datasets: [
      // Indigo line
      {
        data: [732, 610, 610, 504, 504, 504, 349, 349, 504, 342, 504, 610, 391, 192, 154, 273, 191, 191, 126, 263, 349, 252, 423, 622, 470, 532],
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
    ],
  };

  return (
    <>
    {
        isOpen ?
        <div className='fixed shadow-modal bg-white dark:bg-slate-800 w-[50%] inset-x-0 px-10 pt-5 pb-5 mx-auto inset-y-0 h-max my-auto p-4 rounded-[4px] border border-slate-200 dark:border-slate-700'>
          <button onClick={() => handleFecharModal()} className='absolute right-[-12px] top-[-12px] rounded-[50%] border w-[32px] h-[32px] bg-white dark:bg-slate-800 border-slate-400 dark:border-slate-700'>X</button>
          <fieldset>
            <legend className='mb-3 text-center'>Adicionar Entradas</legend>
            <form className='flex flex-col'>
              <div className='flex gap-3'>
                <input placeholder='Título' className='outline-none text-slate-800 dark:text-slate-800 w-[100%] my-2 rounded-[4px] mx-auto' type='text' name='titulo' onChange={(event) => setTitulo(event.currentTarget.value)} />
                <div className='flex relative'>
                  <label className='absolute rounded-tl-[3px] rounded-bl-[3px] bg-slate-300 dark:bg-slate-700 px-[5px] top-[0.6rem] left-[0.05rem] max-w-[32px] flex items-center h-[40px] bg-black'>R$</label>
                  <input placeholder='0,00' className='outline-none pl-[36px] text-slate-800 dark:text-slate-800 w-[100%] my-2 rounded-[4px] mx-auto' type='number' step={.01} name='valor' onChange={(event) => setValor(parseFloat(event.currentTarget.value))} />
                </div>
              </div>
              <button type='button' onClick={() => cadastraEntrada()} className="btn mt-[8px] bg-indigo-500 hover:bg-indigo-600 text-white">
                <span className="hidden xs:block">Adicionar entrada</span>
              </button>                
            </form>
          </fieldset>
        </div>
        :
        <></>
      }

      <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 pb-[20px] bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <button onClick={() => handleAbrirModal()} className="btn bg-indigo-500 rounded-tl-[4px] rounded-tr-[4px] rounded-bl-[0] rounded-br-[0] hover:bg-indigo-600 text-white">
            <span className="hidden xs:block">Adicionar entrada</span>
        </button> 
        <div className="px-5 pt-5">
          <header className="flex justify-between items-start mb-2">
            {/* Icon */}
            <img src={Icon} width="56" height="56" className='w-[56px] h-[56px] object-contain' alt="Icon 01" />
          </header>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Entradas</h2>
          <div className="flex items-start">
            <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mr-2">{formatValue(total)}</div>
            {/*<div className="text-sm font-semibold text-white px-1.5 bg-emerald-500 rounded-full">+49%</div>*/}
          </div>
        </div>
        {
          /*
          <div className="grow max-sm:max-h-[128px] xl:max-h-[128px]">
            <LineChart data={chartData} width={389} height={128} />
          </div>
          */
        }
      </div>
    </>
  );
}

export default Entradas;
