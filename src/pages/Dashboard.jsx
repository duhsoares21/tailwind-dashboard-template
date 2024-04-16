import React, { useState } from 'react';

import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import Datepicker from '../components/Datepicker';
import Entradas from '../partials/dashboard/Entradas';
import Saldo from '../partials/dashboard/Saldo';
import Categorias from '../partials/dashboard/Categorias';
import Saidas from '../partials/dashboard/Saidas';

function Dashboard({currentMonth, setCurrentMonth, currentYear, setCurrentYear}) {
  
  const [updateCategorias, setUpdateCategorias] = useState(true);
  const [updateSaldo, setUpdateSaldo] = useState(true);
  const [updateSaidas, setUpdateSaidas] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main>
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            <WelcomeBanner />

            <div className="sm:flex sm:justify-between sm:items-center mb-8 mt-8">
              <Datepicker setCurrentMonth={setCurrentMonth} setCurrentYear={setCurrentYear} monthOnly={true}/>
            </div>

            <div className="grid grid-cols-12 gap-3">
              <Entradas setUpdateSaldo={setUpdateSaldo} setUpdateCategorias={setUpdateCategorias} month={currentMonth} year={currentYear} />
              <Saldo updateSaldo={updateSaldo} setUpdateSaldo={setUpdateSaldo} setUpdateSaidas={setUpdateSaidas} setUpdateCategorias={setUpdateCategorias} month={currentMonth} year={currentYear} />
            </div>

            <div className="grid gap-3 mb-8">
              <Saidas updateSaidas={updateSaidas} setUpdateSaidas={setUpdateSaidas} setUpdateSaldo={setUpdateSaldo} setUpdateCategorias={setUpdateCategorias} month={currentMonth} year={currentYear} />
            </div>

            <div className="grid gap-3">
              <Categorias month={currentMonth} updateCategorias={updateCategorias} setUpdateCategorias={setUpdateCategorias} year={currentYear}/>
            </div>


          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;