import Brevo from '@getbrevo/brevo'

const Mail = new Brevo.TransactionalEmailsApi();
Mail.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.MAIL_API_KEY);

const sendSmtpEmail = {
    to: [{ email: 'tyler@dynamicshark.com', name: 'Tyler' }],
    sender: {email: 'gimli_aa@hotmail.com', name: 'Tyler I'},
    subject: 'Test Email from Brevo',
    htmlContent: '<html><body>This is a test email</body></html>'
};

// Send the email
async function sendEmail() {
    try {
        const data = await Mail.sendTransacEmail(sendSmtpEmail);
        console.log(data);
    } catch(error) {
        console.error(error);
    }
};

sendEmail();