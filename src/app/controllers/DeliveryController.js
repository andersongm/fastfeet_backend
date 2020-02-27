import { startOfDay, endOfDay, subHours } from 'date-fns';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Mail from '../lib/Mail';
import Recipient from '../models/Recipient';

class DeliveryController {
  async index(req, res) {
    const { q } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        product: {
          [Op.iLike]: q ? `%${q}%` : '%%',
        },
      },
    });

    res.json(deliveries);
  }

  async store(req, res) {
    const { id } = await Delivery.create(req.body);

    const delivery = await Delivery.findByPk(id, {
      include: [
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name'],
        },
        {
          model: Recipient,
          as: 'recipient',
        },
      ],
    });

    // const { name } = await Deliveryman.findByPk(delivery.deliveryman_id);

    Mail.sendMail({
      // to: `${appointment.provider.name} <${appointment.provider.email}>`,
      to: 'and.gmartins@gmail.com',
      subject: 'Encomenda Registrada',
      template: 'delivery',
      context: {
        deliveryman: delivery.deliveryman.name,
        recipient: delivery.recipient.name,
        product: delivery.product,
        address: `${delivery.recipient.street}, ${delivery.recipient.number}`,
        complement: delivery.recipient.complement,
        state: delivery.recipient.state,
        city: delivery.recipient.city,
        zipcode: delivery.recipient.zip_code,
      },
    });

    return res.json(delivery);
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
    });

    if (!delivery) {
      return res.status(400).json({
        error: 'Delivery was not found or already canceled/finished!',
      });
    }

    if (operation === 'start') {
      // Checar horário de Trabalho do Entregador
      const currentHour = new Date().getHours();
      const workTime = currentHour > 8 && currentHour <= 18;

      if (!workTime) {
        return res.status(400).json({
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
    } else if (operation === 'cancel') {
      data = {
        canceled_at: new Date(),
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
}

export default new DeliveryController();
