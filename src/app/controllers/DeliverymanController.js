import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';

class DeliverymanController {
  async index(req, res) {
    const { q } = req.query;

    const deliverymans = await Deliveryman.findAll({
      where: {
        name: {
          [Op.iLike]: q ? `%${q}%` : '%%',
        },
      },
    });

    res.json(deliverymans);
  }

  async show(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(401).json({ error: 'Deliveryman was not provided' });
    }

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: id,
        canceled_at: null,
      },
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(deliveries);
  }

  async store(req, res) {
    const courier = await Deliveryman.create(req.body);
    return res.json(courier);
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      const deliveryman = await Deliveryman.findByPk(id);

      await deliveryman.update(req.body);

      return res.json(deliveryman);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      const deliveryman = await Deliveryman.findByPk(id);

      await deliveryman.destroy();

      return res.json('ok');
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  /* async update(req, res) {
    const { id } = req.params;
    const sysdate = new Date();
    const { delivery_id, ...restUpdate } = req.body;

    // console.log(startOfDay(sysdate));
    // console.log(endOfDay(sysdate));

    // Checar quantidade de Entregas
    const contDelivery = await Delivery.count({
      where: {
        deliveryman_id: id,
        canceled_at: null,
        start_date: {
          [Op.between]: [startOfDay(sysdate), endOfDay(sysdate)],
        },
      },
    });

    if (contDelivery > 4) {
      return res
        .status(400)
        .json({ error: 'Limit deliveries was achieved for you today' });
    }

    const delivery = await Delivery.findByPk(delivery_id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery was not found' });
    }

    await delivery.update(restUpdate);

    return res.json('ok');
  } */
}

export default new DeliverymanController();
