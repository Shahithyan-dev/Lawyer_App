fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({email: 'kumar@kethukotai.com', password: 'password123'})
})
.then(res => res.json())
.then(res => {
  console.log('Login res:', res);
  return fetch('http://localhost:5000/api/tasks', {
    headers: { Authorization: 'Bearer ' + res.token }
  });
})
.then(res => res.json())
.then(res => {
  console.log(JSON.stringify(res, null, 2));
})
.catch(err => console.log(err.message));
