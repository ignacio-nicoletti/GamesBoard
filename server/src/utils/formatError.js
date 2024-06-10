export const formatError = (msg) => {
    // formato de respuesta de errores.
    return {
        errors: [{ msg: msg }],
    };
};
