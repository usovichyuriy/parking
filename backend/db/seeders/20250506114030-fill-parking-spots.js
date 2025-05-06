'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const parkingSpots = [];

    for (let i = 1; i <= 10; i++) {
      parkingSpots.push({
        id: i,
        location: faker.location.streetAddress(),
      });
    }
    await queryInterface.bulkInsert('parking_spots', parkingSpots);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('parking_spots', null, {});
  },
};
