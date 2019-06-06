var express     = require('express'),
    app         = express(),
    bodyparser  = require('body-parser'),
    request     = require('request'),
    http        = require('http').createServer(app),
    io          = require('socket.io')(http);

app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/Public"));

var position = {
    latitude : "",
    longitude : ""
}

var error = false;

var result = {
    places : [],
    err : false
}

app.get('/',function (req,res) {
    res.render("home", { results : result });
})

app.post('/search',function (req,res) {
    var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + position.latitude + "," + position.longitude + "&radius=1500&type=" + req.body.tag + "&key=AIzaSyBwxLBgMZMoGgoS_xoQYteJoDY8mkXhJJ4";

    request(url, function(error, response, body){
        if(!error && response.statusCode == 200){
            var data = JSON.parse(body);
            var results = data.results;
            result.places = results;
            if(results[0] == undefined){
                result.err = true;
            }else{
                result.err = false;
            }
            res.redirect('/');
        }else{
            console.log(error);
        }
    })
})

io.on('connection', function(socket){
    // console.log('a user connected');

    socket.on('SendLocation', function(msg){
        if(position.latitude == "" && position.longitude == ""){
            position.latitude = msg.latitude;
            position.longitude = msg.longitude;
        }
    })
});

http.listen("3000", function(){
    console.log("Server has started");
})