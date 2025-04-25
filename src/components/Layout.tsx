
import React from 'react';
import { Link } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[url('/images/bg-pattern.svg')] bg-fixed bg-center bg-cover">
      <header className="py-8 px-4 text-center backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto">
          <Link to="/" className="inline-block transform transition hover:scale-105">
            <div className="floating-element">
              <h1 className="text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">Word</span>
                <span className="text-white font-light">Flow</span>
                <span className="bg-gradient-to-r from-app-purple to-violet-400 bg-clip-text text-transparent"> Typing Lab</span>
              </h1>
              <div className="h-1 w-full mt-2 bg-gradient-to-r from-blue-400 via-white/80 to-app-purple rounded"></div>
            </div>
          </Link>
          <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
            Treine sua velocidade de digitação em múltiplos idiomas com diferentes níveis de dificuldade
          </p>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="py-6 text-center text-gray-400 text-sm backdrop-blur-sm border-t border-white/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} WordFlow Typing Lab. Todos os direitos reservados.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors hover:underline">Termos</a>
              <a href="#" className="hover:text-white transition-colors hover:underline">Privacidade</a>
              <a href="#" className="hover:text-white transition-colors hover:underline">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
