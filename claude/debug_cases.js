const axios = require('axios');
(async () => {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {username: 'ravi@kethukotai.com', password: 'password123'});
    const token = loginRes.data.token;
    
    const [profileRes, casesRes, tasksRes] = await Promise.all([
      axios.get('http://localhost:5000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:5000/api/cases', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${token}` } })
    ]);
    
    const user = profileRes.data.data;
    
    const myTasks = tasksRes.data.data.filter(t => 
      t.assignedTo && (t.assignedTo === user._id || (t.assignedTo._id && t.assignedTo._id.toString() === user._id.toString()))
    );
    
    console.log("Ravi myTasks length:", myTasks.length);
    if(myTasks.length > 0) {
      console.log("Task title:", myTasks[0].title);
      console.log("Task relatedCase:", JSON.stringify(myTasks[0].relatedCase, null, 2));
    }
    
    const caseIdsFromTasks = myTasks.map(t => {
      const id = t.relatedCase?._id || t.relatedCase;
      return id ? id.toString() : null;
    }).filter(Boolean);
    
    console.log("caseIdsFromTasks:", caseIdsFromTasks);
    
    const myCases = casesRes.data.data.filter(c => {
      const isDirectlyAssigned = c.assignedTo && c.assignedTo.some(id => {
        const assignId = id._id || id;
        return assignId.toString() === user._id.toString();
      });
      const hasTaskInCase = caseIdsFromTasks.includes(c._id.toString());
      return isDirectlyAssigned || hasTaskInCase;
    });
    
    console.log("Ravi myCases length:", myCases.length);
  } catch(e) {
    console.error(e.response ? e.response.data : e.message);
  }
})();
