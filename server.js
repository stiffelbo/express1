const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer  = require('multer');
const fs = require('fs');

const app = express();
const upload = multer({dest: 'images/'});
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './images')));
app.use(express.urlencoded({ extended: false }));

//define render engine
app.engine('hbs', hbs({ extname: 'hbs', layoutsDir: './layouts', defaultLayout: 'main' }));
//set views type to hbs
app.set('view engine', 'hbs');

app.use((req, res, next) => {
  res.show = (name) => {
    res.sendFile(path.join(__dirname, `/views/${name}`));
  };
  next();
});

app.get('/style.css', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/style.css'));
});

app.use('/user/', (req, res, next) => {
  res.render('forbiden');
});

app.get('/hello/:name', (req, res) => {
  res.render('hello', {name: req.params.name });
});

app.get('/', (req, res) => {
  res.render('home');  
});

app.get('/home', (req, res) => {
  res.render('home'); 
});

app.get('/about', (req, res) => {
  res.render('about'); 
});

app.get('/info', (req, res) => {
  res.render('info'); 
});

app.get('/history', (req, res) => {
  res.render('history', { layout: 'dark' }); 
});

app.get('/contact', (req, res) => {
  res.render('contact');  
});

app.get('/style.css', (req, res) => {  
  res.sendFile(path.join(__dirname, '/public/style.css'));
});

app.post('/contact/send-message', upload.single('imgfile'), (req, res) => {

  const { author, sender, title, message } = req.body;
  const imgfile = req.file;
  if(imgfile && author && sender && title && message){
    const newFilename = `images/${imgfile.originalname}`;
    fs.rename(imgfile.path, newFilename, (err)=>{
      if (err) throw err;    
      if(author && sender && title && message) {    
        res.render('contact', { isSent: true, response: `Message sent! Saved file: ${imgfile.originalname}`, file: `/${imgfile.originalname}`});
      }
    });
  }else {      
    res.render('contact', { isError: true, response: 'Not sent, Fill all fields and choose file!' });    
  }
});

app.use((req, res) => {
  res.status(404).render('404'); 
})

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

