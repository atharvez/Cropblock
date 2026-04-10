const db = require('./db/connection');

async function fix() {
  try {
    await db.query("UPDATE farmers SET crop_type = 'Grains', location = 'Delhi' WHERE crop_type IS NULL");
    console.log("Fixed DB");
    process.exit(0);
  } catch(e) {
    console.error(e);
  }
}

fix();
