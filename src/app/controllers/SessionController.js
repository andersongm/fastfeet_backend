import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import DeliveryMan from '../models/Deliveryman';
import File from '../models/File';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }

  async mobileStore(req, res) {
    const { id } = req.body;

    // const deliveryMan = await DeliveryMan.findByPk(id, {
    //   include: [
    //     {
    //       model: File,
    //       as: 'avatar',
    //       attributes: ['type', 'path', 'url'],
    //     },
    //   ],
    // });
    const deliveryMan = await DeliveryMan.findOne({
      where: {
        id,
      },
      // attributes: ['name', 'email', 'createdAt'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['url', 'type', 'path'],
        },
      ],
    });

    // console.log(deliveryMan);

    if (!deliveryMan) {
      return res.status(401).json({ error: 'Deliveryman not found' });
    }

    const { name, email, createdAt } = deliveryMan;

    let url = '';
    if (deliveryMan.avatar) {
      url = deliveryMan.avatar.url;
    }

    return res.json({
      id,
      name,
      email,
      createdAt,
      url,
    });
  }
}

export default new SessionController();
