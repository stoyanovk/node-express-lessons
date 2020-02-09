const uuid4 = require("uuid/v4");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "data.json");
class Course {
  constructor(title, price, label) {
    this.title = title;
    this.price = price;
    this.label = label;
    this.id = uuid4();
  }
  async save() {
    const res = await Course.read();
    res.push({
      title: this.title,
      price: this.price,
      label: this.label,
      id: this.id
    });
    Course.write(filePath, res);
  }
  static async update(course) {
    const courses = await Course.read();
    const filteredCoureses = courses.filter(({ id }) => id !== course.id);
    Course.write(filePath, [...filteredCoureses, course]);
  }
  static read() {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    });
  }
  static write(file, data) {
    return new Promise((resolve, reject) => {
      const jsonData = JSON.stringify(data);
      fs.writeFile(file, jsonData, err => {
        if (err) reject(err);
        console.log("file writed");
      });
    });
  }
  static async getById(innerId) {
    const result = await Course.read();
    return result.find(({ id }) => id === innerId);
  }
}

module.exports = Course;
