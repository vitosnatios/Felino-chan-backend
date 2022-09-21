# Felino chan

Um app com a funcionalidade de um imageaboard.

Live URL: https://felinochan.netlify.app/ \
Repositório: https://github.com/vitosnatios/felino-chan-Client

Server URL: https://felino-chan-server.onrender.com/api \
Repositório: https://github.com/vitosnatios/Felino-chan-backend

## Tecnologias/ferramentas utilizadas:

HTML, CSS, Javascript, Jquery, ReactJS, NodeJS, expressJS, MongoDB, Mongoose, MongoDB Atlas (como host da database), Netlify (como host do client), Heroku (como host do server), thecatapi (como API da qual o site gera as imagens de gatinhos).

## Funcionalidades:

Esse aplicativo exerce a função de um imageboard, o usuário escreve seu tópico ou resposta com possibilidade de outras informações como email, assunto, senha, essas informações são enviadas do front-end para o servidor, e do servidor para a data-base, então a data-base envia essas informações para serem mostradas no front-end.

Perceba que os tópicos aparecem por ordem de criação e também sobem sobre os recém-criados quando são respondidos, sendo assim, para que cada post possa subir sempre que atualizado, ao receber uma resposta, o tópico em si é re-criado como uma cópia de si mesmo para que ele possa ser reposicionado como mais recente na data-base, e suas respectivas respostas são renderizadas dentro dele mesmo, o seguindo pelo "id" único do tópico, já a ordem das respostas é diferente, a mais antiga está sempre acima, e a mais recente sempre aparece embaixo, essa tarefa foi realizada com um simples .reverse() no fetch da database.

Pela página inicial, apenas as cinco últimas respostas de cada tópico são mostradas, e em cada página são mostrados 15 tópicos, essa foi uma tarefa particularmente difícil de se realizar, fiz uma mistura de loop com regras até chegar no resultado desejado, foi definitivamente a parte mais desafiadora do projeto.

Quando um post ultrapassa a última página do site, ele é automaticamente deletado da data-base, como parte do funcionamento comum de um imageboard.

Perceba que todas imagens são tiradas de uma API que gera fotos de gatinho aleatoriamente, o intuito desse projeto não é efetivamente ser um imageboard, e sim demonstrar meus aprendizados e capacidades.

## Pequenas funções

Para parágrafo verde, inicie o parágrafo com ">". \
Para parágrafo azul, inicie o parágrafo com ">>". \
Para parágrafo rosa, inicie o parágrafo com ">>>". \
Para responder um tópico sem subí-lo, escreva "sage" no campo de email da sua resposta. \
Para responder um tópico sem subí-lo, escreva "sage" no campo de email da sua resposta.
