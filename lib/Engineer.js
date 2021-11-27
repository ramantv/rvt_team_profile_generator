// Import generic Employee class
const Employee = require("./Employee");

// CONSTRUCTOR
class Engineer extends Employee {
  constructor(_name, _id, _email, _github) {
    super(_name, _id, _email);
    this.github = _github;
  }

  // Getter for GitHub ID
  getGithub() {
    return this.github;
  }

  // Override getter for role
  getRole() {
    return "Engineer";
  }
}

// EXPORTS
module.exports = Engineer;
