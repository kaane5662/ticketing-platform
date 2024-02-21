const crypto = require('crypto');

function generateSecurityCode() {
  // Generate a 3-byte random number (which will be between 0 and 16777215)
  const randomNumber = crypto.randomBytes(3).readUIntBE(0, 3);

  // Convert the random number to a 6-digit string, padding with leading zeros if necessary
  const securityCode = randomNumber.toString().padStart(6, '0');

  return securityCode;
}

module.exports = generateSecurityCode