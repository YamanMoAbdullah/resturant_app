const handleErrors = (err) => {
    let errors = {};

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        errors[field] = `This ${field} is already in use, Please choose a different one`;
        return { status: 409, errors };
    }

   
    if (err.message && err.message.includes('validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            if (properties && properties.path) {
                errors[properties.path] = properties.message;
            }
        });
        return { status: 400, errors };
    }

    return { status: 500, errors: { general: err.message || 'Internal Server Error' } };
};

const errorHandlerMiddleware = (err, req, res, next) => {
    const { status, errors } = handleErrors(err);
    res.status(status).json({ message: 'Unsuccessful registration', errors }); 
};

module.exports = errorHandlerMiddleware;