const { log } = require('console');
const express = require('express');
const fs = require('fs')
const path = require('path');
const app = express();
const port = 3000

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        res.render('index', { files: files });
    });
});

app.post('/create', (req, res) => {
    const fileName = req.body.title.split(' ').join('');
    const fileContent = req.body.description;

    fs.writeFile(`./files/${fileName}.txt`, fileContent, (err) => {
        res.redirect('/'); 
    });
});


app.get('/file/:title', (req, res) => {
    const fileName = req.params.title;
    fs.readFile(`./files/${fileName}.txt`, 'utf-8', (err, data) => {
        res.render('content',{data})
    });
})

app.get('/edit/:filename', (req, res) => {
    let fileName = req.params.filename;
    fs.readFile(`./files/${fileName}.txt`, 'utf-8', (err, data) => {
        res.render('edit', {fileName, data });
    });
})

app.post('/edit/:filename', (req, res) => {
    const fileName = req.params.filename;
    const newContent = req.body.content;

    fs.writeFile(`./files/${fileName}.txt`, newContent, (err) => {
        res.redirect(`/file/${fileName}`);
    });
});



app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})