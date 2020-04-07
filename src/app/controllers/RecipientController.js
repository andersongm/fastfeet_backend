import * as Yup from 'yup';
import { Op } from 'sequelize';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { name, page } = req.query;
    const limit = 5;
    // eslint-disable-next-line radix
    const pageNumber = parseInt(page) || 1;
    const offset = pageNumber === 1 ? 0 : pageNumber * 5 - limit;

    const recipients = await Recipient.findAndCountAll({
      where: {
        name: {
          [Op.iLike]: name ? `%${name}%` : '%%',
        },
      },
      order: [['name', 'ASC']],
      limit,
      offset,
    });

    res.json(recipients);
  }

  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        street: Yup.string().required(),
        number: Yup.number().required(),
        complement: Yup.string(),
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
