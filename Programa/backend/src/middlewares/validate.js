const { AppError } = require("../config/errores");

const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            throw new AppError("DATOS_INVALIDOS", undefined, result.error.issues);
        }

        req.body = result.data;
        next();
    };
};

module.exports = validate;