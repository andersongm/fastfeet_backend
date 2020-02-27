import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';
import Delivery from '../models/Delivery';

class StartDeliveryController {
  async update(req, res) {
    const sysdate = new Date();
    const { id } = req.params;
    const { deliveryman_id } = req.body;
    const delivery = await Delivery.findByPk(id);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery was not found' });
    }

    const currentHour = new Date().getHours();

    const workTime = currentHour > 8 && currentHour <= 18;

    if (!workTime) {
      return res.status(400).json({
        error: 'You can not get a delivery in out of business time!',
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

    await delivery.update({ start_date: new Date() });

    return res.json('ok');
  }
}

export default StartDeliveryController;
