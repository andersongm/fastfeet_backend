import Mail from '../lib/Mail';

class DeliveryCancelMail {
  get key() {
    return 'DeliveryCancelMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Entrega Cancelada',
      template: 'delivery_cancel',
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
  }
}

export default new DeliveryCancelMail();
