const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { DB_USER, DB_PASS } = process.env;

mongoose.connect(
  `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.ou7kd.mongodb.net/imageboard`
);

const postSchema = {
  board: String,
  email: String,
  assunto: String,
  postContent: String,
  inserir: String,
  password: String,
  reply: String,
  op: Boolean,
  randomIdGeneratedByMe: String,
  imgShow: Boolean,
  catUrl: String,
  catWidth: String,
  catHeight: String,
  postDay: String,
};
const postCountSchema = {
  postNumberIs: Number,
};

const Post = mongoose.model('post', postSchema);
const PostCount = mongoose.model('postCount', postCountSchema);

const sendStatus = (action, status) => {
  return action.json({
    status: status,
  });
};

//BUMP!
const bump = async (bumpId) => {
  try {
    const threadToBump = await Post.find({ randomIdGeneratedByMe: bumpId });
    const oldReply = [...threadToBump][0];
    await Post.create({
      board: oldReply.board,
      email: oldReply.email,
      assunto: oldReply.assunto,
      postContent: oldReply.postContent,
      inserir: oldReply.inserir,
      password: oldReply.password,
      reply: oldReply.reply,
      op: oldReply.op,
      randomIdGeneratedByMe: oldReply.randomIdGeneratedByMe,
      imgShow: oldReply.imgShow,
      catUrl: oldReply.catUrl,
      catWidth: oldReply.catWidth,
      catHeight: oldReply.catHeight,
      postDay: oldReply.postDay,
    });
    await Post.deleteMany({ _id: oldReply._id });
  } catch (err) {
    console.log(err);
  }
};

app.get('/api', async (req, res) => {
  try {
    const posts = await Post.find().select('-password');
    return res.json(posts);
  } catch (err) {
    return sendStatus(res, err);
  }
});

app.post('/newpost', async (req, res) => {
  try {
    //  pega id
    const lastId = await PostCount.findOne();
    const { postNumberIs } = lastId;
    //  bota id no objeto do post
    const postReady = req.body.newPost;
    const postToSend = {
      ...postReady,
      randomIdGeneratedByMe: postNumberIs,
    };
    //  envia
    await Post.create(postToSend);
    await PostCount.findOneAndUpdate(
      { postNumberIs: postNumberIs },
      { postNumberIs: postNumberIs + 1 }
    );
    !postToSend.op ? bump(postToSend.reply) : null;
    return sendStatus(res, 200);
  } catch (err) {
    return sendStatus(res, err);
  }
});

app.post('/replySage', async (req, res) => {
  try {
    //  pega id
    const lastId = await PostCount.findOne();
    const { postNumberIs } = lastId;
    //  bota id no objeto do post
    const postReady = req.body.newPost;
    const postToSend = {
      ...postReady,
      randomIdGeneratedByMe: postNumberIs,
    };
    //sage!
    await Post.create(postToSend);
    await PostCount.findOneAndUpdate(
      { postNumberIs: postNumberIs },
      { postNumberIs: postNumberIs + 1 }
    );
    return sendStatus(res, 200);
  } catch (err) {
    return sendStatus(res, 200);
  }
});

//  deleta threads que excedam a pag10
app.post('/deletePost', async (req, res) => {
  try {
    const gonnaDelete = req.body.idDaqui;
    //  deleta a thread com id tal
    await Post.deleteMany({
      randomIdGeneratedByMe: gonnaDelete.randomIdGeneratedByMe,
    });
    //  deleta todas respostas dessa thread
    await Post.deleteMany({ reply: gonnaDelete.randomIdGeneratedByMe });
    return sendStatus(res, 200);
  } catch (err) {
    return sendStatus(res, err);
  }
});

//  checa password antes de deletar uma thread manualmente,
//  levando junto com suas respostas
app.post('/deletePostButton', async (req, res) => {
  try {
    const threadToRemove = req.body.teste[0].threadsData._id;
    const password = req.body.teste[1];
    const findItsReplys = req.body.teste[0].threadsData.randomIdGeneratedByMe;

    const find = await Post.find({ _id: gonnaDeleteId });
    const getPassword = find[0].password;
    if (getPassword === password) {
      await Post.deleteMany({ _id: threadToRemove });
      await Post.deleteMany({ reply: findItsReplys });
    }
    return sendStatus(res, 200);
  } catch (err) {
    return sendStatus(res, err);
  }
});

//  deleta reply após as senhas coincidirem
app.post('/deleteReplys', async (req, res) => {
  try {
    const gonnaDeleteId = req.body.teste[0].replyData._id;
    const password = req.body.teste[1];
    const find = await Post.find({ _id: gonnaDeleteId });
    const getPassword = find[0].password;
    if (getPassword === password) {
      await Post.deleteMany({ _id: gonnaDeleteId });
    }
    return sendStatus(res, 200);
  } catch (err) {
    return sendStatus(res, 200);
  }
});

app.get('/health', (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log('Your server is now connected at port 5000');
});
