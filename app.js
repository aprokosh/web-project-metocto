const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname))
const urlencodedParser = bodyParser.urlencoded({extended: false});

let port = 80
app.listen(port, () => {

    console.log(`Listening on port ${port}`)
})

const mongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
//const url2 = 'mongodb://myuser:myuser123@ds056549.mlab.com:56549/';

// var sessionStore = new MongoStore({
//     host: 'ds056549.mlab.com',
//     port: '56549',
//     url: 'mongodb://myuser:myuser123@ds056549.mlab.com:56549/'
// });

app.use(session({
    secret: 'mylittlesecret',
    store: new MongoStore({url: 'mongodb://localhost:27017/'}),
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
})
);

var flash = require('req-flash');
app.use(flash());

app.post("/reg", urlencodedParser, function (req, res) {
    mongoClient.connect(url, function (err, client) {
        client.db("metodbase").collection("users").findOne({login: req.body.name}, function(err,result){
            if (result) {
                console.log("Имя пользователя уже используется")
                res.redirect('/regist')
            }
        });
    });
    if (req.body.password1 != req.body.password2){
        console.log("Введенные пароли не совпадают!")
        res.redirect('/regist')
    }
    else {
        mongoClient.connect(url, function (err, client) {
            client.db("metodbase").collection("users").insertOne({login: req.body.name, password: req.body.password1, role: 'user', fav: []});
        });
        res.sendFile(__dirname + '/autho.html')
    }
});

app.post("/login", urlencodedParser, function (req, res) {
    mongoClient.connect(url, function (err, client) {
        client.db("metodbase").collection("users").findOne({login: req.body.login}, function(err,result){
            if (result) {
                if (result.password === req.body.password) {
                    req.session.authorized = true;
                    req.session.username = req.body.login;
                    req.session.role = result.role;
                    res.redirect('/menu');
                }
                else {
                    console.log('Неверный пароль');
                    res.redirect('/')
                }
            }
            else {
                console.log('Пользователя с таким именем не существует');
                res.redirect('/')
            }
        });
    });
});

app.get('/new', (req, res) => {
    if (req.session.authorized && req.session.role === 'admin') {
        res.sendFile(__dirname + '/new.html')
    }
    else
        res.redirect('/404')
});

app.get('/logout', (req, res) => {
    delete req.session.authorized;
    delete req.session.username;
    delete req.session.role;
    res.redirect('/')
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/autho.html')
});
app.get('/menu', (req, res) => {
    if (req.session.authorized) {
        if (req.session.role === 'admin')
            res.sendFile(__dirname + '/menu_admin.html')
        else
            res.sendFile(__dirname + '/menu.html')
    }
    else
        res.redirect('/404')
});
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/autho.html')
});
app.get('/regist', (req, res) => {
    res.sendFile(__dirname + '/regist.html')
});
app.get('/mero', (req, res) => {
    if (req.session.authorized) {
        res.sendFile(__dirname + '/mero.html')
    }
    else
        res.redirect('/404')
});
app.get('/add', (req, res) => {
    if (req.session.authorized) {
        res.sendFile(__dirname + '/add.html')
    }
    else
        res.redirect('/404')
});
app.get('/404', (req, res) => {
    res.sendFile(__dirname + '/404.html')
});

app.get('/favorite', (req, res) => {
    if (req.session.authorized) {
        res.sendFile(__dirname + '/fav.html')
    }
    else
        res.redirect('/404')
});

app.post("/add", urlencodedParser, function (req, res) {
    res.redirect('/menu')
    mongoClient.connect(url, function (err, client) {
        client.db("metodbase").collection("schema").findOne(function(error, result){
            if ((result.age.includes(req.body.age)) && (result.type.includes(req.body.type)) && (result.hard.includes(req.body.hard)) && (result.place.includes(req.body.place))){
                if (req.session.role === 'admin')
                    client.db("metodbase").collection("mero").insertOne({
                        name: req.body.name,
                        type: req.body.type,
                        age: req.body.age,
                        hard: req.body.hard,
                        place: req.body.place,
                        desc: req.body.desc,
                        link: req.body.link,
                        status: 'confirmed',
                        author: req.session.username,
                        fav: []
                    });
                else
                    client.db("metodbase").collection("mero").insertOne({
                        name: req.body.name,
                        type: req.body.type,
                        age: req.body.age,
                        hard: req.body.hard,
                        place: req.body.place,
                        desc: req.body.desc,
                        link: req.body.link,
                        status: 'review',
                        author: req.session.username,
                        fav: []
                    });
            }
        });
    });
});

