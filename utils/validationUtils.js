//************************* Utility function to trim spaces from a string ******************************//

const isTrim = (value) => {
  if (typeof value === "string") {
    const trimmedValue = value.trim();
    return trimmedValue;
  }

  if (Array.isArray(value)) {
    const trimmedArray = value.map((item) => {
      if (typeof item === "string") {
        return item.trim();
      }
      return item; // Return the item as is if it's not a string
    });
    return trimmedArray;
  }
  return value;
};

//******************* Utility function to check if a value is an array ******************************//

const isArray = (value) => {
  // If value is already an array, return it
  if (Array.isArray(value)) return value;

  // If it's a string representing an array, attempt to parse it as JSON
  if (
    typeof value === "string" &&
    value.startsWith("[") &&
    value.endsWith("]")
  ) {
    try {
      const parsedArray = JSON.parse(value);
      return Array.isArray(parsedArray) ? parsedArray : null;
    } catch (e) {
      return null; // Return null if parsing fails
    }
  }

  return null; // Return null if it's neither an array nor a valid JSON array string
};

//***************** Utility function to check if a value can be converted to a number **********************//

const isNumber = (value) => {
  const numValue = Number(value);
  if (!isNaN(numValue)) {
    return numValue; // Return the number if convertible
  }
  return null; // Return null if not convertible
};

//******************* Utility function to check if a parameter is required and not empty ************************//

const isRequired = (param, value) => {
  if (
    param.isRequired &&
    (value === undefined || value === null || value === "")
  ) {
    return { valid: false, message: `${param.name} is required` };
  }
  return { valid: true };
};

//************************************ Utility function to parse JSON *****************************************//

const isJson = (value) => {
  try {
    // Attempt to parse the string as JSON.
    const parsedValue = JSON.parse(value);

    // If successful, return the parsed JSON object.
    return parsedValue;
  } catch (e) {
    // Log an error message if parsing fails.
    console.error("JSON parsing failed:", e);
    return null; // Return null to indicate invalid JSON.
  }
};

//************************* Utility function to check if a number is positive ******************************//

const isPositive = (value) => {
  return typeof value === "number" && value >= 0;
};

//************************* Utility function to validate phone numbers ******************************//

const isValidPhone = (value) => {
  const phoneRegex = /^\d{10,11}$/; // Matches 10 to 11 digits
  return phoneRegex.test(value);
};

//*********************** Function to check if a value is a valid email ****************************//

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

//*************************** Utility function to validate file type ********************************//

const isValidFileType = (file, allowedTypes) => {
  // Check if the file's MIME type exists in the array of allowed types.
  return allowedTypes.includes(file.mimetype);
};

//*************************** Utility function to validate file size ********************************//

const isValidFileSize = (file, maxSize) => {
  // Check if the file's size is less than or equal to the specified maximum size.
  return file.size <= maxSize;
};

//*************************** Utility function to validate file name ********************************//

const isValidFileName = (file, allowedExtensions) => {
  // Extract the file extension from the original file name and convert it to lowercase.
  const fileExtension = file.originalname.split(".").pop().toLowerCase();

  // Check if the extracted extension matches any allowed extension (case-insensitive).
  return allowedExtensions.some(
    (ext) => fileExtension === ext.replace(".", "").toLowerCase()
  );
};

//*************************** Utility function to validate enum values ********************************//

const isValidEnum = (value, enumValues) => {
  // Handle cases where the value might be null or undefined
  const providedValue = value?.toString()?.toLowerCase();
  if (!providedValue) {
    return false; // Early return for invalid input
  }

  // Convert all enum values to lowercase and trim for case-insensitive comparison
  const lowercaseEnumValues = enumValues.map((item) =>
    item?.toString()?.toLowerCase().trim()
  );

  // Check if the lowercase version of the provided value exists in the enum array
  return lowercaseEnumValues.includes(providedValue);
};

//*************************** Utility function to validate time ********************************//

const isValidTime = (value) => {
  // Regular expression to match the 24-hour time format: (HH:MM:SS)
  // - ([01]\d|2[0-3]): Matches hours between 00 and 23
  //      - [01]\d: Matches hours 00 to 19
  //      - 2[0-3]: Matches hours 20 to 23
  // - [0-5]\d: Matches minutes or seconds between 00 and 59
  // - Anchors (^ and $): Ensure the pattern matches the entire string
  const timeRegex = /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/;

  // Test the input value against the regex
  // Returns true if the value matches the time format, false otherwise
  return timeRegex.test(value);
};

//*************************** Utility function to validate date ********************************//

