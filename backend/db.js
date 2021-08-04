const Pool = require("pg").Pool;

const pool = new Pool({
    user: "sam_flamini",
    host: "localhost",
    port: 5432,
    database: "payrollapp"
});

module.exports = pool;