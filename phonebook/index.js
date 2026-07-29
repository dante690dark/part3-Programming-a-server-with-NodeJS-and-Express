const express = require("express");
const app = express();

const persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateID = () => {
  let number;
  do {
    number = Math.floor(Math.random() * 9).toString();
  } while (persons.some((person) => person.id === number));

  return number;
};

app.use(express.json());

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  response.send(`
    <div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
    </div>
  `);
});

app.get("/api/persons/", (request, response) => {
  if (!persons.length)
    return response.status(400).json({ error: "content missing" });

  return response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((note) => note.id === id);

  person ? response.json(person) : response.status(404).end();
});

app.post("/api/person", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number)
    return response.status(400).json({ error: "content missing" });

  const isDuplicate = persons.some((e) => e.name === name);

  if (isDuplicate)
    return response.status(400).json({ error: "name must be unique" });

  const person = {
    name,
    number,
    id: generateID(),
  };

  persons.push(person);

  response.json(persons);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  const isId = persons.some((e) => e.id === id);

  if (!isId) return response.status(400).json({ error: "user doesn't exist" });

  const person = persons.filter((person) => person.id !== id);
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
