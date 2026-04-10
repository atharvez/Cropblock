const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const clearDb = async () => {
    const db = await open({
        filename: path.join(__dirname, 'db', 'database.sqlite'),
        driver: sqlite3.Database
    });
    
    await db.exec('DELETE FROM farmers;');
    await db.exec('DELETE FROM yields;');
    await db.exec('DELETE FROM sales;');
    
    console.log("Database tables cleared successfully.");
};

clearDb().catch(console.error);
