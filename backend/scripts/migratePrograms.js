// backend/scripts/migratePrograms.js
const mongoose = require('mongoose');
const { Program } = require('../models');
require('dotenv').config();

const migratePrograms = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const programs = await Program.find({});
    console.log(`Found ${programs.length} programs to migrate`);

    for (const program of programs) {
      // Si schedule est un objet avec day comme array
      if (program.schedule && program.schedule.day && Array.isArray(program.schedule.day)) {
        const oldSchedule = program.schedule;
        
        // Convertir en array d'objets
        const newSchedule = oldSchedule.day.map(day => ({
          day: convertDay(day), // Convertir 'lundi' → 'monday'
          startTime: oldSchedule.startTime,
          endTime: oldSchedule.endTime,
          duration: oldSchedule.duration || calculateDuration(oldSchedule.startTime, oldSchedule.endTime)
        }));

        program.schedule = newSchedule;
        await program.save();
        console.log(`✅ Migrated: ${program.title}`);
      }
    }

    console.log('🎉 Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Convertir jours français → anglais
function convertDay(frenchDay) {
  const map = {
    'lundi': 'monday',
    'mardi': 'tuesday',
    'mercredi': 'wednesday',
    'jeudi': 'thursday',
    'vendredi': 'friday',
    'samedi': 'saturday',
    'dimanche': 'sunday'
  };
  return map[frenchDay.toLowerCase()] || frenchDay;
}

// Calculer la durée en minutes
function calculateDuration(start, end) {
  if (!start || !end) return null;
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  return (endH * 60 + endM) - (startH * 60 + startM);
}

migratePrograms();