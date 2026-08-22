require('dotenv').config();
const mongoose = require('mongoose');
const Note = require('../models/Note');
const Decision = require('../models/Decision');

/**
 * Initialize database with required text indexes
 * Run this script once after setting up MongoDB
 */
async function initDatabase() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Create text indexes
    console.log('📑 Creating text indexes...');
    
    // Notes text index
    await Note.collection.createIndex({ text: 'text' });
    console.log('✅ Created text index on notes.text');

    // Decisions text index
    await Decision.collection.createIndex({ 
      situationSummary: 'text', 
      reasoning: 'text' 
    });
    console.log('✅ Created text index on decisions.situationSummary and decisions.reasoning');

    console.log('🎉 Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
