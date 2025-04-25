
import React from 'react';
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 px-4 text-center">
        <div className="container mx-auto">
          <Link to="/" className="text-4xl font-bold">
            <span className="text-app-light-blue">Word</span>
            <span className="text-white">Flow</span>
            <span className="text-app-purple"> Typing Lab</span>
          </Link>
          <p className="text-gray-300 mt-2">Treine sua velocidade de digitação em múltiplos idiomas</p>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 pb-10">
        {children}
      </main>
      <footer className="py-4 text-center text-gray-400 text-sm">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} WordFlow Typing Lab. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
