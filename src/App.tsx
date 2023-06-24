import React from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './components/Map';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client = {queryClient}>
      <Map></Map>;
    </QueryClientProvider>
  );
}

export default App;
