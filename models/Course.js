const uuid4 = require("uuid/v4");
const fs = require("fs");
const path = require("path");

class Course {
  constructor(title, price, label) {
    this.title = title;
    this.price = price;
    this.label = label;
    this.id = uuid4();
    this.filePath = path.join(__dirname, "..", "data", "data.json");
  }
  async save() {
    const res = await this._read();
    res.push({
      title: this.title,
      price: this.price,
      label: this.label,
      id: this.id
    });
    await this._write(this.filePath, res);
  }
  _read() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, "utf-8", (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    });
  }
  _write(file, data) {
    return new Promise((resolve, reject) => {
      const jsonData = JSON.stringify(data);
      fs.writeFile(file, jsonData, err => {
        if (err) reject(err);
        console.log("file writed");
      });
    });
  }
}

module.exports = Course;
