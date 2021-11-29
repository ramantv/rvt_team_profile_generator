const fs = require("fs");
const inquirer = require("inquirer");

const generateTeamProfile = require("./src/page-template");

const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");

// function to prompt user to enter Manager details
const getManagerDetails = () => {
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
        validate: validateEmployeeID,
      },
      {
        type: "input",
        name: "email",
        message: "What is the manager's email?",
        validate: validateEmail,
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

// function to prompt user to get Employee details. Recursively calls itself until the user is finished entering all employee/intern details.
const getEmployeeDetails = (teamData) => {
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
              validate: validateEmployeeID,
            },
            {
              type: "input",
              name: "email",
              message: "What is the engineer's email?",
              validate: validateEmail,
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
            return getEmployeeDetails(teamData);
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
              validate: validateEmployeeID,
            },
            {
              type: "input",
              name: "email",
              message: "What is the intern's email?",
              validate: validateEmail,
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
            return getEmployeeDetails(teamData);
          });
      } else {
        return teamData;
      }
    });
};

// employeeID validator
const validateEmployeeID = (empId) => {
  const employeeIdRegex = /^[a-zA-Z0-9\-_]{1,10}$/;
  if (!employeeIdRegex.test(empId)) {
    return "Employee ID should be an alpha-numeric of maximum length up to 10 characters!";
  }
  return true;
};

// email address validator
const validateEmail = (email) => {
  const emailRegEx =
    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
  if (!emailRegEx.test(email)) {
    return "Please enter a valid email address!";
  }
  return true;
};

// function to write out the generated team profile HTML to the output file
const writeFile = (fileContent) => {
  return new Promise((resolve, reject) => {
    fs.writeFile("./dist/index.html", fileContent, (err) => {
      // if there's an error, reject the Promise and return
      if (err) {
        reject(err);
        return;
      }

      // if team profile write succeeded, resolve the Promise and send OK.
      resolve({
        ok: true,
        message: "Team profile created!",
      });
    });
  });
};

// function to copy the custom stylesheet file into the output folder 
const copyStylesheet = () => {
  return new Promise((resolve, reject) => {
    fs.copyFile("./src/style.css", "./dist/style.css", (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        ok: true,
        message:
          "Check out the generated team profile page at ./dist/index.html",
      });
    });
  });
};


// initiate the data collection and team profile generation.
getManagerDetails()
  .then(getEmployeeDetails)
  .then((teamData) => {
    return generateTeamProfile(teamData);
  })
  .then((pageHTML) => {
    return writeFile(pageHTML);
  })
  .then((writeFileResponse) => {
    console.log("------------------------");
    console.log(writeFileResponse.message);
    return copyStylesheet();
  })
  .then((copyStylesResponse) => {
    console.log(copyStylesResponse.message);
    console.log("------------------------");
  })
  .catch((err) => {
    console.log(err);
  });
