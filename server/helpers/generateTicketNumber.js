function generateTicketNumber() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let ticketNumber = '';

    // Generate two random letters
    for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * letters.length);
        ticketNumber += letters[randomIndex];
    }

    // Generate a random number between 1000 and 9999
    const randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    // Generate a timestamp in milliseconds since the Unix epoch
    const timestamp = Date.now();

    // Combine the random letters, random number, and timestamp to create a unique ticket number
    ticketNumber += randomNumber + timestamp;

    return ticketNumber;
}

module.exports = generateTicketNumber