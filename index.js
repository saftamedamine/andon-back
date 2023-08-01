var express = require('express')
var bodyParser = require('body-parser')
var flash = require('express-flash');
var session = require('express-session');
var mysql = require('mysql');
var path = require('path');
const cors = require('cors');
var app = express()

app.use(cors({
    origin: '*'
}));
app.use(bodyParser.json())
app.use(session({
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))

app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/update', (req, res) => {
    var form_data = {
        data: JSON.stringify(req.body),
        name: req.body.name
    }
    connection.query("UPDATE andon SET ? WHERE name = '" + req.body.name + "'", form_data, function (err, result) {
        if (err) {
            console.log(err);
            res.send("not saved")

        } else {
            console.log(result.changedRows);
            if (result.changedRows == 0) {
                connection.query('INSERT INTO andon SET ?', form_data, function (err, result) {
                    if (err) {
                        res.send("not saved")
                    } else {
                        res.send("saved")
                    }
                })
            } else {
                res.send("saved")
            }

        }
    })
})

app.get('/update', (req, res) => {
    connection.query('SELECT * FROM andon', function (err, rows) {
        if (err) {
            req.flash('error', err);
        } else {
            res.json(rows)
        }
    });
})

var connection = mysql.createConnection({
    host: 'containers-us-west-102.railway.app',
    user: 'root',
    password: 'xEc2CVqaNtfQ1dcA9eCy',
    database: 'railway'
});
connection.connect(function (error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log('Database Connected Successfully..!!');
    }
});


app.listen(3333, () => {
    console.log(`app listening on port ${3333}`)
})