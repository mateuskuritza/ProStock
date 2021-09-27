## Instalação

  1. Clone esse repositório
  2. Crie um banco de dados <em>postgreSQL</em> principal e um para testes
  3. Crie um arquivo <em>.env</em> seguindo o <em>.env.example</em>
  4. Acesse a pasta do projeto, acesse o terminal e instale as dependências com
    ```npm i```
  5. Inicie o projeto como desenvolvedor com o comando
    ```npm run start:dev```

## Rotas da API


* Sua URL base será algo como http://localhost:4000, sendo que a porta 4000 pode ser alterada no arquivo <em>.env</em>.

* Todas as rotas são a partir desta rota base, por exemplo, uma rota <em> /user </em> seria http://localhost:4000/user.

* Todas as rotas de <em>/ingredients</em> e <em>/products</em> são autenticadas utilizando um JWT enviado como Bearer token no header Authorization da requisição, esse token é adquirido na rota <em>/user/login</em>, caso o token não seja enviado elas retornam um status 401.


<details>

<strong><summary>/users</summary></strong>

<details>

<summary>POST /register</summary>

<br>

Essa rota espera um body no formato:

```{ name: "Fake", email: "fake@gmail.com", password: ###### }```

Foram feitas algumas validações: 
 * Nenhum dos campos pode estar vazio
 * Name precisa possuir ao menos 3 caracteres
 * Password precisa possuir ao menos 6 dígitos
 * Email precisa ser um email válido

Em caso de sucesso retorna um status 201, se não, 400.

<br>

</details>

<details>

<summary>POST /login</summary>

<br>

Essa rota espera um body no formato:

```{ email: "fake@gmail.com", password: ###### }```

Foram feitas algumas validações: 
 * Nenhum dos campos pode estar vazio
 * Password precisa possuir ao menos 6 dígitos
 * Email precisa ser um email válido

Em caso de sucesso retorna um status 201 com:

``` { user_id: uuid, access_token: jwtToken } ```

Se não, status 401.

</details>

</details>

<br>

<details>

<strong><summary>/ingredients</summary></strong>

<details>

<summary>POST /</summary>

<br>

Essa rota espera um body no formato:

```{ name: "Café em pó", unitType: "g", unitPrice: 10, available: 2000 }```

Nesse caso, estamos criando um ingrediente chamado café em pó, que cada 1g custa 10 centavos e possuí em estoque 2000g.

Foram feitas algumas validações: 
 * Nenhum dos campos pode estar vazio
 * Name precisa possuir ao menos 3 caracteres
 * unitType precisa possuir ao menos 1 caractere
 * unitPrice precisa ser um número maior que 0
 * available precisa ser um número maior ou igual a 0

Em caso de sucesso retorna um status 201 com o ingrediente criado.

Se as validações acima não forem cumpridas, retorna 400 com a mensagem especificando o erro.

O nome do ingrediente precisa ser único, caso já exista é retornado um erro 409.

<br>

</details>

<details>

<summary>GET /</summary>

<br>

Essa rota retorna uma array com todos os ingredientes cadastrados no formato:

```[ { id: Número, name: "Café em pó", unitType: "g", unitPrice: 10, available: 2000 } ]```

Com status 200.
</details>

<details>

<summary>GET /:id</summary>

<br>

Essa rota retorna o ingrediente especificado pelo ID no formato:

```{ id: Número, name: "Café em pó", unitType: "g", unitPrice: 10, available: 2000 }```

Com status 200. Caso não exista um ingrediente com esse ID é retornado um erro 404.

<br>

</details>


<details>

<summary>PATCH /:id</summary>

<br>

Essa rota espera um body com qualquer uma ou mais de uma das propriedades:

```{ name: "Café em pó", unitType: "g", unitPrice: 10, available: 2000 }```

Será atualizado o ingrediente com as informações enviadas. 

Caso não exista o ingrediente, será enviado um erro 404.

Caso seja uma tentativa de alterar o nome, e o nome já exista, será enviado um erro 409.

Em caso de sucesso é retornado status 200.
</details>


<details>

<summary>DELETE /:id</summary>

<br>

Será deletado o ingrediente especificado pelo ID. 

Caso não exista o ingrediente, será enviado um erro 404.

