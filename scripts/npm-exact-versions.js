const fs = require('fs');

let packageJson = JSON.parse(fs.readFileSync('./package.json'));

function checkExactVersion(json) {
  let isValid = true;
  isValid &= checkJson('dependencies', json);
  isValid &= checkJson('devDependencies', json);
  isValid &= checkJson('optionalDependencies', json);
  isValid &= checkJson('peerDependencies', json);
  return isValid;
}

function checkJson(dependencyType, json) {
  let deps = json[dependencyType];
  let isValid = true;
  if (deps) {
    for (let [key, value] of Object.entries(deps)) {
      var numericVersionPattern = new RegExp('^[\.~^x0-9]+$');
      // Check if it is a version number or something else (git url etc.)
      if (numericVersionPattern.test(value)) {
        // Check if only numbers and "." are present
        var onlyNumbersPattern = new RegExp('^[\.0-9]+$');
        if (!onlyNumbersPattern.test(value)) {
          console.log(`Package "${key}" does not have a fixed version ${value}`);
          isValid = false;
        }
      }
    }
  }
  return isValid;
}

if (!checkExactVersion(packageJson)) {
  throw new Error('🖕');
}