const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Load models
const User = require('./models/User');
const Client = require('./models/Client');
const Case = require('./models/Case');
const Task = require('./models/Task');
const Note = require('./models/Note');
const Payment = require('./models/Payment');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

const users = [
  { name: 'Advocate Kumar', email: 'kumar@kethukotai.com', password: 'password123', role: 'admin' },
  { name: 'Junior Ravi', email: 'ravi@kethukotai.com', password: 'password123', role: 'staff' },
  { name: 'Assistant Priya', email: 'priya@kethukotai.com', password: 'password123', role: 'staff' }
];

// Import into DB
const importData = async () => {
  try {
    await User.deleteMany();
    await Client.deleteMany();
    await Case.deleteMany();
    await Task.deleteMany();
    await Note.deleteMany();
    await Payment.deleteMany();

    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0]._id;

    const clients = [
      { name: 'Raj Kumar', phone: '+91 9876543210', email: 'raj@example.com', addedBy: adminUser },
      { name: 'Arun Enterprises', phone: '+91 9123456789', email: 'contact@arunent.com', type: 'Corporate', companyName: 'Arun Enterprises', addedBy: adminUser },
      { name: 'Priya Sharma', phone: '+91 9988776655', email: 'priya@example.com', addedBy: adminUser }
    ];

    const createdClients = await Client.create(clients);

    const cases = [
      { title: 'Raj Kumar vs State', caseNumber: 'CR-1023', type: 'Criminal', status: 'Open', client: createdClients[0]._id, assignedTo: [adminUser], court: 'District Court, No. 4', nextHearingDate: new Date(Date.now() + 86400000) },
      { title: 'Arun Enterprises vs Suresh', caseNumber: 'CIV-2041', type: 'Civil', status: 'Pending', client: createdClients[1]._id, assignedTo: [adminUser], court: 'High Court', nextHearingDate: new Date(Date.now() + 172800000) },
      { title: 'Priya Sharma vs Rohit', caseNumber: 'FM-1022', type: 'Family', status: 'Closed', client: createdClients[2]._id, assignedTo: [adminUser], court: 'Family Court' }
    ];

    const createdCases = await Case.create(cases);

    const tasks = [
      { title: 'Draft Bail Application', description: 'Draft the initial bail application for Raj Kumar.', status: 'Pending', dueDate: new Date(Date.now() + 86400000), relatedCase: createdCases[0]._id, relatedClient: createdClients[0]._id, createdBy: adminUser },
      { title: 'Review Civil Contract', description: 'Review the disputed contract clauses for Arun Enterprises.', status: 'Completed', dueDate: new Date(Date.now() - 86400000), relatedCase: createdCases[1]._id, relatedClient: createdClients[1]._id, createdBy: adminUser }
    ];

    await Task.create(tasks);

    const notes = [
      { title: 'Hearing Prep', content: 'Ensure all documents are signed for CR-1023.', relatedCase: createdCases[0]._id, createdBy: adminUser },
      { title: 'Meeting Notes', content: 'Client requested to expedite the civil matter.', relatedClient: createdClients[1]._id, createdBy: adminUser }
    ];

    await Note.create(notes);

    const payments = [
      { amount: 5000, status: 'Completed', method: 'Cash', client: createdClients[0]._id, case: createdCases[0]._id, recordedBy: adminUser, notes: 'Initial Retainer' },
      { amount: 15000, status: 'Pending', method: 'Bank Transfer', client: createdClients[1]._id, case: createdCases[1]._id, recordedBy: adminUser }
    ];

    await Payment.create(payments);

    console.log('Data Imported...');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Client.deleteMany();
    await Case.deleteMany();
    await Task.deleteMany();
    await Note.deleteMany();
    await Payment.deleteMany();

    console.log('Data Destroyed...');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please provide -i to import or -d to delete');
  process.exit();
}
