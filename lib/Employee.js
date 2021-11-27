// Constructor for generic Employee class
class Employee {
  constructor(_name, _id, _email) {
    this.name = _name;
    this.id = _id;
    this.email = _email;
  }

  getName() {
    return this.name;
  }

  getId() {
    return this.id;
  }

  getEmail() {
    return this.email;
  }

  getRole() {
    return "Employee";
  }
}

// EXPORTS
module.exports = Employee;
