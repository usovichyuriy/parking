'use strict';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const users = [];

    for (let i = 1; i <= 10; i++) {
      const password = await bcrypt.hash(faker.internet.password(), 10);

      users.push({
        id: i,
        email: faker.internet.email(),
        password,
      });
    }
    await queryInterface.bulkInsert('users', users);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
