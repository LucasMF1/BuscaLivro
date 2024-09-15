const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const cors = require('cors'); // Certifique-se de requerer o cors no início

const app = express(); // Inicializa o app antes de usar o CORS

// Habilita o CORS
app.use(cors());

const db = new sqlite3.Database('favorites.db'); // Usando arquivo para persistência
app.use(bodyParser.json());

// Criação das tabelas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    book_id TEXT,
    note TEXT,
    rating INTEGER,
    tags TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
});

// Registro de usuário
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
  }

  // Verifica se o nome de usuário já existe
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Erro no servidor.' });
    }

    if (row) {
      return res.status(400).json({ message: 'Nome de usuário já está em uso.' });
    }

    // Criptografa a senha e insere no banco de dados
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao registrar o usuário.' });
      }
      res.json({ userId: this.lastID });
    });
  });
});

// Login de usuário
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios.' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Usuário ou senha incorretos.' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Usuário ou senha incorretos.' });
    }

    res.json({ userId: user.id });
  });
});

// Favoritar livro
app.post('/favorites', (req, res) => {
  const { user_id, book_id, note, rating, tags } = req.body;

  if (!user_id || !book_id) {
    return res.status(400).json({ message: 'ID do usuário e ID do livro são obrigatórios.' });
  }

  db.run('INSERT INTO favorites (user_id, book_id, note, rating, tags) VALUES (?, ?, ?, ?, ?)', [user_id, book_id, note, rating, tags], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Erro ao favoritar livro.' });
    }
    res.json({ favoriteId: this.lastID });
  });
});

// Obter favoritos do usuário
app.get('/favorites/:user_id', (req, res) => {
  db.all('SELECT * FROM favorites WHERE user_id = ?', [req.params.user_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao obter favoritos.' });
    }
    res.json(rows);
  });
});

// Atualizar favorito
app.put('/favorites/:id', (req, res) => {
  const { note, rating, tags } = req.body;
  const favoriteId = req.params.id;

  db.run(
    'UPDATE favorites SET note = ?, rating = ?, tags = ? WHERE id = ?',
    [note, rating, tags, favoriteId],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Erro ao atualizar favorito.' });
      }
      res.json({ message: 'Favorito atualizado com sucesso!' });
    }
  );
});

// Inicializa o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