app.get('/getnew', (req, res) => {
    mongoClient.connect(url, function (err, client) {
        client.db("metodbase").collection("mero").find({status: 'review'
        }).toArray(function(err, results){
            let meros = []
            for (let res of results) {
                meros.push({ id: res._id, name: res.name, type: res.type, age: res.age, hard: res.hard, place: res.place, desc: res.desc, link: res.link })
            }
            res.status(200).send({ data: meros })
        });
    });
})

var cat_value;
var age_value;
var hard_value;
var place_value;

app.post("/getres", urlencodedParser, function (req, res) {
    if (req.session.authorized) {
        res.sendFile(__dirname + '/res.html');
        cat_value = req.body.type;
        age_value = req.body.age;
        hard_value = req.body.hard;
        place_value = req.body.place;
    }
    else
        res.redirect('/404')
});

app.get("/getmero", (req, res) => {
    mongoClient.connect(url, function (err, client) {
        client.db("metodbase").collection("mero").find({
            type: cat_value,
            age: { $in: [ age_value, 'Любой'] },
            hard: { $in: [ hard_value] },
            place: { $in: [ place_value, 'Любое'] },
            status: 'confirmed'
        }).toArray(function(err, results){
            console.log(JSON.stringify(results))
            let meros = []
            for (let res of results) {
            if ((res.fav).includes(req.session.username))
                meros.push({ id: res._id, name: res.name, type: res.type, age: res.age, hard: res.hard, place: res.place, desc: res.desc, link: res.link, f: true})
            else
                meros.push({ id: res._id, name: res.name, type: res.type, age: res.age, hard: res.hard, place: res.place, desc: res.desc, link: res.link, f: false})
            }
            res.status(200).send({ data: meros })
        });
    });
});


app.get('/getusername', (req, res) => {
    res.send(req.session.username);
});

app.get('/countnew', (req, res) => {
    mongoClient.connect(url, function (err, client) {
        client.db("metodbase").collection("mero").find({
            status: 'review'
        }).count(function(err, result){
            res.send(result);
        });
    });
});

ObjectId = require("mongodb").ObjectID;

app.post('/confirm', (req, res) => {
    let id = req.body.id;
    mongoClient.connect(url, function (err, client) {
        client.db("metodbase").collection("mero").findOneAndUpdate(
            { "_id" : ObjectId(id) },{$set: { status: "confirmed"}});
        client.db("metodbase").collection("mero").findOne({"_id" : ObjectId(id)}, function (error, result) {
            client.db("metodbase").collection("schema").findOneAndUpdate({},
                {$addToSet: {age: result.age, type: result.type, hard: result.hard, place: result.place}})
        });
    });
});

app.post('/reject', (req, res) => {
    let id = req.body.id;
    mongoClient.connect(url, function (err, client) {
        client.db("metodbase").collection("mero").deleteOne({"_id": ObjectId(id)})
    });
});

app.post('/fav', (req, res) => {
    let id = req.body.id;
    mongoClient.connect(url, function (err, client) {
        client.db("metodbase").collection("users").findOneAndUpdate(
            { "login" : req.session.username},{$addToSet: { fav: id}})
        client.db("metodbase").collection("mero").findOneAndUpdate(
            { "_id" : ObjectId(id)},{$addToSet: { fav: req.session.username}})
    });
});

app.post('/unfav', (req, res) => {
    let id = req.body.id;
    mongoClient.connect(url, function (err, client) {
        client.db("metodbase").collection("users").findOneAndUpdate(
            { "login" : req.session.username},{$pull: { fav: id}})
        client.db("metodbase").collection("mero").findOneAndUpdate(
            { "_id" : ObjectId(id)},{$pull: { fav: req.session.username}})
    });
});

app.get('/getfav', (req, res) => {
    let meros = [];
    mongoClient.connect(url, function (err, client) {
        client.db("metodbase").collection("users").findOne({login: req.session.username}, function (err, result) {
            for (var i = 0; i < result.fav.length; ++i) {
                client.db("metodbase").collection("mero").findOne({_id: ObjectId(result.fav[i])}, function (err, res) {
                    meros.push({
                        id: res._id,
                        name: res.name,
                        type: res.type,
                        age: res.age,
                        hard: res.hard,
                        place: res.place,
                        desc: res.desc,
                        link: res.link
                    });
                });
            }
            setTimeout(function() {
                console.log(JSON.stringify(meros));
                res.status(200).send({data: meros})
            }, 3000);
        });
    });
});

app.get('/geteverything', (req, res) => {
    mongoClient.connect(url, function (err, client) {
        client.db("metodbase").collection("schema").findOne(function(err, result){
            res.send({age: result.age, type: result.type, hard: result.hard, place: result.place});
        });
    });
});