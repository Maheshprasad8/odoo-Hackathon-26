const responseHandler = (req, res, next) => {
    res.sendSuccess = (data, message = 'Success', statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    };

    res.sendError = (message = 'Error', statusCode = 400) => {
        return res.status(statusCode).json({
            success: false,
            message,
        });
    };

    next();
};

module.exports = responseHandler;
