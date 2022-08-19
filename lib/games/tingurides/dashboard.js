function client() {
    return `Welcome ${username} to your dashboard \n\n`+
    `1. Create a job.\n`+
    `2. Suggestions box.\n`+
    `3. Help.\n`+
    `4. Logout.\n`
}

function driver(username) {
    return `Welcome ${username} to your driver dashboard \n\n`+
    `1. List available jobs.\n`+
    `2. Join a job.\n`+
    `3. Booked jobs.\n`+
    `3. Commissions.\n`+
    `4. Logout.\n`
}


module.exports = {
    client, driver
}