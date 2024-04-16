import '../../utils/axios';

import { useEffect, useState } from "react"
import { USDate } from '../../utils/Utils';
import { adicionaUmMes } from '../../utils/helper';

import axios from 'axios';

export default function ModalSaidas({idSaida = -1, isUpdate, isOpen, setIsOpen, currentMonth, setUpdateSaldo, setUpdateSaidas, setUpdateCategorias}) {
	const [categorias, setCategorias] = useState([]);

	const [titulo, setTitulo] = useState("");
	const [valor, setValor] = useState(0);
	const [categoria, setCategoria] = useState(1);
  
	const [data, setData] = useState(new Date());
	const [vencimento, setVencimento] = useState(new Date());

	const [numeroMeses, setNumeroMeses] = useState(0);

	useEffect(() => {
		carregaCategorias();
	  }, [])

	useEffect(() => {
		setData(USDate(adicionaUmMes(new Date().setMonth(currentMonth - 2, 1))));
		setVencimento(USDate(adicionaUmMes(adicionaUmMes(new Date().setMonth(currentMonth - 2, 1)))))
	}, [currentMonth])

	useEffect(() => {
		if(isUpdate && idSaida !== -1) {
			carregaSaida(idSaida)
		}

	}, [idSaida])

	function resetarValores() {
		setTitulo("");
		setValor(0);
		setNumeroMeses(0);
		setCategoria(1);
		setData(USDate(adicionaUmMes(new Date().setMonth(currentMonth - 2, 1))));
		setVencimento(USDate(adicionaUmMes(adicionaUmMes(new Date().setMonth(currentMonth - 2, 1)))))
	}

	async function carregaSaida(id) {
		const resposta = (await axios.get(`/saida/${id}`)).data[0];
		
		console.log(resposta)

		setTitulo(resposta.titulo);
		setValor(resposta.valor);
		setCategoria(resposta.categoria);

		const dataAtual = new Date(resposta.data);
		const dataFormatada = dataAtual.toISOString().slice(0, 10).replace('T', ' ');

		setData(dataFormatada);

		const vencimentoAtual = new Date(resposta.vencimento);
		const vencimentoFormatado = vencimentoAtual.toISOString().slice(0, 10).replace('T', ' ');

		setVencimento(vencimentoFormatado);
	}

	async function carregaCategorias() {
		const data = (await axios.get('/categorias')).data;
		setCategorias(data);
	}

	function handleFecharModal() {
		setIsOpen(false);
	}
	
	async function cadastraSaida() {
		const options = {
		  method: 'POST',
		  url: '/saidas',
		  headers: {'Content-Type': 'application/json'},
		  data: {
			titulo: titulo,
			valor: valor,
			tipo: 2,
			categoria: categoria,
			data: data,
			vencimento: vencimento,
			numeroMeses: numeroMeses
		  }
		};
		
		axios.request(options).then(function (response) {
		  if(response.status === 204) {
			setUpdateSaldo(true);
			setUpdateSaidas(true);
			setUpdateCategorias(true);
			setIsOpen(false);
			resetarValores();
		  }
		}).catch(function (error) {
		  console.error(error);
		});
	}

	async function atualizaSaida() {
		const options = {
		  method: 'PUT',
		  url: `/saidas/${idSaida}`,
		  headers: {'Content-Type': 'application/json'},
		  data: {
			titulo: titulo,
			valor: valor,
			tipo: 2,
			categoria: categoria,
			data: data,
			vencimento: vencimento
		  }
		};
		
		axios.request(options).then(function (response) {
		  if(response.status === 204) {
			setUpdateSaldo(true);
			setUpdateSaidas(true);
			setUpdateCategorias(true);
			setIsOpen(false);
			resetarValores();
		  }
		}).catch(function (error) {
		  console.error(error);
		});
	}

	return (
		<>
		{
			isOpen ?
			<div className='fixed shadow-modal bg-white dark:bg-slate-800 w-[50%] inset-x-0 px-10 pt-5 pb-5 mx-auto inset-y-0 h-max my-auto p-4 rounded-[4px] border border-slate-200 dark:border-slate-700'>
			  <button onClick={() => handleFecharModal()} className='absolute right-[-12px] top-[-12px] rounded-[50%] border w-[32px] h-[32px] bg-white dark:bg-slate-800 border-slate-400 dark:border-slate-700'>X</button>
			  <fieldset>
				<legend className='mb-3 text-center'>{isUpdate ? 'Atualizar Saídas' : 'Adicionar Saídas'}</legend>
				<form className='flex flex-col'>
				  <input placeholder='Título' className='outline-none text-slate-800 dark:text-slate-800 w-[100%] my-2 rounded-[4px] mx-auto' type='text' name='titulo' defaultValue={titulo} onChange={(event) => setTitulo(event.currentTarget.value)} />
				  <div className='flex gap-3'>
					<div className='flex relative'>
					  <label className='absolute rounded-tl-[3px] rounded-bl-[3px] bg-slate-300 dark:bg-slate-700 px-[5px] top-[0.6rem] left-[0.05rem] max-w-[32px] flex items-center h-[40px] bg-black'>R$</label>
					  <input placeholder='0,00' className='outline-none pl-[36px] text-slate-800 dark:text-slate-800 w-[100%] my-2 rounded-[4px] mx-auto' type='number' step={.01} name='valor' value={parseFloat(valor)} onChange={(event) => setValor(parseFloat(event.currentTarget.value))} />
					</div>
					<select value={categoria} onChange={(event) => setCategoria(event.currentTarget.value)} className='outline-none text-slate-800 dark:text-slate-800 w-[100%] my-2 rounded-[4px] mx-auto' name='categorias'>
					  {
						categorias.map(_categoria => (
						  <option key={_categoria.id} value={_categoria.id}>{_categoria.categoria}</option>
						))
					  }
					</select>
					<div className='flex relative w-[500px]'>
						<label className='absolute rounded-tl-[3px] rounded-bl-[3px] bg-slate-300 dark:bg-slate-700 px-[5px] top-[0.6rem] left-[0.05rem] max-w-[120px] flex items-center h-[40px] bg-black'>Repetir por: </label>
						<input placeholder={0} className='outline-none pl-[104px] text-slate-800 dark:text-slate-800 w-[100%] my-2 rounded-[4px] mx-auto' type='number' step={1} name='numeroMeses' value={parseInt(numeroMeses)} onChange={(event) => setNumeroMeses(parseInt(event.currentTarget.value))} />
						<label className='absolute rounded-tr-[3px] rounded-br-[3px] bg-slate-300 dark:bg-slate-700 px-[5px] top-[0.6rem] right-[0.05rem] max-w-[60px] flex items-center h-[40px] bg-black'>Meses</label>
					</div>
				  </div>
				  <div className='flex gap-3 my-2'>
					<input className='rounded-[4px] w-[50%]' type='date' name='data' placeholder='Data de Lançamento' value={data} onChange={(event) => setData(event.currentTarget.value)} />
					<input className='rounded-[4px] w-[50%]' type='date' name='vencimento' placeholder='Vencimento' value={vencimento} onChange={(event) => setVencimento(event.currentTarget.value)} />
				  </div>
				  <button type='button' onClick={() => isUpdate ? atualizaSaida() : cadastraSaida() } className="btn mt-[8px] bg-indigo-500 hover:bg-indigo-600 text-white">
					<span className="hidden xs:block">{isUpdate ? 'Atualizar saída' : 'Adicionar saída'}</span>
				  </button>                
				</form>
			  </fieldset>
			</div>
			:
			<></>
		  }
		</>
	)
}