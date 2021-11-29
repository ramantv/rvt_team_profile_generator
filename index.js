const fs = require("fs");
const inquirer = require("inquirer");

const generatePage = require("./src/page-template");

const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");

const writeFile = (fileContent) => {
  return new Promise((resolve, reject) => {
    fs.writeFile("./dist/index.html", fileContent, (err) => {
      // if there's an error, reject the Promise and send the error to the Promise's `.catch()` method
      if (err) {
        reject(err);
        // return out of the function here to make sure the Promise doesn't accidentally execute the resolve() function as well
        return;
      }

      // if everything went well, resolve the Promise and send the successful data to the `.then()` method
      resolve({
        ok: true,
        message: "Team profile created!",
      });
    });
  });
};

const copyFile = () => {
  return new Promise((resolve, reject) => {
    fs.copyFile("./src/style.css", "./dist/style.css", (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        ok: true,
        message: "Check out the generated team profile page at ./dist/index.html",
      });
    });
  });
};

const promptManager = () => {
    var teamData = [];
  return inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "What is the manager's name?",
      },
      {
        type: "input",
        name: "id",
        message: "What is the manager's ID?",
        validate: validateEmployeeID
      },
      {
        type: "input",
        name: "email",
        message: "What is the manager's email?",
        validate: validateEmail
      },
      {
        type: "input",
        name: "officeNumber",
        message: "What is the manager's office number?",
      },
    ])
    .then((managerData) => {
      const { name, id, email, officeNumber } = managerData;
      employee = new Manager(name, id, email, officeNumber);
      teamData.push(employee);
      return teamData;
    });
};

const promptEmployee = (teamData) => {
  return inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message:
          "Would you like to add an engineer, an intern, or finish building your team?",
        choices: ["Engineer", "Intern", "Finished"],
      },
    ])
    .then(({ role }) => {
      if (role === "Engineer") {
        return inquirer
          .prompt([
            {
              type: "input",
              name: "name",
              message: "What is the engineer's name?",
            },
            {
              type: "input",
              name: "id",
              message: "What is the engineer's ID number?",
              validate: validateEmployeeID
            },
            {
              type: "input",
              name: "email",
              message: "What is the engineer's email?",
              validate: validateEmail
            },
            {
              type: "input",
              name: "github",
              message: "What is the engineer's GitHub username?",
            },
          ])
          .then((employeeData) => {
            employee = new Engineer(
              employeeData.name,
              employeeData.id,
              employeeData.email,
              employeeData.github
            );
            teamData.push(employee);
            return promptEmployee(teamData);
          });
      } else if (role === "Intern") {
        return inquirer
          .prompt([
            {
              type: "input",
              name: "name",
              message: "What is the intern's name?",
            },
            {
              type: "input",
              name: "id",
              message: "What is the intern's ID number?",
              validate: validateEmployeeID
            },
            {
              type: "input",
              name: "email",
              message: "What is the intern's email?",
              validate: validateEmail
            },
            {
              type: "input",
              name: "school",
              message: "Which school does the intern attend?",
            },
          ])
          .then((employeeData) => {
            employee = new Intern(
              employeeData.name,
              employeeData.id,
              employeeData.email,
              employeeData.school
            );
            teamData.push(employee);
            return promptEmployee(teamData);
          });
      } else {
        return teamData;
      }
    });
};

const validateEmployeeID = (empId) => {
    const employeeIdRegex = /^[a-zA-Z0-9\-_]{1,10}$/;
    if(!employeeIdRegex.test(empId)) {
        return "Employee ID should be an alpha-numeric of maximum length up to 10 characters!";
    }
    return true;
}

const validateEmail = (email) => {
    const emailRegEx = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if(!emailRegEx.test(email)) {
        return "Please enter a valid email address!";
    }
    return true;
}

promptManager()
  .then(promptEmployee)
  .then((teamData) => {
    return generatePage(teamData);
  })
  .then((pageHTML) => {
    return writeFile(pageHTML);
  })
  .then((writeFileResponse) => {
    console.log("------------------------");
    console.log(writeFileResponse.message);
    return copyFile();
  })
  .then((copyFileResponse) => {
    console.log(copyFileResponse.message);
    console.log("------------------------");
  })
  .catch((err) => {
    console.log(err);
  });
