const { DataSource, EntitySchema } = require("typeorm");

// variables to generate; entities
//const postTable = require("./entity/post.json");
//const categoryTable = require("./entity/category.json");
const uTable = require("./entity/user.json");
const pTable = require("./entity/profile.json");
const oTable = require("./entity/orders.json");


// variables to generate: datasource type, connection to datasource details, and entities
const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "migration",
    synchronize: false,
    entities: [
        //new EntitySchema(postTable),
        //new EntitySchema(categoryTable),
        new EntitySchema(uTable),
        new EntitySchema(pTable),
        new EntitySchema(oTable),
    ],
    migrations: ["src/migration/*.js"]
});

module.exports = { AppDataSource };