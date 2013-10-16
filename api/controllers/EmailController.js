/**
 * EmailController
 *
 * @module    :: Controller
 * @description  :: Contains logic for handling requests.
 */

//var  _und = require('underscore');
//var util  = require('util');

//refactor
// var nodemailer = require("nodemailer");
//var transport = nodemailer.createTransport("SMTP", {
//  service:"Gmail",
//  auth:{
//    user:"jrtgtz@gmail.com",
//    pass:"Doghouse@77"
//  }
//});

var EmailController;
EmailController = {
  create: function(req, res, next) {
    console.log('--email ctrl req.body---------------------\n', req.body.Last, '--\n', req.body);
    //   res.json(200, { "status": "success"} );

    var First = req.param('First');
    var Last = req.param('Last');
    var Company = req.param('Company');
    var Street = req.param('Street');
    var City = req.param('City');
    var State = req.param('State');
    var Zip = req.param('Zip');
    var Emailaddr = req.param('Email');
    var Comment = req.param('Comment');
    var status = req.param('client_status');

    Email.create({
      First: req.param('First'),
      Last: req.param('Last'),
      Company: req.param('Company'),
      Street: req.param('Street'),
      City: req.param('City'),
      State: req.param('State'),
      Zip: req.param('Zip'),
      Email: req.param('Email'),
      Comment: req.param('Comment'),
      status: req.param('client_status')
    })
      .then(function(Email) {
        console.log('Email created::', Email);
        //  return res.json({ data: po });
      })
      .catch (function(err) {
      // console.error('er ',err)
      // return next(err);
    });


    //console.log('name ',First,Last);
    /////////////////////////////////////
    var data = req.body;
    var style = '<!DOCTYPE html> <html lang="en">';
    style += '<head>';
    style += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=us-ascii">';
    style += '<style type="text/css">';
    style += 'table, td, th {';
    style += '  border: 1px solid black;';
    style += '  }';
    style += '</style>';
    style += '</head>';
    var newdata = style + '<br/><br/><div id="alternate-rows"><table cellspacing="0">';
    newdata += '<tbody>';
    newdata += '<tr><td></td><td><b>Contact Info</b></td></tr>';

    newdata += '<tr><td>Last Name: </td><td>' + Last + '</td></tr>';
    newdata += '<tr><td>First:  </td><td>' + First + '</td></tr>';
    newdata += '<tr><td>Company:  </td><td>' + Company + '</td></tr>';
    newdata += '<tr><td>Street:  </td><td>' + Street + '</td></tr>';
    newdata += '<tr><td>City: </td><td>' + City + '</td></tr>';
    newdata += '<tr><td>State:  </td><td>' + State + '</td></tr>';
    newdata += '<tr><td>Zip: </td><td>' + Zip + '</td></tr>';
    newdata += '<tr><td>Email: </td><td>' + Emailaddr + '</td></tr>';
    newdata += '<tr><td>Comment:  </td><td>' + Comment + '</td></tr>';
    newdata += '<tr><td>BestTime:  </td><td>' + status + '</td></tr>';
    newdata += '</tbody>';// only for alt rows
    newdata += '</table>';

    var mailOptions = {
      from: Email,
      to: 'jrt@gtz.com', //+ Other_preparers_Email_address,
      subject: 'Crm email contact from ' + First + ' ' + Last,
      text: 'test\r ',
      html: newdata,
      name: First + ' ' + Last
    };
    EmailService.sendEmail(mailOptions);//{email: 'test@test.com', name: 'test'});
    res.json(200, { 'status': 'success'});
  }
};
module.exports = EmailController;
//    var Street = _und.find(data, function (num, key) {
//      return key == 'Street';
//    });
// refactored to use sails emailService
//    var mailOptions = {
//      from:Email,
//      to:"jrt@gtz.com,", //+ Other_preparers_Email_address,
//      subject:"Crm email contact from " + First+' '+Last,
//
//      text:"test\r " ,
//      html:newdata
//    }
//    console.log('Sending Mail');
//    transport.sendMail(mailOptions, function (error) {
//      if (error) {
//        console.log('Error occured');
//        console.log(error.message);
//        return;
//      }
//      console.log('Message sent successfully!');
//    });
