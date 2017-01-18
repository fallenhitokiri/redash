import moment from 'moment';

function QueryFormatter(query) {
  this.query = query;
  this.formatters = {};

  this.parseQuery();
}

QueryFormatter.prototype.parseQuery = function () {
  const commentString = '-- FORMAT: ';
  const lines = this.query.split('\n');

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.startsWith(commentString)) {
      continue;
    }

    const formatter = line.split(commentString)[1];
    const splitFormatter = formatter.split(/ (.+)/, 2);
    this.formatters[splitFormatter[0].toLowerCase()] = splitFormatter[1];
  }
};

QueryFormatter.prototype.shouldFormat = function (key) {
  return key in this.formatters;
};

QueryFormatter.prototype.format = function (key, value, type) {
  if (this.formatters[key] === 'NOFORMAT') {
    return value;
  }

  if ((type === 'datetime' || type === 'date') && moment.isMoment(value)) {
    return value.format(this.formatters.key);
  }

  const val = this.formatters[key];
  return val.split('$value').join(value);
};

export default QueryFormatter;
