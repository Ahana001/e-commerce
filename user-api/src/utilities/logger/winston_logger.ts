import winston, {format} from 'winston';

const mylevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  silly: 5,
};

const myFormat = format.printf(msg => {
  const { message, timestamp, metadata} = msg;
  let result = `${timestamp} `;
  const payload = metadata;
  result += '\t>> ' + message;
  if (payload.data) {
    if (typeof payload.data === 'object') {
      result +=
        '\n' + (payload.data.stack || JSON.stringify(payload.data, null, 4));
    } else {
      result += ' : ' + payload.data;
    }
  }
  return result;
});

const mylogger = winston.createLogger({
    levels: mylevels,
    format: format.combine(
      // winston.format.colorize(),
      format.metadata(),
      format.timestamp(),
      myFormat
    ),

    transports: [
      new winston.transports.Console({
        level: 'info',
        handleExceptions: true,
      }),
    ],
    exitOnError: false,
  });
function jsonify(data: any) {
  if (typeof data === 'number') {
    if (data % 1 === 0) {
      data = {message_int: data};
    } else {
      data = {message_float: data};
    }
  } else if (typeof data === 'string') {
    data = {message_string: data};
  } else if (typeof data === 'boolean') {
    data = {message_bool: data};
  } else if (typeof data === 'bigint') {
    data = {message_bint: data};
  }
  return data;
}

class logger {
  static error(message: string, data?: any) {
    data = jsonify(data);
    mylogger.error(message, {data});
  }
  static warn(message: string, data?: any) {
    data = jsonify(data);
    mylogger.warn(message, {data});
  }
  static info(message: string, data?: any) {
    data = jsonify(data);
    mylogger.info(message, {data});
  }
  static http(message: string, data?: any) {
    data = jsonify(data);
    mylogger.http(message, {data});
  }
  static debug(message: string, data?: any) {
    data = jsonify(data);
    mylogger.debug(message, {data});
  }
  static silly(message: string, data?: any) {
    data = jsonify(data);
    mylogger.silly(message, {data});
  }
}
export default logger;
