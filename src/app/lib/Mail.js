import nodemailer from 'nodemailer';
import { resolve } from 'path';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import mailConfig from '../../config/mail';

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig;
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.configureTemplates();
  }

  configureTemplates() {
    const viewPath = resolve(__dirname, '..', 'views', 'emails');

    this.transporter.use(
      'compile',
      nodemailerhbs({
        viewEngine: exphbs.create({
          layoutsDir: resolve(viewPath, 'layouts'),
          partialsDir: resolve(viewPath, 'partials'),
          defaultLayout: 'default',
          extname: '.hbs',
        }),
        viewPath,
        extName: '.hbs',
      })
    );
  }

  // sendMail(message) {
  //   console.log('Mail Sent', message);
  //   return this.transporter.sendMail({
  //     ...mailConfig.default,
  //     ...message,
  //   });
  // }

  sendMail(message) {
    try {
      const response = this.transporter.sendMail({
        ...mailConfig.default,
        ...message,
      });
      return response;
    } catch (error) {
      return `Erro ao Enviar Email:${error}`;
    }
  }
}

export default new Mail();
