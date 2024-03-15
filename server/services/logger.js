const { createLogger, format, transports } = require("winston");
const path = require("path");
const util = require("util");

function transform(info, opts) {
    const args = info[Symbol.for("splat")];
    if (args) {
        info.message = util.format(info.message, ...args);
    }
    return info;
}

function utilFormatter() {
    return { transform };
}

module.exports = createLogger({
    transports: [
        new transports.Console({
            format: format.combine(
                format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
                utilFormatter(), // <-- this is what changed
                format.colorize(),
                format.printf(
                    ({ level, message, label, timestamp }) =>
                        `${timestamp} ${label || "-"} ${level}: ${message}`,
                ),
            ),
        }),
        // new transports.File({
        //     filename: 'logs/activity.log',
        //     format:format.combine(
        //         format.label({ label: path.basename(process.mainModule.filename) }),
        //         format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        //         format.align(),
        //         format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
        //         format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
        //         format.splat(),
        //         format.json()
        //     )}),
    ],
});
