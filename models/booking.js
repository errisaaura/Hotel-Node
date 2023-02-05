'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //menerima sambungan dari user
      this.belongsTo(models.user, {
        foreignKey: 'id_user',
        as: 'user'
      })
      //menerima sambungan dari customer
      this.belongsTo(models.customer, {
        foreignKey: 'id_customer',
        as: 'customer'
      })
      //menerima sambungan dari room type
      this.belongsTo(models.room_type, {
        foreignKey: 'id_room_type',
        as: 'room_type'
      })

      //mengirim 1 to many ke detail
      this.hasMany(models.detail_booking, {
        foreignKey: 'id_booking',
        as: 'detail_booking'
      })
    }
  }
  booking.init({
    id_booking : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_user: DataTypes.INTEGER,
    id_customer: DataTypes.INTEGER,
    id_room_type: DataTypes.INTEGER,
    booking_number: DataTypes.INTEGER,
    name_customer: DataTypes.STRING,
    email: DataTypes.STRING,
    booking_date: DataTypes.DATE,
    check_in_date: DataTypes.DATE,
    check_out_date: DataTypes.DATE,
    guest_name: DataTypes.STRING,
    total_room: DataTypes.INTEGER,
    booking_status: DataTypes.ENUM('baru', 'check_in', 'check_out')
  }, {
    sequelize,
    modelName: 'booking',
    tableName: 'booking'
  });
  return booking;
};