module.exports = (err, req, res, next) => {
    let status = 500;
    let message = 'Internal Server Error';

    if (err.message === 'please Enter your email and password' || err.message === 'Please Enter a valid email') {
        status = 400;
        message = err.message;
    } else if (err.message === 'Invalid email or password') {
        status = 401;
        message = err.message;
    }

    res.status(status).json({ message });
};