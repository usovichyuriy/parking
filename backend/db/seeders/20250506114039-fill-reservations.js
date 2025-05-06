'use strict';
const { faker } = require('@faker-js/faker');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const reservations = [];
    const status = ['booked', 'cancelled'];

    const todayDate = new Date();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(todayDate.getDate() - 1);

    for (let i = 1; i <= 10; i++) {
      const date = faker.date
        .between({
          from: yesterdayDate,
          to: todayDate,
        })
        .toISOString()
        .split('T')[0];

      const hours = String(faker.number.int({ min: 0, max: 23 })).padStart(
        2,
        '0',
      );
      const time = `${hours}:00`;

      reservations.push({
        id: i,
        user_id: faker.number.int({ min: 1, max: 10 }),
        parking_spot_number: faker.number.int({ min: 1, max: 10 }),
        reserved_date: date,
        reserved_time: time,
        status: status[Math.floor(Math.random() * status.length)],
      });
    }
    await queryInterface.bulkInsert('reservations', reservations);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('reservations', null, {});
  },
};
