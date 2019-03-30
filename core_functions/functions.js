const path = require('path');
const fs = require('fs');

module.exports = {
    log: function(msg, file = 'system.log')
    {
        const LogDir = process.cwd() + path.sep + 'logs';
        if (msg == 'undefined' || msg === null)
        {
            console.log('An empty message was passed to the log function, skipping.');
            return;
        }

        const logPath = path.join(LogDir, file);
        let dateObj = new Date();
        let day = dateObj.getDate();
        let month = dateObj.getMonth() + 1;
        let year = dateObj.getFullYear();
        let hour = dateObj.getHours();
        let min = dateObj.getMinutes();
        let seconds = dateObj.getSeconds();
        let milliseconds = dateObj.getMilliseconds();
        let date = `${year}-${month}-${day} ${hour}:${min}:${seconds}:${milliseconds}`;

        let processedMessage = date + ` Logged Message: ${msg}\n`;

        fs.appendFile(logPath, processedMessage, err=>
        {
            if (err)
            {
                console.log(`Recieved error when trying to log message. Error: ${err}`);
                console.log(processedMessage);
                return;
            }

            console.log('Logged message.');
            return;
        });
    }
}