"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "John Doe",
          password: "Motdepasse123",
          firstname: "John",
          lastname: "Doe",
          email: "john.doe@gmail.com",
        },
        {
          username: "JBoulay",
          password: "Motdepasse123",
          firstname: "Jean",
          lastname: "Boulay",
          email: "jean.boulay@gmail.com",
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { password: "Motdepasse123" }, {});
  },
};
