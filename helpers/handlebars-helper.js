const moment = require('moment');

module.exports = {
    select: function(status, options)
    {
        return options.fn(this).replace(new RegExp(' value=\"' + status +'\"'), '$&selected="status"');
    },

    /**
     * 
     * @param {Object} req.body{}
     * @param {Object} requiredProperties{}
     * @returns {[]} errors{message:<string>} or null
     */
    postValidator: function(req, requiredProperties)
    {
        let errors = [];
        if (typeof req == 'undefined' || typeof requiredProperties == 'undefined' || req == null || requiredProperties == null)
        {
            return null;
        }

        // req for most use cases is actually req.body
        // so property is actually the req.body.<property>
        for (let property in req)
        {
            if (!requiredProperties.hasOwnProperty(property))
            {
                continue;
            }

            if (req[property].trim().length <= 0)
            {
                errors.push({
                    message: `${requiredProperties[property]} cannot be empty.`
                });
            }
        }

        return errors;
    },

    prettyPrintDate: function(date, format)
    {
        return moment(date).format(format);
    },

    flashArrayMessages: function (flashArray)
    {
        console.log(flashArray);
        return flashArray;
    }
}