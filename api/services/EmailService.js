// EmailService.js - in api/services
var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: 'jrtgtz@gmail.com',
    pass: 'Doghouse@77'
  }
});


exports.sendEmail = function(options) {

//  console.log('=================================\n')
//  console.log('ops ',options)
//  console.log('=================================\n')
//  console.log('from', options.from)
//  console.log('to', options.to)
//  console.log('html ', options.html)
//  console.log('=================================\n')
//  console.log('html ', options.name)
//  console.log('=================================\n')
  var mailOptions = {

    from: options.from,

    to: 'jrt@gtz.com', //+ Other_preparers_Email_address,
    subject: 'Crm email contact from ' + options.name,//First+' '+Last,
    text: 'test\r ' ,
    html: options.html
  };
  transport.sendMail(mailOptions, function(error) {
    if (error) {
      console.log('Error occured');
      console.log(error.message);
      return;
    }
    console.log('Message sent successfully!');
  });


};
