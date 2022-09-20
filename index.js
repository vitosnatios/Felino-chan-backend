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

//BUMP!
function bump(bumpId) {
  Post.find({ randomIdGeneratedByMe: bumpId }, (err, result) => {
    //BUMP! id deve ir no query aqui

    const oldReply = [...result][0]; //Bota o post numa variavel

    function copiarPost() {
      Post.create({
        //recria ela inteira pra ir pro topo
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
    }

    function deletarPostOriginal() {
      Post.deleteMany({ _id: oldReply._id }, (err) => {
        err ? console.log(err) : null;
      }); //deleta o antigo! ha ha
    }

    copiarPost();
    deletarPostOriginal();
  }); //só que aí tem que setar as replys pra acharem o post por algo que nao seja o _id :/ mas ótimo arrumei
}

app.get('/api', (req, res) => {
  Post.find({}, (err, postsFound) => {
    res.json(postsFound); //envia db do server pro client, pra pegar dando useEffect no /api
  })
    .select('-password')
    .sort({ $natural: -1 }); //.sort({$natural:-1}) faz ele entregar a DB de trás pra frente
});

app.get('/reply', (req, res) => {
  Post.find({}, (err, postsFound) => {
    res.json(postsFound);
  }).select('-password');
});

app.post('/newpost', (req, res) => {
  //humm tem como tirar o id da thread que é pra bumpar com req.body.newPost.reply????? hummm vamo ver se da pra fazer algo pra botar esse post pra cima (baixo ja q é inverso)
  const postReady = req.body.newPost;
  Post.create(postReady);
  !postReady.op ? bump(postReady.reply) : null;
});

app.post('/setNewId', (req, res) => {
  let newIdHere = req.body.newPost.randomIdGeneratedByMe;
  PostCount.updateOne(
    { postNumberIs: newIdHere },
    { $inc: { postNumberIs: +1 } },
    (err, itemFound) => {
      err ? console.log(err) : null;
    }
  );
});

app.post('/replySage', (req, res) => {
  //sage!
  const postReady = req.body.newPost;
  Post.create(postReady);
});

app.post('/deletePost', (req, res) => {
  //deleta posts que excedem a pag10, também servirá para deletar threads
  const gonnaDelete = req.body.idDaqui;

  function deleteById() {
    Post.deleteMany(
      { randomIdGeneratedByMe: gonnaDelete.randomIdGeneratedByMe },
      (err) => {
        err ? console.log(err) : null;
      }
    );
  }

  function deleteByReplys() {
    Post.deleteMany({ reply: gonnaDelete.randomIdGeneratedByMe }, (err) => {
      err ? console.log(err) : null;
    });
  }

  deleteById();
  deleteByReplys();
});

app.post('/deletePostButton', (req, res) => {
  //deleta posts que excedem a pag10, também servirá para deletar threads

  const gonnaDeleteId = req.body.teste[0].threadsData._id;
  const password = req.body.teste[1];
  const forDeletingReplys = req.body.teste[0].threadsData.randomIdGeneratedByMe;

  Post.find({ _id: gonnaDeleteId }, (err, findResult) => {
    if (findResult[0].password === password) {
      deleteById();
      deleteByReplys();
    }
  });

  function deleteById() {
    Post.deleteMany({ _id: gonnaDeleteId }, (err) => {
      err ? console.log(err) : null;
    });
  }
  function deleteByReplys() {
    Post.deleteMany({ reply: forDeletingReplys }, (err) => {
      err ? console.log(err) : null;
    });
  }
});

app.post('/deleteReplys', (req, res) => {
  const gonnaDeleteId = req.body.teste[0].replyData._id;
  const password = req.body.teste[1];

  Post.find({ _id: gonnaDeleteId }, (err, findResult) => {
    if (findResult[0].password === password) {
      deleteById();
    }
  });

  function deleteById() {
    Post.deleteMany({ _id: gonnaDeleteId }, (err) => {
      err ? console.log(err) : null;
    });
  }
});

app.get('/getId', (req, res) => {
  PostCount.find({}, (err, idFound) => {
    res.json(idFound);
  });
});

app.listen(PORT, () => {
  console.log('Your server is now connected at port 5000');
});
