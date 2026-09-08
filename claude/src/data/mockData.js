const mockData = {
  cases: [
    {
      _id: 'case_1',
      title: 'Raj Kumar vs State',
      caseNumber: 'CR-1023',
      status: 'Open',
      client: { name: 'Raj Kumar', phone: '+91 9876543210' },
      court: 'District Court, No. 4',
      nextHearingDate: new Date(Date.now() + 86400000).toISOString(),
    },
    {
      _id: 'case_2',
      title: 'Arun Enterprises vs Suresh',
      caseNumber: 'CIV-2041',
      status: 'Pending',
      client: { name: 'Arun Enterprises', phone: '+91 9123456789' },
      court: 'High Court',
      nextHearingDate: new Date(Date.now() + 172800000).toISOString(),
    },
    {
      _id: 'case_3',
      title: 'Priya Sharma vs Rohit',
      caseNumber: 'FM-1022',
      status: 'Closed',
      client: { name: 'Priya Sharma', phone: '+91 9988776655' },
      court: 'Family Court',
      nextHearingDate: null,
    }
  ],
  clients: [
    { _id: 'client_1', name: 'Raj Kumar', phone: '+91 9876543210', email: 'raj@example.com' },
    { _id: 'client_2', name: 'Arun Enterprises', phone: '+91 9123456789', email: 'contact@arunent.com' },
    { _id: 'client_3', name: 'Priya Sharma', phone: '+91 9988776655', email: 'priya@example.com' }
  ],
  tasks: [
    {
      _id: 'task_1',
      title: 'Draft Bail Application',
      description: 'Draft the initial bail application for Raj Kumar.',
      status: 'Pending',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      case: { _id: 'case_1', title: 'Raj Kumar vs State', caseNumber: 'CR-1023' }
    },
    {
      _id: 'task_2',
      title: 'Review Civil Contract',
      description: 'Review the disputed contract clauses for Arun Enterprises.',
      status: 'Completed',
      dueDate: new Date(Date.now() - 86400000).toISOString(),
      case: { _id: 'case_2', title: 'Arun Enterprises vs Suresh', caseNumber: 'CIV-2041' }
    }
  ],
  users: [
    { _id: 'user_1', name: 'Advocate Kumar', role: 'senior', email: 'kumar@kethukotai.com' },
    { _id: 'user_2', name: 'Junior Ravi', role: 'junior', email: 'ravi@kethukotai.com' },
    { _id: 'user_3', name: 'Assistant Priya', role: 'staff', email: 'priya@kethukotai.com' }
  ],
  notes: [
    { _id: 'note_1', title: 'Hearing Prep', content: 'Ensure all documents are signed for CR-1023.', date: new Date().toISOString() },
    { _id: 'note_2', title: 'Meeting Notes', content: 'Client requested to expedite the civil matter.', date: new Date().toISOString() }
  ]
};

export default mockData;
