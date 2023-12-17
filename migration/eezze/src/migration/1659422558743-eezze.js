const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class eezze1659422558743 {
    name = 'eezze1659422558743'

    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`category\`
            ADD \`type\` varchar(255) NOT NULL
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`category\` DROP COLUMN \`type\`
        `);
    }
}
