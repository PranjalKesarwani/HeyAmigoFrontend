import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { store } from './store/store.tsx'
import { Provider } from 'react-redux'
import { SocketProvider } from './context/socketContext.tsx';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient( {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>

      <Provider store={store}>
        <SocketProvider>
          <App />
        </SocketProvider>
      </Provider>
      <ReactQueryDevtools initialIsOpen={true} buttonPosition='top-right' />
    </QueryClientProvider>
  </React.StrictMode>,
)
