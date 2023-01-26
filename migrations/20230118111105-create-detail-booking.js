'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detail_booking', {
      id_detail_booking: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_booking: {
        type: Sequelize.INTEGER,
        references: {
          model : "booking",
          key: "id_booking"
        }
      },
      id_room: {
        type: Sequelize.INTEGER,
        references: {
          model : "room",
          key: "id_room"
        }
      },
      access_date: {
        type: Sequelize.DATE
      },
      total_price: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('detail_booking');
  }
};