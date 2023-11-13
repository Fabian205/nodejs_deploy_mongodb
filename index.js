
/*---------------------------------------------------
 |     3.12: Command-line database                  |
 |     3.13: Phonebook database, step1              |
 |     3.14: Phonebook database, step2              |
 |     3.15: Phonebook database, step3              |
 |     3.16: Phonebook database, step4              |
 |     3.17*: Phonebook database, step5             |
 |     3.18*: Phonebook database step6              |      
 ---------------------------------------------------*/


require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Person = require('./models/person');

app.use(express.json());

/* let persons = [
  { id: 1, name: "Ronny Parra", number: "0988011616" },
  { id: 2, name: "Erick Parra", number: "0988511121" },
  { id: 3, name: "Samantha Parra", number: "0998264721" },
  { id: 4, name: "Rodrigo Parra", number: "0954178956" },
  { id: 5, name: "Fabian Aguilar", number: "0954178957" },
]; */

const url = process.env.MONGO_DB_URI;
mongoose.set('strictQuery',false)
 mongoose.connect(url)
 .then(result => {
  console.log('connected to MongoDB')
})
.catch((error) => {
  console.log('error connecting to MongoDB:', error.message)
})


/* app.get('/', (request, response) => {
  response.end('<h1>Hello World!</h1>')
}) 

app.get('/api/persons', (request, response) => {
  response.header('Content-Type', 'application/json');
  response.end (JSON.stringify(persons,null,2))
});
*/

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.post('/api/persons', async(request, response) => {
 const body = request.body

 if (body.name === undefined) {
   return response.status(400).json({ error: 'content missing' })
 }

 // Verificar si ya existe una nota con el mismo contenido
 const existingPerson = await Person.findOne({ name: body.name })

 if (existingPerson) {
  return response.status(400).json({ error: 'person already exists' })
 }
 const person = new Person({
   name: body.name,
   number: body.number,
 })

 person.save().then(savedPerson => {
   response.json(savedPerson)
 })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', async (req, res) => {
  const idToDelete = req.params.id;

  try {
    const deletedPerson = await Person.findByIdAndDelete(idToDelete);

    if (deletedPerson) {
      res.json({ message: 'Person deleted successfully', deletedPerson });
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    console.error('Error deleting person:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/api/persons/:id', async (req, res) => {
  const idToUpdate = req.params.id;
  const { name, number } = req.body;

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      idToUpdate,
      { name, number }
    );

    if (updatedPerson) {
      res.json({ message: 'Person updated successfully', updatedPerson });
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    console.error('Error updating person:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const PORT = 3000
app.listen(PORT)
console.log(`Server running on port ${PORT}`)