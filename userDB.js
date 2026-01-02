const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'host.docker.internal', 
    port: '3306',
    user: 'root',
    password: '1234',
    database: 'calculator',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function getLogs(method, values) {
    try {
    await pool.execute(
        "INSERT INTO logs (request_time, method, value_list) VALUES (NOW(), ?, ?)",
        [method, JSON.stringify(values)]
      );
    } catch (err) {
      console.error('DB 오류:', err);
    }
}

module.exports = { pool, getLogs };