const isValidDate = (value) => {
  const dateRegex = /^(0[1-9]|[12]\d|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

  // Test the input value against the regular expression
  return dateRegex.test(value);
};

//**************************** Middleware to validate request parameters *********************************//

const validateRequestParams = (paramRules) => {
  return (req, res, next) => {
    const errors = [];

    for (const [key, param] of Object.entries(paramRules)) {
      let value = req.query[key] || req.body[key]; // Check both query and body parameters

      // Finds the first file in the `req.files` array that matches the specified fieldname (key).
      const file = req.files?.find((f) => f.fieldname === key);

      // Check if the parameter is required
      const { valid: isRequiredValid, message } = isRequired(
        { name: key, ...param },
        value
      );

      if (!isRequiredValid) {
        // Special handling for class_id and section_id
        if (key === "class_id") {
          errors.push({ message: "Please select classId" });
        } else if (key === "section_id") {
          errors.push({ message: "Please select sectionId" });
        } else {
          errors.push({ message });
        }
        continue;
      }

      // Parse JSON if required
      if (param.isJson && value) {
        value = isJson(value);
        if (value === null) {
          errors.push({ message: `${key} should be in valid JSON format` });
          continue;
        }
      }

      // Trim spaces if required
      if (param.isTrim && value !== undefined) {
        value = isTrim(value);
      }

      // Validate and convert to number if required
      if (param.isNumber && value !== undefined) {
        const convertedValue = isNumber(value);
        if (convertedValue === null) {
          errors.push({ message: `${key} should be a valid number.` });
          continue;
        }

        // Store the converted value in a special param (convertedClassId or convertedSectionId)
        if (key === "class_id") {
          req.query.class_id = convertedValue;
        } else if (key === "section_id") {
          req.query.section_id = convertedValue;
        }
      }

      // Check if the value should be an array using the new utility function
      if (param.isArray && value !== undefined) {
        value = isArray(value);
        if (value === null) {
          errors.push({ message: `${key} should be an array.` });
          continue;
        }
      }

      // Validate if the number should be positive
      if (param.isPositive && value !== undefined) {
        const convertedValue = isNumber(value);
        if (convertedValue === null || !isPositive(convertedValue)) {
          errors.push({ message: `${key} should be a positive number.` });
          continue;
        }
      }

      // Check if the value should be a valid phone number
      if (param.isValidPhone && value !== undefined) {
        if (!isValidPhone(value)) {
          errors.push({ message: `Please enter valid phone number.` });
          continue;
        }
      }

      // File Presence validation
      if (param.isFileRequired && !file) {
        errors.push({ message: `${key} is required.` });
        continue;
      }

      if (file) {
        // File type validation
        if (
          param.allowedFileTypes &&
          !isValidFileType(file, param.allowedFileTypes)
        ) {
          errors.push({
            message: `${key} must be a valid file.`,
          });
          continue;
        }

        // File size validation
        if (
          param.allowedFileSize &&
          !isValidFileSize(file, param.allowedFileSize)
        ) {
          errors.push({
            message: `${key} must be smaller than ${
              param.allowedFileSize / 1024 / 1024
            } MB.`,
          });
          continue;
        }

        // File name validation
        if (
          param.allowedFileNames &&
          !isValidFileName(file, param.allowedFileNames)
        ) {
          errors.push({
            message: `${key} must have one of the following extensions: ${param.allowedFileNames.join(
              ", "
            )}.`,
          });
          continue;
        }
      }

      // Check whether the value provided is in the valid values
      if (
        param.enumValues &&
        value !== undefined &&
        !isValidEnum(value, param.enumValues)
      ) {
        errors.push({
          message: `${key} must be one of the following values: ${param.enumValues.join(
            ", "
          )}.`,
        });
        continue;
      }

      // Check whether the value provided is in valid time format
      if (param.isTime && value !== undefined && !isValidTime(value)) {
        errors.push({
          message: `${key} must be a valid 24-hour time in the format HH:MM:SS`,
        });
        continue;
      }

      // Check whether the value provided is in valid date format DD-MM-YYYY
      if (param.isDate && value !== undefined && !isValidDate(value)) {
        errors.push({
          message: `${key} must be in the format DD-MM-YYYY`,
        });
        continue;
      }

      // Replace the original value with the validated one
      if (req.query[key]) {
        req.query[key] = value;
      }
      if (req.body[key]) {
        req.body[key] = value;
      }
    }

    if (errors.length) {
      return res.status(400).json({
        status: "failed",
        code: 400,
        message: errors[0].message,
      });
    }

    next(); // Proceed to the next middleware or route handler if validation passes
  };
};

module.exports = {
  validateRequestParams,
};
