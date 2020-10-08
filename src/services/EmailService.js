class EmailService {
    async sendEmailPasswordCode(email, code, link) {
        //Defina a lógica de envio de emails aqui
        return {message: 'sended email'}
    }
}

module.exports = new EmailService();