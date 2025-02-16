'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../../config/database');
const AppError = require('../../utils/appError');
const event = require('./event');

const user = sequelize.define(
  'users',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    role: {
      type: DataTypes.ENUM('Admin', 'Guest', 'Organizer', 'User'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'User role cannot be null',
        },
        notEmpty: {
          msg: 'User role cannot be empty'
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'firstName cannot be null',
        },
        notEmpty: {
          msg: 'firstName cannot be empty'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'lastName cannot be null',
        },
        notEmpty: {
          msg: 'lastName cannot be empty'
        }
      }
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'username cannot be null',
        },
        notEmpty: {
          msg: 'username cannot be empty'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'email cannot be null',
        },
        notEmpty: {
          msg: 'email cannot be empty'
        },
        isEmail: {
          msg: 'Invalid email'
        }
      }
    },
    // role: {
    //   type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     notNull: {
    //       msg: 'role cannot be null',
    //     },
    //     notEmpty: {
    //       msg: 'role cannot be empty'
    //     }
    //   }
    // },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'password cannot be null',
        },
        notEmpty: {
          msg: 'password cannot be empty'
        }
      }
    },
    confirmPassword: {
      type: DataTypes.VIRTUAL,
        set(value) {
          if (this.password.length < 7) {
              throw new AppError(
                  'Password length must be grater than 7',
                  400
              );
          }
          if (value === this.password) {
              const hashPassword = bcrypt.hashSync(value, 10);
              this.setDataValue('password', hashPassword);
          } else {
              throw new AppError(
                  'Password and confirm password must be the same',
                  400
              );
          }
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE
    }
  },

  {
    paranoid: true,
    freezeTableName: true,
    modelName: 'users'
  },
);

user.hasMany(event, { foreignKey: 'createdBy' });
event.belongsTo(user, {
  foreignKey: 'createdBy',
});

module.exports =  user;