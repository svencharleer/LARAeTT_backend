//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')

    , port = 5555
    , ipadress = process.env.host
    , context = "/qbike"
    , logger = require('morgan')

    , _ = require('underscore-node')
    , session = require('express-session')
    , bodyParser = require('body-parser')

    , http = require('http')
    ;


//Setup Express
var app = express();

//server.configure(function(){
    app.set('port', 5555);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.set('view options', { layout: false });
    //app.use(logger('dev'));
  //  app.use(connect.bodyParser());
    app.use(session({ resave: true,
                      saveUninitialized: true,
                      secret: 'uwotm8'
    }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.text({limit: '50mb'}));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(context, express.static(__dirname + '/static'));
    //app.use(express.static(__dirname + '/static'));

    //server.use(server.router);
//});
//server.listen( port, ipadress);
//  app.listen(port);

var server = app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

//var server = http.Server(app);
var ioWeb = io.listen(server);


///////////////////////////////////////////
//              Sockets                  //
///////////////////////////////////////////

//Setup Socket.IO

var listOfObjects = {}
// set up the json file to write out the mouse-positions data to file
ioWeb.on('connection', function(socket) {

    var listTripData = [];
    var address = socket.handshake.address;
    console.log('Client connected with id: '+ socket.id + " from " + address.address + ":" + address.port);

    socket.on('addObjects', function(msg){
        console.log('message: ' + msg.canvas + ' added ' + msg.objects.length + ' objects');
        msg.objects.forEach(function(o){
            listOfObjects[o.data.event_id] = o;
        })

        socket.emit("addObject", "message received sir!")
        broadcastAttention(listOfObjects);
    });
    socket.on('removeObjects', function(msg){
        console.log('message: ' + msg.canvas + ' removed ' + msg.objects.length + ' objects');
        msg.objects.forEach(function(o){
            listOfObjects[o.event_id] = undefined;
        })
        socket.emit("removeObject", "message received` sir!")
        broadcastAttention(listOfObjects);
    });

    socket.on('reset', function(msg){


        listOfObjects = {};
        broadcastAttention(listOfObjects);
    });

    socket.on("register", function(msg){
        socket.join('listener');
    })

});






///////////////////////////////////////////
//         BroadCasting                  //
///////////////////////////////////////////

function broadcastAttention(data){
    // get last attentionData and emit
    ioWeb.sockets.in('listener').emit('fetchObjects',listOfObjects);
};




