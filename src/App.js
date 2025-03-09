import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context';
import Router from './routes/Routes'

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <div>
          <Router></Router>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App;