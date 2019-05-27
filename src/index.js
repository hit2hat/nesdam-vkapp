import React from 'react';
import ReactDOM from 'react-dom';
import connect from '@vkontakte/vkui-connect-promise';
import App from './App';

import '@vkontakte/vkui/dist/vkui.css';

// Init VK App
connect.send('VKWebAppInit', {});

ReactDOM.render(<App />, document.getElementById('root'));
