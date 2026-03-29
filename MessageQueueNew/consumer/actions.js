function sendEmail(message) {
  console.log(`sending email ${message.content}`);
}

function sendSms(message) {
  console.log(`sending sms ${message.content}`);
}

function sendFcm(message) {
  console.log(`sending fcm ${message.content}`);
}

module.exports = { sendEmail, sendSms, sendFcm };
