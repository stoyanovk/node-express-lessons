const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "card.json"
);

class Card {
  static async saveCourse(course) {
    const card = await Card.getCardItems();
    const ind = card.courses.findIndex(({ id }) => id === course.id);

    const candidate = card.courses[ind];

    if (candidate) {
      candidate.count++;
      card.courses[ind] = candidate;
    } else {
      course.count = 1;
      card.courses.push(course);
    }
    card.totalPrice = parseInt(card.totalPrice) + parseInt(course.price);
    Card.write(p, card);
  }
  static getCardItems() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, "utf-8", (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    });
  }
  static write(path, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, JSON.stringify(data), err => {
        if (err) reject(err);
        console.log("card writed");
        resolve(data);
      });
    });
  }
  static async remove(id) {
    const card = await Card.getCardItems();
    const ind = card.courses.findIndex(c => c.id === id);
    card.totalPrice -= card.courses[ind].price;
    if (card.courses[ind].count === 1) {
      card.courses = card.courses.filter(c => c.id !== id);
    } else {
      card.courses[ind].count--;
    }
    return Card.write(p, card);
  }
}
module.exports = Card;
