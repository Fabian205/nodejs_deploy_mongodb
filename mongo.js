const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const gName = process.argv[3];
const gNumber = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@cluster1.xkzcyq6.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

  const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

/* const person = new Person({
  name: gName,
  number: gNumber,
}) 

person.save().then(result => {
  console.log(`added ${gName} number ${gNumber} to phonebook!`)
  mongoose.connection.close()
}) */

Person.find({}).then((result) => {
  result.forEach((person) => {
    console.log(person);
  });
  mongoose.connection.close();
});

