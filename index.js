import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// const Cover_URL = https://covers.openlibrary.org/b/isbn/0011270106-S.jpg;
// 0011270106 rich dad poor dad
// 1847941834 atomic habits

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});
db.connect();

async function best(cata){
    if(cata=='all'){
        const result = await db.query("select * from booksdata order by rating desc;");
        const bookItems = result.rows;
        return bookItems;
    } else {
        const result = await db.query("select * from booksdata where catagory = $1 order by rating desc;",[cata]);
        const bookItems = result.rows;
        return bookItems;
    }
}

async function worst(cata){
    if(cata=='all'){
        const result = await db.query("select * from booksdata order by rating asc;");
        const bookItems = result.rows;
        return bookItems;
    } else {
        const result = await db.query("select * from booksdata where catagory = $1 order by rating asc;",[cata]);
        const bookItems = result.rows;
        return bookItems;
    }
}
async function latest(cata){
    if(cata=='all'){
        const result = await db.query("select * from booksdata order by date asc;");
        const bookItems = result.rows;
        return bookItems;
    } else {
        const result = await db.query("select * from booksdata where catagory = $1 order by date asc;",[cata]);
        const bookItems = result.rows;
        return bookItems;
    }
}
async function oldest(cata){
    if(cata=='all'){
        const result = await db.query("select * from booksdata order by date desc;");
        const bookItems = result.rows;
        return bookItems;
    } else {
        const result = await db.query("select * from booksdata where catagory = $1 order by date desc;",[cata]);
        const bookItems = result.rows;
        return bookItems;
    }
}
async function acending(cata){
    if(cata=='all'){
        const result = await db.query("select * from booksdata order by title asc;");
        const bookItems = result.rows;
        return bookItems;
    } else {
        const result = await db.query("select * from booksdata where catagory = $1 order by title asc;",[cata]);
        const bookItems = result.rows;
        return bookItems;
    }
}
async function decending(cata){
    if(cata=='all'){
        const result = await db.query("select * from booksdata order by title desc;");
        const bookItems = result.rows;
        return bookItems;
    } else {
        const result = await db.query("select * from booksdata where catagory = $1 order by title desc;",[cata]);
        const bookItems = result.rows;
        return bookItems;
    }
}

app.get("/", async (req, res) => {
    const result = await best('all');
    const sortValue = 'best';
    const catagoryValue = 'all';
    const cataResult = await acending('all');
    let catagoryList = [];
    cataResult.forEach((item)=>catagoryList.push(item.catagory));
    // console.log(catagoryList);
    res.render("index.ejs", {books: result, sort:sortValue, catagory: catagoryValue, cataAll: catagoryList});
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

app.get("/book/:id", async(req, res)=>{
    const id = parseInt(req.params.id);
    const result = await best();
    const notes = result.find((item)=>item.id===id);
    res.render("notes.ejs",{book: notes});
});

app.post("/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/new/book", async (req, res) => {
    const isbn = req.body.isbn;
    const title = req.body.title;
    const catagory = req.body.catagory;
    const notes = req.body.notes;
    const rating = parseInt(req.body.rating);
    let date = new Date();
    const result = await db.query("insert into booksdata (isbn, title, catagory, notes, rating, date) values ($1, $2, $3, $4, $5, $6)",
        [isbn, title, catagory, notes, rating, date]);
    res.redirect("/");
});

app.get("/book/edit/:id", async(req, res)=>{
    const id = parseInt(req.params.id);
    const result = await best();
    const needToSee = result.find((item)=>item.id===id);
    res.render("new.ejs", {bookdata: needToSee,});
});

app.post("/book/edited/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const isbn = req.body.isbn;
    const title = req.body.title;
    const catagory = req.body.catagory;
    const notes = req.body.notes;
    const rating = parseInt(req.body.rating);
    const result = await db.query("update booksdata set isbn= $1, title= $2 , catagory= $3 , notes= $4 , rating= $5 where id = $6;",
        [isbn, title, catagory, notes, rating, id]);
    res.redirect("/");
});

app.get("/book/delete/:id", async(req, res) =>{
    const id = parseInt(req.params.id);
    const result = await db.query("delete from booksdata where id = $1", [id]);
    res.redirect("/");
});

async function filterBooks(gory, sort){
        if(sort=='best'){
            // console.log(gory)
            const result = await best(gory);
            return result;
        } 
        else if(sort=='worst'){
            const result = await worst(gory);
            return result;
        }
        else if(sort=='latest'){
            const result = await latest(gory);
            return result;
        }
        else if(sort=='oldest'){
            const result = await oldest(gory);
            return result;
        }
        else if(sort=='asc'){
            const result = await acending(gory);
            return result;
        }
        else if(sort=='desc'){
            const result = await decending(gory);
            return result;
        } else {
            res.json("Error");
        }
}

app.get("/filterBook/filter", async(req, res) =>{
    const sortReq = req.query.sort;
    const catagoryReq = req.query.catagory;
    const result = await filterBooks(catagoryReq, sortReq);
    const cataResult = await acending('all');
    let catagoryList = [];
    cataResult.forEach((item)=>catagoryList.push(item.catagory));
    res.render("index.ejs", {books: result, sort: sortReq, catagory: catagoryReq, cataAll: catagoryList});
});

app.listen(3000, ()=>{
    console.log(`server runnig on ${port}`);
});