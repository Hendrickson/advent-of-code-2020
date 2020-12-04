function handleFiles(input) {
  const file = input.target.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
    const file = event.target.result;
    const allLines = file.split(/\r\n|\n/);
    var numValidPassports = 0;
    var numInvalid = 0;
    var passport = {};
    // Reading line by line
    allLines.forEach((line) => {
      if (line === "") {
        //previous data is for one passport
        if (validatePassport(passport)) {
          numValidPassports++;
        } else {
          numInvalid++;
        }
        passport = {};
      } else {
        var fields = line.split(" ");
        fields.forEach((field) => {
          var keyValue = field.split(":");
          if (passport[keyValue[0]] != undefined) {
            throw "Error";
          }
          passport[keyValue[0]] = keyValue[1];
        });
      }
    });
    // Last entry won't have an empty line
    if (validatePassport(passport)) {
      numValidPassports++;
    } else {
      numInvalid++;
    }

    console.log(numValidPassports);
  };

  reader.onerror = (event) => {
    alert(event.target.error.name);
  };

  reader.readAsText(file);
}

function validatePassport(passport) {
  var mandatoryFields = [
    { name: "byr", min: 1920, max: 2002 },
    { name: "iyr", min: 2010, max: 2020 },
    { name: "eyr", min: 2020, max: 2030 },
    { name: "hgt" },
    { name: "hcl" },
    { name: "ecl" },
    { name: "pid" },
    // "cid",
  ];
  var isValid = true;
  mandatoryFields.forEach((field) => {
    if (passport[field.name] == undefined) {
      isValid = false;
    } else {
      switch (field.name) {
        case "byr":
        case "iyr":
        case "eyr":
          if (!validateNumber(passport[field.name], field.min, field.max)) {
            isValid = false;
          }
          break;
        case "hgt":
          if (!validateHeight(passport[field.name])) {
            isValid = false;
          }
          break;
        case "hcl":
          if (!validateHairColor(passport[field.name])) {
            isValid = false;
          }
          break;
        case "ecl":
          if (!validateEyeColor(passport[field.name])) {
            isValid = false;
          }
          break;
        case "pid":
          if (!validatePassportId(passport[field.name])) {
            isValid = false;
          }
          break;
        default:
          isValid = false;
      }
    }
  });

  return isValid;
}

function validateNumber(numberStr, min, max) {
  var regex = /^\d{4}$/g;
  var res = regex.exec(numberStr);
  if (res == null) {
    return false;
  }

  var number = parseInt(numberStr, 10);
  return number >= min && number <= max;
}

function validateHeight(heightStr) {
  var regex = /^(\d+)(cm|in)$/g;
  var res = regex.exec(heightStr);
  if (res == null) {
    return false;
  }
  if (res[2] == "cm") {
    var num = parseInt(res[1], 10);
    if (num >= 150 && num <= 193) {
      return true;
    }
  } else if (res[2] == "in") {
    var num = parseInt(res[1], 10);
    if (num >= 59 && num <= 76) {
      return true;
    }
  }

  return false;
}

function validateHairColor(hairColorStr) {
  // a # followed by exactly six characters 0-9 or a-f
  var regex = /^#(\d|[a-f]){6}$/g;
  var res = hairColorStr.match(regex);
  return res != null;
}

function validateEyeColor(eyeColorStr) {
  //exactly one of: amb blu brn gry grn hzl oth
  var regex = /^(amb|blu|brn|gry|grn|hzl|oth)$/g;
  var res = eyeColorStr.match(regex);
  return res != null;
}

function validatePassportId(passportStr) {
  // a nine-digit number, including leading zeroes
  var regex = /^\d{9}$/g;
  var res = passportStr.match(regex);
  return res != null;
}
