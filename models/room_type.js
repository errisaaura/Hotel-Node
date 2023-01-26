'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class room_type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      //1 type room memiliki banyak room
      this.hasMany(models.room, {
        foreignKey: 'id_room_type',
        as : 'room'
      })

      //1 type room bisa banyak booking
      this.hasMany(models.booking, {
        foreignKey: 'id_room_type',
        as: 'booking'
      })
    }
  }
  room_type.init({
    id_room_type : {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name_room_type: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    photo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'room_type',
    tableName: 'room_type'
  });
  return room_type;
};