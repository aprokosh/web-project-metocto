const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo');

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname))
const urlencodedParser = bodyParser.urlencoded({extended: false});
var helmet = require('helmet');
app.use(helmet())
var Crypto = require('crypto-js');
const { connect } = require('http2');


app.use(session({
    name: 'example.sid',
    secret: 'Replace with your secret key',
    httpOnly: true,
    secure: true,
    maxAge: 1000 * 60 * 60 * 7,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://user:user123@cluster0.62mkasm.mongodb.net/metodbase",
    })
}));

var port = process.env.PORT || 3000;
app.listen(process.env.PORT ||port, () => {

    console.log(`Listening on port ${port}`)
})

const { MongoClient, ServerApiVersion } = require('mongodb');
const e = require('connect-flash');

//const mongoClient = require("mongodb").MongoClient;
//const url = "mongodb://localhost:27017/metodbase";
//const url = process.env.MONGODB_URI || "mongodb://user:user123@ds056549.mlab.com:56549/metodbase";
const url = "mongodb+srv://user:user123@cluster0.62mkasm.mongodb.net/metodbase";

const mongoClient = new MongoClient(url, {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    }
  });

async function run() {
    try {
      await mongoClient.connect(url);
      await mongoClient.db().command({ping:1});
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    }
  }
  run().catch(console.dir);

check_regex = function (regex, string){
    let ch = string.match(regex);
    if ((ch==null)||(ch[0]!==string)) return false;
    else return true;
}

app.post("/reg", urlencodedParser, async function (req, res) {
    const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]{6,16}/;
    let check = check_regex(regex, req.body.password1)
    try {
        await mongoClient.connect(url);
        await mongoClient.db().collection("users").findOne({name:"12"}).then(async (result)=>{
            if (result) {
                console.log("Имя пользователя уже используется")
                res.redirect('/regist')
            }
            else if (req.body.password1 != req.body.password2){
                console.log("Введенные пароли не совпадают!")
                res.redirect('/regist')
            }
            else if (!check) {
                console.log("Слабый пароль")
                res.redirect('/regist')
            }
            else {
                await mongoClient.db("metodbase").collection("users").insertOne({login: req.body.name, password: Crypto.SHA256(req.body.password1).toString(), role: 'user', fav: []});
                res.sendFile(__dirname + '/autho.html')
            }
        });
    } catch (error) {
    console.log("Error! ", error);
  }
});

