'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detail_booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      //menerima sambungan dari booking
      this.belongsTo(models.booking, {
        foreignKey: 'id_booking',
        as: 'booking'
      })

      //menerima sambungan dari room
      this.belongsTo(models.room, {
        foreignKey: 'id_room',
        as: 'room'
      })
    }
  }
  detail_booking.init({
    id_detail_booking : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_booking: DataTypes.INTEGER,
    id_room: DataTypes.INTEGER,
    access_date: DataTypes.DATE,
    total_price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'detail_booking',
    tableName: 'detail_booking'
  });
  return detail_booking;
};