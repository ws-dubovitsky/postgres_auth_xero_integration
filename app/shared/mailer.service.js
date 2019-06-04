(function () {
  'use strict';

  const Promise = require('bluebird');
  const config		= require('../../config/config');
  const nodemailer = require('nodemailer');

  const emailAuthor = config.EMAIL_SERVICE_LOGIN;
  const emailPassword = config.EMAIL_SERVICE_PASSWORD;
  const clientUrl = config.EMAIL_CLIENT_URL;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailAuthor,
      pass: emailPassword
    }
  });


  module.exports = {
    sendActivation,
    sendResetToken,
  };

  function sendEmail(params) {
    return new Promise((resolve, reject) => {
      transporter.sendMail(params, (err, info) => {
        if(err) {
          reject(err)
        } else {
          resolve(info)
        }
      });
    })
  }


  function sendActivation(params) {
    let content = {
      from: emailAuthor,
      to: params.email,
      subject: 'Account activation',
      html: `
        <h2>Hi, <span style="color: red">${params.username}</span>! Did you signup on the <a href="${clientUrl}">Queens Beans</a> website?</h2>
        <p>If it wasn’t you just ignore this message</p>
        <h2>Or, To confirm your email follow the link <a href="${clientUrl}/account/activation/${params.activationToken}">${clientUrl}/account/activation/${params.activationToken}</a></h2>
      `
    }
    return sendEmail(content);
  }



  function sendResetToken(params) {
    let content = {
      from: emailAuthor,
      to: params.email,
      subject: 'Change password',
      html: `
        <h2>Hi, <span style="color: red">${params.username}</span>! You trying to change password on <a href="${clientUrl}">Queens Beans</a> website.</h2>
        <p>If it wasn’t you just ignore this message</p>
        <h2>If you realy want create new password please follow the link <a href="${clientUrl}/account/password/${params.resetToken}">${clientUrl}/account/password/${params.resetToken}</a></h2>
      `
    }
    return sendEmail(content);
  }

})();