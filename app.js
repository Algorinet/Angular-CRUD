var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();
//Conexión a mongoose
var mongoose = require("mongoose");
//Creación modelo mongoose
/* var ClienteSchema = mongoose.Schema({
  nombre: String,
  apellido: String,
  domicilio: String,
  telefono: String,
  email: String
});
var Cliente = mongoose.model('Cliente', ClienteSchema); */

// const User = require('../models/User');

var userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    birthDay: Date,
    street: String,
    state: String,
    city: String,
    country: String,
    zip: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

const dbName = "UsersDB";
mongoose.connect(`mongodb://localhost/${dbName}`);

app.get("/", function(req, res) {
  res.sendfile("./public/index.html");
});

//Route listar usuarios
app.get("/getusers", function(req, res) {
  User.find({}, function(error, usuarios) {
    if (error) {
      res.send("Error.");
    } else {
      res.send(usuarios);
    }
  });
});

//Route detalle usuario
app.get("/getusersById", function(req, res) {
  User.findById(req.query._id, function(error, usuario) {
    if (error) {
      res.send("Error.");
    } else {
      res.send(usuario);
    }
  });
});

//Route crear usuario
app.post("/createUsers", function(req, res) {
  if (req.query._id == null) {
    console.log(false)
    var users = new User({
      name: req.query.name,
      email: req.query.email,
      birthDay: req.query.birthDay,
      street: req.query.street,
      state: req.query.state,
      city: req.query.city,
      country: req.query.country,
      zip: req.query.zip
    });
    users.save(function(error, usuario) {
      if (error) {
        res.send("Error.");
      } else {
        res.send(usuario);
      }
    });
  } else {
    //Route editar usuario
    User.findByIdAndUpdate(req.query._id, function(error, usuario) {
      if (error) {
        res.send("Error al intentar modificar el personaje.");
      } else {
        console.log(true)
        var user = usuario;
        (user.name = req.query.name),
          (user.email = req.query.email),
          (user.birthDay = req.query.birthDay),
          (user.street = req.query.street),
          (user.state = req.query.state),
          (user.city = req.query.city),
          (user.country = req.query.country),
          (user.zip = req.query.zip)
          
      }
    });
  }
});

//Route para eliminar usuario
app.post('/deleteUsersById', function(req, res){
  User.remove({_id: req.query._id}, function(error){
    console.log(req.query._id)

     if(error){
        res.send('Error.');
     }else{
        res.send('Ok');
     }
  });
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
