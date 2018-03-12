const winston = require('winston');

const getLogger = (module, type) => {
    const modulePath = module.filename.split('/').slice(-2).join('/');
    const logger = new winston.Logger({
        transports: [],
        label: modulePath
    });

    if (process.env.NODE_ENV !== 'production') {
        logger.add(winston.transports.Console, {
            colorize: true,
            json: true,
            abel: modulePath
        });
    }

    switch (type) {
        case 'error':
            logger.add(winston.transports.File, {
                name: 'error-file',
                filename: './error_default.log',
                level: 'error'
            });
            return logger;
        case 'info':
            logger.add(winston.transports.File, {
                name: 'info-file',
                filename: './info_default.log',
                level: 'info'
            });
            return logger;
        case 'warn':
            logger.add(winston.transports.File, {
                name: 'info-file',
                filename: './worn_default.log',
                level: 'info'
            });
            return logger;
        default:
            return logger;
    }
};

module.exports = module => ({
    error(err, meta) {
        getLogger(module, 'error').error(err, meta);
    },
    info(err, meta) {
        getLogger(module, 'info').info(err, meta);
    },
    debug(err, meta) {
        getLogger(module, 'default').debug(err, meta);
    },
    warn(err, meta) {
        getLogger(module, 'warn').debug(err, meta);
    }
});