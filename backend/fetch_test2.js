const http = require('http');
const req = http.request('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const parsed = JSON.parse(data);
    const token = parsed.token;
    http.get('http://localhost:5000/api/tasks', {
      headers: { 'Authorization': 'Bearer ' + token }
    }, (res2) => {
      let data2 = '';
      res2.on('data', chunk => data2 += chunk);
      res2.on('end', () => {
        console.log("RAW TASKS DATA:");
        console.log(data2);
      });
    });
  });
});
req.write(JSON.stringify({email: 'kumar@kethukotai.com', password: 'password123'}));
req.end();