Em caso de sucesso é retornado status 204.

</details>

</details>

<br>


<details>

<strong><summary>/products</summary></strong>

<details>

<summary>POST /</summary>

<br>

Essa rota espera um body no formato:

```{ name: "Café amargo", price: 1000 }```

Será criado um produto de nome "Café amargo" com um valor de venda de 1000 centavos.

Foram feitas algumas validações: 
 * Nenhum dos campos pode estar vazio
 * Name precisa possuir ao menos 3 caracteres
 * Price precisa ser um número maior que 0

Em caso de sucesso retorna um status 201.

Caso já exista um produto com o nome, é retornado um erro 409.

<br>

</details>

<details>

<summary>GET /</summary>

<br>

Essa rota retorna uma array com todos os produtos cadastrados no formato:

```[{ id: Number, name: "Café amargo", price: 1000, imageName: ...., available: Boolean, cost: Number }]```

O campo available indica se existem os ingredientes necessários para o produto em estoque.

O campo cost é calculado a partir da quantidade necessária e preços unitários dos ingredientes.

Em caso de sucesso retorna um status 200.

<br>

</details>


<details>

<summary>GET /:id</summary>

<br>

Essa rota retorna o produto especificado pelo ID no formato:

```[{ id: Number, name: "Café amargo", price: 1000, imageName: ...., available: Boolean, cost: Number, productIngredients }]```

O campo productIngredients retorna todos os ingredientes necessários para o produto, no formato:

```[{ id: Number, productId: Number, ingredientId: Number, ingredientUnits: Number, ingredient: {...} }]```

Sendo que o campo ingredientUnits indica quantas unidades desse ingrediente são necessárias para o determinado produto.

Já o campo ingredient traz as características do ingrediente.

Em caso de sucesso retorna um status 200.

Se o produto não existir é retornado o status 404.

<br>

</details>


<details>

<summary>PATCH /:id</summary>

<br>

Essa rota altera o produto especificado pelo ID a partir de um body:

```{name: "Café doce", price: 2500}```

Pode ser alterado o nome e/ou o preço de venda do produto.

Em caso de sucesso retorna um status 200.

Se o produto não existir é retornado o status 404.

<br>

</details>


<details>

<summary>DELETE /:id</summary>

<br>

Essa rota deleta produto especificado pelo ID.

Em caso de sucesso retorna um status 204.

Se o produto não existir é retornado o status 404.

<br>

</details>

<details>

<summary>POST /ingredient</summary>

<br>

Essa rota adiciona, ou atualiza a quantidade de ingrediente a um produto a partir de um body:

``` { productId: Number, ingredientId: Number, ingredientUnits: Number } ```

O campo ingredientUnits indica quantas unidades do ingrediente são necessárias para o produto.

Em caso de sucesso retorna um status 201.

Se o produto não existir é retornado o status 404.

Se o ingrediente não existir é retornado o status 404.

Ambos os erros 404 retornam consigo uma mensagem especificando o que não foi encontrado.

<br>

</details>


<details>

<summary>GET /:id/image</summary>

<br>

Essa rota retorna a imagem cadastrada no produto especificado pelo ID.

Em caso de sucesso retorna um status 200 com a imagem do produto.

Caso o produto ainda não possua uma imagem cadastrada, ou o produto não exista, é retornado um erro 404 com uma mensagem especificando o caso.

<br>

</details>


<details>

<summary>POST /:id/image</summary>

<br>

Essa rota espera um arquivo de imagem de nome "file".

São permitidas as extensões <strong>.png e .jpg</strong>.

São permitidos os mimeTypes <strong>image/png or image/jpg</strong>.

A imagem não deve possuir um tamanho superior a 2MB ( 2 * 1024 * 1024 ).

Em caso de sucesso retorna um status 201.

Em caso de falha é retornado um status 400 com uma mensagem especificando o motivo.

<br>

</details>


</details>

<br>

## Testes

Foram criados apenas testes end-to-end (e2e) por enquanto, é possível realizar esses testes com o comando:

```bash
# e2e tests
$ npm run test:e2e
```

## Suporte

Qualquer dúvida ou sugestão de melhoria pode entrar em contato comigo pelo meu <a target="_blank" href="https://bit.ly/3zgGEfp"> Linkedin </a> :)
