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
    fs.writeFile(path, JSON.stringify(data), err => {
      if (err) throw err;
      console.log("card writed");
    });
  }
}
module.exports = Card;
