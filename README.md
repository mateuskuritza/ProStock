## Instalação

  1. Clone esse repositório
  2. Crie um banco de dados <em>postgreSQL</em> principal e um para testes
  3. Crie um arquivo <em>.env</em> seguindo o <em>.env.example</em>
  4. Acesse a pasta do projeto, acesse o terminal e instale as dependências com
    ```npm i```
  5. Inicie o projeto como desenvolvedor com o comando
    ```npm run start:dev```

## Rotas da API


* Sua URL base será algo como http://localhost:4000, sendo que a porta 4000 pode ser alterada no arquivo <em>.env</em>
* Todas as rotas são a partir desta rota base, por exemplo, uma rota <em> /user </em> seria http://localhost:4000/user.



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

## Testes

Foram criados apenas testes end-to-end (e2e) por enquanto, é possível realizar esses testes com o comando:

```bash
# e2e tests
$ npm run test:e2e
```

## Suporte

Qualquer dúvida ou sugestão de melhoria pode entrar em contato comigo pelo meu <a target="_blank" href="www.bit.ly/3zgGEfp"> Linkedin </a> :)