const mongoose = require('mongoose');
const Client = require('./models/Client');
const Case = require('./models/Case');
const Task = require('./models/Task');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lexora')
  .then(async () => {
    console.log('Connected to MongoDB for seeding');

    // Get the first client
    const client = await Client.findOne();
    if (!client) {
      console.log('No clients found. Seed clients first.');
      process.exit(1);
    }

    // Create a Case
    const newCase = await Case.create({
      caseId: 'CR-1023',
      title: 'Raj Kumar vs State',
      type: 'Criminal',
      court: 'District Court, Court No. 4',
      client: client._id,
      status: 'Active',
      nextHearing: new Date('2026-08-28')
    });
    console.log('Case seeded:', newCase.caseId);

    // Create a Task
    const newTask = await Task.create({
      title: 'Prepare Bail Petition',
      description: 'Draft and finalize the bail petition for Raj Kumar. Needs to be submitted before the Friday hearing.',
      caseReference: newCase._id,
      priority: 'HIGH PRIORITY',
      status: 'In Progress',
      assignedTo: 'Advocate Kumar',
      dueDate: new Date('2026-08-28')
    });
    console.log('Task seeded:', newTask.title);

    console.log('Seeding complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
