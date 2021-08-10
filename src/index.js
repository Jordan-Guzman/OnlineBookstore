const { response } = require('express');
const express = require("express");
const app = express();
const fetch = require("node-fetch");
const pool = require("./dbPool.js");
app.set("view engine", "ejs");
app.use(express.static("public"));

//routes
app.get('/', async (req, res) => {    
    let imageUrl = "https://images.unsplash.com/photo-1566104689610-8645e19322b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNDY5Njd8MHwxfGFsbHx8fHx8fHx8fDE2Mjc5NDI1NjE&ixlib=rb-1.2.1&q=80&w=400";
    res.render('index', {"imageUrl": imageUrl});
});

app.get('/home', async (req, res) => {    
    let imageUrl = "https://images.unsplash.com/photo-1419640303358-44f0d27f48e7?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDY5Njd8MHwxfGFsbHx8fHx8fHx8fDE2MjczMTkwMDY&ixlib=rb-1.2.1&q=85";
    res.render('home', {"imageUrl": imageUrl});
});

app.get('/search', async (req, res) => {
    let title = "";
    if(req.query.title) {
        title = req.query.title;
    }
    let apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${title}&maxResults=40`;
    let response = await fetch(apiUrl);
    let data = await response.json();
    let coverUrl = "";
    let description = "";

    let imageUrl = "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDY5Njd8MHwxfGFsbHx8fHx8fHx8fDE2MjczMTkyNTM&ixlib=rb-1.2.1&q=85";
    let bookTitle = [];
    let bookCover = [];
    let bookPrice = [];
    let bookDescription = [];

    //only appends books with covers and prices to arrays that get rendered
    for(let i =0; i < data.items.length; i++) {
        try {
            if((data.items[i].volumeInfo.title.substring(0, title.length).toLowerCase() === title.toLowerCase()) &&
                (data.items[i].volumeInfo.imageLinks != undefined) && (data.items[i].saleInfo.saleability != "NOT_FOR_SALE")) {
                coverUrl = data.items[i].volumeInfo.imageLinks.thumbnail;
                price = data.items[i].saleInfo.listPrice.amount;
                description = data.items[i].volumeInfo.description;
                bookTitle.push(data.items[i].volumeInfo.title);
                bookCover.push(coverUrl);
                bookPrice.push(price);
                bookDescription.push(description);
            }
        }
        catch {
            console.log("error");
        }
    }

    //renders book title, book cover, and background image for results page
    res.render('results', {"imageUrl": imageUrl, "bookTitle": bookTitle, "bookCover": bookCover, "bookDescription": bookDescription, "bookPrice": bookPrice});
});

app.get('/api/addToCart', async (req, res) => {
    let sql = "INSERT INTO `book data` (title, imageUrl, price) VALUES (?, ?, ?)";
    let cover = req.query.imageUrl + "&printsec=" + req.query.printsec + "&img=" + req.query.img + 
        "&zoom=" + req.query.zoom + "&edge=" + req.query.edge + "&source=" + req.query.source;
    let sqlParams = [req.query.title, cover, req.query.price];
    let rows = await executeSQL(sql, sqlParams);
    res.send(rows.affectedRows.toString());
});

app.get('/api/removeFromCart', async (req, res) => {
    let sql = "DELETE FROM `book data` WHERE title = ?";
    let sqlParams = [req.query.title];
    let rows = await executeSQL(sql, sqlParams);
    res.send(rows.affectedRows.toString());
});

app.get('/shoppingCart', async (req, res) => {
    let imageUrl = "https://images.unsplash.com/photo-1419640303358-44f0d27f48e7?crop=entropy&cs=srgb&fm=jpg&ixid=MnwyNDY5Njd8MHwxfGFsbHx8fHx8fHx8fDE2MjczMTkwMDY&ixlib=rb-1.2.1&q=85";

    let sql = "SELECT title, imageUrl FROM `book data` ORDER BY title";
    let rows = await executeSQL(sql);
    res.render('cart', {"imageUrl": imageUrl, "rows": rows});
});

//functions
async function executeSQL(sql, params) {
    return new Promise(function(resolve, reject) {
        pool.query(sql, params, function(err, rows, fields) {
            if(err) throw err;
            resolve(rows);
        });
    });
}

//server listener
app.listen(3000, () => {
    console.log('server started');
});