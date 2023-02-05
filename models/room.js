'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      //menerima relasi dari room 
      this.belongsTo(models.room_type, {
        foreignKey: 'id_room_type',
        as: 'room_type'
      })

      //1 room memiliki many detail
      this.hasMany(models.detail_booking, {
        foreignKey: 'id_room',
        as: 'detail_booking'
      })
    }
  }
  room.init({
    id_room : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    room_number: DataTypes.INTEGER,
    id_room_type: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'room',
    tableName: 'room'
  });
  return room;
};