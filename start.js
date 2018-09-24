const forever = require('forever-monitor');
//const SENDEMAIL = require('./lib/email')
//const send_email = SENDEMAIL()
const moment = require('moment')

  var child = new (forever.Monitor)('app.js', {
    append: true,
    max:5,
    silent: false,    
    logFile:"/home/server-hit/forever_linkdashboard.log",
    outFile: "/home/server-hit/sms2_linkdashboard.log",
    errFile: "/home/server-hit/sms2_error_linkdashboard.log",
    command: 'node --max_old_space_size=2000',
    args: []
  });

  child.on('restart', function () {
    console.log('exchange.js has been started on port 8084');
    /*var time = moment().format()
    SENDEMAIL.sendEmail("SMS2 app started","The middleware was started on "+ time,()=>{

    })*/
  });

  child.on('exit', function () {
    console.log('Exchange js has stoped');
    /*
    var time = moment().format()
   SENDEMAIL.sendEmail("SMS2 app stoped","The middleware was stopped on "+ time,()=>{

    })*/
  });

  child.start();
