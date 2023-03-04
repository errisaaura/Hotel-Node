'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('booking', {
      id_booking: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id_user"
        }
      },
      id_customer: {
        type: Sequelize.INTEGER,
        references: {
          model: "customer",
          key: "id_customer"
        }
      },
      id_room_type: {
        type: Sequelize.INTEGER,
        references: {
          model: "room_type",
          key: "id_room_type"
        }
      },
      booking_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      name_customer: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      booking_date: {
        type: Sequelize.DATE
      },
      check_in_date: {
        type: Sequelize.DATE
      },
      check_out_date: {
        type: Sequelize.DATE
      },
      guest_name: {
        type: Sequelize.STRING
      },
      total_room: {
        type: Sequelize.INTEGER
      },
      booking_status: {
        type: Sequelize.ENUM('baru', 'check_in', 'check_out')
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
    await queryInterface.dropTable('booking');
  }
};