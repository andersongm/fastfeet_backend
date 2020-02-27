import * as Yup from 'yup';
import { Op } from 'sequelize';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { q } = req.query;

    const recipients = await Recipient.findAll({
      where: {
        name: {
          [Op.iLike]: q ? `%${q}%` : '%%',
        },
      },
    });

    res.json(recipients);
  }

  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        street: Yup.string().required(),
        number: Yup.number().required(),
        complement: Yup.string().required(),
        state: Yup.string().required(),
        city: Yup.string().required(),
        zip_code: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails' });
      }

      const recipient = await Recipient.create(req.body);
      return res.json(recipient);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);

    await recipient.update(req.body);

    return res.json(recipient);
  }
}

export default new RecipientController();
