const mongoose = require("mongoose");
const cities = require("./cities");
const indcities = require("./indcities");
const Campground = require("../models/campground");
const { places, descriptors } = require("./seedhelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 500; i++) {
    const random = Math.floor(Math.random() * 100);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "6093a04baa6b8a40c840fc7e",
      location: `${indcities[random].city},${indcities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          parseFloat(indcities[random].lng),
          parseFloat(indcities[random].lat),
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dgpq2dfgb/image/upload/v1620632155/Yelpcamp/feynpjkmfod6aeqhj2hi.jpg",
          filename: "Yelpcamp/feynpjkmfod6aeqhj2hi",
        },
        {
          url: "https://res.cloudinary.com/dgpq2dfgb/image/upload/v1620636995/Yelpcamp/roy7xtw9cwc1jgphcsii.jpg",
          filename: "Yelpcamp/roy7xtw9cwc1jgphcsii",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Qui odit minima nisi placeat architecto perferendis labore maiores, eaque nihil suscipit quae mollitia natus eius voluptate beatae molestias, dolorem, nam laudantium!",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