app.post("/login", urlencodedParser, async function(req,res){
    try {
        await mongoClient.connect(url);
        await mongoClient.db().collection("users").findOne({login: req.body.login}).then((result)=>{
            if (result) {
                if (Crypto.SHA256(req.body.password).toString() === result.password) {
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
    } catch (error) {
        console.log("Error! ", error);
      }
})


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
app.get('/getrole', (req, res) => {
        res.send(req.session.role);
});
//some functions
count_new = async function(resolve){
    try {
        await mongoClient.connect(url);
        await mongoClient.db("metodbase").collection("mero").countDocuments({
            status: 'review'
        }).then((result)=> {
            resolve(result);
        });

    } catch (error) {
        console.log("Error! ", error);
    }
}

is_fav = function(username, mero){
    if ((mero.fav).includes(username)) return true;
        else return false;
}
find_mero_by_id = async function(id, resolve) {
    try {
        await mongoClient.connect(url);
        await mongoClient.db("metodbase").collection("mero").findOne({"_id": new ObjectId(id)}).then((res) => {
            resolve(res);
        });

    } catch (error) {
        console.log("Error! ", error);
    }
}

module.exports = {
    count_new, is_fav, find_mero_by_id, check_regex
}

app.post("/add", urlencodedParser, async function (req, res) {
    let check = true;
    const regex1 = /([0-9\s\D]*)([a-zA-Zа-яА-Я]+)([0-9\s\D]*){3,}/g;
    const regex2 = /([a-zA-Z0-9/]+)([a-zA-Z0-9/:-]*)([.]+)([a-zA-Z]+)([a-zA-Z0-9/-]*){5,}/g;
    let check1 = check_regex(regex1, req.body.name)
    let check2 = check_regex(regex1, req.body.desc)
    let check3 = check_regex(regex2, req.body.link)

    if ((!check1)||(!check2)||(!check3)) {
        res.redirect('/add')
        check = false;
    }
    else res.redirect('/menu')
    try {
        await mongoClient.connect(url);
        await mongoClient.db().collection("schema").findOne().then(async (result) =>{
            if ((check) && (result.age.includes(req.body.age)) && (result.type.includes(req.body.type)) && (result.hard.includes(req.body.hard)) && (result.place.includes(req.body.place))){
                if (req.session.role === 'admin')
                    await mongoClient.db("metodbase").collection("mero").insertOne({
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
                    await mongoClient.db("metodbase").collection("mero").insertOne({
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
    } catch (error) {
        console.log("Error! ", error);
    }
    
});

app.get('/getnew', async (req, res) => {
    try {
        await mongoClient.connect(url);
        await mongoClient.db().collection("mero").find({status: 'review'
        }).toArray().then((results) => {
            let meros = []
            for (let res of results) {
                meros.push({ id: res._id, name: res.name, type: res.type, age: res.age, hard: res.hard, place: res.place, desc: res.desc, link: res.link })
            }
            res.status(200).send({ data: meros })
        });
    } catch(error) {
        console.log("Error! ", error);
    }
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

app.get("/getmero", async (req, res) => {
    try {
        await mongoClient.connect(url);
        await mongoClient.db().collection("mero").find({
            type: cat_value,
            age: { $in: [ age_value, 'Любой'] },
            hard: { $in: [ hard_value] },
            place: { $in: [ place_value, 'Любое'] },
            status: 'confirmed'
        }).toArray().then((results) => {
            let meros = []
            for (let res of results) {
                console.log(is_fav(req.session.username,res))
            if (is_fav(req.session.username,res))
                meros.push({ id: res._id, name: res.name, type: res.type, age: res.age, hard: res.hard, place: res.place, desc: res.desc, link: res.link, f: true})
            else
                meros.push({ id: res._id, name: res.name, type: res.type, age: res.age, hard: res.hard, place: res.place, desc: res.desc, link: res.link, f: false})
            }
            console.log(JSON.stringify(meros));
            res.status(200).send({ data: meros })
        });
    } catch (error) {
        console.log("Error! ", error);
    }
});


app.get('/getusername', (req, res) => {
    res.send(req.session.username);
});

app.get('/countnew', (req, res) => {
    count_new(async (cnt) => {
        res.send(String(cnt));
    })
});

const {ObjectId} = require("mongodb");

app.post('/confirm', async (req, res) => {
    let id = req.body.id;
    try {
        await mongoClient.connect(url);
        await mongoClient.db().collection("mero").findOneAndUpdate(
            { "_id" : new ObjectId(id) },{$set: { status: "confirmed"}});
        await mongoClient.db().collection("mero").findOne({"_id" : new ObjectId(id)}).then(async (result) => {
            await mongoClient.db().collection("schema").findOneAndUpdate({},
                {$addToSet: {age: result.age, type: result.type, hard: result.hard, place: result.place}})
        });
    } catch (error) {
        console.log("Error! ", error)
    }
});

app.post('/reject', async (req, res) => {
    let id = req.body.id;
    try {
        await mongoClient.connect(url);
        await mongoClient.db().collection("mero").deleteOne({"_id": new ObjectId(id)})
    } catch (error) {
        console.log("Error! ", error);
    }
});

app.post('/fav', async (req, res) => {
    let id = req.body.id;
    console.log(id);
    try {
        await mongoClient.connect(url);
        await mongoClient.db().collection("users").findOneAndUpdate(
            { "login" : req.session.username},{$addToSet: { fav: new ObjectId(id)}})
        await mongoClient.db().collection("mero").findOneAndUpdate(
            { "_id" : new ObjectId(id)},{$addToSet: { fav: req.session.username}})
    } catch (error) {
        console.log("Error! ", error);
    }
});

app.post('/unfav', async (req, res) => {
    let id = req.body.id;
    try {
        await mongoClient.connect(url);
        await mongoClient.db().collection("users").findOneAndUpdate(
            { "login" : req.session.username},{$pull: { fav: new ObjectId(id)}})
        await mongoClient.db().collection("mero").findOneAndUpdate(
            { "_id" : new ObjectId(id)},{$pull: { fav: req.session.username}})
    } catch (error) {
        console.log("Error! ", error)
    }
});

app.get('/getfav', async (req, res) => {
    let meros = [];
    try {
        await mongoClient.connect(url);
        await mongoClient.db().collection("users").findOne({login: req.session.username}).then((result) => {
            console.log(result);
            for (var i = 0; i < result.fav.length; ++i) {
                find_mero_by_id(result.fav[i], async (res) => {
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
    } catch (error) {
        console.log("Error! ", error);
    }
});

app.get('/geteverything', async (req, res) => {
    try {
        await mongoClient.connect(url);
        await mongoClient.db().collection("schema").findOne().then((result) => {
            res.send({age: result.age, type: result.type, hard: result.hard, place: result.place});
        });
    } catch (error) {
        console.log("Error! ", error);
    }
});