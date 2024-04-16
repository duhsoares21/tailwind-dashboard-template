import '../../utils/axios';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { formatDate, formatValue } from '../../utils/Utils';
import Icon from '../../images/saidas.png';
import { categoriaNome } from '../../utils/helper';
import ModalSaidas from './ModalSaidas';

function Saidas({year, month, updateSaidas, setUpdateSaidas, setUpdateSaldo, setUpdateCategorias}) {

  const [isOpen, setIsOpen] = useState(false);

  const [idSaida, setIdSaida] = useState(-1);

  const [saidas, setSaidas] = useState([]);
  const [deleted, setDeleted] = useState(0);

  useEffect(() => {
    
    if(month === 0 || year === 0) {
      return;
    }
    
    if(updateSaidas || month) {
      carregaSaidas();
      setUpdateSaidas(false);
    }
  }, [year, month, updateSaidas]);
  
  async function carregaSaidas() {
    const data = (await axios.get("/saidas/"+month, {
      params: {
        year: year
      }
    })).data;

    const saidas = await Promise.all(data.map(async saida => {
        saida.id = saida.id;
        saida.valor = formatValue(saida.valor);
        saida.categoria = await categoriaNome(saida.categoria);
        saida.data = formatDate(saida.data);
        saida.vencimento = formatDate(saida.vencimento);
    
        return saida;
    }));

    setSaidas(saidas);
  }

  async function handleEditSaida(id) {
    setIdSaida(id);
    setIsOpen(true);
  }

  async function handleDeleteSaida(id) {
    const data = (await axios.delete("/saidas/"+id));

    if(data.status === 204) {
      setDeleted(id);

      setTimeout(() => {
        setUpdateSaidas(true);
        setUpdateSaldo(true);
        setUpdateCategorias(true);
      }, 500)
    }
  }

  return (
    <>
      <ModalSaidas idSaida={idSaida} isUpdate={true} isOpen={isOpen} currentMonth={month} setIsOpen={setIsOpen} setUpdateSaldo={setUpdateSaldo} setUpdateSaidas={setUpdateSaidas} setUpdateCategorias={setUpdateCategorias} />
      <div className="px-5 col-span-full xl:col-span-8 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
        <header className='mt-2 pt-2'>
          <img src={Icon} width="56" height="56" className='w-[56px] h-[56px] object-contain' alt="Icon 02" />
        </header>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 pt-2">Saídas</h2>
        <div>
          {/* Table */}
          <div className="overflow-x-auto">
            {
              saidas.length > 0 ?
              <table className="table-auto w-full dark:text-slate-300">
                {/* Table header */}
                <thead className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm">
                  <tr>
                    <th className="p-2">
                      <div className="font-semibold text-left">Título</div>
                    </th>
                    <th className="p-2">
                      <div className="font-semibold text-center">Valor</div>
                    </th>
                    <th className="p-2">
                      <div className="font-semibold text-center">Categoria</div>
                    </th>
                    <th className="p-2">
                      <div className="font-semibold text-center">Data do Lançamento</div>
                    </th>
                    <th className="p-2">
                      <div className="font-semibold text-center">Vencimento</div>
                    </th>
                    <th className="p-2">
                      <div className="font-semibold text-center">Editar</div>
                    </th>
                    <th className="p-2">
                      <div className="font-semibold text-center">Apagar</div>
                    </th>
                  </tr>
                </thead>
                {/* Table body */}
                <tbody className="text-sm font-medium divide-y divide-slate-100 dark:divide-slate-700">
                  {  
                    saidas.map((saida, index) => {

                      const id = saida.id;
                      const titulo = saida.titulo;
                      const valor = saida.valor;
                      const categoria = saida.categoria;
                      const data = saida.data;
                      const vencimento = saida.vencimento;

                      return (
                        <tr style={{ 
                          transform: deleted === id ? 'translateX(-100%)' : 'none', 
                          transition: deleted === id ? 'transform 0.5s ease' : 'none'
                        }} id={`row_${id}`} key={index}>
                          <td className="p-2">
                            <div className="flex items-center">
                              <div className="text-slate-800 dark:text-slate-100">{titulo}</div>
                            </div>
                          </td>
                          <td className="p-2">
                          <div className="text-center text-red-500">-{valor}</div>
                          </td>
                          <td className="p-2">
                            <div className="text-center">{categoria}</div>
                          </td>
                          <td className="p-2">
                            <div className="text-center">{data}</div>
                          </td>
                          <td className="p-2">
                            <div className="text-center">{vencimento}</div>
                          </td>
                          <td className="p-2">
                            <div className="text-center">
                              <button onClick={() => handleEditSaida(id)} className="btn bg-indigo-500 hover:bg-indigo-600 text-white">
                                <span className="hidden xs:block">Editar</span>
                              </button>
                            </div>
                          </td>
                          <td className="p-2">
                            <div className="text-center">
                              <button onClick={() => handleDeleteSaida(id)} className="btn bg-red-500 hover:bg-red-600 text-white">
                                <span className="hidden xs:block">Deletar</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
              :
                <div className="flex justify-center mb-4">
                  <h4>Nenhuma saída registrada</h4>
                </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Saidas;
