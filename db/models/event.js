const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

module.exports = sequelize.define(
    'events',
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'title cannot be null',
                },
                notEmpty: {
                    msg: 'title cannot be empty',
                },
            },
        },
        eventImage: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
            // validate: {
            //     notNull: {
            //         msg: 'productImage cannot be null',
            //     },
            // },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'description cannot be null',
                },
                notEmpty: {
                    msg: 'description cannot be empty',
                },
            },
        },
        shortDesc: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'shortDescription cannot be null',
                },
                notEmpty: {
                    msg: 'shortDescription cannot be empty',
                },
            },
        },
        category: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'category cannot be null',
                },
            },
        },
        price: {
          type: DataTypes.DECIMAL,
          allowNull: false,
          validate: {
              notNull: {
                  msg: 'price cannot be null',
              },
              isDecimal: {
                  msg: 'price value must be in decimal',
              },
          },
        },
        venue: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Event venue has to be specified"
                }
            }
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Specify when the event begins"
                }
            }
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Event end date cannot be null"
                }
            }
        },
        createdBy: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'id',
            },
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    },
    {
        paranoid: true,
        freezeTableName: true,
        modelName: 'events',
    }
);