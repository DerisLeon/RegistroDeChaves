import React from 'react';
import RoutesApp from './routes/rotas';
import { AuthProvider } from './contexts/auth';

const App = () => {
  return (
    <AuthProvider>
      <RoutesApp/>
    </AuthProvider>
  );
};

export default App;
