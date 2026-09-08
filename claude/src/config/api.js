import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import mockData from '../data/mockData';

const HOST = '192.168.1.53'; 
const API_URL = `http://${HOST}:5000/api`;

// Configure Mock Adapter
const mock = new MockAdapter(axios, { delayResponse: 500 });

// Auth Mock
mock.onPost(`${API_URL}/auth/login`).reply(200, { 
  token: 'mock-jwt-token', 
  user: mockData.users[0] 
});

// Cases Mock
mock.onGet(`${API_URL}/cases`).reply(200, mockData.cases);
mock.onPost(`${API_URL}/cases`).reply(config => {
  const newCase = JSON.parse(config.data);
  newCase._id = `case_${Date.now()}`;
  mockData.cases.push(newCase);
  return [201, newCase];
});

// Clients Mock
mock.onGet(`${API_URL}/clients`).reply(200, mockData.clients);
mock.onPost(`${API_URL}/clients`).reply(config => {
  const newClient = JSON.parse(config.data);
  newClient._id = `client_${Date.now()}`;
  mockData.clients.push(newClient);
  return [201, newClient];
});

// Tasks Mock
mock.onGet(`${API_URL}/tasks`).reply(200, mockData.tasks);
mock.onPost(`${API_URL}/tasks`).reply(201, { _id: `task_${Date.now()}` });

// Users Mock
mock.onGet(`${API_URL}/users`).reply(200, mockData.users);

// Notes Mock
mock.onGet(`${API_URL}/notes`).reply(200, mockData.notes);

// Fallback for any other route
mock.onAny().reply(200, {});

console.log('🛡️ Mock API Adapter is Active. Intercepting calls to:', API_URL);

export { API_URL };
