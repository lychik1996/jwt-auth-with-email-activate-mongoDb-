const nodemailer = require('nodemailer');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivation(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_HOST,
      to:to,
      subject: 'Activated account' + process.env.API_URL,
      text: '',
      html: `
        <div>
            <h1>Бусінка перейди по ссилці</h1>
            <a href="${link}">${link}</a>
            <p>Вельми дякую</p>
        </div>`,
    });
  }
}

module.exports = new MailService();
