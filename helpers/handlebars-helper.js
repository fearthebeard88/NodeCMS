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
    paginate: function(options)
    {
        let output = '';
        if (options.hash.current == 1)
        {
            output += `<li class='page-item disabled'><a class='page-link'>First</a></li>`
        }
        else
        {
            output += `<li class='page-item'><a href='?page=1' class='page-link'>First</a></li>`
        }
        
        let i = (Number(options.hash.current) > 5 ? Number(options.hash.current) - 4 : 1);
        if (i != 1)
        {
            output += `<li class='page-item disabled'><a class='page-link'>...</a></li>`;
        }

        for (; i <= (Number(options.hash.current) + 4) && i <= options.hash.pages; i++)
        {
            if (i == options.hash.current)
            {
                output += `<li class='page-item active'><a class='page-link'>${i}</a></li>`;
            }
            else
            {
                output += `<li class=page-item'><a href='?page=${i}' class='page-link'>${i}</a></li>`;
            }
            
            if (i == Number(options.hash.current) + 4 && i < options.hash.pages)
            {
                output += `<li class=page-item disabled'><a class='page-link'>...</a></li>`;
            }
        }

        if (options.hash.current == options.hash.pages)
        {
            output += `<li class=page-item disabled'><a class='page-link'>Last</a></li>`;
        }
        else
        {
            output += `<li class=page-item'><a href='?page=${options.hash.pages}' class='page-link'>Last</a></li>`;
        }

        return output;
    }
}