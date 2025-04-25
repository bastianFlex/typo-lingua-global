
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="h-[60vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-6">Oops! Página não encontrada</p>
        <Link to="/">
          <Button className="bg-app-purple hover:bg-app-purple/90">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a Página Inicial
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
