module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('deliveryproblems', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      delivery_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'deliveries',
          key: 'id',
        },
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('deliveryproblems');
  },
};
