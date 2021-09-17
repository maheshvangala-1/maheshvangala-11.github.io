var fs = require("fs");
module.exports = (function () {
  const LogLevels = {
    INFO: 1,
    ERROR: 2,
    WARNING: 3,
    valueOf: function (level) {
      switch (level) {
        case 1:
          return "INFO";
          break;
        case 2:
          return "ERROR";
          break;
        case 3:
          return "WARNING";
          break;
        default:
          return undefined;
      }
    },
  };
  var logs = [];

  var LOGS_DIRECTORY = process.cwd() + "/logs";
  
  function log(level, description, payload) {
    // console.log("HIII",level,description,payload);

    let _level = 1;
    let _log = undefined;
    let _description = description;
    let _payload = payload;
    try {
      _level = LogLevels.valueOf(level) ? level : 1;
   
     
    } catch (exc) {
      
      _log = new Log(
        LogLevels.WARNING,
        "Wrong type of Log Level Passed.",
        null
      );
    } finally {
        _log = new Log(_level, _description, _payload);
      
     
      logs.push(_log);
      
      fs.appendFileSync(
        LOGS_DIRECTORY+"/"+LogLevels.valueOf(level).toLowerCase(),
        // `${LOGS_DIRECTORY}/${LogLevels.valueOf(level).toLowerCase()}`,
        _log.toString()
      );
      
    }
  }

  function getLogs(level) {
    if (LogLevels.valueOf(level))
      return logs.filter((x) => x.logLevel === level).map((x) => x.toString());
    else return [...logs];
  }

  class Log {
    _level = undefined;
    _description = undefined;
    _payload = undefined;
    _time = undefined;
    constructor(level, description, payload) {
        
      if (LogLevels.valueOf(level)) this._level = level;
      this._description =
        description.__proto__ === String.prototype
          ? description.replace("\t", " ")
          : description;
      this._payload = payload;
      this._time = Date.now();
    }
    get logLevel() {
      return this._level;
    }
    get logTime() {
      return new Date(this._time).toISOString();
    }
    get logDescription() {
      return this._description;
    }
    get logFile() {
      return __filename;
    }
    get payload() {
      return this._payload;
    }

    toString() {
      let result = `${this.logTime} - ${LogLevels.valueOf(this._level)} - ${
        this.logDescription
      }\n`;
      if (this.payload) {
        result += `${this.logTime} - ${LogLevels.valueOf(
          this._level
        )} - Payload passed - ${JSON.stringify(this.payload)}\n`;
      }
      return result;
    }
  }

  return { LogLevels, getLogs, log };
})();
