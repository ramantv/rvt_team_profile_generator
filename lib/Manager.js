// Import generic Employee class
const Employee = require("./Employee");

// CONSTRUCTOR
class Manager extends Employee {
  constructor(_name, _id, _email, _officeNumber) {
    super(_name, _id, _email);
    this.officeNumber = _officeNumber;
  }

  // overridden getter for role 
  getRole() {
    return "Manager";
  }

  getOfficeNumber() {
    return this.officeNumber;
  }
}

// EXPORT
module.exports = Manager;
