import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Recipient from '../models/Recipient';
import Queue from '../lib/Queue';
import DeliveryRegiteredMail from '../jobs/DeliveryRegisteredMail';

class DeliveryController {
  async index(req, res) {
    const { product, page } = req.query;
    const limit = page ? 5 : null;

    // eslint-disable-next-line radix
    const pageNumber = parseInt(page) || 1;
    const offset = pageNumber === 1 ? 0 : pageNumber * 5 - limit;

    const deliveries = await Delivery.findAndCountAll({
      where: {
        product: {
          [Op.iLike]: product ? `%${product}%` : '%%',
        },
      },
      order: [['id', 'ASC']],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'avatar_id'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['url', 'type', 'path'],
            },
          ],
        },
        {
          model: Recipient,
          as: 'recipient',
        },
        {
          model: File,
          as: 'signature',
          attributes: ['url', 'type', 'path'],
        },
      ],
      offset,
      limit,
    });

    res.json(deliveries);
  }

  async show(req, res) {
    const { id } = req.params;
    // eslint-disable-next-line radix

    const delivery = await Delivery.findByPk(id, {
      order: [['id', 'ASC']],
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'avatar_id'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['url', 'type', 'path'],
            },
          ],
        },
        {
          model: Recipient,
          as: 'recipient',
        },
        {
          model: File,
          as: 'signature',
          attributes: ['url', 'type', 'path'],
        },
      ],
    });

    res.json(delivery);
  }

  async store(req, res) {
    try {
      const { id } = await Delivery.create(req.body);

      const delivery = await Delivery.findByPk(id, {
        include: [
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['name', 'email'],
          },
          {
            model: Recipient,
            as: 'recipient',
          },
        ],
      });

      await Queue.add(DeliveryRegiteredMail.key, {
        delivery,
      });

      return res.json(delivery);
    } catch (error) {
      console.log('Falha ao Registrar Encomenda:', error.message);
      return res.status(500).json({
        error:
          'Falha no Servidor. Entre em contato com o Administrador do Sistema',
      });
    }
  }

  async update(req, res) {
    const { id, operation } = req.params;
    const sysdate = new Date();
    const { deliveryman_id, signature_id, recipient_id, product } = req.body;
    let data = null;

    const delivery = await Delivery.findOne({
      where: {
        id,
        canceled_at: null,
        end_date: null,
      },
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: Recipient,
          as: 'recipient',
        },
      ],
    });

    if (!delivery) {
      return res.status(400).json({
        error: 'Delivery was not found or already canceled/finished!',
      });
    }

    if (operation === 'start') {
      // Checar horário de Trabalho do Entregador
      const currentHour = new Date().getHours();
      const workTime = currentHour > 8 && currentHour <= 23;

      if (!workTime) {
        return res.json({
          error: 'You can not get a delivery out of business time!',
        });
      }

      // Checar quantidade de Entregas
      const contDelivery = await Delivery.count({
        where: {
          deliveryman_id,
          canceled_at: null,
          start_date: {
            [Op.between]: [startOfDay(sysdate), endOfDay(sysdate)],
          },
        },
      });

      if (contDelivery > 5) {
        return res
          .status(400)
          .json({ error: 'You can withdraw only 5 deliveries per day!' });
      }

      data = {
        start_date: new Date(),
      };
    } else if (operation === 'end') {
      // Check Signature ID
      if (!signature_id) {
        return res.status(400).json({
          error: 'Signature was not informed!',
        });
      }

      const signature = await File.findOne({
        where: {
          id: signature_id,
        },
      });

      if (!signature) {
        return res.status(400).json({
          error: 'Signature was not found!',
        });
      }

      data = {
        signature_id,
        end_date: new Date(),
      };
    } else {
      data = {
        recipient_id,
        deliveryman_id,
        product,
      };
    }

    await delivery.update(data);

    return res.json('ok');
  }

  async delete(req, res) {
    const { id } = req.params;

    await Delivery.destroy({
      where: {
        id,
      },
    });

    return res.json('ok');
  }
}

export default new DeliveryController();
