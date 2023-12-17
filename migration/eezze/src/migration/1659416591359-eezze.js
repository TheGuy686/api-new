const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class eezze1659416591359 {
    name = 'eezze1659416591359'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`post\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`title\` varchar(255) NOT NULL,
                \`text\` text NOT NULL,
                \`test\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`category\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`post_categories_category\` (
                \`postId\` int NOT NULL,
                \`categoryId\` int NOT NULL,
                INDEX \`IDX_93b566d522b73cb8bc46f7405b\` (\`postId\`),
                INDEX \`IDX_a5e63f80ca58e7296d5864bd2d\` (\`categoryId\`),
                PRIMARY KEY (\`postId\`, \`categoryId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`post_categories_category\`
            ADD CONSTRAINT \`FK_93b566d522b73cb8bc46f7405bd\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`post_categories_category\`
            ADD CONSTRAINT \`FK_a5e63f80ca58e7296d5864bd2d3\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`post_categories_category\` DROP FOREIGN KEY \`FK_a5e63f80ca58e7296d5864bd2d3\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`post_categories_category\` DROP FOREIGN KEY \`FK_93b566d522b73cb8bc46f7405bd\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_a5e63f80ca58e7296d5864bd2d\` ON \`post_categories_category\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_93b566d522b73cb8bc46f7405b\` ON \`post_categories_category\`
        `);
        await queryRunner.query(`
            DROP TABLE \`post_categories_category\`
        `);
        await queryRunner.query(`
            DROP TABLE \`category\`
        `);
        await queryRunner.query(`
            DROP TABLE \`post\`
        `);
    }
}
