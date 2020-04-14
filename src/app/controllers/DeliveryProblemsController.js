import DeliveryProblems from '../models/DeliveryProblems';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import Queue from '../lib/Queue';
import DeliveryCancelMail from '../jobs/DeliveryCancelMail';

class DeliveryProblemsController {
  async index(req, res) {
    const { page } = req.query;
    const limit = page ? 5 : null;
    // eslint-disable-next-line radix
    const pageNumber = parseInt(page) || 1;
    const offset = pageNumber === 1 ? 0 : pageNumber * 5 - limit;

    try {
      const problems = await DeliveryProblems.findAndCountAll({
        include: [
          {
            model: Delivery,
            as: 'deliveries',
            attributes: ['product'],
          },
        ],
        order: [['id', 'ASC']],
        limit,
        offset,
      });

      if (!problems) {
        return res.status(400).json({ error: 'Problems not found' });
      }

      return res.json(problems);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async store(req, res) {
    const { id } = req.params;
    const { description } = req.body;

    try {
      const delivery = await Delivery.findByPk(id);

      if (!delivery) {
        return res.status(400).json({ error: 'Delivery not found' });
      }

      const deliveryProblem = await DeliveryProblems.create({
        delivery_id: id,
        description,
      });

      return res.json(deliveryProblem);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async show(req, res) {
    const { id } = req.params;

    try {
      const problems = await DeliveryProblems.findAll({
        where: {
          delivery_id: id,
        },
        include: [
          {
            model: Delivery,
            as: 'deliveries',
            attributes: ['product'],
          },
        ],
      });

      if (!problems) {
        return res
          .status(400)
          .json({ error: 'Problems not found for this Delivery' });
      }

      return res.json(problems);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;

    try {
      const problem = await DeliveryProblems.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Delivery,
            as: 'deliveries',
          },
        ],
      });

      if (!problem) {
        return res.json({ error: 'Problem not found for delivery' });
      }

      const { delivery_id } = problem;

      const delivery = await Delivery.findByPk(delivery_id, {
        include: [
          {
            model: Deliveryman,
            as: 'deliveryman',
          },
          {
            model: Recipient,
            as: 'recipient',
          },
        ],
      });

      if (delivery.canceled_at !== null) {
        return res.json({ error: 'Delivery already was canceled!' });
      }

      await delivery.update({
        canceled_at: new Date(),
      });

      await Queue.add(DeliveryCancelMail.key, {
        delivery,
      });

      return res.json(delivery);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new DeliveryProblemsController();
