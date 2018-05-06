'use strict';

var fs = require('fs');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nabavki.info@gmail.com',
    pass: 'qazxsw.123'
  }
});

var mailOptions = {
  from: 'nabvaki.info@gmail.com',
  to: 'nabavki.info@gmail.com',
  subject: 'е-набавки',
  text: 'огласи'
};

var read = [];

var file_emails = 'emails.txt';
var file_settings = 'settings.txt';
global.emails = [];
global.interval = 3;
global.keywords = [];
var first = true;

fs.readFile(file_emails, 'utf8', function(err, data){
  if(err)
    throw err;
  global.emails = data.split(',');
});

fs.readFile(file_settings, 'utf8', function(err, data){
  if(err)
    throw err;
  var settings = data.split(',');
  interval = settings[0];
  for(let i = 1; i<settings.length; i++)
    keywords.push(settings[i].trim());
});

setInterval(() => {
  main();
console.log(interval);
}, interval*1000);
// main()

// console.log("interval: " + interval);

function main() {
  // var fs = require('fs');
  // console.log("vo main, interval: " + interval);
  var spawn = require('child_process').spawn;
  var args = ["./k1.js"];

  var options = {};


  var dataString = "";
  let count = 0;
  var phantomExecutable = 'phantomjs';

  // var searchString = process.argv[2];
  // var file_emails = 'emails.txt';
  // var file_settings = 'settings.txt';
  // global.emails = [];
  // global.interval = 2;
  // global.keywords = [];
  //
  // fs.readFile(file_emails, 'utf8', function(err, data){
  //   if(err)
  //     throw err;
  //   this.emails = data.split(',');
  // });
  //
  // fs.readFile(file_settings, 'utf8', function(err, data){
  //   if(err)
  //     throw err;
  //   settings = data.split(',');
  //   interval = settings[0];
  //   for(let i = 1; i<settings.length; i++)
  //     keywords.push(settings[i]);
  // });

  function Uint8ArrToString(myUint8Arr){
      // return String.fromCharCode.apply(null, myUint8Arr);
      return myUint8Arr.toString();
  };

  var child = spawn(phantomExecutable, args, options);
  // console.log("interval * 1000 : " + interval * 1000);

  // setInterval(() => {
  //   console.log("interval : " + interval);
  //   var child = spawn(phantomExecutable, args, options);
  // }, interval * 1000);

  child.stdout.on('data', function(data) {
    // for(let i = 0; i<emails.length; i++)
    //   console.log("emails: " + emails[i]);
    // console.log("interval: " + interval);
    // for(let i = 0; i<keywords.length; i++)
    //   console.log("keywords: " + keywords[i]);

    // console.log("searchString: " + searchString);
    // process.argv.forEach(function (val, index, array) {
    //   console.log(index + ': ' + val);
    // });
    // interval*=1000;
    // count++;
    // if(count % 2 == 0){
    //   setInterval(() => {
    //     var textData = Uint8ArrToString(data);
    //     this.dataString = textData;
    //
    //     let ttime = interval/2;
    //     setTimeout(() => {
    //       let dataArr = this.dataString.split('--novred--');
    //       for(let i = 0; i<dataArr.length; i++)
    //       {
    //         if(dataArr[i].indexOf('сирење') != -1){
    //           console.log(dataArr[i]);
    //         }
    //       }
    //     }, ttime);
    //   }, interval);
    // }


    count++;
    if(count == 2){
      var textData = Uint8ArrToString(data);
      this.dataString = textData;
      var send = true;

      setTimeout(() => {
        let dataArr = this.dataString.split('--novred--');
        for(let i = 0; i<dataArr.length; i++)
        {
          for(let j = 0; j<keywords.length; j++){
            if(dataArr[i].indexOf(keywords[j]) != -1){
              for(let k = 0; k<read.length; k++){
                if(read[k] == dataArr[i])
                  send = false;
              }
              if(send){
                let mailData = dataArr[i].split(' -|- ');
                // for(let i = 0; i<mailData.length; i++){
                //   console.log('maildata : ' + i + ' = ' + mailData[i]);
                // }
                var mailText = `
                                Број на оглас: ${mailData[0].trim()}\n
                                Договорен орган: ${mailData[1]}\n
                                Предмет на договорот: ${mailData[2]}\n
                                Вид на договорот: ${mailData[3]}\n
                                Вид на постапка: ${mailData[4].trim()}\n
                                Датум на објава: ${mailData[5]}\n
                                Краен рок: ${mailData[6]}\n`;
                read.push(dataArr[i]);
                var mailOptions = {
                  from: 'nabavki.info@gmail.com',
                  to: 'nabavki.info@gmail.com',
                  subject: 'Оглас број: ' + mailData[0],
                  text: mailText
                };

                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });

                send = true;
              }
              console.log(dataArr[i]);
            }
          }
          // for(let j = 0; j<keywords; j++){
          //   console.log(`keyword[${j}] : ${keywords[j]}`);
          //   if(dataArr[i].indexOf(keywords[j]) != -1){
          //     console.log(dataArr[i]);
          //     break;
          //   }
          // }
          // if(dataArr[i].indexOf('сирење') != -1){
          //   console.log(dataArr[i]);
          // }
        }
      }, 2000);
    }


      // for(let i = 0; i<textData.length; i++){
      //   console.log("textData.charAt: " + i + " : " + textData.charAt(i));
      // }
      // console.log("index of n: " + textData.indexOf("n"));
      // var textArr = textData.split("--novcell--");
      //
      // for(let i = 0; i<textArr; i++){
      //   console.log(textArr[i] + "\n------------------------------------------\n");
      // }

  });

  // child.stderr.on('data', function(err) {
  //     var textErr = Uint8ArrToString(err);
  //     console.log(textErr);
  // });

  child.on('close', function(code) {
      console.log('Process closed with status code: ' + code);
  });

}
