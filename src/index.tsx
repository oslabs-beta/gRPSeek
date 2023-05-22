import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './client/components/App';
import { Provider } from 'react-redux';
// import store from './redux/store'

const root = createRoot(document.getElementById('root'));
root.render(
    // <Provider store={store}>
        <App />
    // </Provider>
)
