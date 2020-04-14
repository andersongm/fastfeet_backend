import Mail from '../lib/Mail';

class DeliveryRegisteredMail {
  get key() {
    return 'DeliveryRegisteredMail';
  }

  async handle({ data }) {
    const { delivery } = data;

    Mail.sendMail({
      to: `${delivery.deliveryman.name} <${delivery.deliveryman.email}>`,
      subject: 'Entrega Registrada',
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
  }
}

export default new DeliveryRegisteredMail();
