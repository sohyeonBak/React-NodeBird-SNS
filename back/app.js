const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path =require('path')
const helmet =require('helmet')
const hpp =require('hpp')

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();
const app = express();

db.sequelize.sync()
.then(() => {
    console.log('db 연결 성공');
})
.catch(console.error, console.log('또 실패'));

passportConfig();

if(process.env.NODE_ENV === 'production'){
    app.use(morgan('combined'))
    app.use(hpp());
    app.use(helmet())
    app.use(cors({
        origin: 'http://nodebird.letusloveoneanother.com',
        credentials: true,
    }));
}else{
    app.use(morgan('dev'))
    app.use(cors({
        origin: true,
        credentials: true,
    }));
}

app.use('/', express.static(path.join(__dirname, 'uploads')))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false,
        domain: process.env.NODE_ENV === 'production' && '.nodebird.letusloveoneanother.com'
    }
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('hello express');
  });


app.use('/posts', postsRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

app.listen(80, ()=>{
    console.log('서버 실행 중')
})