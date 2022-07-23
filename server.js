const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();

hbs.registerHelper('inc', function (value, options) {
  return parseInt(value) + 1;
});

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'agv_db',
});

conn.connect((err) => {
  if (err) throw err;
  console.log('Mysql Connected...');
});

app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/assets', express.static(__dirname + '/public'));

//route untuk homepage
app.get('/',(req, res) => {
  res.render('index');
});

app.get('/products',(req, res) => {
  let sql = "SELECT * FROM products";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('product',{
      results: results
    });
  });
});
app.get('/teams',(req, res) => {
  let sql = "SELECT * FROM teams";
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.render('team',{
      results: results
    });
  });
});


//route untuk insert data
app.post('/products/save',(req, res) => {
  let data = {nama: req.body.nama, deskripsi: req.body.deskripsi, harga: req.body.harga};
  let sql = "INSERT INTO products SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/products');
  });
});

app.post('/teams/save',(req, res) => {
  let data = {nama: req.body.nama,Nomor_Mahasiswa: req.body.Nomor_Mahasiswa, Role:req.body.Role};
  let sql = "INSERT INTO teams SET ?";
  let query = conn.query(sql, data,(err, results) => {
    if(err) throw err;
    res.redirect('/teams');
  });
});


//route untuk update data
app.post('/products/update',(req, res) => {
  let sql = "UPDATE products SET nama='"+req.body.edit_nama+"', deskripsi='"+req.body.edit_deskripsi+"' ,harga='"+req.body.edit_harga+"'  WHERE id_product="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/products');
  });
});

app.post('/teams/update',(req, res) => {
  let sql = "UPDATE teams SET nama='"+req.body.edit_nama+"', Nomor_Mahasiswa='"+req.body.edit_Nomor_Mahasiswa+"',Role='"+req.body.edit_Role+"'  WHERE id_team="+req.body.id;
  let query = conn.query(sql, (err, results) => {
    if(err) throw err;
    res.redirect('/teams');
  });
});

app.get('/products/:id', (req, res) => {
  const id = req.params.id;
  let sql = 'SELECT * FROM products WHERE id_product=' + id + '';
  conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results[0]);
  });
});

app.get('/teams/:id', (req, res) => {
  const id = req.params.id;
  let sql = 'SELECT * FROM teams WHERE id_team=' + id + '';
  conn.query(sql, (err, results) => {
    if (err) throw err;
    res.send(results[0]);
  });
});

//route untuk delete data
app.get('/products/destroy/:id', (req, res) => {
  const id = req.params.id;
  let sql = 'DELETE FROM products WHERE id_product=' + id + '';
  conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect('/products');
  });
});

app.get('/teams/destroy/:id', (req, res) => {
  const id = req.params.id;
  let sql = 'DELETE FROM teams WHERE id_team=' + id + '';
  conn.query(sql, (err, results) => {
    if (err) throw err;
    res.redirect('/teams');
  });
});


app.listen(8000, () => {
  console.log('Server is running at port 8000');
});
