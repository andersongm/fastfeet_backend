import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import Delivery from '../models/Delivery';
import File from '../models/File';
import Recipient from '../models/Recipient';

class DeliverymanController {
  async index(req, res) {
    const { name, page } = req.query;
    const limit = page ? 5 : null;
    // eslint-disable-next-line radix
    const pageNumber = parseInt(page) || 1;
    const offset = pageNumber === 1 ? 0 : pageNumber * 5 - limit;

    const deliverymans = await Deliveryman.findAndCountAll({
      where: {
        name: {
          [Op.iLike]: name ? `%${name}%` : '%%',
        },
      },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['type', 'path', 'url'],
        },
      ],
      order: [['name', 'ASC']],
      limit,
      offset,
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
        canceled_at: {
          [Op.is]: null,
        },
      },
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email', 'createdAt'],
        },
        {
          model: Recipient,
          as: 'recipient',
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
}

export default new DeliverymanController();
