// Import generic Employee class
const Employee = require("./Employee");

// Constructor
class Intern extends Employee {
  constructor(_name, _id, _email, _school) {
    super(_name, _id, _email);
    this.school = _school;
  }

  // Getter for school
  getSchool() {
    return this.school;
  }

  // Override getter for role
  getRole() {
    return "Intern";
  }
}

// EXPORT
module.exports = Intern;
