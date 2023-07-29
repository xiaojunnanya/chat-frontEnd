import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import 'normalize.css'
import { BrowserRouter } from 'react-router-dom'

import AuthRouter from './utils/authRouter';

import App from './App';
import '@/assets/css/index.css'
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
    <BrowserRouter>
        <Provider store={store}>
            <AuthRouter>
                <Suspense fallback="">
                    <App></App>
                </Suspense>
            </AuthRouter>
        </Provider>
    </BrowserRouter>
)