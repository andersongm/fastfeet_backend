module.exports = {
  up: QueryInterface => {
    return QueryInterface.bulkInsert('delivery_problems', [
      {
        delivery_id: 201,
        description: 'massa. Vestibulum accumsan',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        delivery_id: 212,
        description: 'tristique ac, eleifend',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        delivery_id: 220,
        description: 'odio sagittis semper.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        delivery_id: 238,
        description: 'Aenean sed pede',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        delivery_id: 225,
        description: 'nonummy ipsum non',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        delivery_id: 240,
        description: 'tellus. Aenean egestas',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        delivery_id: 234,
        description: 'vitae semper egestas,',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        delivery_id: 260,
        description: 'massa. Suspendisse eleifend.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        delivery_id: 288,
        description: 'vitae, erat. Vivamus',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        delivery_id: 279,
        description: 'quis turpis vitae',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('delivery_problems', null, {});
  },
};
