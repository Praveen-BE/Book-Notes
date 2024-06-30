import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// const Cover_URL = https://covers.openlibrary.org/b/isbn/0011270106-S.jpg;
// 0011270106 rich dad poor dad
// 1847941834 atomic habits

const booksObject = [
    {
        id: 1,
        isbn: "9781612680019",
        title: "Rich Dad Poor Dad",
        catagory: "Finance",
        notes: "1 Lorem ipsum dolor sit amet consectetur adipisicing elit.Ad dolorem aperiam magni voluptate placeat, adipisci incidunt dolore in voluptates veritatis vel animi facilis labore sed consequuntur, accusamus provident, ex mollitia.",
        rating: 9,
        date: "Sun Jun 30 2024 06:09:19 GMT+0530 (India Standard Time)",
    },
    {
        id: 2,
        isbn: "1847941834",
        title: "Atomic Habits",
        catagory: "Self Development",
        notes: "2 Lorem ipsum dolor sit amet consectetur adipisicing elit.Ad dolorem aperiam magni voluptate placeat, adipisci incidunt dolore in voluptates veritatis vel animi facilis labore sed consequuntur, accusamus provident, ex mollitia.",
        rating: 8,
        date: "Sun Jun 30 2024 07:09:19 GMT+0530 (India Standard Time)",
    },
];

let lastId = 2;

app.get("/", (req, res) => {
    res.render("index.ejs", {books: booksObject});
});

app.get("/contact", (req, res) => {
    res.render("contact.ejs");
});

app.get("/about", (req, res) => {
    res.render("contact.ejs");
});

app.get("/faq", (req, res) => {
    res.render("faq.ejs");
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

app.get("/book/:id", (req, res)=>{
    const id = parseInt(req.params.id);
    const notes = booksObject.find((item)=>item.id===id);
    res.render("notes.ejs",{book: notes});
});

app.post("/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/new/book", (req, res) => {

    lastId = lastId+1;
    const newIsbn = req.body.isbn;
    const numIsbn = parseInt(newIsbn);
    const addDate = new Date();
    const data = {
        id: lastId,
        isbn: newIsbn,
        title: req.body.title,
        catagory: req.body.catagory,
        notes: req.body.notes,
        rating: req.body.rating,
        date: addDate,
    }
    booksObject.push(data);
    res.redirect("/");
});

app.get("/book/edit/:id", (req, res)=>{
    const id = parseInt(req.params.id);
    const needToSee = booksObject.find((item)=>item.id===id);
    res.render("new.ejs", {bookdata: needToSee,});
});

app.post("/book/edited/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const existingBook = booksObject.find((item)=>item.id ===id);
    if(req.body.isbn) existingBook.isbn = req.body.isbn;
    if(req.body.title) existingBook.title = req.body.title;
    if(req.body.catagory) existingBook.catagory = req.body.catagory;
    if(req.body.notes) existingBook.notes = req.body.notes;
    if(req.body.rating) existingBook.rating = req.body.rating;
    res.redirect("/");
});

app.get("/book/delete/:id", (req, res) =>{
    const searchIndex = booksObject.findIndex((item)=>item.id===parseInt(req.params.id));
    booksObject.splice(searchIndex, 1);
    res.redirect("/");
});

app.listen(3000, ()=>{
    console.log(`server runnig on ${port}`);
});