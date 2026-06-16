// undefined v0.0.26 Copyright 2026 Iván Velasco González & John Alexis Guerra Gómez
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3')) :
typeof define === 'function' && define.amd ? define(['d3'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.TimeWidget = factory(global.d3));
})(this, (function (d3) { 'use strict';

function _interopNamespaceDefault(e) {
var n = Object.create(null);
if (e) {
Object.keys(e).forEach(function (k) {
if (k !== 'default') {
var d = Object.getOwnPropertyDescriptor(e, k);
Object.defineProperty(n, k, d.get ? d : {
enumerable: true,
get: function () { return e[k]; }
});
}
});
}
n.default = e;
return Object.freeze(n);
}

var d3__namespace = /*#__PURE__*/_interopNamespaceDefault(d3);

(function() {
    const env = {"NODE_ENV":"debug"};
    try {
        if (process) {
            process.env = Object.assign({}, process.env);
            Object.assign(process.env, env);
            return;
        }
    } catch (e) {} // avoid ReferenceError: process is not defined
    globalThis.process = { env:env };
})();

function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }

  var number = Number(dirtyNumber);

  if (isNaN(number)) {
    return number;
  }

  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
  }
}

function _typeof$2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$2 = function _typeof(obj) { return typeof obj; }; } else { _typeof$2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$2(obj); }
/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @param {Date|Number} argument - the value to convert
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */

function toDate(argument) {
  requiredArgs(1, arguments);
  var argStr = Object.prototype.toString.call(argument); // Clone the date

  if (argument instanceof Date || _typeof$2(argument) === 'object' && argStr === '[object Date]') {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime());
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument);
  } else {
    if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments"); // eslint-disable-next-line no-console

      console.warn(new Error().stack);
    }

    return new Date(NaN);
  }
}

/**
 * @name addDays
 * @category Day Helpers
 * @summary Add the specified number of days to the given date.
 *
 * @description
 * Add the specified number of days to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of days to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} - the new date with the days added
 * @throws {TypeError} - 2 arguments required
 *
 * @example
 * // Add 10 days to 1 September 2014:
 * const result = addDays(new Date(2014, 8, 1), 10)
 * //=> Thu Sep 11 2014 00:00:00
 */

function addDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);

  if (isNaN(amount)) {
    return new Date(NaN);
  }

  if (!amount) {
    // If 0 days, no-op to avoid changing times in the hour before end of DST
    return date;
  }

  date.setDate(date.getDate() + amount);
  return date;
}

/**
 * @name addMonths
 * @category Month Helpers
 * @summary Add the specified number of months to the given date.
 *
 * @description
 * Add the specified number of months to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of months to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the months added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 5 months to 1 September 2014:
 * const result = addMonths(new Date(2014, 8, 1), 5)
 * //=> Sun Feb 01 2015 00:00:00
 */

function addMonths(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);

  if (isNaN(amount)) {
    return new Date(NaN);
  }

  if (!amount) {
    // If 0 months, no-op to avoid changing times in the hour before end of DST
    return date;
  }

  var dayOfMonth = date.getDate(); // The JS Date object supports date math by accepting out-of-bounds values for
  // month, day, etc. For example, new Date(2020, 0, 0) returns 31 Dec 2019 and
  // new Date(2020, 13, 1) returns 1 Feb 2021.  This is *almost* the behavior we
  // want except that dates will wrap around the end of a month, meaning that
  // new Date(2020, 13, 31) will return 3 Mar 2021 not 28 Feb 2021 as desired. So
  // we'll default to the end of the desired month by adding 1 to the desired
  // month and using a date of 0 to back up one day to the end of the desired
  // month.

  var endOfDesiredMonth = new Date(date.getTime());
  endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
  var daysInMonth = endOfDesiredMonth.getDate();

  if (dayOfMonth >= daysInMonth) {
    // If we're already at the end of the month, then this is the correct date
    // and we're done.
    return endOfDesiredMonth;
  } else {
    // Otherwise, we now know that setting the original day-of-month value won't
    // cause an overflow, so set the desired day-of-month. Note that we can't
    // just set the date of `endOfDesiredMonth` because that object may have had
    // its time changed in the unusual case where where a DST transition was on
    // the last day of the month and its local time was in the hour skipped or
    // repeated next to a DST transition.  So we use `date` instead which is
    // guaranteed to still have the original time.
    date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
    return date;
  }
}

function _typeof$1(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof$1 = function _typeof(obj) { return typeof obj; }; } else { _typeof$1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof$1(obj); }

/**
 * @name add
 * @category Common Helpers
 * @summary Add the specified years, months, weeks, days, hours, minutes and seconds to the given date.
 *
 * @description
 * Add the specified years, months, weeks, days, hours, minutes and seconds to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Duration} duration - the object with years, months, weeks, days, hours, minutes and seconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 *
 * | Key            | Description                        |
 * |----------------|------------------------------------|
 * | years          | Amount of years to be added        |
 * | months         | Amount of months to be added       |
 * | weeks          | Amount of weeks to be added        |
 * | days           | Amount of days to be added         |
 * | hours          | Amount of hours to be added        |
 * | minutes        | Amount of minutes to be added      |
 * | seconds        | Amount of seconds to be added      |
 *
 * All values default to 0
 *
 * @returns {Date} the new date with the seconds added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add the following duration to 1 September 2014, 10:19:50
 * const result = add(new Date(2014, 8, 1, 10, 19, 50), {
 *   years: 2,
 *   months: 9,
 *   weeks: 1,
 *   days: 7,
 *   hours: 5,
 *   minutes: 9,
 *   seconds: 30,
 * })
 * //=> Thu Jun 15 2017 15:29:20
 */
function add(dirtyDate, duration) {
  requiredArgs(2, arguments);
  if (!duration || _typeof$1(duration) !== 'object') return new Date(NaN);
  var years = duration.years ? toInteger(duration.years) : 0;
  var months = duration.months ? toInteger(duration.months) : 0;
  var weeks = duration.weeks ? toInteger(duration.weeks) : 0;
  var days = duration.days ? toInteger(duration.days) : 0;
  var hours = duration.hours ? toInteger(duration.hours) : 0;
  var minutes = duration.minutes ? toInteger(duration.minutes) : 0;
  var seconds = duration.seconds ? toInteger(duration.seconds) : 0; // Add years and months

  var date = toDate(dirtyDate);
  var dateWithMonths = months || years ? addMonths(date, months + years * 12) : date; // Add weeks and days

  var dateWithDays = days || weeks ? addDays(dateWithMonths, days + weeks * 7) : dateWithMonths; // Add days, hours, minutes and seconds

  var minutesToAdd = minutes + hours * 60;
  var secondsToAdd = seconds + minutesToAdd * 60;
  var msToAdd = secondsToAdd * 1000;
  var finalDate = new Date(dateWithDays.getTime() + msToAdd);
  return finalDate;
}

/**
 * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
 * They usually appear for dates that denote time before the timezones were introduced
 * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
 * and GMT+01:00:00 after that date)
 *
 * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
 * which would lead to incorrect calculations.
 *
 * This function returns the timezone offset in milliseconds that takes seconds in account.
 */
function getTimezoneOffsetInMilliseconds(date) {
  var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  utcDate.setUTCFullYear(date.getFullYear());
  return date.getTime() - utcDate.getTime();
}

/**
 * @name startOfDay
 * @category Day Helpers
 * @summary Return the start of a day for the given date.
 *
 * @description
 * Return the start of a day for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|Number} date - the original date
 * @returns {Date} the start of a day
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // The start of a day for 2 September 2014 11:55:00:
 * const result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 00:00:00
 */

function startOfDay(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setHours(0, 0, 0, 0);
  return date;
}

var MILLISECONDS_IN_DAY = 86400000;
/**
 * @name differenceInCalendarDays
 * @category Day Helpers
 * @summary Get the number of calendar days between the given dates.
 *
 * @description
 * Get the number of calendar days between the given dates. This means that the times are removed
 * from the dates and then the difference in days is calculated.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @returns {Number} the number of calendar days
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many calendar days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * const result = differenceInCalendarDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 366
 * // How many calendar days are between
 * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
 * const result = differenceInCalendarDays(
 *   new Date(2011, 6, 3, 0, 1),
 *   new Date(2011, 6, 2, 23, 59)
 * )
 * //=> 1
 */

function differenceInCalendarDays(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var startOfDayLeft = startOfDay(dirtyDateLeft);
  var startOfDayRight = startOfDay(dirtyDateRight);
  var timestampLeft = startOfDayLeft.getTime() - getTimezoneOffsetInMilliseconds(startOfDayLeft);
  var timestampRight = startOfDayRight.getTime() - getTimezoneOffsetInMilliseconds(startOfDayRight); // Round the number of days to the nearest integer
  // because the number of milliseconds in a day is not constant
  // (e.g. it's different in the day of the daylight saving time clock shift)

  return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY);
}

/**
 * @name compareAsc
 * @category Common Helpers
 * @summary Compare the two dates and return -1, 0 or 1.
 *
 * @description
 * Compare the two dates and return 1 if the first date is after the second,
 * -1 if the first date is before the second or 0 if dates are equal.
 *
 * @param {Date|Number} dateLeft - the first date to compare
 * @param {Date|Number} dateRight - the second date to compare
 * @returns {Number} the result of the comparison
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Compare 11 February 1987 and 10 July 1989:
 * const result = compareAsc(new Date(1987, 1, 11), new Date(1989, 6, 10))
 * //=> -1
 *
 * @example
 * // Sort the array of dates:
 * const result = [
 *   new Date(1995, 6, 2),
 *   new Date(1987, 1, 11),
 *   new Date(1989, 6, 10)
 * ].sort(compareAsc)
 * //=> [
 * //   Wed Feb 11 1987 00:00:00,
 * //   Mon Jul 10 1989 00:00:00,
 * //   Sun Jul 02 1995 00:00:00
 * // ]
 */

function compareAsc(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var diff = dateLeft.getTime() - dateRight.getTime();

  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1; // Return 0 if diff is 0; return NaN if diff is NaN
  } else {
    return diff;
  }
}

/**
 * Milliseconds in 1 minute
 *
 * @name millisecondsInMinute
 * @constant
 * @type {number}
 * @default
 */

var millisecondsInMinute = 60000;
/**
 * Milliseconds in 1 hour
 *
 * @name millisecondsInHour
 * @constant
 * @type {number}
 * @default
 */

var millisecondsInHour = 3600000;

/**
 * @name differenceInCalendarMonths
 * @category Month Helpers
 * @summary Get the number of calendar months between the given dates.
 *
 * @description
 * Get the number of calendar months between the given dates.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @returns {Number} the number of calendar months
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many calendar months are between 31 January 2014 and 1 September 2014?
 * const result = differenceInCalendarMonths(
 *   new Date(2014, 8, 1),
 *   new Date(2014, 0, 31)
 * )
 * //=> 8
 */

function differenceInCalendarMonths(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
  var monthDiff = dateLeft.getMonth() - dateRight.getMonth();
  return yearDiff * 12 + monthDiff;
}

/**
 * @name differenceInCalendarYears
 * @category Year Helpers
 * @summary Get the number of calendar years between the given dates.
 *
 * @description
 * Get the number of calendar years between the given dates.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @returns {Number} the number of calendar years
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many calendar years are between 31 December 2013 and 11 February 2015?
 * const result = differenceInCalendarYears(
 *   new Date(2015, 1, 11),
 *   new Date(2013, 11, 31)
 * )
 * //=> 2
 */

function differenceInCalendarYears(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  return dateLeft.getFullYear() - dateRight.getFullYear();
}

// for accurate equality comparisons of UTC timestamps that end up
// having the same representation in local time, e.g. one hour before
// DST ends vs. the instant that DST ends.

function compareLocalAsc(dateLeft, dateRight) {
  var diff = dateLeft.getFullYear() - dateRight.getFullYear() || dateLeft.getMonth() - dateRight.getMonth() || dateLeft.getDate() - dateRight.getDate() || dateLeft.getHours() - dateRight.getHours() || dateLeft.getMinutes() - dateRight.getMinutes() || dateLeft.getSeconds() - dateRight.getSeconds() || dateLeft.getMilliseconds() - dateRight.getMilliseconds();

  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1; // Return 0 if diff is 0; return NaN if diff is NaN
  } else {
    return diff;
  }
}
/**
 * @name differenceInDays
 * @category Day Helpers
 * @summary Get the number of full days between the given dates.
 *
 * @description
 * Get the number of full day periods between two dates. Fractional days are
 * truncated towards zero.
 *
 * One "full day" is the distance between a local time in one day to the same
 * local time on the next or previous day. A full day can sometimes be less than
 * or more than 24 hours if a daylight savings change happens between two dates.
 *
 * To ignore DST and only measure exact 24-hour periods, use this instead:
 * `Math.floor(differenceInHours(dateLeft, dateRight)/24)|0`.
 *
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @returns {Number} the number of full days according to the local timezone
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many full days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * const result = differenceInDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 365
 * // How many full days are between
 * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
 * const result = differenceInDays(
 *   new Date(2011, 6, 3, 0, 1),
 *   new Date(2011, 6, 2, 23, 59)
 * )
 * //=> 0
 * // How many full days are between
 * // 1 March 2020 0:00 and 1 June 2020 0:00 ?
 * // Note: because local time is used, the
 * // result will always be 92 days, even in
 * // time zones where DST starts and the
 * // period has only 92*24-1 hours.
 * const result = differenceInDays(
 *   new Date(2020, 5, 1),
 *   new Date(2020, 2, 1)
 * )
//=> 92
 */


function differenceInDays(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var sign = compareLocalAsc(dateLeft, dateRight);
  var difference = Math.abs(differenceInCalendarDays(dateLeft, dateRight));
  dateLeft.setDate(dateLeft.getDate() - sign * difference); // Math.abs(diff in full days - diff in calendar days) === 1 if last calendar day is not full
  // If so, result must be decreased by 1 in absolute value

  var isLastDayNotFull = Number(compareLocalAsc(dateLeft, dateRight) === -sign);
  var result = sign * (difference - isLastDayNotFull); // Prevent negative zero

  return result === 0 ? 0 : result;
}

/**
 * @name differenceInMilliseconds
 * @category Millisecond Helpers
 * @summary Get the number of milliseconds between the given dates.
 *
 * @description
 * Get the number of milliseconds between the given dates.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @returns {Number} the number of milliseconds
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many milliseconds are between
 * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
 * const result = differenceInMilliseconds(
 *   new Date(2014, 6, 2, 12, 30, 21, 700),
 *   new Date(2014, 6, 2, 12, 30, 20, 600)
 * )
 * //=> 1100
 */

function differenceInMilliseconds(dateLeft, dateRight) {
  requiredArgs(2, arguments);
  return toDate(dateLeft).getTime() - toDate(dateRight).getTime();
}

var roundingMap = {
  ceil: Math.ceil,
  round: Math.round,
  floor: Math.floor,
  trunc: function trunc(value) {
    return value < 0 ? Math.ceil(value) : Math.floor(value);
  } // Math.trunc is not supported by IE

};
var defaultRoundingMethod = 'trunc';
function getRoundingMethod(method) {
  return method ? roundingMap[method] : roundingMap[defaultRoundingMethod];
}

/**
 * @name differenceInHours
 * @category Hour Helpers
 * @summary Get the number of hours between the given dates.
 *
 * @description
 * Get the number of hours between the given dates.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @param {Object} [options] - an object with options.
 * @param {String} [options.roundingMethod='trunc'] - a rounding method (`ceil`, `floor`, `round` or `trunc`)
 * @returns {Number} the number of hours
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many hours are between 2 July 2014 06:50:00 and 2 July 2014 19:00:00?
 * const result = differenceInHours(
 *   new Date(2014, 6, 2, 19, 0),
 *   new Date(2014, 6, 2, 6, 50)
 * )
 * //=> 12
 */

function differenceInHours(dateLeft, dateRight, options) {
  requiredArgs(2, arguments);
  var diff = differenceInMilliseconds(dateLeft, dateRight) / millisecondsInHour;
  return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
}

/**
 * @name differenceInMinutes
 * @category Minute Helpers
 * @summary Get the number of minutes between the given dates.
 *
 * @description
 * Get the signed number of full (rounded towards 0) minutes between the given dates.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @param {Object} [options] - an object with options.
 * @param {String} [options.roundingMethod='trunc'] - a rounding method (`ceil`, `floor`, `round` or `trunc`)
 * @returns {Number} the number of minutes
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many minutes are between 2 July 2014 12:07:59 and 2 July 2014 12:20:00?
 * const result = differenceInMinutes(
 *   new Date(2014, 6, 2, 12, 20, 0),
 *   new Date(2014, 6, 2, 12, 7, 59)
 * )
 * //=> 12
 *
 * @example
 * // How many minutes are between 10:01:59 and 10:00:00
 * const result = differenceInMinutes(
 *   new Date(2000, 0, 1, 10, 0, 0),
 *   new Date(2000, 0, 1, 10, 1, 59)
 * )
 * //=> -1
 */

function differenceInMinutes(dateLeft, dateRight, options) {
  requiredArgs(2, arguments);
  var diff = differenceInMilliseconds(dateLeft, dateRight) / millisecondsInMinute;
  return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
}

/**
 * @name endOfDay
 * @category Day Helpers
 * @summary Return the end of a day for the given date.
 *
 * @description
 * Return the end of a day for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|Number} date - the original date
 * @returns {Date} the end of a day
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // The end of a day for 2 September 2014 11:55:00:
 * const result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 23:59:59.999
 */

function endOfDay(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * @name endOfMonth
 * @category Month Helpers
 * @summary Return the end of a month for the given date.
 *
 * @description
 * Return the end of a month for the given date.
 * The result will be in the local timezone.
 *
 * @param {Date|Number} date - the original date
 * @returns {Date} the end of a month
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // The end of a month for 2 September 2014 11:55:00:
 * const result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 23:59:59.999
 */

function endOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

/**
 * @name isLastDayOfMonth
 * @category Month Helpers
 * @summary Is the given date the last day of a month?
 *
 * @description
 * Is the given date the last day of a month?
 *
 * @param {Date|Number} date - the date to check
 * @returns {Boolean} the date is the last day of a month
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Is 28 February 2014 the last day of a month?
 * const result = isLastDayOfMonth(new Date(2014, 1, 28))
 * //=> true
 */

function isLastDayOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  return endOfDay(date).getTime() === endOfMonth(date).getTime();
}

/**
 * @name differenceInMonths
 * @category Month Helpers
 * @summary Get the number of full months between the given dates.
 *
 * @description
 * Get the number of full months between the given dates using trunc as a default rounding method.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @returns {Number} the number of full months
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many full months are between 31 January 2014 and 1 September 2014?
 * const result = differenceInMonths(new Date(2014, 8, 1), new Date(2014, 0, 31))
 * //=> 7
 */

function differenceInMonths(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var sign = compareAsc(dateLeft, dateRight);
  var difference = Math.abs(differenceInCalendarMonths(dateLeft, dateRight));
  var result; // Check for the difference of less than month

  if (difference < 1) {
    result = 0;
  } else {
    if (dateLeft.getMonth() === 1 && dateLeft.getDate() > 27) {
      // This will check if the date is end of Feb and assign a higher end of month date
      // to compare it with Jan
      dateLeft.setDate(30);
    }

    dateLeft.setMonth(dateLeft.getMonth() - sign * difference); // Math.abs(diff in full months - diff in calendar months) === 1 if last calendar month is not full
    // If so, result must be decreased by 1 in absolute value

    var isLastMonthNotFull = compareAsc(dateLeft, dateRight) === -sign; // Check for cases of one full calendar month

    if (isLastDayOfMonth(toDate(dirtyDateLeft)) && difference === 1 && compareAsc(dirtyDateLeft, dateRight) === 1) {
      isLastMonthNotFull = false;
    }

    result = sign * (difference - Number(isLastMonthNotFull));
  } // Prevent negative zero


  return result === 0 ? 0 : result;
}

/**
 * @name differenceInSeconds
 * @category Second Helpers
 * @summary Get the number of seconds between the given dates.
 *
 * @description
 * Get the number of seconds between the given dates.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @param {Object} [options] - an object with options.
 * @param {String} [options.roundingMethod='trunc'] - a rounding method (`ceil`, `floor`, `round` or `trunc`)
 * @returns {Number} the number of seconds
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many seconds are between
 * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
 * const result = differenceInSeconds(
 *   new Date(2014, 6, 2, 12, 30, 20, 0),
 *   new Date(2014, 6, 2, 12, 30, 7, 999)
 * )
 * //=> 12
 */

function differenceInSeconds(dateLeft, dateRight, options) {
  requiredArgs(2, arguments);
  var diff = differenceInMilliseconds(dateLeft, dateRight) / 1000;
  return getRoundingMethod(options === null || options === void 0 ? void 0 : options.roundingMethod)(diff);
}

/**
 * @name differenceInYears
 * @category Year Helpers
 * @summary Get the number of full years between the given dates.
 *
 * @description
 * Get the number of full years between the given dates.
 *
 * @param {Date|Number} dateLeft - the later date
 * @param {Date|Number} dateRight - the earlier date
 * @returns {Number} the number of full years
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // How many full years are between 31 December 2013 and 11 February 2015?
 * const result = differenceInYears(new Date(2015, 1, 11), new Date(2013, 11, 31))
 * //=> 1
 */

function differenceInYears(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var sign = compareAsc(dateLeft, dateRight);
  var difference = Math.abs(differenceInCalendarYears(dateLeft, dateRight)); // Set both dates to a valid leap year for accurate comparison when dealing
  // with leap days

  dateLeft.setFullYear(1584);
  dateRight.setFullYear(1584); // Math.abs(diff in full years - diff in calendar years) === 1 if last calendar year is not full
  // If so, result must be decreased by 1 in absolute value

  var isLastYearNotFull = compareAsc(dateLeft, dateRight) === -sign;
  var result = sign * (difference - Number(isLastYearNotFull)); // Prevent negative zero

  return result === 0 ? 0 : result;
}

/**
 * @name intervalToDuration
 * @category Common Helpers
 * @summary Convert interval to duration
 *
 * @description
 * Convert a interval object to a duration object.
 *
 * @param {Interval} interval - the interval to convert to duration
 *
 * @returns {Duration} The duration Object
 * @throws {TypeError} Requires 2 arguments
 * @throws {RangeError} `start` must not be Invalid Date
 * @throws {RangeError} `end` must not be Invalid Date
 *
 * @example
 * // Get the duration between January 15, 1929 and April 4, 1968.
 * intervalToDuration({
 *   start: new Date(1929, 0, 15, 12, 0, 0),
 *   end: new Date(1968, 3, 4, 19, 5, 0)
 * })
 * // => { years: 39, months: 2, days: 20, hours: 7, minutes: 5, seconds: 0 }
 */

function intervalToDuration(interval) {
  requiredArgs(1, arguments);
  var start = toDate(interval.start);
  var end = toDate(interval.end);
  if (isNaN(start.getTime())) throw new RangeError('Start Date is invalid');
  if (isNaN(end.getTime())) throw new RangeError('End Date is invalid');
  var duration = {};
  duration.years = Math.abs(differenceInYears(end, start));
  var sign = compareAsc(end, start);
  var remainingMonths = add(start, {
    years: sign * duration.years
  });
  duration.months = Math.abs(differenceInMonths(end, remainingMonths));
  var remainingDays = add(remainingMonths, {
    months: sign * duration.months
  });
  duration.days = Math.abs(differenceInDays(end, remainingDays));
  var remainingHours = add(remainingDays, {
    days: sign * duration.days
  });
  duration.hours = Math.abs(differenceInHours(end, remainingHours));
  var remainingMinutes = add(remainingHours, {
    hours: sign * duration.hours
  });
  duration.minutes = Math.abs(differenceInMinutes(end, remainingMinutes));
  var remainingSeconds = add(remainingMinutes, {
    minutes: sign * duration.minutes
  });
  duration.seconds = Math.abs(differenceInSeconds(end, remainingSeconds));
  return duration;
}

/**
 * @name subDays
 * @category Day Helpers
 * @summary Subtract the specified number of days from the given date.
 *
 * @description
 * Subtract the specified number of days from the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of days to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the days subtracted
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Subtract 10 days from 1 September 2014:
 * const result = subDays(new Date(2014, 8, 1), 10)
 * //=> Fri Aug 22 2014 00:00:00
 */

function subDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addDays(dirtyDate, -amount);
}

/**
 * @name subMonths
 * @category Month Helpers
 * @summary Subtract the specified number of months from the given date.
 *
 * @description
 * Subtract the specified number of months from the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of months to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the months subtracted
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Subtract 5 months from 1 February 2015:
 * const result = subMonths(new Date(2015, 1, 1), 5)
 * //=> Mon Sep 01 2014 00:00:00
 */

function subMonths(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMonths(dirtyDate, -amount);
}

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
/**
 * @name sub
 * @category Common Helpers
 * @summary Subtract the specified years, months, weeks, days, hours, minutes and seconds from the given date.
 *
 * @description
 * Subtract the specified years, months, weeks, days, hours, minutes and seconds from the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Duration} duration - the object with years, months, weeks, days, hours, minutes and seconds to be subtracted
 *
 * | Key     | Description                        |
 * |---------|------------------------------------|
 * | years   | Amount of years to be subtracted   |
 * | months  | Amount of months to be subtracted  |
 * | weeks   | Amount of weeks to be subtracted   |
 * | days    | Amount of days to be subtracted    |
 * | hours   | Amount of hours to be subtracted   |
 * | minutes | Amount of minutes to be subtracted |
 * | seconds | Amount of seconds to be subtracted |
 *
 * All values default to 0
 *
 * @returns {Date} the new date with the seconds subtracted
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Subtract the following duration from 15 June 2017 15:29:20
 * const result = sub(new Date(2017, 5, 15, 15, 29, 20), {
 *   years: 2,
 *   months: 9,
 *   weeks: 1,
 *   days: 7,
 *   hours: 5,
 *   minutes: 9,
 *   seconds: 30
 * })
 * //=> Mon Sep 1 2014 10:19:50
 */

function sub(date, duration) {
  requiredArgs(2, arguments);
  if (!duration || _typeof(duration) !== 'object') return new Date(NaN);
  var years = duration.years ? toInteger(duration.years) : 0;
  var months = duration.months ? toInteger(duration.months) : 0;
  var weeks = duration.weeks ? toInteger(duration.weeks) : 0;
  var days = duration.days ? toInteger(duration.days) : 0;
  var hours = duration.hours ? toInteger(duration.hours) : 0;
  var minutes = duration.minutes ? toInteger(duration.minutes) : 0;
  var seconds = duration.seconds ? toInteger(duration.seconds) : 0; // Subtract years and months

  var dateWithoutMonths = subMonths(date, months + years * 12); // Subtract weeks and days

  var dateWithoutDays = subDays(dateWithoutMonths, days + weeks * 7); // Subtract hours, minutes and seconds

  var minutestoSub = minutes + hours * 60;
  var secondstoSub = seconds + minutestoSub * 60;
  var mstoSub = secondstoSub * 1000;
  var finalDate = new Date(dateWithoutDays.getTime() - mstoSub);
  return finalDate;
}

function log() {
  performance.now();
}

function darken(color, k = 1) {
  const { l, c, h } = d3__namespace.lch(color);
  return d3__namespace.lch(l - 18 * k, c, h);
}

function compareSets(set1, set2) {
  if (set1 === set2) return true;
  if (set1 === null) return false;
  if (set2 === null) return false;

  if (set1.size !== set2.size) return false;

  for (const val of set1) {
    if (!set2.has(val)) {
      return false;
    }
  }
  return true;
}

function isInsideDomain(domain, scaleX, scaleY) {
  let scaleXDomain = scaleX.domain();
  let scaleYDomain = scaleY.domain();
  let domainX = [domain[0][0], domain[1][0]];
  let domainY = [domain[1][1], domain[0][1]];

  return (
    domainX[0] > scaleXDomain[0] &&
    domainX[1] < scaleXDomain[1] &&
    domainY[0] > scaleYDomain[0] &&
    domainY[1] < scaleYDomain[1]
  );
}

const BrushModes = Object.freeze({
  Intersect: "intersect",
  Contains: "contains",
});

const BrushAggregation = Object.freeze({
  And: "and",
  Or: "OR",
});

/* eslint-disable no-undefined,no-param-reassign,no-shadow */

/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param {number} delay -                  A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher)
 *                                            are most useful.
 * @param {Function} callback -               A function to be executed after delay milliseconds. The `this` context and all arguments are passed through,
 *                                            as-is, to `callback` when the throttled-function is executed.
 * @param {object} [options] -              An object to configure options.
 * @param {boolean} [options.noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds
 *                                            while the throttled-function is being called. If noTrailing is false or unspecified, callback will be executed
 *                                            one final time after the last throttled-function call. (After the throttled-function has not been called for
 *                                            `delay` milliseconds, the internal counter is reset).
 * @param {boolean} [options.noLeading] -   Optional, defaults to false. If noLeading is false, the first throttled-function call will execute callback
 *                                            immediately. If noLeading is true, the first the callback execution will be skipped. It should be noted that
 *                                            callback will never executed if both noLeading = true and noTrailing = true.
 * @param {boolean} [options.debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is
 *                                            false (at end), schedule `callback` to execute after `delay` ms.
 *
 * @returns {Function} A new, throttled, function.
 */
function throttle (delay, callback, options) {
  var _ref = options || {},
      _ref$noTrailing = _ref.noTrailing,
      noTrailing = _ref$noTrailing === void 0 ? false : _ref$noTrailing,
      _ref$noLeading = _ref.noLeading,
      noLeading = _ref$noLeading === void 0 ? false : _ref$noLeading,
      _ref$debounceMode = _ref.debounceMode,
      debounceMode = _ref$debounceMode === void 0 ? undefined : _ref$debounceMode;
  /*
   * After wrapper has stopped being called, this timeout ensures that
   * `callback` is executed at the proper times in `throttle` and `end`
   * debounce modes.
   */


  var timeoutID;
  var cancelled = false; // Keep track of the last time `callback` was executed.

  var lastExec = 0; // Function to clear existing timeout

  function clearExistingTimeout() {
    if (timeoutID) {
      clearTimeout(timeoutID);
    }
  } // Function to cancel next exec


  function cancel(options) {
    var _ref2 = options || {},
        _ref2$upcomingOnly = _ref2.upcomingOnly,
        upcomingOnly = _ref2$upcomingOnly === void 0 ? false : _ref2$upcomingOnly;

    clearExistingTimeout();
    cancelled = !upcomingOnly;
  }
  /*
   * The `wrapper` function encapsulates all of the throttling / debouncing
   * functionality and when executed will limit the rate at which `callback`
   * is executed.
   */


  function wrapper() {
    for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
      arguments_[_key] = arguments[_key];
    }

    var self = this;
    var elapsed = Date.now() - lastExec;

    if (cancelled) {
      return;
    } // Execute `callback` and update the `lastExec` timestamp.


    function exec() {
      lastExec = Date.now();
      callback.apply(self, arguments_);
    }
    /*
     * If `debounceMode` is true (at begin) this is used to clear the flag
     * to allow future `callback` executions.
     */


    function clear() {
      timeoutID = undefined;
    }

    if (!noLeading && debounceMode && !timeoutID) {
      /*
       * Since `wrapper` is being called for the first time and
       * `debounceMode` is true (at begin), execute `callback`
       * and noLeading != true.
       */
      exec();
    }

    clearExistingTimeout();

    if (debounceMode === undefined && elapsed > delay) {
      if (noLeading) {
        /*
         * In throttle mode with noLeading, if `delay` time has
         * been exceeded, update `lastExec` and schedule `callback`
         * to execute after `delay` ms.
         */
        lastExec = Date.now();

        if (!noTrailing) {
          timeoutID = setTimeout(debounceMode ? clear : exec, delay);
        }
      } else {
        /*
         * In throttle mode without noLeading, if `delay` time has been exceeded, execute
         * `callback`.
         */
        exec();
      }
    } else if (noTrailing !== true) {
      /*
       * In trailing throttle mode, since `delay` time has not been
       * exceeded, schedule `callback` to execute `delay` ms after most
       * recent execution.
       *
       * If `debounceMode` is true (at begin), schedule `clear` to execute
       * after `delay` ms.
       *
       * If `debounceMode` is false (at end), schedule `callback` to
       * execute after `delay` ms.
       */
      timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
    }
  }

  wrapper.cancel = cancel; // Return the wrapper function.

  return wrapper;
}

// import {log} from "./utils.js";

function Timeline({
  points = [],
  width = 600,
  height = 300,
  margin = { top: 10, left: 40, right: 10, bottom: 10 },
  xScale = d3__namespace.scaleLinear().range([0, width]),
  yScale = d3__namespace.scaleLinear().range([height, 0]),
  x = (d) => d[0],
  y = (d) => d[1],
  line = d3__namespace.line(),
  title = "",
  target = null, // where to draw it
  renderer = "canvas",
  pointRadius = 1.5,
  strokeColor = "#777",
} = {}) {
  let div = (target ? d3__namespace.select(target) : d3__namespace.create("div"))
    .attr("class", "details")
    .style("position", "relative");

  // cleanup
  div.selectAll("*").remove();

  let canvas = div
    .append("canvas")
    .style("position", "absolute")
    .style("top", `${margin.top}px`)
    .style("left", `${margin.left}px`)
    .style("height", height + "px")
    .style("width", width + "px")
    .style("pointer-events", "none");
  let context = canvas.node().getContext("2d");

  // https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
  const scale = window.devicePixelRatio || 1;
  canvas
    .attr("height", Math.floor(height * scale))
    .attr("width", Math.floor(width * scale));
  // Normalize coordinate system to use CSS pixels.
  context.scale(scale, scale);

  let g = div
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("class", "gDrawing")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  g.append("g")
    .attr("class", "detailsYAxis")
    .call(d3__namespace.axisLeft(yScale).ticks(Math.floor(height / 30)));

  g.append("g")
    .attr("class", "detailsXAxis")
    .call(d3__namespace.axisBottom(xScale))
    .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`);

  g.append("text")
    .text(title)
    .attr("transform", "translate(10, 0)")
    .style("fill", strokeColor)
    .style("font-size", "0.7em");

  if (renderer.toUpperCase() == "SVG") {
    g.append("path")
      .attr("d", line(points))
      .style("fill", "none")
      .style("stroke", strokeColor);

    g.append("points")
      .selectAll("circle")
      .data(points)
      .join("circle")
      .attr("cx", (d) => xScale(x(d)))
      .attr("cx", (d) => xScale(x(d)))
      .attr("r", pointRadius)
      .attr("stroke", strokeColor);
  } else {
    let path = new Path2D(line(points));
    context.strokeStyle = strokeColor;
    context.stroke(path);

    context.beginPath();
    for (let p of points) {
      context.moveTo(xScale(x(p))+ pointRadius, yScale(y(p)) + pointRadius);
      context.arc(xScale(x(p)), yScale(y(p)), pointRadius, 0, 2 * Math.PI);
    }

    context.stroke();
  }

  return div;
}

function TimelineDetails({
  ts,
  detailsElement,
  detailsContainerHeight,
  detailsWidth,
  maxDetailsRecords,
  detailsHeight,
  x,
  y,
  margin = {left: 50, top: 10, bottom: 20, right: 0},
} = {}) {
  const me = {};
  let prerenderDetails = new Map();

  const divDetails = d3__namespace
    .select(detailsElement)
    .attr("id", "detail")
    .style("height", `${detailsContainerHeight}px`)
    .style("width", `${detailsWidth}px`)
    .style("overflow-y", "scroll")
    .node();

  const line = d3__namespace.line().defined((d) => y(d) !== undefined && y(d) !== null);

  let detailsX, detailsY;

  me.setScales = function ({overviewX, overviewY}) {
    detailsX = overviewX.copy();
    detailsX.range([0, detailsWidth - margin.right - margin.left]);

    detailsY = overviewY.copy();
    detailsY.range([detailsHeight - margin.top - margin.bottom, 0])
      .nice()
      .clamp(true);

    line.x((d) => detailsX(+x(d))).y((d) => detailsY(y(d)));
  };

  // ts.observer = new IntersectionObserver(onDetailsScrolled, {
  //   root: divDetails,
  //   threshold: 0.1,
  // });

  me.generatePrerenderDetails = function (data) {
    prerenderDetails = new Map();
    // log("Prerendering Details:...");
    // data.forEach((d) => {
    //   const div = Timeline({
    //     width: detailsWidth,
    //     height: detailsHeight,
    //     margin: margin,
    //     yScale: detailsY,
    //     xScale: detailsX,
    //     title: d[0],
    //     points: d[1],
    //     line: line,
    //   });

    //   prerenderDetails.set(d[0], div);
    // });

    // log("Prerendering Details: done", prerenderDetails);
    return prerenderDetails;
  };

  // function onDetailsScrolled(entries) {
  //   log("onDetailsScrolled ", entries);
  //   entries.forEach((entry) => {
  //     if (entry.isIntersecting) {
  //       let div = entry.target;
  //       let group = div.getAttribute("group");
  //       // group = typeof groupedData[0][0] === "number" ? +group : group;
  //       const prerenderDetailsEle = prerenderDetails.get(group);
  //       if (!prerenderDetailsEle) {
  //         console.log(
  //           "Error onDetailsScrolled couldn't find ",
  //           group,
  //           " on ",
  //           prerenderDetails
  //         );
  //         return;
  //       }
  //       div.appendChild(prerenderDetailsEle.node());
  //     } else {
  //       entry.target.innerHTML = "";
  //     }
  //   });
  // }

  function renderDetailsCanvas({data, brushGroupSelected}) {
    // let frag = document.createDocumentFragment();

    let slicedData = maxDetailsRecords
      ? data.get(brushGroupSelected).slice(0, maxDetailsRecords)
      : data.get(brushGroupSelected);

    // log("renderDetailsCanvas", brushGroupSelected, data, slicedData);

    divDetails.innerHTML = "";
    d3__namespace.select(divDetails)
      .selectAll("div.detailsContainer")
      .data(slicedData, (d) => d[0])
      .join("div")
      .attr("class", "detailsContainer")
      .attr("group", (d) => d[0])
      .each(function (d) {
        Timeline({
          target: this,
          width: detailsWidth,
          height: detailsHeight,
          margin,
          yScale: detailsY,
          xScale: detailsX,
          x,
          y,
          title: d[0],
          points: d[1],
          line: line,
        });
      });

    // for (let d of slicedData) {
    //   // let div = document.createElement("div");
    //   div.node().className = "detailsContainer";
    //   div.node().setAttribute("group", d[0]);
    //   // div.style.height = `${detailsHeight}px`;
    //   // frag.appendChild(div);

    //   divDetails.appendChild(div.node());
    // }

    // removed to reduce flickering
    // divDetails.innerHTML = "";

    // Observer API To only show in the details view the divs that are visible
    // window.requestIdleCallback(() => {
    //   divDetails.replaceChildren(frag);
    //   divDetails.querySelectorAll(".detailsContainer").forEach((d) => {
    //     ts.observer.observe(d);
    //   });
    // });
  }

  // function createDetailsChart(d) {
  //   let g = d3
  //     .select(this)
  //     .append("svg")
  //     .attr("class", "details")
  //     .attr("viewBox", [0, 0, detailsWidth, detailsHeight])
  //     .attr("height", detailsHeight)
  //     .attr("width", detailsWidth)
  //     .append("g");
  //   g.attr("transform", `translate(${margin.left}, ${margin.top})`);

  //   g.append("g")
  //     .attr("class", "mainYAxis")
  //     .call(d3.axisLeft(detailsY).ticks(Math.floor(detailsHeight / 20)));

  //   g.append("g")
  //     .attr("class", "mainXAxis")
  //     .call(d3.axisBottom(detailsX))
  //     .attr(
  //       "transform",
  //       `translate(0, ${detailsHeight - margin.top - margin.bottom})`
  //     );

  //   g.append("text")
  //     .text(d[0])
  //     .attr("transform", "translate(10, 0)")
  //     .style("fill", "black")
  //     .style("font-size", "0.7em");

  //   g.selectAll(".point") //.select("#points") //TODO make new G with id for this cricles
  //     .data(d[1])
  //     .join("circle")
  //     .attr("class", "point")
  //     .attr("cy", (d) => detailsY(y(d)))
  //     .attr("cx", (d) => detailsX(x(d)))
  //     .attr("fill", "black")
  //     .attr("r", 2);

  //   g.selectAll(".lines") //TODO add to the new G
  //     .data([d])
  //     .join("path")
  //     .attr("class", "line")
  //     .attr("d", (g) => line(g[1]))
  //     .style("fill", "none")
  //     .style("stroke", "black");
  // }

  // me.renderDetailsSVG = function (data) {
  //   const div = d3.select(divDetails);

  //   let slicedData = maxDetailsRecords
  //     ? data.slice(0, maxDetailsRecords)
  //     : data;

  //   div
  //     .selectAll(".details")
  //     .data(slicedData, (d) => d[0])
  //     .join("div")
  //     .each(createDetailsChart);
  // };

  me.render = ({data, brushGroupSelected}) =>
    renderDetailsCanvas({data, brushGroupSelected});

  return me;
}

// Clase principal del renderer usando la API WebGPU.
// Envía datos en bruto a la GPU y ejecuta pipelines de renderizado WGSL.

/**
 * Parsea un color CSS en formato #rrggbb o #rgb a un vector [r, g, b] normalizado [0-1].
 * Versión pura sin dependencias DOM, segura en entornos sin document.
 * Acepta cualquier string que el canvas 2D aceptaría, con fallback a blanco.
 * @param {string} colorStr
 * @returns {[number, number, number]}
 */
function parseCSSColorToVec3(colorStr) {
  if (!colorStr) return [1, 1, 1];
  const s = colorStr.trim();

  // Formato #rrggbb
  if (/^#[0-9a-fA-F]{6}$/.test(s)) {
    return [
      parseInt(s.slice(1, 3), 16) / 255,
      parseInt(s.slice(3, 5), 16) / 255,
      parseInt(s.slice(5, 7), 16) / 255,
    ];
  }
  // Formato #rgb (abreviado)
  if (/^#[0-9a-fA-F]{3}$/.test(s)) {
    return [
      parseInt(s[1] + s[1], 16) / 255,
      parseInt(s[2] + s[2], 16) / 255,
      parseInt(s[3] + s[3], 16) / 255,
    ];
  }
  // Formato rgb(r, g, b)
  const rgbMatch = s.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgbMatch) {
    return [
      parseInt(rgbMatch[1]) / 255,
      parseInt(rgbMatch[2]) / 255,
      parseInt(rgbMatch[3]) / 255,
    ];
  }
  // Fallback: blanco
  return [1, 1, 1];
}

class WebGPURenderer {
  constructor() {
    this.device = null;
    this.context = null;
    this.pipeline = null;
    this.vertexBuffer = null;
    this.styleBuffer = null;
    this.uniformBuffer = null;
    this.bindGroup = null;
    // Inicializar como array vacío para que draw() pueda hacer null-checks seguros
    this.bindGroups = [];
    this.points = null;
    this.lineIndices = null;
    this.presentationFormat = navigator.gpu ? navigator.gpu.getPreferredCanvasFormat() : 'bgra8unorm';
    
    this.thickLinePipeline = null;
    this.medianVertexBuffer = null;
    this.medianStyleBuffer = null;
    this.medianBindGroup = null;
    this.medianVertexCount = 0;
    this.medianCount = 0;
    this.medianJointCount = 0;
    
    this.haloBindGroup = null;
    this.haloStyleBuffer = null;
    this.jointPipeline = null;
    this.medianJointBuffer = null;

    this.haloJointPipeline = null;
    this.haloThickPipeline = null;
    this.stencilTexture = null;
    this.stencilTextureView = null;

    this.msaaTexture = null;
    this.msaaTextureView = null;
    this.sampleCount = 4;

    this.indexBuffer = null;
    this.indexCount = 0;

    this._mainRenderBundle = null;
    this._renderBundleDirty = true;

    this._uniformData = new Float32Array(8);
    this._lastUniformKey = null;
  }

  // Inicialización asíncrona: primero pedimos el "adapter" (la GPU física)
  // y luego el "device" (la conexión lógica con ella). Si falla devolvemos false
  // para que el código que llame a esto pueda hacer fallback al canvas 2D.
  init(canvas) {
    if (!navigator.gpu) {
      console.error("WebGPU not supported on this browser.");
      return Promise.resolve(false);
    }

    return navigator.gpu.requestAdapter().then(adapter => {
        if (!adapter) {
            console.error("No WebGPU adapter found.");
            return Promise.resolve(false);
        }
        return adapter.requestDevice().then(device => {
            this.device = device;
            this.context = canvas.getContext("webgpu");

            if (!this.context) {
                console.error("Failed to get WebGPU context from canvas.");
                return false;
            }

            this.context.configure({
                device: this.device,
                format: this.presentationFormat,
                alphaMode: "opaque",
            });

            // Crear la textura MSAA al inicio con el tamaño actual del canvas
            this._createMSAATexture(canvas.width, canvas.height);

            return this.initPipeline().then(() => true);
        });
    });
  }

  // Aquí se compilan los shaders WGSL y se configuran los pipelines de renderizado.

  initPipeline() {
    // Shader compacto para líneas principales: lee solo color (vec4, 16 bytes/línea).
    // Reduce el style buffer de 32 bytes a 16 bytes, mejorando la tasa de acierto en
    // caché L2 de la GPU (crítico para N > 50k donde el buffer supera la capacidad L2).
    const compactShaderModule = this.device.createShaderModule({
      label: "Compact Line Shader (color only)",
      code: `
        struct Uniforms {
          domainX: vec2<f32>,
          domainY: vec2<f32>,
          screenSize: vec2<f32>,
          _pad: vec2<f32>,
        }

        @group(0) @binding(0) var<uniform> uniforms: Uniforms;
        @group(0) @binding(1) var<storage, read> lineColors: array<vec4<f32>>;

        struct VertexInput {
            @location(0) position: vec2<f32>,
            @location(1) lineIndex: f32,
        }

        struct VertexOutput {
            @builtin(position) position: vec4<f32>,
            @location(0) color: vec4<f32>,
        }

        @vertex
        fn vs_main(input: VertexInput) -> VertexOutput {
            var output: VertexOutput;
            let xNorm = (input.position.x - uniforms.domainX.x) / (uniforms.domainX.y - uniforms.domainX.x);
            let yNorm = (input.position.y - uniforms.domainY.x) / (uniforms.domainY.y - uniforms.domainY.x);
            output.position = vec4<f32>(-1.0 + 2.0 * xNorm, -1.0 + 2.0 * yNorm, 0.0, 1.0);
            output.color = lineColors[u32(input.lineIndex)];
            return output;
        }

        @fragment
        fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
            if (input.color.a <= 0.0) { discard; }
            return input.color;
        }
      `,
    });

    const shaderModule = this.device.createShaderModule({
      label: "Line Shader with Dash Support",
      code: `
        struct Uniforms {
          domainX: vec2<f32>,
          domainY: vec2<f32>,
          screenSize: vec2<f32>,
          _pad: vec2<f32>,
        }

        struct LineStyle {
            color: vec4<f32>,      // 16 bytes (offset 0)
            params: vec4<f32>,     // 16 bytes (offset 16)
            // params.x = dashOn (pixels)
            // params.y = dashOff (pixels)
            // params.z = lineWidth
            // params.w = selectionFlag (unused in single-pass renderer)
        }

        @group(0) @binding(0) var<uniform> uniforms: Uniforms;
        @group(0) @binding(1) var<storage, read> lineStyles: array<LineStyle>;

        struct VertexInput {
            @location(0) position: vec2<f32>,
            @location(1) lineIndex: f32,
        }

        struct VertexOutput {
            @builtin(position) position: vec4<f32>,
            @location(0) color: vec4<f32>,
            @location(1) worldPos: vec2<f32>,
            @location(2) lineLength: f32,
            @location(3) dashPattern: vec2<f32>, // (dashOn, dashOff)
        }

        @vertex
        fn vs_main(input: VertexInput) -> VertexOutput {
            var output: VertexOutput;

            let xNorm = (input.position.x - uniforms.domainX.x) / (uniforms.domainX.y - uniforms.domainX.x);
            let yNorm = (input.position.y - uniforms.domainY.x) / (uniforms.domainY.y - uniforms.domainY.x);

            let xClip = -1.0 + 2.0 * xNorm;
            // D3 y=0 is top; WebGPU clip y=1 is top — same direction, no flip needed
            let yClip = -1.0 + 2.0 * yNorm;

            output.position = vec4<f32>(xClip, yClip, 0.0, 1.0);
            output.worldPos = input.position;

            let style = lineStyles[u32(input.lineIndex)];
            // Color (rgba) and dash params already encode selection state — no pass filtering needed
            output.color = style.color;
            output.dashPattern = vec2<f32>(style.params.x, style.params.y);
            output.lineLength = 0.0;

            return output;
        }

        @fragment
        fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
            // Discard transparent lines (alpha == 0 means the style map didn't include this line)
            if (input.color.a <= 0.0) {
                discard;
            }

            // Dash pattern (dashOn > 0 activates it)
            if (input.dashPattern.x > 0.0) {
                let dashOn = input.dashPattern.x;
                let dashOff = input.dashPattern.y;
                let dashPeriod = dashOn + dashOff;
                let dist = input.position.x + input.position.y;
                let dashCycle = fract(dist / dashPeriod);
                let dashRatio = dashOn / dashPeriod;
                if (dashCycle > dashRatio) {
                    discard;
                }
            }

            return input.color;
        }

        struct ThickVertexInput {
            @location(0) position: vec2<f32>,
            @location(1) otherPosition: vec2<f32>,
            @location(2) side: f32,
            @location(3) lineIndex: f32,
            @location(4) t: f32,
        }

        struct ThickVertexOutput {
            @builtin(position) position: vec4<f32>,
            @location(0) color: vec4<f32>,
            @location(1) dashPattern: vec2<f32>,
            @location(2) uv: vec2<f32>,
        }

        @vertex
        fn vs_thick(input: ThickVertexInput) -> ThickVertexOutput {
            var output: ThickVertexOutput;
            
            let p1Norm = vec2<f32>(
                (input.position.x - uniforms.domainX.x) / (uniforms.domainX.y - uniforms.domainX.x),
                (input.position.y - uniforms.domainY.x) / (uniforms.domainY.y - uniforms.domainY.x)
            );
            let p2Norm = vec2<f32>(
                (input.otherPosition.x - uniforms.domainX.x) / (uniforms.domainX.y - uniforms.domainX.x),
                (input.otherPosition.y - uniforms.domainY.x) / (uniforms.domainY.y - uniforms.domainY.x)
            );

            let p1Screen = p1Norm * uniforms.screenSize;
            let p2Screen = p2Norm * uniforms.screenSize;
            
            let style = lineStyles[u32(input.lineIndex)];
            let width = style.params.z;
            
            var dir = p2Screen - p1Screen;
            if (length(dir) < 0.0001) {
                dir = vec2<f32>(1.0, 0.0);
            }
            let segLen = length(dir);
            let unitDir = normalize(dir);
            let unitNormal = vec2<f32>(-unitDir.y, unitDir.x);
            
            let offsetPos = p1Screen + unitNormal * input.side * (width / 2.0);
            let pClip = (offsetPos / uniforms.screenSize) * 2.0 - 1.0;
            
            output.position = vec4<f32>(pClip.x, pClip.y, 0.0, 1.0);
            output.color = style.color;
            output.dashPattern = vec2<f32>(style.params.x, style.params.y);
            output.uv = vec2<f32>(input.side, input.t * segLen);
            
            return output;
        }

        @fragment
        fn fs_thick(input: ThickVertexOutput) -> @location(0) vec4<f32> {
            if (input.dashPattern.x > 0.0) {
                let dashPeriod = input.dashPattern.x + input.dashPattern.y;
                let segDist = input.uv.y;
                if (fract(segDist / dashPeriod) > (input.dashPattern.x / dashPeriod)) {
                    discard;
                }
            }
            // Suavizado de borde sutil en los extremos laterales del quad
            let edgeFade = 1.0 - smoothstep(0.88, 1.0, abs(input.uv.x));
            var col = input.color;
            col.a = col.a * edgeFade;
            return col;
        }

        struct JointVertexInput {
            @location(0) position: vec2<f32>,
            @location(1) offset: vec2<f32>,
            @location(2) lineIndex: f32,
        }

        struct JointVertexOutput {
            @builtin(position) position: vec4<f32>,
            @location(0) color: vec4<f32>,
            @location(1) uv: vec2<f32>,
        }

        @vertex
        fn vs_joint(input: JointVertexInput) -> JointVertexOutput {
            var output: JointVertexOutput;
            
            let pNorm = vec2<f32>(
                (input.position.x - uniforms.domainX.x) / (uniforms.domainX.y - uniforms.domainX.x),
                (input.position.y - uniforms.domainY.x) / (uniforms.domainY.y - uniforms.domainY.x)
            );
            
            let style = lineStyles[u32(input.lineIndex)];
            let width = style.params.z; 
            
            let pScreen = pNorm * uniforms.screenSize;
            let offsetPos = pScreen + input.offset * (width / 2.0);
            
            let pClip = (offsetPos / uniforms.screenSize) * 2.0 - 1.0;
            
            output.position = vec4<f32>(pClip.x, pClip.y, 0.0, 1.0);
            output.color = style.color;
            output.uv = input.offset;
            
            return output;
        }

        @fragment
        fn fs_joint(input: JointVertexOutput) -> @location(0) vec4<f32> {
            // Draw as a circle
            if (length(input.uv) > 1.0) {
                discard;
            }
            return input.color;
        }
      `,
    });

    this.bindGroupLayout = this.device.createBindGroupLayout({
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: "uniform" },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: "read-only-storage" },
        },
      ],
    });

    const pipelineLayout = this.device.createPipelineLayout({
      bindGroupLayouts: [this.bindGroupLayout],
    });

    // Requerido porque el render pass ahora declara un adjunto de profundidad/stencil.
    const neutralDepthStencil = {
      format: 'depth24plus-stencil8',
      depthWriteEnabled: false,
      depthCompare: 'always',
      stencilFront: { compare: 'always', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
      stencilBack:  { compare: 'always', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
    };

    this.jointPipeline = this.device.createRenderPipeline({
      label: "Joint Render Pipeline",
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: "vs_joint",
        buffers: [
          {
            arrayStride: 20,
            attributes: [
              { shaderLocation: 0, offset: 0, format: "float32x2" },
              { shaderLocation: 1, offset: 8, format: "float32x2" },
              { shaderLocation: 2, offset: 16, format: "float32" },
            ],
          },
        ],
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fs_joint",
        targets: [
          {
            format: this.presentationFormat,
            blend: {
              color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" },
              alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
            },
          },
        ],
      },
      depthStencil: neutralDepthStencil,
      primitive: { topology: "triangle-list" },
      multisample: { count: this.sampleCount },
    });

    const haloStencilState = {
      format: 'depth24plus-stencil8',
      depthWriteEnabled: false,
      depthCompare: 'always',
      stencilFront: { compare: 'not-equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'replace' },
      stencilBack:  { compare: 'not-equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'replace' },
    };

    // Pipeline de unión de halo
    this.haloJointPipeline = this.device.createRenderPipeline({
      label: "Halo Joint Pipeline (stencil)",
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: "vs_joint",
        buffers: [{
          arrayStride: 20,
          attributes: [
            { shaderLocation: 0, offset: 0,  format: "float32x2" },
            { shaderLocation: 1, offset: 8,  format: "float32x2" },
            { shaderLocation: 2, offset: 16, format: "float32" },
          ],
        }],
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fs_joint",
        targets: [{
          format: this.presentationFormat,
          blend: {
            color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" },
            alpha: { srcFactor: "one",       dstFactor: "one-minus-src-alpha", operation: "add" },
          },
        }],
      },
      depthStencil: haloStencilState,
      primitive: { topology: "triangle-list" },
      multisample: { count: this.sampleCount },
    });

    // Pipeline de línea gruesa para halo 
    this.haloThickPipeline = this.device.createRenderPipeline({
      label: "Halo Thick Line Pipeline (stencil)",
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: "vs_thick",
        buffers: [{
          arrayStride: 28,
          attributes: [
            { shaderLocation: 0, offset: 0,  format: "float32x2" },
            { shaderLocation: 1, offset: 8,  format: "float32x2" },
            { shaderLocation: 2, offset: 16, format: "float32" },
            { shaderLocation: 3, offset: 20, format: "float32" },
            { shaderLocation: 4, offset: 24, format: "float32" },
          ],
        }],
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fs_thick",
        targets: [{
          format: this.presentationFormat,
          blend: {
            color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" },
            alpha: { srcFactor: "one",       dstFactor: "one-minus-src-alpha", operation: "add" },
          },
        }],
      },
      depthStencil: haloStencilState,
      primitive: { topology: "triangle-list" },
      multisample: { count: this.sampleCount },
    });

    this.thickLinePipeline = this.device.createRenderPipeline({
      label: "Thick Line Render Pipeline",
      layout: pipelineLayout,
      vertex: {
        module: shaderModule,
        entryPoint: "vs_thick",
        buffers: [
          {
            arrayStride: 28,
            attributes: [
              { shaderLocation: 0, offset: 0,  format: "float32x2" },
              { shaderLocation: 1, offset: 8,  format: "float32x2" },
              { shaderLocation: 2, offset: 16, format: "float32"   },
              { shaderLocation: 3, offset: 20, format: "float32"   },
              { shaderLocation: 4, offset: 24, format: "float32"   }, // t (0=start, 1=end)
            ],
          },
        ],
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fs_thick",
        targets: [
          {
            format: this.presentationFormat,
            blend: {
              color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" },
              alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
            },
          },
        ],
      },
      depthStencil: neutralDepthStencil,
      primitive: { topology: "triangle-list" },
      multisample: { count: this.sampleCount },
    });

    this.pipeline = this.device.createRenderPipeline({
      label: "Line Render Pipeline (compact style)",
      layout: pipelineLayout,
      vertex: {
        module: compactShaderModule,
        entryPoint: "vs_main",
        buffers: [
          {
            arrayStride: 12,
            attributes: [
              { shaderLocation: 0, offset: 0, format: "float32x2" },
              { shaderLocation: 1, offset: 8, format: "float32" },
            ],
          },
        ],
      },
      fragment: {
        module: compactShaderModule,
        entryPoint: "fs_main",
        targets: [
          {
            format: this.presentationFormat,
            blend: {
              color: { srcFactor: "src-alpha", dstFactor: "one-minus-src-alpha", operation: "add" },
              alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
            },
          },
        ],
      },
      depthStencil: neutralDepthStencil,
      primitive: { topology: "line-list" },
      multisample: { count: this.sampleCount },
    });

    this.uniformBuffer = this.device.createBuffer({
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.uniformBuffers = [this.uniformBuffer];
    this.bindGroups = [];
    
    return Promise.resolve();
  }

  uploadData(data) {
    if (!this.device) return;

    // Index buffer: cada punto se almacena una sola vez en el vertex buffer.
    // Los índices forman pares (line-list) que referencian puntos compartidos entre
    // segmentos consecutivos. La GPU reutiliza vértices via post-transform vertex cache,
    // reduciendo las invocaciones del vertex shader ~48% para series de 30 muestras.
    const pointsAccumulator = [];
    const indexAccumulator  = [];

    this.idToIndex = new Map();
    let globalVertexOffset = 0;

    data.forEach((entry, index) => {
        this.idToIndex.set(entry.id, index);
        const pts = entry.points;

        for (let i = 0; i < pts.length; i++) {
            pointsAccumulator.push(pts[i][0], pts[i][1], index);
        }
        for (let i = 0; i < pts.length - 1; i++) {
            indexAccumulator.push(globalVertexOffset + i, globalVertexOffset + i + 1);
        }
        globalVertexOffset += pts.length;
    });

    if (pointsAccumulator.length === 0) return;

    const vertexData = new Float32Array(pointsAccumulator);
    this.vertexBuffer = this.device.createBuffer({
        size: vertexData.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
    });
    new Float32Array(this.vertexBuffer.getMappedRange()).set(vertexData);
    this.vertexBuffer.unmap();

    const indexData = new Uint32Array(indexAccumulator);
    this.indexBuffer = this.device.createBuffer({
        size: indexData.byteLength,
        usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
    });
    new Uint32Array(this.indexBuffer.getMappedRange()).set(indexData);
    this.indexBuffer.unmap();

    this.indexCount = indexData.length;
    this.lineCount = data.length;

    // Style buffer compacto: solo RGBA (16 bytes/línea vs 32 bytes con params).
    // El pipeline principal usa array<vec4<f32>>, reduciendo el buffer a la mitad
    // y mejorando la tasa de acierto en caché L2 de GPU para N > 50k.
    const styleBufferSize = this.lineCount * 16;
    this.styleBuffer = this.device.createBuffer({
        size: styleBufferSize,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    // Pre-alocar buffer reutilizable: 4 floats por línea (r, g, b, a)
    this._styleDataCache = new Float32Array(this.lineCount * 4);
    this._styleBaseFilled = false;
    this._bindGroupsDirty = true;
  }

  uploadMedians(medians, medianStyles, haloEnabled = true, haloConfig = {}) {
    if (!this.device || !medians || medians.length === 0) {
      this.medianVertexCount = 0;
      this.medianCount = 0;
      this.medianJointCount = 0;
      this.haloBindGroup = null;
      return;
    }

    let pointsAccumulator = [];
    let jointsAccumulator = [];
    
    medians.forEach((median, index) => {
      const points = median[1];
      for (let i = 0; i < points.length; i++) {
        const P = points[i];
        
        // Quad for joint (circle): 2 triangles
        jointsAccumulator.push(P[0], P[1], -1.0, -1.0, index);
        jointsAccumulator.push(P[0], P[1],  1.0, -1.0, index);
        jointsAccumulator.push(P[0], P[1], -1.0,  1.0, index);
        
        jointsAccumulator.push(P[0], P[1],  1.0, -1.0, index);
        jointsAccumulator.push(P[0], P[1], -1.0,  1.0, index);
        jointsAccumulator.push(P[0], P[1],  1.0,  1.0, index);

        if (i < points.length - 1) {
          const A = points[i];
          const B = points[i+1];
          pointsAccumulator.push(A[0], A[1], B[0], B[1], -1.0, index, 0.0); 
          pointsAccumulator.push(A[0], A[1], B[0], B[1],  1.0, index, 0.0); 
          pointsAccumulator.push(B[0], B[1], A[0], A[1], -1.0, index, 1.0); 
          
          pointsAccumulator.push(A[0], A[1], B[0], B[1],  1.0, index, 0.0); // A, side=+1, t=0
          pointsAccumulator.push(B[0], B[1], A[0], A[1], -1.0, index, 1.0); // B, side=-1, t=1
          pointsAccumulator.push(B[0], B[1], A[0], A[1],  1.0, index, 1.0); // B, side=+1, t=1
        }
      }
    });

    if (pointsAccumulator.length === 0) {
      this.medianVertexCount = 0;
      this.medianCount = 0;
      this.medianJointCount = 0;
      return;
    }

    // Segment Buffer
    const vertexData = new Float32Array(pointsAccumulator);
    this.medianVertexBuffer = this.device.createBuffer({
      size: vertexData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    new Float32Array(this.medianVertexBuffer.getMappedRange()).set(vertexData);
    this.medianVertexBuffer.unmap();
    this.medianVertexCount = vertexData.length / 7; // 7 floats por vértice ahora (antes 6)

    // Joint Buffer
    const jointData = new Float32Array(jointsAccumulator);
    this.medianJointBuffer = this.device.createBuffer({
      size: jointData.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    new Float32Array(this.medianJointBuffer.getMappedRange()).set(jointData);
    this.medianJointBuffer.unmap();
    this.medianJointCount = jointData.length / 5;  

    this.medianCount = medians.length;

    
    const styleBufferSize = this.medianCount * 32;
    this.medianStyleBuffer = this.device.createBuffer({
      size: styleBufferSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    this.haloStyleBuffer = this.device.createBuffer({
      size: styleBufferSize,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    // Upload Styles
    const mainStyleData = new Float32Array(this.medianCount * 8);
    const haloStyleData = new Float32Array(this.medianCount * 8);

    medians.forEach((median, index) => {
      const groupId = median[0];
      const style = medianStyles.get(groupId) || {
        color: [0, 0, 0, 1],
        dashOn: 7,
        dashOff: 7,
        lineWidth: 2
      };
      
      const width = style.lineWidth || 2;
      
      // Main Line Style
      mainStyleData[index*8 + 0] = style.color[0];
      mainStyleData[index*8 + 1] = style.color[1];
      mainStyleData[index*8 + 2] = style.color[2];
      mainStyleData[index*8 + 3] = style.color[3];
      mainStyleData[index*8 + 4] = style.dashOn || 0;
      mainStyleData[index*8 + 5] = style.dashOff || 0;
      mainStyleData[index*8 + 6] = width;
      mainStyleData[index*8 + 7] = 0;

      const haloColorStr = (haloConfig && haloConfig.color) ? haloConfig.color : null;
      // Usar parseo CSS puro: evita dependencia DOM y es seguro en tests/workers
      const [haloR, haloG, haloB] = haloColorStr ? parseCSSColorToVec3(haloColorStr) : [1, 1, 1];
      const haloAlpha = (haloConfig && haloConfig.alpha != null) ? haloConfig.alpha : 0.8;
      const haloExtra = (haloConfig && haloConfig.size  != null) ? haloConfig.size  : 6.0;

      haloStyleData[index*8 + 0] = haloR;
      haloStyleData[index*8 + 1] = haloG;
      haloStyleData[index*8 + 2] = haloB;
      haloStyleData[index*8 + 3] = haloAlpha;
      haloStyleData[index*8 + 4] = 0;   // no dash
      haloStyleData[index*8 + 5] = 0;
      haloStyleData[index*8 + 6] = width + haloExtra;
      haloStyleData[index*8 + 7] = 0;
    });

    this.device.queue.writeBuffer(this.medianStyleBuffer, 0, mainStyleData);
    this.device.queue.writeBuffer(this.haloStyleBuffer, 0, haloStyleData);
    
    this.medianBindGroup = this.device.createBindGroup({
      layout: this.bindGroupLayout,
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer } },
        { binding: 1, resource: { buffer: this.medianStyleBuffer } },
      ]
    });

    if (haloEnabled) {
      this.haloBindGroup = this.device.createBindGroup({
        layout: this.bindGroupLayout,
        entries: [
          { binding: 0, resource: { buffer: this.uniformBuffer } },
          { binding: 1, resource: { buffer: this.haloStyleBuffer } },
        ]
      });
    } else {
      this.haloBindGroup = null;
    }


  }

  updateStyles(stylesMap, defaultColor = [0.5, 0.5, 0.5, 0.1]) {
      if (!this.device || !this.styleBuffer) return;

      if (stylesMap instanceof Float32Array) {
          // Fast path: raw data provided
          this.device.queue.writeBuffer(this.styleBuffer, 0, stylesMap);
          return;
      }
      
      if (!this.idToIndex) return;

      // Buffer compacto: 4 floats por línea (r, g, b, a). El pipeline principal usa
      // array<vec4<f32>>, así que solo escribimos el color sin params extra.
      if (!this._styleDataCache || this._styleDataCache.length !== this.lineCount * 4) {
          this._styleDataCache = new Float32Array(this.lineCount * 4);
          this._styleBaseFilled = false;
      }
      const styleData = this._styleDataCache;

      // Re-rellenar con color por defecto solo si cambió o si es la primera vez
      const dc = defaultColor;
      if (!this._styleBaseFilled ||
          this._cachedDC0 !== dc[0] || this._cachedDC1 !== dc[1] ||
          this._cachedDC2 !== dc[2] || this._cachedDC3 !== dc[3]) {
          for (let i = 0; i < this.lineCount; i++) {
              styleData[i*4 + 0] = dc[0];
              styleData[i*4 + 1] = dc[1];
              styleData[i*4 + 2] = dc[2];
              styleData[i*4 + 3] = dc[3];
          }
          this._styleBaseFilled = true;
          this._cachedDC0 = dc[0]; this._cachedDC1 = dc[1];
          this._cachedDC2 = dc[2]; this._cachedDC3 = dc[3];
          if (!this._styleBaseData || this._styleBaseData.length !== styleData.length) {
              this._styleBaseData = new Float32Array(styleData);
          } else {
              this._styleBaseData.set(styleData);
          }
      } else {
          styleData.set(this._styleBaseData);
      }

      stylesMap.forEach((style, id) => {
          if (this.idToIndex.has(id)) {
              const idx = this.idToIndex.get(id);
              if (style.color) {
                  styleData[idx*4 + 0] = style.color[0];
                  styleData[idx*4 + 1] = style.color[1];
                  styleData[idx*4 + 2] = style.color[2];
                  styleData[idx*4 + 3] = style.color[3];
              }
          }
      });

      this.device.queue.writeBuffer(this.styleBuffer, 0, styleData);
  }
  
  updateUniforms(domains, width, height, margins = {top:0, left:0, right:0, bottom:0}) {
      if (!this.device || !this.uniformBuffer) return;

      this.currentWidth = width;
      this.currentHeight = height;
      this.margins = margins;

      // Evitar writeBuffer si los valores no cambiaron (ahorra un IPC al GPU process por frame)
      const key = `${domains.x[0]},${domains.x[1]},${domains.y[0]},${domains.y[1]},${width},${height}`;
      if (key === this._lastUniformKey) return;
      this._lastUniformKey = key;

      this._uniformData[0] = domains.x[0]; this._uniformData[1] = domains.x[1];
      this._uniformData[2] = domains.y[0]; this._uniformData[3] = domains.y[1];
      this._uniformData[4] = width;         this._uniformData[5] = height;
      this._uniformData[6] = 0;             this._uniformData[7] = 0;
      this.device.queue.writeBuffer(this.uniformBuffer, 0, this._uniformData);
  }

  // Crea la textura de anti-aliasing MSAA y la textura de stencil para el halo
  _createMSAATexture(width, height) {
    if (!this.device) return;
    if (this.msaaTexture) this.msaaTexture.destroy();
    this.msaaTexture = this.device.createTexture({
      size: [width, height],
      sampleCount: this.sampleCount,
      format: this.presentationFormat,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    this.msaaTextureView = this.msaaTexture.createView();

    if (this.stencilTexture) this.stencilTexture.destroy();
    this.stencilTexture = this.device.createTexture({
      size: [width, height],
      sampleCount: this.sampleCount,
      format: 'depth24plus-stencil8',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
    this.stencilTextureView = this.stencilTexture.createView();

    this._msaaWidth = width;
    this._msaaHeight = height;
  }

  _ensureMSAATexture(width, height) {
    if (!this.msaaTexture || this._msaaWidth !== width || this._msaaHeight !== height) {
      this._createMSAATexture(width, height);
    }
  }

  // Pre-compila los comandos de draw de las líneas principales en un GPURenderBundle.
  // executeBundles() es sustancialmente más rápido que re-codificar los mismos comandos
  // cada frame: elimina validación de estado y reduce el IPC con el GPU process de Chrome.
  // Se construye una sola vez tras uploadData() y se reutiliza hasta que cambian datos/pipeline.
  _buildMainBundle() {
    if (!this.device || !this.pipeline || !this.vertexBuffer || !this.indexBuffer ||
        !this.bindGroups || !this.bindGroups[0]) return;

    const bundleEncoder = this.device.createRenderBundleEncoder({
      colorFormats: [this.presentationFormat],
      depthStencilFormat: 'depth24plus-stencil8',
      sampleCount: this.sampleCount,
    });

    bundleEncoder.setPipeline(this.pipeline);
    bundleEncoder.setBindGroup(0, this.bindGroups[0]);
    bundleEncoder.setVertexBuffer(0, this.vertexBuffer);
    bundleEncoder.setIndexBuffer(this.indexBuffer, 'uint32');
    bundleEncoder.drawIndexed(this.indexCount, 1, 0, 0, 0);

    this._mainRenderBundle = bundleEncoder.finish();
    this._renderBundleDirty = false;
  }

  draw(hasSelection = false, groupCount = 0) {
      if (!this.device || !this.pipeline || !this.vertexBuffer || !this.indexBuffer || !this.styleBuffer) return;
      if (!this.bindGroups) this.bindGroups = [];

      // Recrear bind group solo cuando cambia el style buffer (uploadData)
      if (this._bindGroupsDirty || !this.bindGroups.length) {
          this.bindGroups = [this.device.createBindGroup({
              layout: this.pipeline.getBindGroupLayout(0),
              entries: [
                  { binding: 0, resource: { buffer: this.uniformBuffer } },
                  { binding: 1, resource: { buffer: this.styleBuffer } },
              ]
          })];
          this.bindGroup = this.bindGroups[0];
          this._bindGroupsDirty = false;
          this._renderBundleDirty = true; // bind group cambió → bundle inválido
      }

      // Construir render bundle si es necesario (solo primera vez o tras cambio de datos)
      if (this._renderBundleDirty || !this._mainRenderBundle) {
          this._buildMainBundle();
      }

      const commandEncoder = this.device.createCommandEncoder();
      const canvasTexture = this.context.getCurrentTexture();
      const canvasTextureView = canvasTexture.createView();

      this._ensureMSAATexture(canvasTexture.width, canvasTexture.height);

      // Cuando sampleCount=1 (MSAA desactivado), renderizar directamente al canvas.
      // Con sampleCount>1, usar textura MSAA intermedia + resolveTarget al canvas.
      const useMSAA = this.sampleCount > 1;
      const renderPassDescriptor = useMSAA ? {
          colorAttachments: [
              {
                  view: this.msaaTextureView,
                  resolveTarget: canvasTextureView,
                  clearValue: { r: 1, g: 1, b: 1, a: 0 },
                  loadOp: "clear",
                  storeOp: "discard",
              },
          ],
          depthStencilAttachment: this.stencilTextureView ? {
              view: this.stencilTextureView,
              depthLoadOp: 'clear',  depthStoreOp: 'discard', depthClearValue: 1.0,
              stencilLoadOp: 'clear', stencilStoreOp: 'discard', stencilClearValue: 0,
          } : undefined,
      } : {
          colorAttachments: [
              {
                  view: canvasTextureView,
                  clearValue: { r: 1, g: 1, b: 1, a: 0 },
                  loadOp: "clear",
                  storeOp: "store",
              },
          ],
          depthStencilAttachment: this.stencilTextureView ? {
              view: this.stencilTextureView,
              depthLoadOp: 'clear',  depthStoreOp: 'discard', depthClearValue: 1.0,
              stencilLoadOp: 'clear', stencilStoreOp: 'discard', stencilClearValue: 0,
          } : undefined,
      };

      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

      if (this.margins && this.currentWidth && this.currentHeight) {
          const canvasWidth = canvasTexture.width;
          const canvasHeight = canvasTexture.height;
          const dpr = window.devicePixelRatio || 1;
          const x = Math.floor(this.margins.left * dpr);
          const y = Math.floor(this.margins.top * dpr);
          const w = Math.floor(Math.min(canvasWidth - x, this.currentWidth  - this.margins.left * dpr - this.margins.right  * dpr));
          const h = Math.floor(Math.min(canvasHeight - y, this.currentHeight - this.margins.top  * dpr - this.margins.bottom * dpr));
          passEncoder.setScissorRect(x, y, w, h);
      }

      // Render bundle: ejecuta los comandos pre-compilados de las líneas principales.
      // Elimina validación por frame y reduce mensajes IPC al GPU process de Chrome.
      passEncoder.executeBundles([this._mainRenderBundle]);
      
      if (this.medianVertexBuffer && this.medianBindGroup && this.medianVertexCount > 0 && this.thickLinePipeline && this.jointPipeline) {
        
        if (this.haloBindGroup && this.haloJointPipeline && this.haloThickPipeline) {
          passEncoder.setBindGroup(0, this.haloBindGroup);
          passEncoder.setStencilReference(1);

          // 1) Uniones primero → tapas redondeadas en cada vértice, marca los píxeles cubiertos (stencil→1)
          passEncoder.setPipeline(this.haloJointPipeline);
          passEncoder.setVertexBuffer(0, this.medianJointBuffer);
          passEncoder.draw(this.medianJointCount, 1, 0, 0);

          // 2) Segmentos → rellena entre uniones, omite los píxeles ya pintados por las uniones
          passEncoder.setPipeline(this.haloThickPipeline);
          passEncoder.setVertexBuffer(0, this.medianVertexBuffer);
          passEncoder.draw(this.medianVertexCount, 1, 0, 0);
        }
        
        passEncoder.setBindGroup(0, this.medianBindGroup);
        
        passEncoder.setPipeline(this.jointPipeline);
          passEncoder.setVertexBuffer(0, this.medianJointBuffer);
          passEncoder.draw(this.medianJointCount, 1, 0, 0);
        
        passEncoder.setPipeline(this.thickLinePipeline);
        passEncoder.setVertexBuffer(0, this.medianVertexBuffer);
        passEncoder.draw(this.medianVertexCount, 1, 0, 0);
      }

      
      passEncoder.end();

      this.device.queue.submit([commandEncoder.finish()]);
  }

  // Ajusta el nivel de MSAA según el número de líneas.
  // Para N > 10k, las líneas se superponen tanto que el anti-aliasing no aporta visualmente
  // pero sí cuesta 4× más en el fragment shader. Se llama una vez tras uploadData().
  setAdaptiveSampleCount(lineCount) {
    const optimal = lineCount > 10000 ? 1 : 4;
    if (this.sampleCount === optimal) return;
    this.sampleCount = optimal;
    // Recrear textura MSAA y stencil con el nuevo sample count
    if (this._msaaWidth && this._msaaHeight) {
      this._createMSAATexture(this._msaaWidth, this._msaaHeight);
    }
    // Recrear todos los pipelines (multisample.count está horneado en cada pipeline)
    this.initPipeline();
    this._bindGroupsDirty = true;
    this._renderBundleDirty = true;
    console.log(`%c[WebGPU] MSAA ajustado a ${optimal}× para ${lineCount.toLocaleString()} líneas`, 'color:#00aaff');
  }

  // Devuelve una Promise que resuelve cuando la GPU termina todos los comandos enviados.
  // Necesario para medir tiempos reales de GPU (submit() es asíncrono).
  syncGPU() {
    if (!this.device) return Promise.resolve();
    return this.device.queue.onSubmittedWorkDone();
  }

  /**
   * Libera todos los recursos GPU: buffers, texturas, device.
   * Llamar en el unmount del widget para evitar memory leaks.
   */
  destroy() {
    if (this.vertexBuffer) { this.vertexBuffer.destroy(); this.vertexBuffer = null; }
    if (this.indexBuffer)  { this.indexBuffer.destroy();  this.indexBuffer  = null; }
    if (this.styleBuffer) { this.styleBuffer.destroy(); this.styleBuffer = null; }
    if (this.medianVertexBuffer) { this.medianVertexBuffer.destroy(); this.medianVertexBuffer = null; }
    if (this.medianStyleBuffer) { this.medianStyleBuffer.destroy(); this.medianStyleBuffer = null; }
    if (this.haloStyleBuffer) { this.haloStyleBuffer.destroy(); this.haloStyleBuffer = null; }
    if (this.medianJointBuffer) { this.medianJointBuffer.destroy(); this.medianJointBuffer = null; }
    if (this.msaaTexture) { this.msaaTexture.destroy(); this.msaaTexture = null; }
    if (this.stencilTexture) { this.stencilTexture.destroy(); this.stencilTexture = null; }

    if (this.uniformBuffer) { this.uniformBuffer.destroy(); this.uniformBuffer = null; }
    this.uniformBuffers = null;

    // Limpiar el resto de referencias
    this.pipeline = null;
    this.thickLinePipeline = null;
    this.jointPipeline = null;
    this.haloJointPipeline = null;
    this.haloThickPipeline = null;
    this.bindGroup = null;
    this.bindGroups = [];
    this.medianBindGroup = null;
    this.haloBindGroup = null;
    this.bindGroupLayout = null;
    this.context = null;
    this.idToIndex = null;

    // El device se libera al final — invalidar referencia
    if (this.device) {
      this.device.destroy();
      this.device = null;
    }
  }
}

function TimeLineOverview({
  ts,
  element,
  width = 800,
  height = 600,
  x,
  y,
  groupAttr,
  renderer = "canvas",
}) {
  const dpr = window.devicePixelRatio || 1;
  let me = {};
  let paths, overviewX, overviewY;

  const divOverview = d3__namespace
    .select(element)
    .style("display", "flex")
    .style("flex-wrap", "wrap")
    .style("position", "relative")
    .style("top", "0px")
    .style("left", "0px")
    .style("background-color", ts.backgroundColor);

  let line = d3__namespace.line()
    .defined((d) => y(d) !== undefined && y(d) !== null);
  
  let linem = d3__namespace.line();

  const innerWidth = width - ts.margin.left - ts.margin.right;
  const innerHeight = height - ts.margin.top - ts.margin.bottom;

  const canvas = divOverview
    .selectAll("canvas")
    .data([1])
    .join("canvas")
    .attr("height", innerHeight * dpr)
    .attr("width", innerWidth * dpr)
    .style("position", "absolute")
    .style("z-index", "-1")
    .style("top", `${ts.margin.top}px`)
    .style("left", `${ts.margin.left}px`)
    .style("width", `${innerWidth}px`)
    .style("height", `${innerHeight}px`)
    .style("pointer-events", "none");

  let context = null;

  function initCanvas2D() {
    if (context) return;
    context = canvas.node().getContext("2d");
    context.scale(dpr, dpr);
    console.log("%c[TimeWidget] Canvas 2D Renderer Active", "color: #ffaa00; font-weight: bold;");
  }

  let gpuRenderer = null;
  let isGpuReady = false;
  let pendingRender = null;
  let pendingData = null;

  if (renderer === "webgpu") {
    gpuRenderer = new WebGPURenderer();
    gpuRenderer.init(canvas.node()).then((ok) => {
      if (ok) {
        console.log("%c[TimeWidget] WebGPU Renderer Active", "color: #00ff00; font-weight: bold;");
        isGpuReady = true;
        
        if (pendingData) {
          me.data(pendingData);
          pendingData = null;
        }
        
        if (pendingRender) {
          pendingRender();
          pendingRender = null;
        }
      } else {
        console.warn("[TimeWidget] WebGPU initialization failed, falling back to Canvas 2D");
        gpuRenderer = null;
        initCanvas2D();
      }
    });
  } else {
    initCanvas2D();
  }

  me.data = function (data) {
    paths = new Map();
    data.forEach((d) => {
      let group = groupAttr ? groupAttr(d[1][0]) : null;
      let pathObject = { path: new Path2D(line(d[1])), group: group };
      paths.set(d[0], pathObject);
    });

    if (gpuRenderer) {
      if (!isGpuReady) {
        pendingData = data;
        return;
      }
      const formattedData = data.map(([id, points]) => ({
        id,
        points: points
          .map((p) => [+x(p), +y(p)])
          .filter((p) => !isNaN(p[0]) && !isNaN(p[1])),
      }));

      // LOD adaptativo para WebGPU: dos etapas de reducción para N masivo.
      // Se puede deshabilitar con enableLOD: false para preservar outliers.
      const useLOD = ts.enableLOD !== false;
      const n = formattedData.length;
      const maxSamples = useLOD ? (n > 75000 ? 5 : n > 40000 ? 8 : n > 20000 ? 14 : null) : null;
      const lineStep   = useLOD ? (n > 80000 ? 2 : n > 60000 ? 1.5 : 1) : 1;

      const sampledData = maxSamples
        ? formattedData.map(d => {
            const pts = d.points;
            if (pts.length <= maxSamples) return d;
            const step = (pts.length - 1) / (maxSamples - 1);
            return Object.assign({}, d, {
              points: Array.from({ length: maxSamples }, function(_, i) {
                return pts[Math.min(Math.round(i * step), pts.length - 1)];
              }),
            });
          })
        : formattedData;

      // Subsampleo de líneas: mantener 1 de cada lineStep
      const gpuData = lineStep > 1
        ? sampledData.filter(function(_, i) { return Math.round(i % lineStep) === 0; })
        : sampledData;

      if (maxSamples || lineStep > 1) {
        const linePct = Math.round((1 - gpuData.length / n) * 100);
        const linePart = lineStep > 1
          ? ` → ${gpuData.length.toLocaleString()} dibujadas (−${linePct}% líneas)`
          : '';
        const samplePart = maxSamples ? `, máx ${maxSamples} muestras/línea` : '';
        console.log(
          `%c[WebGPU] LOD: ${n.toLocaleString()} líneas${linePart}${samplePart}`,
          'color:#ff8800'
        );
      }

      gpuRenderer.uploadData(gpuData);
      // Ajustar MSAA: desactivarlo para N > 10k (sin beneficio visual, 4× coste)
      gpuRenderer.setAdaptiveSampleCount(gpuData.length);
      // Invalidar cache de estilos al cargar nuevos datos
      _gpuLastDataSelected = _gpuLastDataNotSelected = _gpuLastMedians = null;
    }
  };

  me.setScales = function ({ scaleX, scaleY }) {
    overviewX = scaleX;
    overviewY = scaleY;

    line = line.x((d) => overviewX(+x(d))).y((d) => overviewY(y(d)));
    linem = linem.x((d) => overviewX(d[0])).y((d) => overviewY(d[1]));
  };

  function renderOvwerview(
    dataSelected,
    groupSelected,
    dataNotSelected,
    medians,
    hasSelection
  ) {
    dataNotSelected = dataNotSelected ? dataNotSelected : [];
    context.clearRect(0, 0, canvas.node().width, canvas.node().height);

    if (!hasSelection) {
      // Render all
      renderOverviewCanvasSubset(
        dataNotSelected,
        ts.defaultAlpha,
        ts.defaultColor
      );
    } else {
      context.lineWidth = 1;

      // Render Non selected
      renderOverviewCanvasSubset(
        dataNotSelected,
        ts.noSelectedAlpha,
        ts.noSelectedColor
      );

      dataSelected.forEach((data, group) => {
        if (group !== groupSelected) {
          let selectedColor = computeColor(group);
          // console.log(
          //   "Render selected selectedColor",
          //   selectedColor,
          //   group
          // );

          // Render selected
          const groupColor = selectedColor || ts.brushesColorScale(0) || "#4682b4";
          renderOverviewCanvasSubset(
            data,
            ts.selectedAlpha,
            groupColor.toString(),
            group
          );
        }
      });

      const selectedColor = computeColor(groupSelected);
      const groupColor = selectedColor || ts.brushesColorScale(0) || "#4682b4";
      renderOverviewCanvasSubset(
        dataSelected.get(groupSelected),
        ts.selectedAlpha,
        groupColor.toString(),
        groupSelected
      );

      // TODO configs for this
      /*childSelections.forEach((selection, childIx) => {
      if (childPosition !== childIx) {
        let selection = childSelections[childIx];
        selection.forEach((group, id) => {
          let color = d3.hsl(ts.brushesColorScale(id));
          color.s = 1;
          color.l = lums[childIx]; //initLum + LStep * (childSelections.length - 1 - childIx);
          renderOverviewCanvasSubset(group, ts.selectedAlpha, color);
        });
      }
    }); */

      context.save();
      // Render group Medians
      if (medians) {
        context.lineWidth = ts.medianLineWidth;
        context.globalAlpha = ts.medianLineAlpha;

        medians.forEach((d) => {
          if (!d[1]) {
            console.log("Error drawing medians, empty data", d);
            return;
          }
          let path = new Path2D(linem(d[1]));
          context.setLineDash(ts.medianLineDash);
          context.strokeStyle = darken(computeColor(d[0]));
          context.stroke(path);
        });
      }
      context.restore();
    }
  }

  function computeColor(groupId) {
    const color = ts.brushesColorScale(groupId);
    return color || ts.brushesColorScale(0) || "#4682b4";
  }

  // Pass a groupId when rendering a highlighted selection for a group
  function renderOverviewCanvasSubset(
    dataSubset,
    alpha,
    color,
    groupId = null
  ) {
    if (!dataSubset) {
      console.log("\uD83D\uDEAB Error renderOverviewCanvasSubset called with no dataSubset", dataSubset);
      return;
    }

    //context.save();
    // Compute the transparency with respect to the number of lines drawn
    // Min 0.05, then adjust by the expected alpha divided by 10% of the number of lines
    // context.globalAlpha = 0.05 + alpha / (dataSubset.length * 0.1);
    context.globalAlpha = alpha * ts.alphaScale(dataSubset.length);

    

    for (let d of dataSubset) {
      let path = paths.get(d[0]);
      if (!path) {
        console.log("renderOverviewCanvasSubset error finding path", d[0], d);
        return;
      }
      let strokeColor = color;
      if (groupAttr) {
        const baseGroupColor = ts.colorScale(path.group);
        strokeColor = ts.selectedColorTransform(baseGroupColor, groupId);

        // const { h, c, l, opacity } = d3.lch(baseGroupColor);
        // strokeColor = d3.lch(l + ts.brushesColorScale(groupId), c, h, opacity);
        // console.log(
        //   "group",
        //   groupId,

        //   "baseGroupColor",
        //   baseGroupColor,
        //   h,
        //   s,
        //   l,
        //   o,

        //   "after",
        //   strokeColor
        // );
      }
      // context.strokeStyle = groupAttr ? ts.colorScale(path.group) : color;
      context.strokeStyle = "" + strokeColor;
      context.stroke(path.path);
    }
  }

  // Cache para evitar re-uploads GPU innecesarios cuando el estado no cambia entre frames.
  // updateStyles() y uploadMedians() son O(N) y escriben MBs de datos; saltarlos cuando
  // dataSelected/dataNotSelected/medians son los mismos objetos es la optimización más impactante.
  let _gpuLastDataSelected    = null;
  let _gpuLastDataNotSelected = null;
  let _gpuLastHasSelection    = undefined;
  let _gpuLastColorKey        = null;
  let _gpuLastMedians         = null;
  let _gpuLastMedianStyleKey  = null;

  me.render = function (
    dataSelected,
    groupSelected,
    dataNotSelected,
    medians,
    hasSelection
  ) {
    if (gpuRenderer) {
      if (!isGpuReady) {
        pendingRender = () =>
          me.render(
            dataSelected,
            groupSelected,
            dataNotSelected,
            medians,
            hasSelection
          );
        return;
      }

      // ── Styles: re-upload solo si la selección o los colores cambiaron ────────
      const colorKey = `${ts.defaultColor}|${ts.defaultAlpha}|${ts.selectedAlpha}`;
      const stylesDirty =
        dataSelected    !== _gpuLastDataSelected    ||
        dataNotSelected !== _gpuLastDataNotSelected ||
        hasSelection    !== _gpuLastHasSelection    ||
        colorKey        !== _gpuLastColorKey;

      if (stylesDirty) {
        const stylesMap = new Map();
        const defaultColorRGB = d3__namespace.rgb(ts.defaultColor);
        const notSelAlpha = hasSelection ? ts.noSelectedAlpha : ts.defaultAlpha;
        const defaultColorVec = [
          defaultColorRGB.r / 255,
          defaultColorRGB.g / 255,
          defaultColorRGB.b / 255,
          notSelAlpha,
        ];

        dataNotSelected.forEach((d) => {
          let colorVec = defaultColorVec;
          if (groupAttr) {
            const pathObj = paths.get(d[0]);
            if (pathObj) {
              const gc = d3__namespace.rgb(ts.colorScale(pathObj.group));
              colorVec = [gc.r / 255, gc.g / 255, gc.b / 255, notSelAlpha];
            }
          }
          stylesMap.set(d[0], { color: colorVec, selectionFlag: 0.0 });
        });

        let groupIdx = 0;
        dataSelected.forEach((groupData, groupId) => {
          const brushColor = d3__namespace.rgb(computeColor(groupId));
          const flag = groupIdx + 1.0;
          groupData.forEach((d) => {
            let colorVec;
            if (groupAttr) {
              const pathObj = paths.get(d[0]);
              if (pathObj) {
                const transformed = d3__namespace.rgb(ts.selectedColorTransform(ts.colorScale(pathObj.group), groupId));
                colorVec = [transformed.r / 255, transformed.g / 255, transformed.b / 255, ts.selectedAlpha];
              } else {
                colorVec = [brushColor.r / 255, brushColor.g / 255, brushColor.b / 255, ts.selectedAlpha];
              }
            } else {
              colorVec = [brushColor.r / 255, brushColor.g / 255, brushColor.b / 255, ts.selectedAlpha];
            }
            stylesMap.set(d[0], { color: colorVec, selectionFlag: flag });
          });
          groupIdx++;
        });

        const transparentColor = [0, 0, 0, 0];
        gpuRenderer.updateStyles(stylesMap, transparentColor);

        _gpuLastDataSelected    = dataSelected;
        _gpuLastDataNotSelected = dataNotSelected;
        _gpuLastHasSelection    = hasSelection;
        _gpuLastColorKey        = colorKey;
      }

      gpuRenderer.updateUniforms(
        {
          x: overviewX.domain().map((d) => +d),
          y: overviewY.domain().map((d) => +d),
        },
        innerWidth  * dpr,
        innerHeight * dpr,
        { top: 0, left: 0, right: 0, bottom: 0 }
      );

      // ── Medians: re-upload solo si cambian ───────────────────────────────────
      const medianStyleKey = medians && medians.length > 0
        ? `${ts.medianLineWidth}|${ts.medianLineAlpha}|${ts.medianLineDash}`
        : null;
      const mediansDirty =
        medians         !== _gpuLastMedians        ||
        medianStyleKey  !== _gpuLastMedianStyleKey;

      if (mediansDirty) {
        const medianStyles = new Map();
        if (medians && medians.length > 0) {
          medians.forEach(([groupId]) => {
            const color = d3__namespace.rgb(computeColor(groupId));
            medianStyles.set(groupId, {
              color: [color.r / 255, color.g / 255, color.b / 255, ts.medianLineAlpha],
              lineWidth: ts.medianLineWidth,
              dashOn: ts.medianLineDash[0] || 0,
              dashOff: ts.medianLineDash[0] || 0,
            });
          });
        }
        gpuRenderer.uploadMedians(medians || [], medianStyles);
        _gpuLastMedians        = medians;
        _gpuLastMedianStyleKey = medianStyleKey;
      }

      gpuRenderer.draw(hasSelection, dataSelected.size);
    } else {
      renderOvwerview(
        dataSelected,
        groupSelected,
        dataNotSelected,
        medians,
        hasSelection
      );
    }
  };

  // Espera a que la GPU termine todos los comandos enviados (WebGPU async sync).
  // Canvas 2D resuelve inmediatamente.
  me.syncGPU = function() {
    if (gpuRenderer && typeof gpuRenderer.syncGPU === 'function') {
      return gpuRenderer.syncGPU();
    }
    return Promise.resolve();
  };

  me.syncRenderer = function() {
    if (gpuRenderer && typeof gpuRenderer.syncGPU === 'function') {
      return gpuRenderer.syncGPU();
    }
    if (context) {
      context.getImageData(0, 0, 1, 1);
    }
    return Promise.resolve();
  };

  return me;
}

/*Data is an array of the next form
[
  [id,[[x0,y0],[x1,y1]...]]
  .
  .
  .
]
 */
function BVH({
  data,
  xPartitions = 10,
  yPartitions = 10,
  polylines = true,
  referenceLines = null,
  scaleY = d3__namespace.scaleLinear()
}) {
  let me = {};
  const unclampedScaleY = scaleY.copy().clamp(false);
  let BVH = makeBVH();

  function pupulateBVHPolylines(data, BVH, Rcurve) {
    let xinc = BVH.xinc;
    let yinc = BVH.yinc;
    data.forEach((d) => {
      let key = d[0];
      let collisionActive = d[2];
      let isSimplePoints = d[3];

      let lastXindex = -1;
      let lastYindex = -1;
      for (let i = 0; i < d[1].length; ++i) {
        let current = d[1][i];
        let xCoor = current[0];
        let yCoor = current[1];
        if (xCoor != null && yCoor != null) {
          let xIndex = Math.floor(xCoor / xinc);
          let yIndex = Math.floor(yCoor / yinc);
          if (isNaN(xIndex) || isNaN(yIndex)) {
            log();
          }

          if (i === 0) {
            if (Rcurve) {
              // Almacenar como objeto con propiedades
              BVH.BVH[xIndex][yIndex].referenceLines.set(key, {
                data: [[current]],
                collisionActive: collisionActive,
                isSimplePoints: isSimplePoints,
              });
            } else {
              BVH.BVH[xIndex][yIndex].data.set(key, [[current]]);
            }
          } else {
            if (xIndex === lastXindex && yIndex === lastYindex) {
              if (Rcurve) {
                BVH.BVH[xIndex][yIndex].referenceLines
                  .get(key)
                  .data.push(current);
              } else {
                BVH.BVH[xIndex][yIndex].data.get(key).at(-1).push(current);
              }
            } else {
              let previousCell = BVH.BVH[lastXindex][lastYindex];
              if (Rcurve) {
                previousCell.referenceLines.get(key).data.push(current);
              } else {
                previousCell.data.get(key).at(-1).push(current);
              }
              let previous = d[1][i - 1];
              for (let row of BVH.BVH) {
                for (let cell of row) {
                  if (cell !== previousCell) {
                    if (
                      lineIntersection(
                        [previous, current],
                        cell.x0,
                        cell.y0,
                        cell.x1,
                        cell.y1
                      )
                    ) {
                      if (Rcurve) {
                        if (cell.referenceLines.has(key)) {
                          cell.referenceLines.get(key).data.push([previous]);
                          cell.referenceLines
                            .get(key)
                            .data.at(-1)
                            .push(current);
                        } else {
                          // Crear nuevo objeto con propiedades
                          cell.referenceLines.set(key, {
                            data: [[previous]],
                            collisionActive: collisionActive,
                            isSimplePoints: isSimplePoints,
                          });
                          cell.referenceLines
                            .get(key)
                            .data.at(-1)
                            .push(current);
                        }
                      } else {
                        if (cell.data.has(key)) {
                          cell.data.get(key).push([previous]);
                          cell.data.get(key).at(-1).push(current);
                        } else {
                          cell.data.set(key, [[previous]]);
                          cell.data.get(key).at(-1).push(current);
                        }
                      }
                    }
                  }
                }
              }
            }
          }

          lastXindex = xIndex;
          lastYindex = yIndex;
        }
      }
    });
  }
  // Distancia mínima entre punto p y el segmento ab
  function pointSegmentDistance(p, a, b) {
    // Vectores AP y AB
    const ap = [p[0] - a[0], p[1] - a[1]];
    const ab = [b[0] - a[0], b[1] - a[1]];

    // Longitud al cuadrado de AB (para evitar sqrt temprano)
    const ab2 = ab[0] * ab[0] + ab[1] * ab[1];

    // Si a==b (segmento degenerado), distancia euclídea de p a a
    if (ab2 === 0) return Math.hypot(ap[0], ap[1]);

    // Proyección escalar “t” de AP sobre AB normalizado, acotada a [0,1]
    const t = Math.max(0, Math.min(1, (ap[0] * ab[0] + ap[1] * ab[1]) / ab2));

    // Punto más cercano sobre el segmento: a + t*AB
    const closest = [a[0] + t * ab[0], a[1] + t * ab[1]];

    // Distancia euclídea de P a ese punto más cercano
    return Math.hypot(p[0] - closest[0], p[1] - closest[1]);
  }

 function RCIntersection(BVH) {
    const collisions = new Map();
    const refMeta = new Map();

    // 1. Aplanar todos los puntos de referencia simples en una sola lista para un acceso más fácil.
    const allRefPoints = [];
    if (BVH.referenceLines) {
        BVH.referenceLines.forEach(ref => {
            if (ref.isSimplePoints && ref.collisionActive) {
                refMeta.set(ref.id, { isSimplePoints: true });
                (ref.data || []).forEach(pointCoords => {
                    allRefPoints.push({
                        id: ref.id,
                        point: pointCoords,
                        epsilon: ref.epsilon !== undefined ? ref.epsilon : 0,
                    });
                });
            }
        });
    }

    // 2. Iterar sobre puntos 
    allRefPoints.forEach(refPoint => {
        if (refPoint.epsilon <= 0) return; 

        // 3. Calcular el área de búsqueda en píxeles.
        const epsilon_data = refPoint.epsilon;
        const epsilon_px = Math.abs(unclampedScaleY(0) - unclampedScaleY(epsilon_data));
        const [px, py] = refPoint.point;

        // Definimos una "caja de búsqueda" (bounding box) alrededor del círculo de tolerancia.
        const searchBox = {
            x0: px - epsilon_px,
            y0: py - epsilon_px,
            x1: px + epsilon_px,
            y1: py + epsilon_px,
        };

        // 4. Usar la caja de búsqueda para obtener todas las celdas del BVH relevantes.
        const [[initI, finI], [initJ, finJ]] = getCollidingCells(searchBox.x0, searchBox.y0, searchBox.x1, searchBox.y1, BVH);

        // 5. Recopilar todas las líneas de datos únicas de esas celdas para evitar comprobaciones repetidas.
        const candidatePolylines = new Map();
        for (let i = initI; i <= finI; i++) {
            for (let j = initJ; j <= finJ; j++) {
                if (BVH.BVH[i] && BVH.BVH[i][j]) {
                    for (const [dataKey, polylines] of BVH.BVH[i][j].data.entries()) {
                        if (!candidatePolylines.has(dataKey)) {
                            candidatePolylines.set(dataKey, polylines);
                        }
                    }
                }
            }
        }
        
        // 6. Realizar la comprobación de distancia precisa solo con las líneas candidatas.
        for (const [dataKey, dataPolylines] of candidatePolylines.entries()) {
            let collisionFound = false;
            for (const poly of dataPolylines) {
                for (let k = 1; k < poly.length; k++) {
                    const a = poly[k - 1];
                    const b = poly[k];
                    const distance = pointSegmentDistance(refPoint.point, a, b);

                    if (distance <= epsilon_px) {
                        if (!collisions.has(refPoint.id)) collisions.set(refPoint.id, new Map());
                        const byData = collisions.get(refPoint.id);
                        if (!byData.has(dataKey)) byData.set(dataKey, new Map());
                        const hits = byData.get(dataKey);

                        const hitKey = `p:${px},${py}`;
                        if (!hits.has(hitKey)) {
                            hits.set(hitKey, { type: "point", point: [px, py] });
                        }
                        
                        collisionFound = true;
                        break; // Salimos del bucle de segmentos
                    }
                }
                if (collisionFound) break; // Salimos del bucle de polilíneas
            }
        }
    });

    // 7. Formatear el resultado final (sin cambios en esta parte).
    const result = [];
    
    if (BVH.referenceLines) {
        BVH.referenceLines.forEach((ref) => {
            if (collisions.has(ref.id)) {
                const byData = collisions.get(ref.id);
                const formattedCollisions = [];
                for (const [dataId, hitsMap] of byData) {
                    formattedCollisions.push({
                        dataId,
                        count: hitsMap.size,
                        hits: Array.from(hitsMap.values()),
                    });
                }
                ref.collisions = formattedCollisions;
            } else {
                ref.collisions = [];
            }

            if (ref.collisions.length > 0) {
                 result.push({
                    refId: ref.id,
                    isSimplePoints: ref.isSimplePoints,
                    collisions: ref.collisions
                });
            }
        });
    }

    return result;
  }
  function populateBVHReferenceLines(newReferenceLines, BVH) {
    const inBounds = (x, y) => {
      const result = x >= 0 && x < BVH.width && y >= 0 && y < BVH.height;
      return result;
    };
    if (!BVH.referenceLines) {
      BVH.referenceLines = [];
    }
    BVH.referenceLines = BVH.referenceLines.concat(newReferenceLines);
    if (!BVH.referenceLines) BVH.referenceLines = [];
    const byId = new Map(BVH.referenceLines.map((r) => [r.id, r]));
    for (const ref of newReferenceLines) {
      if (!byId.has(ref.id)) {
        byId.set(ref.id, ref);
      } else {
        byId.set(ref.id, Object.assign({}, byId.get(ref.id), ref));
      }
    }
    BVH.referenceLines = Array.from(byId.values());
    newReferenceLines.forEach((ref) => {
      const id = ref.id;
      const collisionActive = ref.collisionActive;
      const isSimplePoints = ref.isSimplePoints;
      // 1) Aplica offset y filtra valores no finitos
      const adjustedPoints = (ref.data || [])
        .map(([x, y]) => {
          const adjusted = [x - BVH.offsetX, y - BVH.offsetY];
          return adjusted;
        })
        .filter(([x, y]) => {
          const isFinite = Number.isFinite(x) && Number.isFinite(y);
          return isFinite;
        })
        .filter(([x, y]) => {
          const bounds = inBounds(x, y);
          return bounds;
        });

      // 2) Si no queda nada, saltamos
      if (adjustedPoints.length === 0) {
        return;
      }
      // 3) Decide a qué función llamar
      if (ref.isSimplePoints || adjustedPoints.length === 1) {
        // puntos sueltos
        populateBVHPoints(
          [[id, adjustedPoints, collisionActive, isSimplePoints]],
          BVH,
          true
        );
      } else {
        // polilínea (mínimo 2 puntos)
        if (adjustedPoints.length >= 2) {
          pupulateBVHPolylines(
            [[id, adjustedPoints, collisionActive, isSimplePoints]],
            BVH,
            true
          );
        }
      }
    });
    return RCIntersection(BVH);
  }

  function populateBVHPoints(data, BVH, Rcurve) {
    let xinc = BVH.xinc;
    let yinc = BVH.yinc;
    data.forEach((d) => {
      let key = d[0];
      let collisionActive = d[2];
      let isSimplePoints = d[3];

      for (let point of d[1]) {
        let [x, y] = point;
        let Iindex = Math.floor(x / xinc);
        let Jindex = Math.floor(y / yinc);
        let cell = BVH.BVH[Iindex][Jindex];

        if (Rcurve) {
          if (!cell.referenceLines.has(key)) {
            cell.referenceLines.set(key, {
              data: [],
              collisionActive: collisionActive,
              isSimplePoints: isSimplePoints,
            });
          }
          cell.referenceLines.get(key).data.push([x, y]);
        } else {
          if (!cell.data.has(key)) {
            cell.data.set(key, []);
          }
          cell.data.get(key).push([x, y]);
        }
      }
    });
  }

  function makeBVH() {
    let keys = data.map((d) => d[0]);
    let allValues = data.map((d) => d[1]).flat();
    if (referenceLines && referenceLines.length > 0) {
      referenceLines.forEach((ref) => {
        if (ref.data && Array.isArray(ref.data)) {
          allValues = allValues.concat(ref.data);
        }
      });
    }

    let extentX = d3__namespace.extent(allValues, (d) => d[0]);
    let extentY = d3__namespace.extent(allValues, (d) => d[1]);
    let width = extentX[1] - extentX[0] + 1;
    let height = extentY[1] - extentY[0] + 1;
    let xinc = width / xPartitions;
    let yinc = height / yPartitions;
    let BVH = {
      width: width,
      height: height,
      xinc: xinc,
      yinc: yinc,
      offsetX: extentX[0],
      offsetY: extentY[0],
      keys: keys,
      BVH: [],
    };

    for (let i = 0; i < xPartitions; ++i) {
      BVH.BVH[i] = [];
      let currentX = i * xinc;
      for (let j = 0; j < yPartitions; ++j) {
        let currentY = yinc * j;
        BVH.BVH[i][j] = {
          x0: currentX,
          x1: currentX + xinc,
          y0: currentY,
          y1: currentY + yinc,
          data: new Map(),
          referenceLines: new Map(), //Map to store reference lines
        };
      }
    }
    // Move the data to start at coordinates [0,0]
    data = data.map(([k, v]) => [
      k,
      v.map(([x, y]) => [x - BVH.offsetX, y - BVH.offsetY]),
    ]);

    if (polylines) pupulateBVHPolylines(data, BVH, false);
    else populateBVHPoints(data, BVH, false);

    if (referenceLines != null) {
      populateBVHReferenceLines(referenceLines, BVH);
    }
    return BVH;
  }

  function pointIntersection(point, x0, y0, x1, y1) {
    let [px, py] = point;
    return px >= x0 && px <= x1 && py >= y0 && py <= y1;
  }

  //Calculate the intersection with the first vertical line of the box.
  function intersectX0(initPoint, finalPoint, x0, y0, x1, y1) {
    if (
      (initPoint[0] < x0 && finalPoint[0] < x0) ||
      (initPoint[0] > x0 && finalPoint[0] > x0)
    )
      return false;
    let dx = finalPoint[0] - initPoint[0];
    if (Math.abs(dx) < 1e-10) {
      return (
        initPoint[0] === x0 &&
        Math.max(initPoint[1], finalPoint[1]) >= y0 &&
        Math.min(initPoint[1], finalPoint[1]) <= y1
      );
    }
    let m = (finalPoint[1] - initPoint[1]) / dx;
    let y = m * (x0 - initPoint[0]) + initPoint[1];
    return y >= y0 && y <= y1;
  }

  function intersectX1(initPoint, finalPoint, x0, y0, x1, y1) {
    if (
      (initPoint[0] < x1 && finalPoint[0] < x1) ||
      (initPoint[0] > x1 && finalPoint[0] > x1)
    )
      return false;
    let dx = finalPoint[0] - initPoint[0];
    if (Math.abs(dx) < 1e-10) {
      return (
        initPoint[0] === x1 &&
        Math.max(initPoint[1], finalPoint[1]) >= y0 &&
        Math.min(initPoint[1], finalPoint[1]) <= y1
      );
    }
    let m = (finalPoint[1] - initPoint[1]) / dx;
    let y = m * (x1 - initPoint[0]) + initPoint[1];
    return y >= y0 && y <= y1;
  }

  function intersectY0(initPoint, finalPoint, x0, y0, x1, y1) {
    if (
      (initPoint[1] < y0 && finalPoint[1] < y0) ||
      (initPoint[1] > y0 && finalPoint[1] > y0)
    )
      return false;
    let dy = finalPoint[1] - initPoint[1];
    if (Math.abs(dy) < 1e-10) {
      return (
        initPoint[1] === y0 &&
        Math.max(initPoint[0], finalPoint[0]) > x0 &&
        Math.min(initPoint[0], finalPoint[0]) < x1
      );
    }
    let dx = finalPoint[0] - initPoint[0];
    if (Math.abs(dx) < 1e-10) {
      return initPoint[0] > x0 && initPoint[0] < x1;
    }
    let m = dy / dx;
    let x = (y0 - initPoint[1]) / m + initPoint[0];
    return x > x0 && x < x1;
  }

  function intersectY1(initPoint, finalPoint, x0, y0, x1, y1) {
    if (
      (initPoint[1] < y1 && finalPoint[1] < y1) ||
      (initPoint[1] > y1 && finalPoint[1] > y1)
    )
      return false;
    let dy = finalPoint[1] - initPoint[1];
    if (Math.abs(dy) < 1e-10) {
      return (
        initPoint[1] === y1 &&
        Math.max(initPoint[0], finalPoint[0]) > x0 &&
        Math.min(initPoint[0], finalPoint[0]) < x1
      );
    }
    let dx = finalPoint[0] - initPoint[0];
    if (Math.abs(dx) < 1e-10) {
      return initPoint[0] > x0 && initPoint[0] < x1;
    }
    let m = dy / dx;
    let x = (y1 - initPoint[1]) / m + initPoint[0];
    return x > x0 && x < x1;
  }

  function lineIntersection(line, x0, y0, x1, y1) {
    let initPoint = line[0];
    if (pointIntersection(initPoint, x0, y0, x1, y1)) return true;

    for (let index = 1; index < line.length; ++index) {
      let finalPoint = line[index];
      if (intersectX0(initPoint, finalPoint, x0, y0, x1, y1)) return true;
      if (intersectX1(initPoint, finalPoint, x0, y0, x1, y1)) return true;
      if (intersectY0(initPoint, finalPoint, x0, y0, x1)) return true;
      if (intersectY1(initPoint, finalPoint, x0, y0, x1, y1)) return true;
      if (pointIntersection(finalPoint, x0, y0, x1, y1)) return true;
      initPoint = finalPoint;
    }
    return false;
  }

  function containIntersection(line, x0, y0, x1, y1) {
    let initPoint = line[0];
    let finalPoint = line[line.length - 1];

    if (initPoint[0] < x0 && finalPoint[0] < x0) return undefined;
    if (initPoint[0] > x1 && finalPoint[0] > x1) return undefined;

    for (let index = 1; index < line.length; ++index) {
      let finalPoint = line[index];
      if (intersectY0(initPoint, finalPoint, x0, y0, x1)) return false;
      if (intersectY1(initPoint, finalPoint, x0, y0, x1, y1)) return false;
      initPoint = finalPoint;
    }

    return line[0][1] >= y0 && line[0][1] <= y1;
  }

  // Returns the range of cells that collide with the given box. The result is of the form [[InitI,EndI],[INiJ, EndJ]]]
  // bvhRef: optional explicit BVH object (used when called before the outer BVH variable is initialized)
  function getCollidingCells(x0, y0, x1, y1, bvhRef) {
    const b = bvhRef || BVH;
    if (x1 > b.width || y1 > b.height || x0 < 0 || y0 < 0)
      log();

    // Ensure that the coordinates are in the limits of the BVH
    x1 = Math.min(x1, b.width - 1);
    y1 = Math.min(y1, b.height - 1);
    x0 = Math.max(x0, 0);
    y0 = Math.max(y0, 0);

    let initI = Math.floor(x0 / b.xinc);
    let finI = Math.floor(x1 / b.xinc);
    let initJ = Math.floor(y0 / b.yinc);
    let finJ = Math.floor(y1 / b.yinc);
    return [
      [initI, finI],
      [initJ, finJ],
    ];
  }

  //
  function applyOffsets(x0, y0, x1, y1) {
    return [
      x0 - BVH.offsetX,
      y0 - BVH.offsetY,
      x1 - BVH.offsetX,
      y1 - BVH.offsetY,
    ];
  }

  // Returns all the polylines that satisfy the function "testFunc" for a complete polyline. The function testFunct must be as follows
  // TestFunc( Entity, x0, x1,y0,y1). Where entity is a polyline and return true, false or undefined if the result of the cuerrent entity dosent matter
  function testsEntitiesAll(x0, y0, x1, y1, testFunc) {
    [x0, y0, x1, y1] = applyOffsets(x0, y0, x1, y1);
    let [[initI, finI], [initJ, finJ]] = getCollidingCells(x0, y0, x1, y1);

    let contains = new Set();
    let notContains = new Set();

    for (let i = initI; i <= finI; ++i)
      for (let j = initJ; j <= finJ; ++j)
        for (const entities of BVH.BVH[i][j].data)
          if (!notContains.has(entities[0])) {
            for (const entity of entities[1]) {
              let intersect = testFunc(entity, x0, y0, x1, y1);
              if (intersect !== undefined) {
                if (intersect) {
                  contains.add(entities[0]);
                } else {
                  notContains.add(entities[0]);
                }
              }
            }
          }

    notContains.forEach((d) => contains.delete(d));

    return contains;
  }

  // Returns all the polylines that satisfy the function "testFunc" for any piece of polyline. The function testFunct must be as follows
  // TestFunc( Entity, x0, x1,y0,y1). Where entity is a polyline.
  function testsEntitiesAny(x0, y0, x1, y1, testFunc) {
    [x0, y0, x1, y1] = applyOffsets(x0, y0, x1, y1);
    let [[initI, finI], [initJ, finJ]] = getCollidingCells(x0, y0, x1, y1);

    let intersections = new Set();

    for (let i = initI; i <= finI; ++i)
      for (let j = initJ; j <= finJ; ++j)
        for (const entities of BVH.BVH[i][j].data)
          if (!intersections.has(entities[0]))
            for (const entity of entities[1]) {
              let intersect = testFunc(entity, x0, y0, x1, y1);
              if (intersect) {
                intersections.add(entities[0]);
                break;
              }
            }

    return intersections;
  }
  me.contains = function (x0, y0, x1, y1) {
    return testsEntitiesAll(x0, y0, x1, y1, containIntersection);
  };

  me.intersect = function (x0, y0, x1, y1) {
    return testsEntitiesAny(x0, y0, x1, y1, lineIntersection);
  };

  me.addReferenceCurves = function (curves) {
    populateBVHReferenceLines(curves, BVH);
  };

  me.getBvh = function () {
    return BVH;
  };

  me.removeReferenceCurves = function (ids) {
    if (!Array.isArray(ids)) ids = [ids];
    if (!BVH) return;

    if (Array.isArray(BVH.referenceLines)) {
      BVH.referenceLines = BVH.referenceLines.filter(
        (r) => !ids.includes(r.id)
      );
    }

    if (Array.isArray(BVH.BVH)) {
      for (const row of BVH.BVH) {
        for (const cell of row) {
          if (cell && cell.referenceLines) {
            for (const id of ids) cell.referenceLines.delete(id);
          }
        }
      }
    }

    RCIntersection(BVH);
  };

  return me;
}

function renderHtml(string) {
  const template = document.createElement("template");
  template.innerHTML = string;
  return document.importNode(template.content, true);
}

function renderSvg(string) {
  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.innerHTML = string;
  return g;
}

const html = Object.assign(hypertext(renderHtml, fragment => {
  if (fragment.firstChild === null) return null;
  if (fragment.firstChild === fragment.lastChild) return fragment.removeChild(fragment.firstChild);
  const span = document.createElement("span");
  span.appendChild(fragment);
  return span;
}), {fragment: hypertext(renderHtml, fragment => fragment)});

Object.assign(hypertext(renderSvg, g => {
  if (g.firstChild === null) return null;
  if (g.firstChild === g.lastChild) return g.removeChild(g.firstChild);
  return g;
}), {fragment: hypertext(renderSvg, g => {
  const fragment = document.createDocumentFragment();
  while (g.firstChild) fragment.appendChild(g.firstChild);
  return fragment;
})});

const
CODE_TAB = 9,
CODE_LF = 10,
CODE_FF = 12,
CODE_CR = 13,
CODE_SPACE = 32,
CODE_UPPER_A = 65,
CODE_UPPER_Z = 90,
CODE_LOWER_A = 97,
CODE_LOWER_Z = 122,
CODE_LT = 60,
CODE_GT = 62,
CODE_SLASH = 47,
CODE_DASH = 45,
CODE_BANG = 33,
CODE_EQ = 61,
CODE_DQUOTE = 34,
CODE_SQUOTE = 39,
CODE_QUESTION = 63,
STATE_DATA = 1,
STATE_TAG_OPEN = 2,
STATE_END_TAG_OPEN = 3,
STATE_TAG_NAME = 4,
STATE_BOGUS_COMMENT = 5,
STATE_BEFORE_ATTRIBUTE_NAME = 6,
STATE_AFTER_ATTRIBUTE_NAME = 7,
STATE_ATTRIBUTE_NAME = 8,
STATE_BEFORE_ATTRIBUTE_VALUE = 9,
STATE_ATTRIBUTE_VALUE_DOUBLE_QUOTED = 10,
STATE_ATTRIBUTE_VALUE_SINGLE_QUOTED = 11,
STATE_ATTRIBUTE_VALUE_UNQUOTED = 12,
STATE_AFTER_ATTRIBUTE_VALUE_QUOTED = 13,
STATE_SELF_CLOSING_START_TAG = 14,
STATE_COMMENT_START = 15,
STATE_COMMENT_START_DASH = 16,
STATE_COMMENT = 17,
STATE_COMMENT_LESS_THAN_SIGN = 18,
STATE_COMMENT_LESS_THAN_SIGN_BANG = 19,
STATE_COMMENT_LESS_THAN_SIGN_BANG_DASH = 20,
STATE_COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH = 21,
STATE_COMMENT_END_DASH = 22,
STATE_COMMENT_END = 23,
STATE_COMMENT_END_BANG = 24,
STATE_MARKUP_DECLARATION_OPEN = 25,
STATE_RAWTEXT = 26,
STATE_RAWTEXT_LESS_THAN_SIGN = 27,
STATE_RAWTEXT_END_TAG_OPEN = 28,
STATE_RAWTEXT_END_TAG_NAME = 29,
SHOW_COMMENT = 128,
SHOW_ELEMENT = 1,
TYPE_COMMENT = 8,
TYPE_ELEMENT = 1,
NS_SVG = "http://www.w3.org/2000/svg",
NS_XLINK = "http://www.w3.org/1999/xlink",
NS_XML = "http://www.w3.org/XML/1998/namespace",
NS_XMLNS = "http://www.w3.org/2000/xmlns/";

const svgAdjustAttributes = new Map([
  "attributeName",
  "attributeType",
  "baseFrequency",
  "baseProfile",
  "calcMode",
  "clipPathUnits",
  "diffuseConstant",
  "edgeMode",
  "filterUnits",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "kernelMatrix",
  "kernelUnitLength",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "limitingConeAngle",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "maskContentUnits",
  "maskUnits",
  "numOctaves",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "refX",
  "refY",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "specularConstant",
  "specularExponent",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stitchTiles",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textLength",
  "viewBox",
  "viewTarget",
  "xChannelSelector",
  "yChannelSelector",
  "zoomAndPan"
].map(name => [name.toLowerCase(), name]));

const svgForeignAttributes = new Map([
  ["xlink:actuate", NS_XLINK],
  ["xlink:arcrole", NS_XLINK],
  ["xlink:href", NS_XLINK],
  ["xlink:role", NS_XLINK],
  ["xlink:show", NS_XLINK],
  ["xlink:title", NS_XLINK],
  ["xlink:type", NS_XLINK],
  ["xml:lang", NS_XML],
  ["xml:space", NS_XML],
  ["xmlns", NS_XMLNS],
  ["xmlns:xlink", NS_XMLNS]
]);

function hypertext(render, postprocess) {
  return function({raw: strings}) {
    let state = STATE_DATA;
    let string = "";
    let tagNameStart; // either an open tag or an end tag
    let tagName; // only open; beware nesting! used only for rawtext
    let attributeNameStart;
    let attributeNameEnd;
    let nodeFilter = 0;

    for (let j = 0, m = arguments.length; j < m; ++j) {
      const input = strings[j];

      if (j > 0) {
        const value = arguments[j];
        switch (state) {
          case STATE_RAWTEXT: {
            if (value != null) {
              const text = `${value}`;
              if (isEscapableRawText(tagName)) {
                string += text.replace(/[<]/g, entity);
              } else if (new RegExp(`</${tagName}[\\s>/]`, "i").test(string.slice(-tagName.length - 2) + text)) {
                throw new Error("unsafe raw text"); // appropriate end tag
              } else {
                string += text;
              }
            }
            break;
          }
          case STATE_DATA: {
            if (value == null) ; else if (value instanceof Node
                || (typeof value !== "string" && value[Symbol.iterator])
                || (/(?:^|>)$/.test(strings[j - 1]) && /^(?:<|$)/.test(input))) {
              string += "<!--::" + j + "-->";
              nodeFilter |= SHOW_COMMENT;
            } else {
              string += `${value}`.replace(/[<&]/g, entity);
            }
            break;
          }
          case STATE_BEFORE_ATTRIBUTE_VALUE: {
            state = STATE_ATTRIBUTE_VALUE_UNQUOTED;
            let text;
            if (/^[\s>]/.test(input)) {
              if (value == null || value === false) {
                string = string.slice(0, attributeNameStart - strings[j - 1].length);
                break;
              }
              if (value === true || (text = `${value}`) === "") {
                string += "''";
                break;
              }
              const name = strings[j - 1].slice(attributeNameStart, attributeNameEnd);
              if ((name === "style" && isObjectLiteral(value)) || typeof value === "function") {
                string += "::" + j;
                nodeFilter |= SHOW_ELEMENT;
                break;
              }
            }
            if (text === undefined) text = `${value}`;
            if (text === "") throw new Error("unsafe unquoted empty string");
            string += text.replace(/^['"]|[\s>&]/g, entity);
            break;
          }
          case STATE_ATTRIBUTE_VALUE_UNQUOTED: {
            string += `${value}`.replace(/[\s>&]/g, entity);
            break;
          }
          case STATE_ATTRIBUTE_VALUE_SINGLE_QUOTED: {
            string += `${value}`.replace(/['&]/g, entity);
            break;
          }
          case STATE_ATTRIBUTE_VALUE_DOUBLE_QUOTED: {
            string += `${value}`.replace(/["&]/g, entity);
            break;
          }
          case STATE_BEFORE_ATTRIBUTE_NAME: {
            if (isObjectLiteral(value)) {
              string += "::" + j + "=''";
              nodeFilter |= SHOW_ELEMENT;
              break;
            }
            throw new Error("invalid binding");
          }
          case STATE_COMMENT: break;
          default: throw new Error("invalid binding");
        }
      }

      for (let i = 0, n = input.length; i < n; ++i) {
        const code = input.charCodeAt(i);

        switch (state) {
          case STATE_DATA: {
            if (code === CODE_LT) {
              state = STATE_TAG_OPEN;
            }
            break;
          }
          case STATE_TAG_OPEN: {
            if (code === CODE_BANG) {
              state = STATE_MARKUP_DECLARATION_OPEN;
            } else if (code === CODE_SLASH) {
              state = STATE_END_TAG_OPEN;
            } else if (isAsciiAlphaCode(code)) {
              tagNameStart = i, tagName = undefined;
              state = STATE_TAG_NAME, --i;
            } else if (code === CODE_QUESTION) {
              state = STATE_BOGUS_COMMENT, --i;
            } else {
              state = STATE_DATA, --i;
            }
            break;
          }
          case STATE_END_TAG_OPEN: {
            if (isAsciiAlphaCode(code)) {
              state = STATE_TAG_NAME, --i;
            } else if (code === CODE_GT) {
              state = STATE_DATA;
            } else {
              state = STATE_BOGUS_COMMENT, --i;
            }
            break;
          }
          case STATE_TAG_NAME: {
            if (isSpaceCode(code)) {
              state = STATE_BEFORE_ATTRIBUTE_NAME;
              tagName = lower(input, tagNameStart, i);
            } else if (code === CODE_SLASH) {
              state = STATE_SELF_CLOSING_START_TAG;
            } else if (code === CODE_GT) {
              tagName = lower(input, tagNameStart, i);
              state = isRawText(tagName) ? STATE_RAWTEXT : STATE_DATA;
            }
            break;
          }
          case STATE_BEFORE_ATTRIBUTE_NAME: {
            if (isSpaceCode(code)) ; else if (code === CODE_SLASH || code === CODE_GT) {
              state = STATE_AFTER_ATTRIBUTE_NAME, --i;
            } else if (code === CODE_EQ) {
              state = STATE_ATTRIBUTE_NAME;
              attributeNameStart = i + 1, attributeNameEnd = undefined;
            } else {
              state = STATE_ATTRIBUTE_NAME, --i;
              attributeNameStart = i + 1, attributeNameEnd = undefined;
            }
            break;
          }
          case STATE_ATTRIBUTE_NAME: {
            if (isSpaceCode(code) || code === CODE_SLASH || code === CODE_GT) {
              state = STATE_AFTER_ATTRIBUTE_NAME, --i;
              attributeNameEnd = i;
            } else if (code === CODE_EQ) {
              state = STATE_BEFORE_ATTRIBUTE_VALUE;
              attributeNameEnd = i;
            }
            break;
          }
          case STATE_AFTER_ATTRIBUTE_NAME: {
            if (isSpaceCode(code)) ; else if (code === CODE_SLASH) {
              state = STATE_SELF_CLOSING_START_TAG;
            } else if (code === CODE_EQ) {
              state = STATE_BEFORE_ATTRIBUTE_VALUE;
            } else if (code === CODE_GT) {
              state = isRawText(tagName) ? STATE_RAWTEXT : STATE_DATA;
            } else {
              state = STATE_ATTRIBUTE_NAME, --i;
              attributeNameStart = i + 1, attributeNameEnd = undefined;
            }
            break;
          }
          case STATE_BEFORE_ATTRIBUTE_VALUE: {
            if (isSpaceCode(code)) ; else if (code === CODE_DQUOTE) {
              state = STATE_ATTRIBUTE_VALUE_DOUBLE_QUOTED;
            } else if (code === CODE_SQUOTE) {
              state = STATE_ATTRIBUTE_VALUE_SINGLE_QUOTED;
            } else if (code === CODE_GT) {
              state = isRawText(tagName) ? STATE_RAWTEXT : STATE_DATA;
            } else {
              state = STATE_ATTRIBUTE_VALUE_UNQUOTED, --i;
            }
            break;
          }
          case STATE_ATTRIBUTE_VALUE_DOUBLE_QUOTED: {
            if (code === CODE_DQUOTE) {
              state = STATE_AFTER_ATTRIBUTE_VALUE_QUOTED;
            }
            break;
          }
          case STATE_ATTRIBUTE_VALUE_SINGLE_QUOTED: {
            if (code === CODE_SQUOTE) {
              state = STATE_AFTER_ATTRIBUTE_VALUE_QUOTED;
            }
            break;
          }
          case STATE_ATTRIBUTE_VALUE_UNQUOTED: {
            if (isSpaceCode(code)) {
              state = STATE_BEFORE_ATTRIBUTE_NAME;
            } else if (code === CODE_GT) {
              state = isRawText(tagName) ? STATE_RAWTEXT : STATE_DATA;
            }
            break;
          }
          case STATE_AFTER_ATTRIBUTE_VALUE_QUOTED: {
            if (isSpaceCode(code)) {
              state = STATE_BEFORE_ATTRIBUTE_NAME;
            } else if (code === CODE_SLASH) {
              state = STATE_SELF_CLOSING_START_TAG;
            } else if (code === CODE_GT) {
              state = isRawText(tagName) ? STATE_RAWTEXT : STATE_DATA;
            } else {
              state = STATE_BEFORE_ATTRIBUTE_NAME, --i;
            }
            break;
          }
          case STATE_SELF_CLOSING_START_TAG: {
            if (code === CODE_GT) {
              state = STATE_DATA;
            } else {
              state = STATE_BEFORE_ATTRIBUTE_NAME, --i;
            }
            break;
          }
          case STATE_BOGUS_COMMENT: {
            if (code === CODE_GT) {
              state = STATE_DATA;
            }
            break;
          }
          case STATE_COMMENT_START: {
            if (code === CODE_DASH) {
              state = STATE_COMMENT_START_DASH;
            } else if (code === CODE_GT) {
              state = STATE_DATA;
            } else {
              state = STATE_COMMENT, --i;
            }
            break;
          }
          case STATE_COMMENT_START_DASH: {
            if (code === CODE_DASH) {
              state = STATE_COMMENT_END;
            } else if (code === CODE_GT) {
              state = STATE_DATA;
            } else {
              state = STATE_COMMENT, --i;
            }
            break;
          }
          case STATE_COMMENT: {
            if (code === CODE_LT) {
              state = STATE_COMMENT_LESS_THAN_SIGN;
            } else if (code === CODE_DASH) {
              state = STATE_COMMENT_END_DASH;
            }
            break;
          }
          case STATE_COMMENT_LESS_THAN_SIGN: {
            if (code === CODE_BANG) {
              state = STATE_COMMENT_LESS_THAN_SIGN_BANG;
            } else if (code !== CODE_LT) {
              state = STATE_COMMENT, --i;
            }
            break;
          }
          case STATE_COMMENT_LESS_THAN_SIGN_BANG: {
            if (code === CODE_DASH) {
              state = STATE_COMMENT_LESS_THAN_SIGN_BANG_DASH;
            } else {
              state = STATE_COMMENT, --i;
            }
            break;
          }
          case STATE_COMMENT_LESS_THAN_SIGN_BANG_DASH: {
            if (code === CODE_DASH) {
              state = STATE_COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH;
            } else {
              state = STATE_COMMENT_END, --i;
            }
            break;
          }
          case STATE_COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH: {
            state = STATE_COMMENT_END, --i;
            break;
          }
          case STATE_COMMENT_END_DASH: {
            if (code === CODE_DASH) {
              state = STATE_COMMENT_END;
            } else {
              state = STATE_COMMENT, --i;
            }
            break;
          }
          case STATE_COMMENT_END: {
            if (code === CODE_GT) {
              state = STATE_DATA;
            } else if (code === CODE_BANG) {
              state = STATE_COMMENT_END_BANG;
            } else if (code !== CODE_DASH) {
              state = STATE_COMMENT, --i;
            }
            break;
          }
          case STATE_COMMENT_END_BANG: {
            if (code === CODE_DASH) {
              state = STATE_COMMENT_END_DASH;
            } else if (code === CODE_GT) {
              state = STATE_DATA;
            } else {
              state = STATE_COMMENT, --i;
            }
            break;
          }
          case STATE_MARKUP_DECLARATION_OPEN: {
            if (code === CODE_DASH && input.charCodeAt(i + 1) === CODE_DASH) {
              state = STATE_COMMENT_START, ++i;
            } else { // Note: CDATA and DOCTYPE unsupported!
              state = STATE_BOGUS_COMMENT, --i;
            }
            break;
          }
          case STATE_RAWTEXT: {
            if (code === CODE_LT) {
              state = STATE_RAWTEXT_LESS_THAN_SIGN;
            }
            break;
          }
          case STATE_RAWTEXT_LESS_THAN_SIGN: {
            if (code === CODE_SLASH) {
              state = STATE_RAWTEXT_END_TAG_OPEN;
            } else {
              state = STATE_RAWTEXT, --i;
            }
            break;
          }
          case STATE_RAWTEXT_END_TAG_OPEN: {
            if (isAsciiAlphaCode(code)) {
              tagNameStart = i;
              state = STATE_RAWTEXT_END_TAG_NAME, --i;
            } else {
              state = STATE_RAWTEXT, --i;
            }
            break;
          }
          case STATE_RAWTEXT_END_TAG_NAME: {
            if (isSpaceCode(code) && tagName === lower(input, tagNameStart, i)) {
              state = STATE_BEFORE_ATTRIBUTE_NAME;
            } else if (code === CODE_SLASH && tagName === lower(input, tagNameStart, i)) {
              state = STATE_SELF_CLOSING_START_TAG;
            } else if (code === CODE_GT && tagName === lower(input, tagNameStart, i)) {
              state = STATE_DATA;
            } else if (!isAsciiAlphaCode(code)) {
              state = STATE_RAWTEXT, --i;
            }
            break;
          }
          default: {
            state = undefined;
            break;
          }
        }
      }

      string += input;
    }

    const root = render(string);

    const walker = document.createTreeWalker(root, nodeFilter, null, false);
    const removeNodes = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      switch (node.nodeType) {
        case TYPE_ELEMENT: {
          const attributes = node.attributes;
          for (let i = 0, n = attributes.length; i < n; ++i) {
            const {name, value: currentValue} = attributes[i];
            if (/^::/.test(name)) {
              const value = arguments[+name.slice(2)];
              removeAttribute(node, name), --i, --n;
              for (const key in value) {
                const subvalue = value[key];
                if (subvalue == null || subvalue === false) ; else if (typeof subvalue === "function") {
                  node[key] = subvalue;
                } else if (key === "style" && isObjectLiteral(subvalue)) {
                  setStyles(node[key], subvalue);
                } else {
                  setAttribute(node, key, subvalue === true ? "" : subvalue);
                }
              }
            } else if (/^::/.test(currentValue)) {
              const value = arguments[+currentValue.slice(2)];
              removeAttribute(node, name), --i, --n;
              if (typeof value === "function") {
                node[name] = value;
              } else { // style
                setStyles(node[name], value);
              }
            }
          }
          break;
        }
        case TYPE_COMMENT: {
          if (/^::/.test(node.data)) {
            const parent = node.parentNode;
            const value = arguments[+node.data.slice(2)];
            if (value instanceof Node) {
              parent.insertBefore(value, node);
            } else if (typeof value !== "string" && value[Symbol.iterator]) {
              if (value instanceof NodeList || value instanceof HTMLCollection) {
                for (let i = value.length - 1, r = node; i >= 0; --i) {
                  r = parent.insertBefore(value[i], r);
                }
              } else {
                for (const subvalue of value) {
                  if (subvalue == null) continue;
                  parent.insertBefore(subvalue instanceof Node ? subvalue : document.createTextNode(subvalue), node);
                }
              }
            } else {
              parent.insertBefore(document.createTextNode(value), node);
            }
            removeNodes.push(node);
          }
          break;
        }
      }
    }

    for (const node of removeNodes) {
      node.parentNode.removeChild(node);
    }

    return postprocess(root);
  };
}

function entity(character) {
  return `&#${character.charCodeAt(0).toString()};`;
}

function isAsciiAlphaCode(code) {
  return (CODE_UPPER_A <= code && code <= CODE_UPPER_Z)
      || (CODE_LOWER_A <= code && code <= CODE_LOWER_Z);
}

function isSpaceCode(code) {
  return code === CODE_TAB
      || code === CODE_LF
      || code === CODE_FF
      || code === CODE_SPACE
      || code === CODE_CR; // normalize newlines
}

function isObjectLiteral(value) {
  return value && value.toString === Object.prototype.toString;
}

function isRawText(tagName) {
  return tagName === "script" || tagName === "style" || isEscapableRawText(tagName);
}

function isEscapableRawText(tagName) {
  return tagName === "textarea" || tagName === "title";
}

function lower(input, start, end) {
  return input.slice(start, end).toLowerCase();
}

function setAttribute(node, name, value) {
  if (node.namespaceURI === NS_SVG) {
    name = name.toLowerCase();
    name = svgAdjustAttributes.get(name) || name;
    if (svgForeignAttributes.has(name)) {
      node.setAttributeNS(svgForeignAttributes.get(name), name, value);
      return;
    }
  }
  node.setAttribute(name, value);
}

function removeAttribute(node, name) {
  if (node.namespaceURI === NS_SVG) {
    name = name.toLowerCase();
    name = svgAdjustAttributes.get(name) || name;
    if (svgForeignAttributes.has(name)) {
      node.removeAttributeNS(svgForeignAttributes.get(name), name);
      return;
    }
  }
  node.removeAttribute(name);
}

// We can’t use Object.assign because custom properties…
function setStyles(style, values) {
  for (const name in values) {
    const value = values[name];
    if (name.startsWith("--")) style.setProperty(name, value);
    else style[name] = value;
  }
}

function BrushTooltipEditable({
  fmtX,
  fmtY,
  target,
  margin = { top: 0, left: 0 },
  callback = () => {},
}) {
  const x0E = html`<input class="x0" contenteditable="true"></input>`;
  const y0E = html`<input class="y0" contenteditable="true"></input>`;
  const x1E = html`<input class="x1" contenteditable="true"></input>`;
  const y1E = html`<input class="y1" contenteditable="true"></input>`;

  // https://stackoverflow.com/questions/3392493/adjust-width-of-input-field-to-its-input
  const adjustInputWidth = (input) => {
    input.addEventListener("input", resizeInput); // bind the "resizeInput" callback on "input" event
    resizeInput.call(input); // immediately call the function

    function resizeInput() {
      this.style.width = this.value.length + 1 + "ch";
    }
  };

  const resizeInputs = () => [x0E, y0E, x1E, y1E].map(adjustInputWidth);

  const btnChange0E = html`<button>✅</button>`;
  const btnChange1E = html`<button>✅</button>`;

  const fromE = html`<div style="position: absolute; top:0; left:0;">
    <div style="display:flex; position: absolute; bottom: 0px; right: 0px;">
      ${x0E}<strong> x </strong>${y0E} ${btnChange0E}
    </div>
  </div>`;
  const toE = html`<div style="position: absolute; display:flex;">${x1E}<strong> x </strong>${y1E} ${btnChange1E}</div>`;

  const brushTooltip = html`<div class="__ts_tooltip" style="display: none; z-index:2; position: absolute; top: ${margin.top}px; left: ${margin.left}px;">
    <style>
    div.__ts_tooltip { 
      font-family: sans-serif; font-size: 10pt; 
    }
    div.__ts_tooltip > div > div * { 
      margin-right: 1px;
    }
    div.__ts_tooltip div > button {
      padding: 0px;
      display: none;
    }
    div.__ts_tooltip div:hover > button {
      padding: 0px;
      display: block;
    }
    div.__ts_tooltip input {
      background-color:rgba(255, 255, 255, 0);    
      border: none;
      outline: none;
    }
    div.__ts_tooltip input:focus {
        border: solid #aaa;
    }


    </style>
    <div>${fromE}</div>
    <div>${toE}</div>

  </div>`;

  // x0E.oninput = (evt) => evt.preventDefault();
  // x1E.oninput = (evt) => evt.preventDefault();
  // y0E.oninput = (evt) => evt.preventDefault();
  // y1E.oninput = (evt) => evt.preventDefault();

  brushTooltip.__update = ({ selection, selectionPixels }) => {
    brushTooltip.style.display = "block";
    x0E.value = fmtX(selection[0][0]);
    x1E.value = fmtX(selection[1][0]);
    y0E.value = fmtY(selection[0][1]);
    y1E.value = fmtY(selection[1][1]);

    resizeInputs();

    fromE.style.top = selectionPixels[0][1] + "px";
    fromE.style.left = selectionPixels[0][0] + "px";
    toE.style.top = selectionPixels[1][1] + "px";
    toE.style.left = selectionPixels[1][0] + "px";
  };

  brushTooltip.__hide = () => (brushTooltip.style.display = "none");

  // brushTooltip.oninput = (evt) => evt.preventDefault();

  function triggerUpdate() {
    brushTooltip.value = [
      [x0E.value, y0E.value],
      [x1E.value, y1E.value],
    ];
    brushTooltip.dispatchEvent(new Event("input", { bubbles: true }));

    callback(brushTooltip.value);
  }

  btnChange0E.addEventListener("click", triggerUpdate);
  btnChange1E.addEventListener("click", triggerUpdate);

  let tooltipNode = target.getElementsByClassName("__ts_tooltip");
  if (tooltipNode.length > 0) target.removeChild(tooltipNode[0]);
  target.appendChild(brushTooltip);

  //triggerUpdate();
  resizeInputs();

  return brushTooltip;
}

function BrushContextMenu({ target, callback }) {
  const intersectE = html`<input type="radio" name="mode" id="__ts_c_intersect" value="intersect">`;
  const containsE = html`<input type="radio" name="mode" id="__ts_c_contains" value="contains">`;
  const notE = html`<input type="checkbox"  id="__ts_c_not">`;
  const andE = html`<input type="radio" name="aggregation" id="__ts_c_and" value="and">`;
  const orE = html`<input type="radio" name="aggregation" id="__ts_c_or" value="or">`;
  const closeBtn = html`<button style="position: absolute; right: 0; top: 0; padding: 0; margin: 0; border: none; background: none; cursor: pointer; font-size: 0.8rem; color: #444; line-height: 1; padding: 2px 2px;">&times;</button>`;

  intersectE.onchange = onChange;
  containsE.onchange = onChange;
  andE.onchange = onChange;
  orE.onchange = onChange;
  notE.onchange = onChange;

  let _brush;

  let contextMenu = html`<div class="__ts_contextMenu" style="display: none; z-index: 2; position: absolute" >
        ${closeBtn}
      
        <div class="__ts_option_label"><strong>Mode</strong></div>
        <div class="__ts_option_values">
          <div>
            ${intersectE}
            <label for="__ts_c_intersect" title="Search for timelines that touch any part of the timebox">Intersect</label>
          </div>
          <div>
            ${containsE}
            <label for="__ts_c_contains" title="Search for timelines that are fully contained in the timebox">Contains</label>
          </div>
          <div>
            ${notE}
            <label for="__ts_c_not" title=" ">Not</label>
          </div>
        </div>
      

      
        <div class="__ts_option_label"><strong>Aggregation</strong></div>
        <div class="__ts_option_values">
          <div>
            ${andE}
            <label for="__ts_c_and">And</label>
          </div>
          <div>
            ${orE}
            <label for="__ts_c_or">Or</label>
          </div>
        </div>
      
      

      <style> 
        .__ts_contextMenu { 
            border-radius: 3px;
            padding: 4px 14px 4px 4px;
            position: absolute; 
            width: max-content;
            background: #f6f6f6;
            opacity: 0.9;
            border: 1px solid #ccc; 
            font-family: sans-serif;
            font-size: 0.8rem;
            grid-template-columns: 1fr auto;
            grid-row-gap: 7px;
            box-shadow: 2px 2px 1px 0px #888888;
        }         

        .__ts_contextMenu  .__ts_option_values:hover { 
            background: #eee; 
        } 

        .__ts_contextMenu input[type="radio"] {
          margin-top: -1px;
          vertical-align: middle;
        }
      </style> 
    </div>`;

  target.appendChild(contextMenu);

  // To keep track of the hiding timeout
  let toHide = null;
  // If the mouse leaves the context menu, hide it after 1s
  contextMenu.onmouseleave = () =>
    (toHide = setTimeout(() => {
      contextMenu.__hide();
      toHide = null;
    }, 1000));
  // But if the mouse re-enters the context menu, cancel the hiding
  contextMenu.onmouseenter = () => {
    toHide && clearTimeout(toHide);
    toHide = null;
  };
  closeBtn.onclick = () => contextMenu.__hide();

  function onChange() {
    let brushMode = intersectE.checked
      ? BrushModes.Intersect
      : BrushModes.Contains;
    let brushAggregation = andE.checked
      ? BrushAggregation.And
      : BrushAggregation.Or;
    let brushNot = notE.checked;
    callback(brushMode, brushAggregation, brushNot, _brush);
  }

  contextMenu.__hide = () => (contextMenu.style.display = "none");
  contextMenu.__show = (mode, aggregation,not, pxX, pxY, brush) => {
    _brush = brush;
    switch (mode) {
      case BrushModes.Intersect:
        intersectE.checked = true;
        break;
      case BrushModes.Contains:
        containsE.checked = true;
        break;
      default:
        intersectE.checked = true;
        log();
    }

    notE.checked = not;

    switch (aggregation) {
      case BrushAggregation.And:
        andE.checked = true;
        break;
      case BrushAggregation.Or:
        orE.checked = true;
        break;
      default:
        andE.checked = true;
        log();
    }

    contextMenu.style.display = "grid";
    contextMenu.style.left = pxX + "px";
    contextMenu.style.top = pxY + "px";
  };

  return contextMenu;
}

function brushInteraction({
  ts,
  data,
  element,
  extent = undefined, //Defines the area in which the brush can move ([[[x0, y0], [x1, y1]])
  tooltipTarget,
  contextMenuTarget,
  xPartitions,
  yPartitions,
  x,
  y,
  scaleX,
  scaleY,
  fmtX,
  fmtY,
  updateTime,
  brushShadow,
  minBrushSize = 5, // Min size in pixels of brushes
  selectionCallback = () => {}, // (dataSelected, dataNotSelected, hasSelection) => {} Called when selected elements change
  groupsCallback = () => {}, // (groups) => {} Called when information of the groups changes (not the selection made by them)
  changeSelectedCoordinatesCallback = () => {}, // (selection) => {} Called when the coordinates of the selected brush change.
  selectedBrushCallback = () => {}, // (brush) => {} Called when the selected Brush changes.
  statusCallback = () => {}, // (status) => {}
  referenceCurves,
  getProbePairBoxes,
  getSliders,
  getYAtX,
  printSlidersCallback = () => {},
}) {
  let me = {},
    brushSize,
    brushesGroup,
    brushCount = 0,
    gBrushes,
    tBrushed,
    tUpdateSelection,
    tShowTooltip,
    tSelectionCall,
    brushGroupSelected,
    selectedBrush,
    dataSelected,
    dataNotSelected,
    BVH_,
    brushTooltip,
    brushContextMenu,
    suppress = false,
    brushWithTooltip;
    const dataMap = new Map(data.map(d => [d[0], d]));
    if (!data) return;
    me.getSliders = getSliders;
    gBrushes = d3__namespace.select(element);
    gBrushes.node().innerHTML = "";
    tBrushed = throttle(updateTime, brushed);
    tUpdateSelection = throttle(updateTime, updateSelection);
    tShowTooltip = throttle(50, showBrushTooltip);
    tSelectionCall = throttle(50, updateSelectedCoordinates);

  dataSelected = new Map();
  dataNotSelected = [];
  brushesGroup = new Map();
  brushCount = 0;
  brushSize = 0;
  const unclampedScaleY = scaleY.copy().clamp(false);

  let BVHData = data.map((d) => {
    let polyline = d[1].map((d) => [scaleX(x(d)), scaleY(y(d))]);
    return [d[0], polyline];
  });

   let curves = referenceCurves || [];
  let BVHReferenceLines = curves
    ? curves.map((ref) => {
        let scaledData = ref.data.map((pt) => {
          return [scaleX(pt[0]), scaleY(pt[1])];
        });

        return Object.assign({}, ref, { data: scaledData });
      })
    : null;

  BVH_ = BVH({
    data: BVHData,
    xPartitions,
    yPartitions,
    referenceLines: BVHReferenceLines,
    scaleY: unclampedScaleY, 
  });
  

  brushTooltip = BrushTooltipEditable({
    fmtX,
    fmtY,
    target: tooltipTarget,
    margin: { top: ts.margin.top, left: ts.margin.left },
    callback: onTooltipChange,
  });

  brushContextMenu = BrushContextMenu({
    target: contextMenuTarget,
    callback: onContextMenuChange,
  });
  function onTooltipChange([[x0, y0], [x1, y1]]) {
    y0 = +y0;
    y1 = +y1;
    if (isNaN(+x0)) {
      let timeParse = d3__namespace.timeParse(fmtX);
      x0 = timeParse(x0);
      x1 = timeParse(x1);
    } else {
      x0 = +x0;
      x1 = +x1;
    }
    me.moveBrush(brushWithTooltip, [
      [x0, y0],
      [x1, y1],
    ]);
  }

  function onContextMenuChange(mode, aggregation, not, entity) {
    if (Array.isArray(entity) && entity.length === 2) {
      const brush = entity;
      brush[1].mode = mode;
      brush[1].aggregation = aggregation;
      brush[1].negate = not;
      updateBrush(brush);
      brushFilter();
      drawBrushes();
    } else if (entity && entity.rcId !== undefined) {
      const slider = entity;
      slider.mode = mode;
      slider.aggregation = aggregation;
      slider.negate = not;
      brushFilter();
      printSlidersCallback();
    }
  }

  const onBrushStart = (e, brushObject) => {
    log();
    if (!brushObject || !brushObject.length) {
      // TODO
      log();
      return;
    }

    // if (!brushObject[1].selection) {
    //   log("👁️ brushStart, selection is null, not doing anything ");
    //   return;
    // }
    const [id, brush] = brushObject;

    // call when the user starts interacting with a timeBox
    // If the user is creating a new TimeBox, modify the group to which the timeBox belongs.
    if (id === brushCount - 1) {
      brushSize++;
      changeBrushOfGroup([id, brush], brushGroupSelected);
      brushesGroup.get(brushGroupSelected).isEnable = true;
      selectedBrush = [id, brush];
      selectedBrushCallback(selectedBrush);
      drawBrushes();
    }
    if (ts.autoUpdate) {
      tBrushed(e, [id, brush]);
    }
  };

  function onBrushEnd({ selection, sourceEvent }, brush) {
    if (sourceEvent === undefined) return;
    if (selection) {
      let [[x0, y0], [x1, y1]] = selection;
      if (
        Math.abs(x0 - x1) < minBrushSize &&
        Math.abs(y0 - y1) < minBrushSize
      ) {
        // Remove brush smaller than 5px
        removeBrush(brush);
      } else if (!ts.autoUpdate) {
        // update manually if not autoupdate with brushed event.
        if (brush[1].isSelected) {
          updateSelection();
        } else {
          brushed({ selection, sourceEvent }, brush);
        }
      }
    } else {
      removeBrush(brush);
    }
    if (brush[0] === brushCount - 1) newBrush(); // If the user has just created a new TimeBox, prepare the next one so that it can be created.

    drawBrushes();
  }

  // Call newBrush with an initial Selection to create the brush on initial selection
  function newBrush(
    mode = BrushModes.Intersect,
    aggregation = BrushAggregation.And,
    brushGroup = brushGroupSelected,
    brushinitialSelection = undefined
  ) {
    // Create the brush
    let brush = d3__namespace.brush().on("start", onBrushStart);

    // Add the new brush to the group
    brushesGroup
      .get(brushGroup)
      .brushes.set(
        brushCount,
        generateBrush(
          brush,
          mode,
          aggregation,
          brushGroup,
          null,
          null,
          brushinitialSelection
        )
      );
    let brushObject = [
      brushCount,
      brushesGroup.get(brushGroupSelected).brushes.get(brushCount),
    ];
    // Set events for Brush
    brush.on("brush.move", moveSelectedBrushes);
    brush.on("brush.Selected", tSelectionCall);
    if (ts.autoUpdate) {
      // Update brushSelection only if autoUpdate
      brush.on("brush.brushed", tBrushed);
    }
    if (ts.showBrushTooltip) {
      brush.on("brush.show", (event) => tShowTooltip(event, brushObject));
    }
    brush.on("end", onBrushEnd);
    if (extent) brush.extent(extent);

    brushCount++;
  }

  function getSelectionDomain(selection) {
    return selection.map(([x, y]) => [scaleX.invert(x), scaleY.invert(y)]);
  }

  // Update brush intersections when moved
  function brushed({ selection, sourceEvent }, brush) {
    //log("brushed", brush, arguments);
    if (!brush[1]) {
      // TODO
      log();
      return;
    }

    // dont execute this method when move brushes programmatically (sourceEvent === null) or when there is no selection
    if (sourceEvent === undefined || !selection) return;
    //log("brushed", brush);
    brush[1].selection = selection;
    brush[1].selectionDomain = getSelectionDomain(selection); // Calculate the selection coordinates in data domain
    if (updateBrush(brush)) {
      //Update intersections with modified brush
      brushFilter();
    }
  }
  function isTimelineInSliderCurtain(timelinePolyline, slider, refCurve) {
    const sliderMinX = +slider.leftX;
    const sliderMaxX = +slider.rightX;

    const yDomain = scaleY.domain();
    const yBoundary = slider.side === "above" ? yDomain[1] : yDomain[0];

    const yRefLeft = getYAtX(refCurve, sliderMinX);
    const yRefRight = getYAtX(refCurve, sliderMaxX);

    if (yRefLeft === null || yRefRight === null) return false;

    const refSegment = refCurve.data.filter(
      (p) => +p[0] >= sliderMinX && +p[0] <= sliderMaxX
    );

    const curtainPolygon = [];
    curtainPolygon.push([sliderMinX, yRefLeft]);
    refSegment.forEach((p) => curtainPolygon.push([+p[0], p[1]]));
    curtainPolygon.push([sliderMaxX, yRefRight]);
    curtainPolygon.push([sliderMaxX, yBoundary]);
    curtainPolygon.push([sliderMinX, yBoundary]);

    for (let i = 0; i < timelinePolyline.length; i++) {
      const p = timelinePolyline[i];
      const pointCoords = [+x(p), y(p)];
      if (d3__namespace.polygonContains(curtainPolygon, pointCoords)) {
        return true;
      }
    }

    for (let i = 0; i < timelinePolyline.length - 1; i++) {
      const p1 = [+x(timelinePolyline[i]), y(timelinePolyline[i])];
      const p2 = [+x(timelinePolyline[i + 1]), y(timelinePolyline[i + 1])];

      for (let j = 0; j < curtainPolygon.length; j++) {
        const polyP1 = curtainPolygon[j];
        const polyP2 = curtainPolygon[(j + 1) % curtainPolygon.length];
        if (segmentIntersect(p1, p2, polyP1, polyP2).hit) {
          return true;
        }
      }
    }

    return false;
  }

  function isTimelineFullyInSliderCurtain(timelinePolyline, slider, refCurve) {
    const sliderMinX = +slider.leftX;
    const sliderMaxX = +slider.rightX;

    const yDomain = scaleY.domain();
    const yBoundary = slider.side === "above" ? yDomain[1] : yDomain[0];
    const yRefLeft = getYAtX(refCurve, sliderMinX);
    const yRefRight = getYAtX(refCurve, sliderMaxX);

    if (yRefLeft === null || yRefRight === null) return false;

    const refSegmentPoints = refCurve.data.filter(
      (p) => +p[0] >= sliderMinX && +p[0] <= sliderMaxX
    );

    const curtainPolygon = [];
    const refCurveBoundary = []; // Store just the ref-curve part

    const startPt = [sliderMinX, yRefLeft];
    curtainPolygon.push(startPt);
    refCurveBoundary.push(startPt);

    refSegmentPoints.forEach((p) => {
      const pt = [+p[0], p[1]];
      curtainPolygon.push(pt);
      refCurveBoundary.push(pt);
    });

    const endPt = [sliderMaxX, yRefRight];
    curtainPolygon.push(endPt);
    refCurveBoundary.push(endPt);

    // These are the top/bottom boundary points
    const boundaryPt1 = [sliderMaxX, yBoundary];
    const boundaryPt2 = [sliderMinX, yBoundary];
    curtainPolygon.push(boundaryPt1);
    curtainPolygon.push(boundaryPt2);

    // This is the top/bottom "horizontal" boundary segment
    const horizontalBoundary = [boundaryPt1, boundaryPt2];

    // --- Logic Check ---
    let hasLeftPoint = false;
    let hasRightPoint = false;

    for (const p of timelinePolyline) {
      const px = +x(p);
      const py = y(p);

      if (px <= sliderMinX) {
        hasLeftPoint = true;
      } else if (px >= sliderMaxX) {
        hasRightPoint = true;
      } else {
        // Point is within slider's X-range.
        // Check if it's outside the curtain (crosses horizontal boundary)
        if (!d3__namespace.polygonContains(curtainPolygon, [px, py])) {
          return false; // Fails Rule 2 (point check)
        }
      }
    }

    // If it doesn't even span across, it's not "contained"
    if (!hasLeftPoint || !hasRightPoint) {
      return false;
    }

    let yAtMinX = null;
    for (let i = 0; i < timelinePolyline.length - 1; i++) {
        const p1 = timelinePolyline[i];
        const p2 = timelinePolyline[i + 1];
        const x1 = +x(p1), x2 = +x(p2);
        if ((x1 <= sliderMinX && x2 >= sliderMinX) || (x2 <= sliderMinX && x1 >= sliderMinX)) {
            if (Math.abs(x1 - x2) < 1e-10) {
                yAtMinX = y(p1);
            } else {
                const t = (sliderMinX - x1) / (x2 - x1);
                yAtMinX = y(p1) * (1 - t) + y(p2) * t;
            }
            break;
        }
    }
    if (yAtMinX !== null && !d3__namespace.polygonContains(curtainPolygon, [sliderMinX, yAtMinX])) {
        return false;
    }

    // Check segments for horizontal crossings
    for (let i = 0; i < timelinePolyline.length - 1; i++) {
      const p1 = [+x(timelinePolyline[i]), y(timelinePolyline[i])];
      const p2 = [+x(timelinePolyline[i + 1]), y(timelinePolyline[i + 1])];

      // We only care about segments that are at least partially inside the slider's X-range
      const p1_x = p1[0];
      const p2_x = p2[0];

      // Check if segment is at least partially inside the X range
      const segmentInRange =
        (p1_x >= sliderMinX && p1_x <= sliderMaxX) || // p1 is inside
        (p2_x >= sliderMinX && p2_x <= sliderMaxX) || // p2 is inside
        (p1_x < sliderMinX && p2_x > sliderMinX) || // crosses left boundary
        (p1_x > sliderMaxX && p2_x < sliderMaxX) || // crosses right boundary
        (p1_x < sliderMaxX && p2_x > sliderMaxX) || // crosses right boundary
        (p1_x > sliderMinX && p2_x < sliderMinX); // crosses left boundary

      if (!segmentInRange) {
        continue; // This segment is entirely outside the X-range, skip it
      }

      // Check intersection with top/bottom boundary
      const topIntersectData = segmentIntersect(
        p1,
        p2,
        horizontalBoundary[0],
        horizontalBoundary[1]
      );
      if (topIntersectData.hit) {
        // Check if the intersection point is within the slider's X-range
        const intersectionPoint = topIntersectData.point;
        if (
          intersectionPoint[0] >= sliderMinX &&
          intersectionPoint[0] <= sliderMaxX
        ) {
          return false; // Fails Rule 2 (segment check on top/bottom)
        }
      }

      // Check intersection with ref-curve boundary
      for (let j = 0; j < refCurveBoundary.length - 1; j++) {
        const ref_p1 = refCurveBoundary[j];
        const ref_p2 = refCurveBoundary[j + 1];

        // We only check for intersection if the timeline segment is not identical
        // to the ref_curve segment (which would be a 'touch' not a 'cross')
        if (
          p1[0] === ref_p1[0] &&
          p1[1] === ref_p1[1] &&
          p2[0] === ref_p2[0] &&
          p2[1] === ref_p2[1]
        ) {
          continue;
        }

        if (segmentIntersect(p1, p2, ref_p1, ref_p2).hit) {
          return false; // Fails Rule 2 (segment check on ref curve)
        }
      }
    }

    // If all checks passed (spans across, no points or segments crossed horizontal boundaries)
    return true;
  }

  function segmentIntersect(a, b, c, d) {
    const r = [b[0] - a[0], b[1] - a[1]];
    const s = [d[0] - c[0], d[1] - c[1]];
    const rxs = r[0] * s[1] - r[1] * s[0];
    const qpxr = (c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0];
    if (rxs === 0) return { hit: false };
    const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / rxs;
    const u = qpxr / rxs;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return { hit: true, t, u, point: [a[0] + t * r[0], a[1] + t * r[1]] };
    }
    return { hit: false };
  }

  function getBrushResultWithNegation(resultSet, negate) {
    if (!negate) {
      return resultSet;
    }
    const allKeys = new Set(data.map((d) => d[0]));
    for (const key of resultSet) {
      allKeys.delete(key);
    }
    return allKeys;
  }
function brushFilter() {
    const newDataSelected = new Map();

    // Get all programmatic filter data once
    const sliderBoxes =
      (typeof getProbePairBoxes === "function" ? getProbePairBoxes() : []) || [];
    const getSlidersFunc = me.getSliders || (() => new Map());
    const sliders = getSlidersFunc();
    const dataDomainCurves = referenceCurves || [];
    const bvh =
      BVH_ && typeof BVH_.getBvh === "function" ? BVH_.getBvh() : BVH_;
    const curvesFromBvh =
      bvh && Array.isArray(bvh.referenceLines) ? bvh.referenceLines : [];

    for (const [groupId, group] of brushesGroup.entries()) {
      const andFilters = [];
      const orFilters = [];

      // --- 1. Collect ALL filters for this group ---

      // Collect Timeboxes
      if (group.isEnable) {
        group.brushes.forEach((brush) => {
          if (brush.selection) {
            const filter = {
              aggregation: brush.aggregation,
              getResults: () => {
                const [[x0, y0], [x1, y1]] = brush.selection;
                const results =
                  brush.mode === BrushModes.Contains
                    ? BVH_.contains(x0, y0, x1, y1)
                    : BVH_.intersect(x0, y0, x1, y1);
                // NOT se aplica aquí, al resultado individual
                return getBrushResultWithNegation(results, brush.negate);
              },
            };
            (brush.aggregation === BrushAggregation.And
              ? andFilters
              : orFilters
            ).push(filter);
          }
        });
      }

      // Collect Sliders
      const slidersForGroup = sliderBoxes.filter((s) => s.groupId === groupId);
      slidersForGroup.forEach((sliderInfo) => {
        const slider = sliders.get(sliderInfo.sliderId);
        if (slider) {
          const filter = {
            aggregation: slider.aggregation,
            getResults: () => {
              const refCurve = dataDomainCurves.find(
                (rc) => rc.id === slider.rcId
              );
              // Si la curva no existe o está oculta, no aplicamos filtro
              if (!refCurve || refCurve.isVisible === false) return new Set();
              
              let candidateIds;
              if (slider.mode === BrushModes.Contains) {
                candidateIds = new Set(data.map((d) => d[0]));
              } else {
                const [[x0, y0], [x1, y1]] = sliderInfo.box;
                candidateIds = BVH_.intersect(x0, y0, x1, y1);
              }

              const singleSliderResult = new Set();
              for (const id of candidateIds) {
                const timeline = dataMap.get(id);
                if (!timeline || !timeline[1]) continue;
                let inCurtain =
                  slider.mode === BrushModes.Contains
                    ? isTimelineFullyInSliderCurtain(
                        timeline[1],
                        slider,
                        refCurve
                      )
                    : isTimelineInSliderCurtain(timeline[1], slider, refCurve);
                if (inCurtain) singleSliderResult.add(id);
              }
              // NOT se aplica aquí, al resultado individual
              return getBrushResultWithNegation(
                singleSliderResult,
                slider.negate
              );
            },
          };
          (slider.aggregation === BrushAggregation.And
            ? andFilters
            : orFilters
          ).push(filter);
        }
      });

      // Collect Points
      curvesFromBvh.forEach((rcFromBvh) => {
        if (
          rcFromBvh.isSimplePoints &&
          Array.isArray(rcFromBvh.associations) &&
          Array.isArray(rcFromBvh.collisions)
        ) {
          rcFromBvh.associations.forEach((assoc) => {
            if (assoc.enabled && assoc.id === groupId && rcFromBvh.isVisible !== false) {
              const aggregation = assoc.aggregation || BrushAggregation.Or;
              const filterList =
                aggregation === BrushAggregation.And ? andFilters : orFilters;

              filterList.push({
                aggregation: aggregation,
                getResults: () => {
                  const pointResults = new Set();
                  const currentCollisions = Array.isArray(rcFromBvh.collisions) ? rcFromBvh.collisions : [];
                  currentCollisions.forEach((collision) => {
                    pointResults.add(collision.dataId);
                  });
                  return getBrushResultWithNegation(
                    pointResults,
                    assoc.negate || false
                  );
                },
              });
            }
          });
        }
      });

      // --- 2. Process the unified AND/OR filter lists ---

      const orResults = new Set();
      if (orFilters.length > 0) {
        // Unir todos los resultados OR
        orFilters.forEach((filter, idx) => {
          const filterResults = filter.getResults();
          filterResults.forEach((id) => orResults.add(id));
        });
      }

      let andResults = new Set();
      let hasAndFilters = andFilters.length > 0;

      if (hasAndFilters) {
        andResults = andFilters[0].getResults();
        
        for (let i = 1; i < andFilters.length; i++) {
          if (andResults.size === 0) {
            break; 
          }
          const currentResults = andFilters[i].getResults();
          andResults = new Set(
            [...andResults].filter((id) => currentResults.has(id))
          );
        }
      }

      const finalSelectedIds = new Set();
      
      const hasOrFilters = orFilters.length > 0;

      if (hasOrFilters) {
         orResults.forEach((id) => finalSelectedIds.add(id));
      }

      if (hasAndFilters) {
        andResults.forEach((id) => finalSelectedIds.add(id));
      }
      
      // --- 4. Populate newDataSelected ---
      const groupSelection = [];
      finalSelectedIds.forEach((id) => {
        if (dataMap.has(id)) {
          groupSelection.push(dataMap.get(id));
        }
      });
      newDataSelected.set(groupId, groupSelection);
    } // end for-loop over groups

    // --- 5. Update global state ---
    const allSelectedIds = new Set();
    newDataSelected.forEach((items) => {
      items.forEach((item) => allSelectedIds.add(item[0]));
    });
    dataSelected = newDataSelected;
    dataNotSelected = data.filter((d) => !allSelectedIds.has(d[0]));
    const hasAnySelection = allSelectedIds.size > 0;

    if (!suppress) {
      selectionCallback(dataSelected, dataNotSelected, hasAnySelection);
    }
  }

  function removeBrush([id, brush]) {
    brushSize--;
    brushesGroup.get(brush.group).brushes.delete(id);

    drawBrushes();
    brushFilter();
    updateStatus();
    brushTooltip.__hide();
  }

  function updateStatus() {
    // TODO
    statusCallback();
  }

  function updateGroups() {
    if (!suppress) groupsCallback(brushesGroup);
  }

  function updateSelectedCoordinates({ selection }) {
    let selectionDomain = getSelectionDomain(selection);
    changeSelectedCoordinatesCallback(selectionDomain);
  }

  // Update the intersection of all selected brushes
  function updateSelection() {
    let someUpdate = false;
    for (const brushGroup of brushesGroup.values()) {
      for (const brush of brushGroup.brushes) {
        if (brush[1].isSelected) {
          let update = updateBrush(brush); //avoid lazy evaluation
          someUpdate = someUpdate || update;
        }
      }
    }
    if (someUpdate) {
      brushFilter();
    }
  }

  function moveBrush([brushId, brush], distX, distY) {
    let [[x0, y0], [x1, y1]] = brush.selection;
    x0 += distX;
    x1 += distX;
    y0 += distY;
    y1 += distY;
    let d3Brush = gBrushes.selectAll("#brush-" + brushId);
    d3Brush.call(brush.brush.move, [
      [x0, y0],
      [x1, y1],
    ]);
    brush.selection = [
      [x0, y0],
      [x1, y1],
    ];

    updateCirclesSelected(d3Brush, brush);
    brush.selectionDomain = getSelectionDomain(brush.selection);
  }

  // Move all selected brushes the same amount of the triggerBrush
  function moveSelectedBrushes({ selection, sourceEvent }, trigger) {
    // dont execute this method when move brushes programmatically
    if (sourceEvent === undefined) return;
    if (!Array.isArray(trigger) || trigger.length !== 2) {
      log();
      return;
    }
    const [triggerId, triggerBrush] = trigger;
    updateCirclesSelected(d3__namespace.select(this), triggerBrush);

    if (!selection || !triggerBrush.isSelected) return;

    let [[x0, y0]] = selection;
    let distX = x0 - triggerBrush.selection[0][0];
    let distY = y0 - triggerBrush.selection[0][1];
    triggerBrush.selection = selection;
    triggerBrush.selectionDomain = getSelectionDomain(selection);
    for (const brushGroup of brushesGroup.values()) {
      for (const [brushId, brush] of brushGroup.brushes) {
        if (brush.isSelected && !(triggerId === brushId)) {
          moveBrush([brushId, brush], distX, distY);
        }
      }
    }

    if (ts.autoUpdate) {
      tUpdateSelection();
    }
  }

  // Calculate the intersection of one brush with all the lines. Returns true if any changes have been made
  function updateBrush([brushId, brush]) {
    let [[x0, y0], [x1, y1]] = brush.selection;
    let newIntersections = null;
    // TODO Another form to do that is to asing the brush the function to calculate the intersection. It would make the code shorter, but I think less readable.
    switch (brush.mode) {
      case BrushModes.Intersect:
        newIntersections = BVH_.intersect(x0, y0, x1, y1);
        break;
      case BrushModes.Contains:
        newIntersections = BVH_.contains(x0, y0, x1, y1);
        break;
      default:
        newIntersections = BVH_.intersect(x0, y0, x1, y1);
        log();
    }

    if (brush.negate) {
      let allKeys = new Set(data.map((d) => d[0]));
      for (const key of newIntersections) {
        allKeys.delete(key);
      }
      newIntersections = allKeys;
    }

    let updated = !compareSets(newIntersections, brush.intersections);
    brush.intersections = newIntersections;

    return updated;
  }

  function selectBrush(brush) {
    brush[1].isSelected = !brush[1].isSelected;
    updateGroups();
    selectedBrushCallback(brush);
  }

  function deselectAllBrushes() {
    for (let brushGroup of brushesGroup.values()) {
      for (let brush of brushGroup.brushes) {
        brush[1].isSelected = false;
      }
    }
  }

  function getUnusedIdBrushGroup() {
    let keys = Array.from(brushesGroup.keys()).sort();
    let lastKey = -1;

    for (let key of keys) {
      if (lastKey + 1 !== key) {
        break;
      }
      lastKey++;
    }

    lastKey++;
    return lastKey;
  }

  function brushShadowIfSelected(d) {
    return selectedBrush && d[0] === selectedBrush[0] ? brushShadow : "";
  }

  function showBrushTooltip({ selection, sourceEvent }, brush) {
    if (!selection || sourceEvent === undefined) return;

    let selectionInverted = selection.map(([x, y]) => [
      scaleX.invert(+x),
      scaleY.invert(+y),
    ]);

    brushWithTooltip = brush;
    brushTooltip.__update({
      selection: selectionInverted,
      selectionPixels: selection,
    });
  }

  function updateCirclesSelected(d3Brush, brushValue) {
    let selectedCircles = [];
    if (brushValue.isSelected) {
      let padding = 10;
      selectedCircles = [
        {
          x: brushValue.selection[0][0] + padding,
          y: brushValue.selection[0][1] + padding,
        },
        {
          x: brushValue.selection[1][0] - padding,
          y: brushValue.selection[1][1] - padding,
        },
        {
          x: brushValue.selection[0][0] + padding,
          y: brushValue.selection[1][1] - padding,
        },
        {
          x: brushValue.selection[1][0] - padding,
          y: brushValue.selection[0][1] + padding,
        },
      ];
    }

    d3Brush
      .selectAll(".circle")
      .data(selectedCircles)
      .join("circle")
      .attr("class", "circle")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("r", "4px")
      .attr("fill", darken(computeColor(brushValue.group)))
      .attr("fill-opacity", 0.5);
  }

  // Called by drawBrushes
  function drawOneBrush(d) {
    const brushValue = d[1];

    d3__namespace.select(this)
      .selectAll(".selection")
      .style("outline", "-webkit-focus-ring-color solid 0px")
      .style("fill", computeColor(brushValue.group))
      .style(
        "stroke-width",
        brushValue.group === brushGroupSelected ? "2px" : "0.5px"
      )
      .style(
        "stroke-dasharray",
        brushValue.mode === BrushModes.Intersect ? "4" : ""
      )
      .style("stroke", darken(computeColor(brushValue.group)))
      .style("outline-color", darken(computeColor(brushValue.group)))
      .style("fill", computeColor(brushValue.group))
      .attr("tabindex", 0)
      .on("mousedown", (sourceEvent) => {
        if (sourceEvent.button === 0) {
          //Do that in left click
          let selection = brushValue.selection;
          updateSelectedCoordinates({ selection });
          selectedBrush = selectedBrush && d[0] === selectedBrush[0] ? null : d;
          selectedBrushCallback(selectedBrush);

          // Show shadow on current brush
          gBrushes
            .selectAll(".brush")
            .style("-webkit-filter", brushShadowIfSelected)
            .style("filter", brushShadowIfSelected);

          if (sourceEvent.shiftKey) {
            selectBrush(d);
          }
        }
      })
      .on("contextmenu", (sourceEvent) => {
        sourceEvent.preventDefault();
        let px = brushValue.selection[0][0];
        let py = brushValue.selection[0][1];
        brushContextMenu.__show(
          brushValue.mode,
          brushValue.aggregation,
          brushValue.negate,
          px,
          py,
          d
        );
      });

    updateCirclesSelected(d3__namespace.select(this), brushValue);

    d3__namespace.select(this)
      .selectAll(".handle--w, .handle--e")
      .style(
        "fill",
        brushValue.aggregation === BrushAggregation.Or
          ? darken(computeColor(brushValue.group))
          : "none"
      )
      .style("opacity", 0.4);

    d3__namespace.select(this)
      .selectAll(".handle--n, .handle--s")
      .style("fill", brushValue.negate ? "red" : "none")
      .style("opacity", 0.4);

    d3__namespace.select(this)
      .selectAll("title")
      .data([0]) // hack to create the title only once used instead of .append("title")
      .join("title")
      .text(
        `Mode: ${
          brushValue.mode === BrushModes.Contains ? "Contains" : "Intersect"
        }\nAggregation: ${
          brushValue.aggregation === BrushAggregation.And ? "And" : "Or"
        }\nRight click for options`
      );

    if (ts.showBrushTooltip) {
      d3__namespace.select(this)
        .selectAll(":not(.overlay)")
        .on("mousemove", (sourceEvent) => {
          let selection = brushValue.selection;
          showBrushTooltip({ selection, sourceEvent }, d);
        });
    }
  }

  function selectBrushGroup(id) {
    if (brushGroupSelected !== id && brushGroupSelected !== undefined) {
      const oldGroup = brushesGroup.get(brushGroupSelected);
      if (oldGroup) {
        oldGroup.isActive = false;

        const placeholderBrushId = brushCount - 1;
        if (oldGroup.brushes.has(placeholderBrushId)) {
          const placeholder = oldGroup.brushes.get(placeholderBrushId);
          oldGroup.brushes.delete(placeholderBrushId);
          const newGroup = brushesGroup.get(id);
          if (newGroup) {
            placeholder.group = id;
            newGroup.brushes.set(placeholderBrushId, placeholder);
          }
        }
      }
      deselectAllBrushes();
    }

    brushGroupSelected = id;
    const g = brushesGroup.get(id);
    if (g) {
      g.isActive = true;
      g.isEnable = true;
    }

    brushFilter();
    drawBrushes();
    updateGroups();
  }
  function computeColor(groupId) {
    return ts.brushesColorScale(groupId);
  }

  // Change one brush to a new BrushGroup
  function changeBrushOfGroup([brushId, brush], newBrushGroupId) {
    brushesGroup.get(brush.group).brushes.delete(brushId);
    brush.group = newBrushGroupId;
    brushesGroup.get(newBrushGroupId).brushes.set(brushId, brush);
  }

  function drawBrushes() {
    let brushes = [];
    brushesGroup.forEach(
      (d) => (brushes = brushes.concat(Array.from(d.brushes)))
    );
    brushes.sort((a, b) => d3__namespace.descending(a[0], b[0]));

    const brushesSelection = gBrushes
      .selectAll(".brush")
      .data(brushes, (d) => d[0])
      .join("g")
      .attr("class", "brush")
      .attr("id", ([id]) => "brush-" + id)
      .each(function ([, brush]) {
        // Actually create the d3 brush
        const sel = d3__namespace.select(this).call(brush.brush);

        return sel;
      })
      .style("-webkit-filter", brushShadowIfSelected)
      .style("filter", brushShadowIfSelected)
      .style("display", (d) => {
        const g = brushesGroup.get(d[1].group);
        const isPlaceholder = d[0] === brushCount - 1;
        return isPlaceholder || (g && g.isEnable) ? "" : "none";
      })
      // Permitir eventos si es el placeholder O si pertenece al grupo seleccionado
      .style("pointer-events", (d) => {
        const isPlaceholder = d[0] === brushCount - 1;
        return isPlaceholder || d[1].group === brushGroupSelected
          ? "all"
          : "none";
      })
      .each(drawOneBrush);

    brushesSelection.each(function (d) {
      d3__namespace.select(this)
        .selectAll(".overlay")
        .style("pointer-events", () => {
          return brushCount - 1 === d[0] ? "all" : "none";
        });
    });

    brushesSelection.each(function ([id, brush]) {
      // Are we creating a brush for a predefined filter?
      if (brush.initialSelection) {
        log("\uD83C\uDF89 setting initial selection", brush.initialSelection);

        // Update brushColor
        d3__namespace.select(this)
          .selectAll(".selection")
          .style("stroke", darken(computeColor(brush.group)))
          .style("outline-color", darken(computeColor(brush.group)))
          .style("fill", computeColor(brush.group));

        // // if so set the new brush programmatically, and delete the initial selection
        me.moveBrush([id, brush], brush.initialSelection);
        // d3.select(this).call(
        //   brush.brush.move,
        //   // [[52, 254], [237, 320]]
        //   // convert to pixels
        //   brush.initialSelection.map(([px, py]) => [scaleX(px), scaleY(py)])
        // );
        brush.initialSelection = undefined;
      }
    });
  }

  me.updateBrushGroupName = function (id, name) {
    brushesGroup.get(id).name = name;
    updateGroups();
    updateStatus();
  };

  me.addBrushGroup = function () {
    let newId = getUnusedIdBrushGroup();
    let brushGroup = {
      isEnable: true,
      isActive: false,
      name: "Group " + (newId + 1),
      brushes: new Map(),
    };
    brushesGroup.set(newId, brushGroup);
    dataSelected.set(newId, []);
    selectBrushGroup(newId);

    if (!suppress) {
      brushFilter();
    }
    updateStatus();
    updateGroups();
  };

  function removeBrushGroup(id) {
    if (!brushesGroup.has(id) || brushesGroup.size <= 1) return;

    if (Array.isArray(referenceCurves)) {
      referenceCurves.forEach((curve) => {
        if (curve.isSimplePoints && Array.isArray(curve.associations)) {
          curve.associations = curve.associations.filter(
            (assoc) => assoc.id !== id
          );
        }
      });
      me.updateReferenceCurves(referenceCurves);
    }

    const groupToDelete = brushesGroup.get(id);

    const currentGroup = brushesGroup.get(brushGroupSelected);
    const currentPlaceholder = currentGroup
      ? currentGroup.brushes.get(brushCount - 1)
      : undefined;
    if (currentPlaceholder) {
      brushesGroup.get(brushGroupSelected).brushes.delete(brushCount - 1);
    }
    for (const [brushId, brush] of groupToDelete.brushes.entries()) {
      brushSize--;
    }
    brushesGroup.delete(id);
    dataSelected.delete(id);

    if (brushGroupSelected === id) {
      const newActiveId = brushesGroup.keys().next().value;
      selectBrushGroup(newActiveId);
    }
    newBrush();
    brushFilter();
    drawBrushes();
    updateGroups();
  }

  me.changeBrushGroupState = function (id, newState) {
    const g = brushesGroup.get(id);
    if (!g || g.isEnable === newState) return;

    g.isEnable = newState;

    if (!newState && selectedBrush && selectedBrush[1].group === id) {
      brushTooltip.__hide();
    }

    if (typeof g.name === "string" && g.name.startsWith("RC ")) {
      const ref = Array.isArray(referenceCurves)
        ? referenceCurves.find((r) => r.id === id)
        : null;

      if (ref) {
        ref.isVisible = newState;
        if (ts && typeof ts.printReferenceCurves === "function") {
          ts.printReferenceCurves(referenceCurves);
        }
      }
    }

    drawBrushes();
    updateStatus();
    updateGroups();

    // Si acabo de ocultar el grupo seleccionado, cambia a otro habilitado
    if (newState === false && id === brushGroupSelected) {
      // busca algún grupo habilitado distinto
      let nextId = null;
      for (const [gid, g] of brushesGroup.entries()) {
        if (gid !== id && g.isEnable) {
          nextId = gid;
          break;
        }
      }
      if (nextId != null) {
        selectBrushGroup(nextId);
      } else {
        // si no queda ninguno habilitado, crea uno vacío y selecciónalo
        const nid = getUnusedIdBrushGroup();
        const bg = {
          isEnable: true,
          isActive: true,
          name: "Group " + (nid + 1),
          brushes: new Map(),
        };
        brushesGroup.set(nid, bg);
        dataSelected.set(nid, []);
        selectBrushGroup(nid);
        newBrush();
      }
      drawBrushes();
      updateStatus();
      updateGroups();
    }
  };

  me.selectBrushGroup = function (id) {
    selectBrushGroup(id);
    updateStatus();
    updateGroups();
  };

  me.selectBrush = function (groupId, brushId) {
    const group = brushesGroup.get(groupId);
    if (group && group.brushes.has(brushId)) {
      selectedBrush = [brushId, group.brushes.get(brushId)];
      brushGroupSelected = groupId;
      drawBrushes();
      selectedBrushCallback(selectedBrush);
    }
  };

  me.getBrushesGroupSize = function () {
    return brushesGroup.size;
  };

  me.removeBrushGroup = function (id) {
    removeBrushGroup(id);
  };

  me.getEnableGroups = function () {
    let enable = new Set();
    brushesGroup.forEach((d, id) => {
      if (d.isEnable) {
        enable.add(id);
      }
    });
    return enable;
  };

  me.getBrushesGroup = function () {
    //return brushesGroup;

    // Return a copy of brushesGroups without the uninitialized brushes
    let filterBrushesGroup = new Map();
    // Deep copy
    brushesGroup.forEach((g, gId) => {
      let o = Object.assign({}, g);
      o.brushes = new Map(g.brushes);
      filterBrushesGroup.set(gId, o);
    });

    filterBrushesGroup.forEach((group) => {
      group.brushes.forEach((brush, brushId) => {
        if (brush.selection === null) group.brushes.delete(brushId);
      });
    });
    return filterBrushesGroup;
  };

  me.getBrushGroupSelected = function () {
    return brushGroupSelected;
  };

  me.removeSelectedBrush = function () {
    if (selectedBrush) removeBrush(selectedBrush);
  };

  me.getSelectedBrush = function () {
    return selectedBrush;
  };

  me.hasSelection = function () {
    if (brushSize !== 0) return true;
    if (dataSelected) {
      for (const groupEntries of dataSelected.values()) {
        if (groupEntries && groupEntries.length > 0) return true;
      }
    }

    const bvh =
      BVH_ && typeof BVH_.getBvh === "function" ? BVH_.getBvh() : BVH_;
    const refs =
      bvh && Array.isArray(bvh.referenceLines) ? bvh.referenceLines : [];
    for (const [groupId, group] of brushesGroup.entries()) {
      if (group.name && group.name.startsWith("RC ")) {
        const ref = refs.find((r) => r.id === groupId);
        if (ref && Array.isArray(ref.collisions) && ref.collisions.length)
          return true;
      }
    }
    return false;
  };

  me.deselectBrush = function () {
    if (selectedBrush) {
      selectedBrush = null;
      drawBrushes();
      selectedBrushCallback(selectedBrush);
    }
  };

  me.changeSelectedBrushMode = function (brushMode) {
    selectedBrush.mode = brushMode;
    updateBrush(selectedBrush);
  };

  me.changeSelectedBrushAggregation = function (brushAggregation) {
    selectedBrush.aggregation = brushAggregation;
    brushFilter();
  };

  me.moveBrush = function (
    [brushID, brushValue],
    selection,
    moveSelection = false
  ) {
    let [[x0, y0], [x1, y1]] = selection;
    //Domain coordinates
    let minX = scaleX.domain()[0];
    let maxX = scaleX.domain()[1];
    let minY = scaleY.domain()[0];
    let maxY = scaleY.domain()[1];

    x0 = Math.max(x0, minX);
    x1 = Math.min(x1, maxX);
    y0 = Math.min(y0, maxY);
    y1 = Math.max(y1, minY);

    // if the X axis is a Date return to Date after clamping
    if (minX instanceof Date) {
      x0 = new Date(x0);
      x1 = new Date(x1);
    }

    if (x0 > x1) {
      [x0, x1] = [x1, x0];
    }

    if (y0 < y1) {
      [y0, y1] = [y1, y0];
    }

    let x0p = scaleX(x0);
    let x1p = scaleX(x1);
    let y0p = scaleY(y0);
    let y1p = scaleY(y1);

    //log("moveBrush", brushID, brushValue, arguments[1]);
    gBrushes.selectAll("#brush-" + brushID).call(brushValue.brush.move, [
      [x0p, y0p],
      [x1p, y1p],
    ]);

    selection = [
      [x0p, y0p],
      [x1p, y1p],
    ];
    let selectionDomain = [
      [x0, y0],
      [x1, y1],
    ];

    let sourceEvent = new Event("move"); // fake event to be able to call brushed programmatically
    if (moveSelection) {
      moveSelectedBrushes({ selection, sourceEvent }, [brushID, brushValue]);
    } else {
      brushed({ selection, sourceEvent }, [brushID, brushValue]);
      brushTooltip.__update({
        selection: selectionDomain,
        selectionPixels: selection,
      });
    }
  };

  me.moveSelectedBrush = function (
    [[x0, y0], [x1, y1]],
    moveSelection = false
  ) {
    //log("Move selected brush", selectedBrush);
    if (!selectedBrush) {
      log();
      return;
    }

    me.moveBrush(
      selectedBrush,
      [
        [x0, y0],
        [x1, y1],
      ],
      moveSelection
    );
  };

  function generateBrush(
    brush,
    mode,
    aggregation,
    group,
    selection,
    selectionDomain,
    initialSelection
  ) {
    return {
      brush: brush,
      intersections: null,
      mode: mode,
      aggregation: aggregation,
      negate: false,
      isSelected: false,
      group: group,
      selection: selection,
      selectionDomain: selectionDomain,
      initialSelection: initialSelection,
    };
  }
  me.invertQuery = function (brushGroup) {
    let brushes = brushesGroup.get(brushGroup).brushes;
    let miny = Number.MAX_VALUE;
    let maxy = Number.MIN_VALUE;
    brushes.forEach((brush) => {
      if (!brush.selection) return;
      miny = Math.min(brush.selection[0][1], miny);
      maxy = Math.max(brush.selection[1][1], maxy);
    });
    let midPointQuery = (maxy - miny) / 2 + miny;
    brushes.forEach((brush, brushId) => {
      if (!brush.selection) return;
      let brushHeight = brush.selection[1][1] - brush.selection[0][1];
      let brushMidPoint = brushHeight / 2 + brush.selection[0][1];
      let distY = midPointQuery - brushMidPoint;
      moveBrush([brushId, brush], 0, distY * 2);
    });

    tUpdateSelection();
  };

  me.invertQuerySelectedGroup = function () {
    me.invertQuery(brushGroupSelected);
  };

  me.addFilters = function (filters, wipeAll = false) {
    if (filters instanceof Map) {
      filters = Array.from(filters.values());
      filters.forEach((f) => (f.brushes = Array.from(f.brushes.values())));
    }

    if (filters.length === 0) return;

    if (wipeAll) {
      brushesGroup.clear();
    } else {
      // Remove the brush prepared to generate new TimeBox. Will be added later.
      brushesGroup.forEach((group) => {
        group.brushes.forEach((brush, id) => {
          if (!brush.selection) group.brushes.delete(id);
        });
      });
    }

    for (let group of filters) {
      let groupId = getUnusedIdBrushGroup();
      let brushGroup = {
        isEnable: group.isEnable ? group.isEnable : true,
        isActive: group.isActive ? group.isActive : false,
        name: group.name,
        brushes: new Map(),
      };
      brushesGroup.set(groupId, brushGroup);
      dataSelected.set(groupId, []);

      for (const brush of group.brushes) {
        if (!isInsideDomain(brush.selectionDomain, scaleX, scaleY)) {
          // If the provided domain is out of bounds use the pixel selection. If not, set default value.
          if (brush.selection)
            brush.selectionDomain = getSelectionDomain(brush.selection);
          else
            brush.selectionDomain = getSelectionDomain([
              [0, 100],
              [0, 100],
            ]);
        }
        newBrush(brush.mode, brush.aggregation, groupId, brush.selectionDomain);
        brushSize++; // The brushSize will not be increased in onStartBrush
        // because the last brush added will be the one set for a new Brush.
      }
    }

    newBrush(); // Add another brush that handle the possible new TimeBox

    brushFilter();
    drawBrushes();
  };

  me.suppressCallbacks = (on = true) => {
    suppress = !!on;
  };

  me.getBvh = function () {
    return BVH_;
  };

  me.drawBrushes = function () {
    drawBrushes();
  };

  // add brush group without func to avoid callback
  let newId = getUnusedIdBrushGroup();
  let brushGroup = {
    isEnable: true,
    isActive: true,
    name: "Group " + (newId + 1),
    brushes: new Map(),
  };

  brushesGroup.set(newId, brushGroup);
  dataSelected.set(newId, []);
  brushGroupSelected = newId;
  brushesGroup.get(newId).isEnable = true;

  newBrush();
  drawBrushes();

  me.updateReferenceCurves = function (newCurves) {
    referenceCurves = newCurves;
  };

  me.recomputeSelection = function () {
    brushFilter();
  };
  me.getBrushSize = function () {
      return brushSize;
    };
  me.contextMenu = brushContextMenu;
  return me;
}

/*
 * HelpSystem: sistema de ayuda integrado en el TimeWidget.
 *  - Botón "?" sobre el widget.
 *  - Popup (modal) con la documentación de todas las configuraciones e interacciones.
 *  - Demo guiada por pasos (tour) que recorre las partes de la herramienta.
 *
 * Uso desde TimeWidget:
 *   const help = HelpSystem({ container: divOverview, elements: {...} });
 *   help.showHelp();   // abre el popup de documentación
 *   help.startTour();  // inicia la demo guiada
 */

const STYLE_ID = "__tw_help_styles";

const CSS = `
.__tw-help-btn {
  position: absolute; top: 6px; right: 8px; z-index: 10;
  width: 26px; height: 26px; border-radius: 50%;
  border: 1px solid #bbb; background: #fff; color: #444;
  font: bold 14px/1 sans-serif; cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,.25);
}
.__tw-help-btn:hover { background: #f0f4ff; border-color: #4a7bd0; color: #2a5bb8; }

.__tw-help-overlay {
  position: fixed; inset: 0; z-index: 999990;
  background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
  font-family: sans-serif;
}
.__tw-help-modal {
  background: #fff; width: min(760px, 92vw); max-height: 85vh;
  border-radius: 8px; box-shadow: 0 8px 30px rgba(0,0,0,.35);
  display: flex; flex-direction: column; overflow: hidden;
}
.__tw-help-modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-bottom: 1px solid #e3e3e3;
}
.__tw-help-modal-header h2 { margin: 0; font-size: 1.05rem; color: #222; }
.__tw-help-x {
  border: none; background: none; font-size: 1.3rem; line-height: 1;
  cursor: pointer; color: #666; padding: 2px 6px;
}
.__tw-help-x:hover { color: #000; }
.__tw-help-modal-body {
  padding: 12px 16px 18px; overflow-y: auto;
  font-size: .86rem; color: #333; line-height: 1.45;
}
.__tw-help-tour-cta {
  display: inline-block; margin-bottom: 12px; padding: 7px 14px;
  border: none; border-radius: 5px; background: #2a5bb8; color: #fff;
  font-size: .85rem; cursor: pointer;
}
.__tw-help-tour-cta:hover { background: #1d4796; }
.__tw-help-section { border: 1px solid #e3e3e3; border-radius: 6px; margin-bottom: 8px; }
.__tw-help-section summary {
  cursor: pointer; padding: 8px 10px; font-weight: bold; color: #2a3950;
}
.__tw-help-section[open] > summary { border-bottom: 1px solid #eee; }
.__tw-help-section-body { padding: 8px 12px; }
.__tw-help-section-body p { margin: 6px 0; }
.__tw-help-section-body ul { margin: 6px 0; padding-left: 18px; }
.__tw-help-table { border-collapse: collapse; width: 100%; font-size: .8rem; margin: 6px 0; }
.__tw-help-table th, .__tw-help-table td {
  border: 1px solid #ddd; padding: 4px 6px; text-align: left; vertical-align: top;
}
.__tw-help-table th { background: #f4f6fa; }
.__tw-kbd {
  display: inline-block; border: 1px solid #bbb; border-bottom-width: 2px;
  border-radius: 3px; padding: 0 5px; font-family: monospace;
  font-size: .78rem; background: #f7f7f7;
}

.__tw-tour-dim { position: fixed; inset: 0; z-index: 999990; }
.__tw-tour-highlight {
  position: fixed; z-index: 999991; border-radius: 6px;
  box-shadow: 0 0 0 9999px rgba(0,0,0,.5), 0 0 0 3px #4a90d9;
  pointer-events: none; transition: all .25s ease;
}
.__tw-tour-card {
  position: fixed; z-index: 999992; width: 340px; max-width: 92vw;
  background: #fff; border-radius: 8px; box-shadow: 0 6px 24px rgba(0,0,0,.4);
  font-family: sans-serif; font-size: .85rem; color: #333; line-height: 1.4;
}
.__tw-tour-card-header {
  display: flex; justify-content: space-between; align-items: baseline;
  padding: 10px 12px 0;
}
.__tw-tour-card-header h3 { margin: 0; font-size: .95rem; }
.__tw-tour-step-counter { color: #888; font-size: .75rem; margin-left: 8px; white-space: nowrap; }
.__tw-tour-card-body { padding: 8px 12px; }
.__tw-tour-card-body p { margin: 6px 0; }
.__tw-tour-card-body ul { margin: 6px 0; padding-left: 18px; }
.__tw-tour-card-footer {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 12px 12px;
}
.__tw-tour-btn {
  padding: 5px 12px; border-radius: 4px; border: 1px solid #ccc;
  background: #fff; cursor: pointer; font-size: .8rem;
}
.__tw-tour-btn[disabled] { opacity: .4; cursor: default; }
.__tw-tour-btn.__tw-primary { background: #2a5bb8; border-color: #2a5bb8; color: #fff; }
.__tw-tour-exit {
  border: none; background: none; color: #888; cursor: pointer;
  font-size: .75rem; text-decoration: underline; padding: 4px;
}
.__tw-lang-switcher {
  display: flex; gap: 4px; align-items: center;
}
.__tw-lang-btn {
  padding: 2px 7px; border-radius: 3px; border: 1px solid #ccc;
  background: #fff; cursor: pointer; font-size: .75rem; color: #555;
  line-height: 1.4;
}
.__tw-lang-btn:hover { border-color: #4a7bd0; color: #2a5bb8; }
.__tw-lang-btn.__tw-lang-active {
  background: #2a5bb8; border-color: #2a5bb8; color: #fff; font-weight: bold;
}
`;

function injectStyles() {
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }
}

function kbd(k) {
  return `<span class="__tw-kbd">${k}</span>`;
}

// ─── Contenido de la documentación ──────────────────────────────────────────
function buildDocSections() {
  return [
    {
      title: "\xBFQu\xE9 es TimeWidget?",
      open: true,
      html: `
        <p>TimeWidget es una herramienta interactiva para explorar colecciones de
        series temporales. Permite filtrar las series dibujando cajas de selección
        (<strong>TimeBoxes</strong>) directamente sobre el gráfico, organizar las
        selecciones en <strong>grupos</strong> y compararlas con
        <strong>curvas de referencia</strong>.</p>
        <p>Pulsa <em>«Iniciar demo guiada»</em> (arriba) para hacer un recorrido paso
        a paso por todas las partes de la herramienta.</p>`,
    },
    {
      title: "Vista general (el gr\xE1fico)",
      html: `
        <ul>
          <li>Las <strong>líneas grises</strong> son las series que no cumplen ninguna selección.</li>
          <li>Las <strong>líneas coloreadas</strong> son las series seleccionadas; el color es el del grupo al que pertenecen.</li>
          <li>La <strong>línea discontinua</strong> es la mediana de las series de cada grupo activo (se puede desactivar con <code>showGroupMedian</code>).</li>
          <li>El texto <em>«Groups + :»</em> sobre el gráfico crea un grupo nuevo al hacer clic.</li>
          <li>Con <code>showGrid</code> se muestra una rejilla de referencia y con <code>doubleYlegend</code> el eje Y se duplica a la derecha.</li>
        </ul>`,
    },
    {
      title: "TimeBoxes (cajas de selecci\xF3n)",
      html: `
        <p>Un TimeBox define un rectángulo [rango X] × [rango Y]. Las series que lo
        cumplen pasan a formar parte del grupo al que pertenece la caja.</p>
        <ul>
          <li><strong>Crear:</strong> haz clic y arrastra sobre una zona vacía del gráfico.</li>
          <li><strong>Mover:</strong> arrastra el interior de la caja. <strong>Redimensionar:</strong> arrastra sus bordes o esquinas.</li>
          <li><strong>Seleccionar:</strong> haz clic sobre una caja; la caja activa se resalta con una sombra y sus coordenadas aparecen en el panel de coordenadas.</li>
          <li><strong>Eliminar:</strong> con la caja seleccionada, pulsa ${kbd("R")}, ${kbd("Supr")} o ${kbd("Retroceso")}.</li>
        </ul>
        <p><strong>Menú contextual</strong> (clic derecho sobre la caja):</p>
        <ul>
          <li><strong>Mode → Intersect:</strong> selecciona las series que <em>tocan</em> la caja en algún punto.</li>
          <li><strong>Mode → Contains:</strong> selecciona solo las series cuyo tramo dentro del rango X queda <em>completamente contenido</em> en la caja.</li>
          <li><strong>Not:</strong> invierte la condición de la caja (excluye las series que la cumplen).</li>
          <li><strong>Aggregation → And:</strong> la serie debe cumplir <em>todas</em> las cajas del grupo.</li>
          <li><strong>Aggregation → Or:</strong> basta con que cumpla <em>una</em> de las cajas del grupo.</li>
        </ul>
        <p>Si <code>showBrushTooltip</code> está activo, al dibujar o mover una caja se
        muestra un tooltip con sus coordenadas.</p>`,
    },
    {
      title: "Grupos de selecci\xF3n",
      html: `
        <p>Cada grupo reúne uno o más TimeBoxes y tiene un color propio. El panel
        <em>Groups</em> permite gestionarlos:</p>
        <ul>
          <li><strong>Checkbox:</strong> activa o desactiva el grupo (sus series dejan de colorearse).</li>
          <li><strong>Cuadrado de color:</strong> haz clic para convertirlo en el grupo <em>activo</em> (borde negro); los nuevos TimeBoxes se añaden al grupo activo.</li>
          <li><strong>Nombre:</strong> editable directamente sobre el texto.</li>
          <li><strong>(n):</strong> número de series que cumplen actualmente la consulta del grupo.</li>
          <li><strong>✕:</strong> elimina el grupo y sus cajas.</li>
          <li><strong>Add Group:</strong> crea un grupo nuevo (también con la tecla ${kbd("+")} o el texto «Groups + :» del gráfico).</li>
          <li><strong>Non selected (n):</strong> muestra u oculta las series que no pertenecen a ningún grupo.</li>
        </ul>`,
    },
    {
      title: "Coordenadas del TimeBox",
      html: `
        <p>El panel de coordenadas muestra los límites de la caja seleccionada
        (X inicial/final e Y inferior/superior) y permite editarlos numéricamente
        para colocar la caja con precisión. El tamaño del paso se controla con
        <code>stepX</code> y <code>stepY</code>.</p>
        <p>Si seleccionas un <em>slider</em> de una curva de referencia, el panel pasa a
        mostrar (y editar) sus coordenadas X.</p>`,
    },
    {
      title: "Curvas de referencia",
      html: `
        <p>Las curvas de referencia (parámetro <code>referenceCurves</code>) son curvas
        o conjuntos de puntos que se dibujan sobre el gráfico y sirven tanto de
        referencia visual como de mecanismo de consulta. Pueden definirse con datos
        explícitos, una función <code>y = f(x)</code>, un polinomio o una curva paramétrica.</p>
        <p>En el panel <em>Reference Curves</em>, cada curva tiene:</p>
        <ul>
          <li><strong>Checkbox:</strong> muestra u oculta la curva.</li>
          <li><strong>Selector de color</strong> y <strong>nombre editable</strong>.</li>
          <li><strong>Add Slider</strong> (polilíneas): añade un slider asociado al grupo activo.</li>
          <li><strong>Add Association</strong> (curvas de puntos): asocia la curva al grupo activo.</li>
          <li><strong>Collision Tolerance</strong> (curvas de puntos): radio de tolerancia
            (en unidades del eje Y) con el que una serie se considera que «pasa por» un punto.</li>
        </ul>
        <p>Las <strong>asociaciones</strong> seleccionan las series que pasan a una distancia
        menor o igual que la tolerancia de los puntos de la curva. Cada asociación se puede
        activar/desactivar y combinar con <strong>AND / OR / NOT</strong> con el resto de
        condiciones del grupo.</p>`,
    },
    {
      title: "Sliders sobre curvas",
      html: `
        <p>Un slider delimita un tramo [izquierda, derecha] de una polilínea de referencia
        y selecciona las series que quedan <em>por encima</em> («above») o
        <em>por debajo</em> («below») de la curva en ese tramo.</p>
        <ul>
          <li><strong>Mover:</strong> arrastra el área sombreada del slider.</li>
          <li><strong>Ajustar extremos:</strong> arrastra las líneas verticales de los bordes.</li>
          <li><strong>Cambiar de lado:</strong> doble clic sobre el slider, o el botón ↑/↓ del panel.</li>
          <li><strong>Menú contextual</strong> (clic derecho): mismas opciones que los TimeBoxes
            (Intersect/Contains, Not, And/Or).</li>
          <li>Desde el panel también se puede renombrar, activar/desactivar o eliminar (✕).</li>
        </ul>`,
    },
    {
      title: "Grupos de datos (atributo color)",
      html: `
        <p>Si el widget se crea con el parámetro <code>color</code>, las series se colorean
        por categoría y aparece la fila <em>«Data groups»</em> con un botón por categoría.
        Haz clic en un botón para ocultar o volver a mostrar las series de esa categoría.</p>`,
    },
    {
      title: "Vista de detalles",
      html: `
        <p>Con <code>hasDetails</code> activo se muestra un panel con un gráfico individual
        por cada serie seleccionada del grupo activo (hasta <code>maxDetailsRecords</code>
        gráficos a la vez, con scroll para ver el resto).</p>`,
    },
    {
      title: "Atajos de teclado",
      html: `
        <p>Funcionan con el gráfico enfocado (haz clic sobre él primero):</p>
        <table class="__tw-help-table">
          <tr><th>Tecla</th><th>Acción</th></tr>
          <tr><td>${kbd("R")} / ${kbd("Supr")} / ${kbd("Retroceso")}</td><td>Elimina el TimeBox seleccionado</td></tr>
          <tr><td>${kbd("+")}</td><td>Añade un grupo nuevo</td></tr>
          <tr><td>${kbd("\u2190")} ${kbd("\u2192")} ${kbd("\u2191")} ${kbd("\u2193")}</td><td>Desplaza el TimeBox seleccionado (pasos de <code>stepX</code> / <code>stepY</code>)</td></tr>
          <tr><td>${kbd("I")}</td><td>Invierte la consulta del grupo seleccionado (NOT)</td></tr>
        </table>`,
    },
    {
      title: "Par\xE1metros de configuraci\xF3n (API)",
      html: `
        <p>Principales opciones al crear el widget: <code>TimeWidget(data, opciones)</code>.</p>
        <p><strong>Datos y ejes</strong></p>
        <table class="__tw-help-table">
          <tr><th>Parámetro</th><th>Significado</th></tr>
          <tr><td><code>x</code>, <code>y</code>, <code>id</code></td><td>Atributos (o funciones) para el eje X, el eje Y y el identificador de cada serie.</td></tr>
          <tr><td><code>color</code></td><td>Atributo para colorear las series por categoría (crea los «Data groups»).</td></tr>
          <tr><td><code>referenceCurves</code></td><td>Array de curvas de referencia (datos, función, polinomio o paramétrica).</td></tr>
          <tr><td><code>filters</code></td><td>TimeBoxes iniciales con los que arranca el widget.</td></tr>
          <tr><td><code>xDomain</code> / <code>yDomain</code></td><td>Dominio de cada eje (por defecto, el rango de los datos).</td></tr>
          <tr><td><code>xScale</code> / <code>yScale</code></td><td>Escalas de d3 a usar en cada eje.</td></tr>
          <tr><td><code>fmtX</code> / <code>fmtY</code></td><td>Formato de los valores X/Y en tooltips y coordenadas.</td></tr>
          <tr><td><code>stepX</code> / <code>stepY</code></td><td>Paso usado por los spinboxes de coordenadas y las flechas del teclado.</td></tr>
          <tr><td><code>xTicks</code> / <code>yTicks</code>, <code>xLabel</code> / <code>yLabel</code></td><td>Etiquetas personalizadas de los ejes.</td></tr>
        </table>
        <p><strong>Apariencia</strong></p>
        <table class="__tw-help-table">
          <tr><th>Parámetro</th><th>Significado</th></tr>
          <tr><td><code>width</code> / <code>height</code></td><td>Tamaño del gráfico principal.</td></tr>
          <tr><td><code>detailsWidth</code> / <code>detailsHeight</code> / <code>detailsContainerHeight</code></td><td>Tamaño de la vista de detalles.</td></tr>
          <tr><td><code>margin</code>, <code>backgroundColor</code></td><td>Márgenes y color de fondo.</td></tr>
          <tr><td><code>defaultColor</code> / <code>selectedColor</code> / <code>noSelectedColor</code></td><td>Colores de las líneas (sin selección, seleccionadas, no seleccionadas) cuando no se usa <code>color</code>.</td></tr>
          <tr><td><code>defaultAlpha</code> / <code>selectedAlpha</code> / <code>noSelectedAlpha</code></td><td>Transparencias de las líneas en cada estado.</td></tr>
          <tr><td><code>colorScale</code> / <code>brushesColorScale</code></td><td>Escalas de color para las categorías de datos y para los grupos.</td></tr>
          <tr><td><code>showGrid</code>, <code>doubleYlegend</code>, <code>brushGroupSize</code>, <code>brushShadow</code></td><td>Rejilla, doble eje Y, tamaño de los selectores de grupo y sombra de la caja activa.</td></tr>
        </table>
        <p><strong>Comportamiento</strong></p>
        <table class="__tw-help-table">
          <tr><th>Parámetro</th><th>Significado</th></tr>
          <tr><td><code>hasDetails</code> / <code>showDetails</code></td><td>Calcula / muestra la vista de detalles.</td></tr>
          <tr><td><code>showBrushesControls</code> / <code>showBrushesCoordinates</code> / <code>showBrushTooltip</code></td><td>Muestra los paneles de grupos, de coordenadas y el tooltip de las cajas.</td></tr>
          <tr><td><code>showHelp</code></td><td>Muestra el botón «?» con esta ayuda y la demo guiada.</td></tr>
          <tr><td><code>showGroupMedian</code>, <code>medianNumBins</code>, <code>medianFn</code>, <code>medianMinRecordsPerBin</code></td><td>Mediana por grupo: si se muestra, número de bins, función de agregación y mínimo de registros por bin.</td></tr>
          <tr><td><code>autoUpdate</code></td><td>Si la selección se recalcula mientras se mueve la caja o solo al soltarla.</td></tr>
          <tr><td><code>fixAxis</code>, <code>maxTimelines</code>, <code>maxDetailsRecords</code></td><td>Ejes fijos al cambiar los datos, límite de series y de gráficos de detalle.</td></tr>
          <tr><td><code>updateCallback</code> / <code>statusCallback</code></td><td>Callbacks al cambiar la selección / el estado interno.</td></tr>
        </table>
        <p><strong>Rendimiento</strong></p>
        <table class="__tw-help-table">
          <tr><th>Parámetro</th><th>Significado</th></tr>
          <tr><td><code>renderer</code></td><td><code>'webgpu'</code> (por defecto, acelerado por GPU) o <code>'canvas'</code> (Canvas 2D clásico).</td></tr>
          <tr><td><code>enableLOD</code></td><td>Activa el submuestreo de líneas y puntos en WebGPU (más fluido con datasets grandes; puede omitir outliers).</td></tr>
          <tr><td><code>xPartitions</code> / <code>yPartitions</code></td><td>Particiones del algoritmo de aceleración de colisiones.</td></tr>
          <tr><td><code>alphaScale</code></td><td>Escala que ajusta la transparencia según el número de elementos dibujados.</td></tr>
        </table>`,
    },
  ];
}

// ─── Pasos de la demo guiada ────────────────────────────────────────────────
// elements: mapa de getters que devuelven el elemento a resaltar (o null si no aplica).
function buildTourSteps(elements) {
  const el = (key) =>
    elements && typeof elements[key] === "function" ? elements[key] : null;

  return [
    {
      title: "Bienvenido a TimeWidget",
      element: null,
      html: `
        <p>Esta demo guiada recorre las partes principales de la herramienta en unos pocos pasos.</p>
        <p>Usa los botones o las flechas ${kbd("\u2190")} ${kbd("\u2192")} del teclado para navegar,
        y ${kbd("Esc")} o «Salir» para terminar en cualquier momento.</p>`,
    },
    {
      title: "La vista general",
      element: el("chart"),
      html: `
        <p>Aquí se dibujan todas las series temporales sobre los ejes X e Y.</p>
        <p>Las líneas <strong>grises</strong> son series sin seleccionar. Cuando crees una
        selección, las series que la cumplan se pintarán con el <strong>color de su
        grupo</strong>, y una línea discontinua mostrará su mediana.</p>`,
    },
    {
      title: "TimeBoxes: selecciona dibujando",
      element: el("chart"),
      html: `
        <p><strong>Haz clic y arrastra</strong> sobre el gráfico para crear un
        <em>TimeBox</em>: un rectángulo que selecciona las series que pasan por él.</p>
        <p>Puedes <strong>moverlo</strong> arrastrando su interior y
        <strong>redimensionarlo</strong> desde los bordes. Con
        <strong>clic derecho</strong> se abre un menú para elegir el modo
        (<em>Intersect</em>: la serie toca la caja / <em>Contains</em>: la serie queda
        contenida), negar la condición (<em>Not</em>) y combinar varias cajas
        (<em>And</em> / <em>Or</em>).</p>`,
    },
    {
      title: "Grupos de selecci\xF3n",
      element: el("groups"),
      html: `
        <p>Cada grupo reúne varios TimeBoxes y tiene su propio color.</p>
        <ul>
          <li>El <strong>checkbox</strong> activa o desactiva el grupo.</li>
          <li>Haz clic en el <strong>cuadrado de color</strong> para hacerlo el grupo activo
            (las nuevas cajas se añaden a él).</li>
          <li><strong>(n)</strong> indica cuántas series cumplen su consulta y
            <strong>✕</strong> lo elimina.</li>
          <li><em>«Non selected»</em> muestra u oculta las series sin seleccionar.</li>
        </ul>`,
    },
    {
      title: "Coordenadas del TimeBox",
      element: el("coordinates"),
      html: `
        <p>Estos campos muestran los límites (X e Y) de la caja seleccionada y permiten
        editarlos numéricamente para colocarla con precisión.</p>
        <p>También puedes desplazar la caja seleccionada con las
        <strong>flechas del teclado</strong>.</p>`,
    },
    {
      title: "Curvas de referencia",
      element: el("referenceCurves"),
      html: `
        <p>Las curvas de referencia se dibujan sobre el gráfico y sirven para consultar
        las series respecto a ellas.</p>
        <ul>
          <li>En las <strong>polilíneas</strong>, <em>«Add Slider»</em> añade un slider que
            selecciona las series por encima o por debajo de un tramo de la curva
            (doble clic sobre el slider cambia de lado).</li>
          <li>En las <strong>curvas de puntos</strong>, <em>«Add Association»</em> selecciona
            las series que pasan cerca de los puntos, con la tolerancia de
            <em>«Collision Tolerance»</em>.</li>
        </ul>`,
    },
    {
      title: "Grupos de datos",
      element: el("dataGroups"),
      html: `
        <p>Las series están coloreadas por categoría. Cada botón activa o desactiva
        las series de una categoría para centrarte solo en las que te interesen.</p>`,
    },
    {
      title: "Vista de detalles",
      element: el("details"),
      html: `
        <p>Aquí aparece un gráfico individual por cada serie seleccionada del grupo
        activo, para examinarlas una a una.</p>`,
    },
    {
      title: "Atajos de teclado",
      element: null,
      html: `
        <p>Con el gráfico enfocado (haz clic sobre él):</p>
        <ul>
          <li>${kbd("R")} / ${kbd("Supr")}: elimina la caja seleccionada.</li>
          <li>${kbd("+")}: añade un grupo nuevo.</li>
          <li>${kbd("\u2190")} ${kbd("\u2192")} ${kbd("\u2191")} ${kbd("\u2193")}: desplaza la caja seleccionada.</li>
          <li>${kbd("I")}: invierte la consulta del grupo (NOT).</li>
        </ul>`,
    },
    {
      title: "\xA1Listo!",
      element: null,
      html: `
        <p>Ya conoces las partes principales de TimeWidget.</p>
        <p>Puedes consultar la documentación completa en cualquier momento pulsando el
        botón <strong>«?»</strong> de la esquina superior derecha del widget.</p>`,
    },
  ];
}

// ─── English content ────────────────────────────────────────────────────────
function buildDocSectionsEN() {
  return [
    {
      title: "What is TimeWidget?",
      open: true,
      html: `
        <p>TimeWidget is an interactive tool for exploring collections of time series.
        It lets you filter series by drawing selection boxes (<strong>TimeBoxes</strong>)
        directly on the chart, organize selections into <strong>groups</strong>, and
        compare them against <strong>reference curves</strong>.</p>
        <p>Press <em>«Start guided tour»</em> (above) for a step-by-step walkthrough
        of every part of the tool.</p>`,
    },
    {
      title: "Overview (the chart)",
      html: `
        <ul>
          <li><strong>Grey lines</strong> are series that do not match any active selection.</li>
          <li><strong>Colored lines</strong> are selected series; the color corresponds to their group.</li>
          <li>The <strong>dashed line</strong> is the median of the series in each active group (toggle with <code>showGroupMedian</code>).</li>
          <li>The <em>«Groups + :»</em> label above the chart creates a new group on click.</li>
          <li><code>showGrid</code> shows a reference grid; <code>doubleYlegend</code> mirrors the Y axis on the right.</li>
        </ul>`,
    },
    {
      title: "TimeBoxes (selection boxes)",
      html: `
        <p>A TimeBox defines a rectangle [X range] × [Y range]. Series that satisfy it
        are assigned to the group that owns the box.</p>
        <ul>
          <li><strong>Create:</strong> click and drag on an empty area of the chart.</li>
          <li><strong>Move:</strong> drag the inside of the box. <strong>Resize:</strong> drag its edges or corners.</li>
          <li><strong>Select:</strong> click a box to make it active (highlighted with a shadow); its coordinates appear in the coordinates panel.</li>
          <li><strong>Delete:</strong> with the box selected, press ${kbd("R")}, ${kbd("Del")}, or ${kbd("Backspace")}.</li>
        </ul>
        <p><strong>Context menu</strong> (right-click on the box):</p>
        <ul>
          <li><strong>Mode → Intersect:</strong> selects series that <em>touch</em> the box at any point.</li>
          <li><strong>Mode → Contains:</strong> selects only series whose segment within the X range is fully <em>contained</em> in the box.</li>
          <li><strong>Not:</strong> inverts the box condition (excludes matching series).</li>
          <li><strong>Aggregation → And:</strong> a series must satisfy <em>all</em> boxes in the group.</li>
          <li><strong>Aggregation → Or:</strong> satisfying <em>any one</em> box in the group is enough.</li>
        </ul>
        <p>When <code>showBrushTooltip</code> is active, a tooltip with the box coordinates is shown while drawing or moving.</p>`,
    },
    {
      title: "Selection groups",
      html: `
        <p>Each group holds one or more TimeBoxes and has its own color. The
        <em>Groups</em> panel lets you manage them:</p>
        <ul>
          <li><strong>Checkbox:</strong> enables or disables the group (its series stop being colored).</li>
          <li><strong>Color square:</strong> click to make it the <em>active</em> group (black border); new TimeBoxes are added to the active group.</li>
          <li><strong>Name:</strong> editable directly in the field.</li>
          <li><strong>(n):</strong> number of series currently matching the group's query.</li>
          <li><strong>✕:</strong> removes the group and all its boxes.</li>
          <li><strong>Add Group:</strong> creates a new group (also via ${kbd("+")} or the «Groups + :» label on the chart).</li>
          <li><strong>Non selected (n):</strong> shows or hides series that belong to no group.</li>
        </ul>`,
    },
    {
      title: "TimeBox coordinates",
      html: `
        <p>The coordinates panel shows the bounds of the selected box
        (start/end X and bottom/top Y) and lets you edit them numerically
        for precise positioning. The step size is controlled by
        <code>stepX</code> and <code>stepY</code>.</p>
        <p>When a reference curve <em>slider</em> is selected, the panel
        switches to showing (and editing) its X coordinates.</p>`,
    },
    {
      title: "Reference curves",
      html: `
        <p>Reference curves (<code>referenceCurves</code> parameter) are curves or
        point sets drawn on the chart that act both as visual references and as
        query mechanisms. They can be defined with explicit data, a function
        <code>y = f(x)</code>, a polynomial, or a parametric curve.</p>
        <p>In the <em>Reference Curves</em> panel, each curve has:</p>
        <ul>
          <li><strong>Checkbox:</strong> shows or hides the curve.</li>
          <li><strong>Color picker</strong> and <strong>editable name</strong>.</li>
          <li><strong>Add Slider</strong> (polylines): adds a slider linked to the active group.</li>
          <li><strong>Add Association</strong> (point curves): associates the curve with the active group.</li>
          <li><strong>Collision Tolerance</strong> (point curves): proximity radius (in Y-axis units) within which a series is considered to «pass through» a point.</li>
        </ul>
        <p><strong>Associations</strong> select series that pass within the tolerance distance of the curve's points. Each association can be enabled/disabled and combined with <strong>AND / OR / NOT</strong> with the rest of the group's conditions.</p>`,
    },
    {
      title: "Sliders on curves",
      html: `
        <p>A slider delimits a [left, right] segment of a reference polyline and selects
        the series that lie <em>above</em> («above») or <em>below</em> («below») the
        curve in that range.</p>
        <ul>
          <li><strong>Move:</strong> drag the shaded area of the slider.</li>
          <li><strong>Adjust edges:</strong> drag the vertical edge lines.</li>
          <li><strong>Toggle side:</strong> double-click the slider, or use the ↑/↓ button in the panel.</li>
          <li><strong>Context menu</strong> (right-click): same options as TimeBoxes (Intersect/Contains, Not, And/Or).</li>
          <li>The panel also lets you rename, enable/disable, or delete (✕) a slider.</li>
        </ul>`,
    },
    {
      title: "Data groups (color attribute)",
      html: `
        <p>When the widget is created with the <code>color</code> parameter, series are
        colored by category and a <em>«Data groups»</em> row appears with one button per
        category. Click a button to hide or show the series of that category.</p>`,
    },
    {
      title: "Details view",
      html: `
        <p>When <code>hasDetails</code> is active, an individual chart is shown for each
        selected series in the active group (up to <code>maxDetailsRecords</code> charts
        at a time, with scroll for the rest).</p>`,
    },
    {
      title: "Keyboard shortcuts",
      html: `
        <p>Work with the chart focused (click on it first):</p>
        <table class="__tw-help-table">
          <tr><th>Key</th><th>Action</th></tr>
          <tr><td>${kbd("R")} / ${kbd("Del")} / ${kbd("Backspace")}</td><td>Delete the selected TimeBox</td></tr>
          <tr><td>${kbd("+")}</td><td>Add a new group</td></tr>
          <tr><td>${kbd("\u2190")} ${kbd("\u2192")} ${kbd("\u2191")} ${kbd("\u2193")}</td><td>Move the selected TimeBox (steps of <code>stepX</code> / <code>stepY</code>)</td></tr>
          <tr><td>${kbd("I")}</td><td>Invert the selected group's query (NOT)</td></tr>
        </table>`,
    },
    {
      title: "Configuration parameters (API)",
      html: `
        <p>Main options when creating the widget: <code>TimeWidget(data, options)</code>.</p>
        <p><strong>Data &amp; axes</strong></p>
        <table class="__tw-help-table">
          <tr><th>Parameter</th><th>Description</th></tr>
          <tr><td><code>x</code>, <code>y</code>, <code>id</code></td><td>Attributes (or functions) for the X axis, Y axis, and series identifier.</td></tr>
          <tr><td><code>color</code></td><td>Attribute to color series by category (creates «Data groups»).</td></tr>
          <tr><td><code>referenceCurves</code></td><td>Array of reference curves (data, function, polynomial, or parametric).</td></tr>
          <tr><td><code>filters</code></td><td>Initial TimeBoxes loaded when the widget starts.</td></tr>
          <tr><td><code>xDomain</code> / <code>yDomain</code></td><td>Domain for each axis (defaults to data extent).</td></tr>
          <tr><td><code>xScale</code> / <code>yScale</code></td><td>D3 scales to use for each axis.</td></tr>
          <tr><td><code>fmtX</code> / <code>fmtY</code></td><td>Format for X/Y values in tooltips and coordinates.</td></tr>
          <tr><td><code>stepX</code> / <code>stepY</code></td><td>Step used by the coordinate spinboxes and arrow keys.</td></tr>
          <tr><td><code>xTicks</code> / <code>yTicks</code>, <code>xLabel</code> / <code>yLabel</code></td><td>Custom axis tick labels and axis titles.</td></tr>
        </table>
        <p><strong>Appearance</strong></p>
        <table class="__tw-help-table">
          <tr><th>Parameter</th><th>Description</th></tr>
          <tr><td><code>width</code> / <code>height</code></td><td>Size of the main chart.</td></tr>
          <tr><td><code>detailsWidth</code> / <code>detailsHeight</code> / <code>detailsContainerHeight</code></td><td>Size of the details view.</td></tr>
          <tr><td><code>margin</code>, <code>backgroundColor</code></td><td>Margins and background color.</td></tr>
          <tr><td><code>defaultColor</code> / <code>selectedColor</code> / <code>noSelectedColor</code></td><td>Line colors (no selection / selected / unselected) when <code>color</code> is not used.</td></tr>
          <tr><td><code>defaultAlpha</code> / <code>selectedAlpha</code> / <code>noSelectedAlpha</code></td><td>Line opacity in each state.</td></tr>
          <tr><td><code>colorScale</code> / <code>brushesColorScale</code></td><td>Color scales for data categories and groups.</td></tr>
          <tr><td><code>showGrid</code>, <code>doubleYlegend</code>, <code>brushGroupSize</code>, <code>brushShadow</code></td><td>Grid, double Y axis, group selector size, and active box shadow.</td></tr>
        </table>
        <p><strong>Behavior</strong></p>
        <table class="__tw-help-table">
          <tr><th>Parameter</th><th>Description</th></tr>
          <tr><td><code>hasDetails</code> / <code>showDetails</code></td><td>Compute / show the details view.</td></tr>
          <tr><td><code>showBrushesControls</code> / <code>showBrushesCoordinates</code> / <code>showBrushTooltip</code></td><td>Show the groups panel, coordinates panel, and brush tooltip.</td></tr>
          <tr><td><code>showHelp</code></td><td>Shows the «?» button with this help and the guided tour.</td></tr>
          <tr><td><code>showGroupMedian</code>, <code>medianNumBins</code>, <code>medianFn</code>, <code>medianMinRecordsPerBin</code></td><td>Group median: whether to show it, number of bins, aggregation function, and minimum records per bin.</td></tr>
          <tr><td><code>autoUpdate</code></td><td>Whether selection is recomputed while dragging the box or only on release.</td></tr>
          <tr><td><code>fixAxis</code>, <code>maxTimelines</code>, <code>maxDetailsRecords</code></td><td>Fixed axes on data change, series limit, and detail chart limit.</td></tr>
          <tr><td><code>updateCallback</code> / <code>statusCallback</code></td><td>Callbacks on selection change / internal state change.</td></tr>
        </table>
        <p><strong>Performance</strong></p>
        <table class="__tw-help-table">
          <tr><th>Parameter</th><th>Description</th></tr>
          <tr><td><code>renderer</code></td><td><code>'webgpu'</code> (default, GPU-accelerated) or <code>'canvas'</code> (legacy Canvas 2D).</td></tr>
          <tr><td><code>enableLOD</code></td><td>Enables WebGPU line/point subsampling (smoother with large datasets; may drop outliers).</td></tr>
          <tr><td><code>xPartitions</code> / <code>yPartitions</code></td><td>Partitions for the collision acceleration algorithm.</td></tr>
          <tr><td><code>alphaScale</code></td><td>Scale that adjusts opacity based on the number of rendered elements.</td></tr>
        </table>`,
    },
  ];
}

function buildTourStepsEN(elements) {
  const el = (key) =>
    elements && typeof elements[key] === "function" ? elements[key] : null;

  return [
    {
      title: "Welcome to TimeWidget",
      element: null,
      html: `
        <p>This guided tour walks you through the main parts of the tool in just a few steps.</p>
        <p>Use the buttons or the ${kbd("\u2190")} ${kbd("\u2192")} arrow keys to navigate,
        and ${kbd("Esc")} or «Exit» to quit at any time.</p>`,
    },
    {
      title: "The overview chart",
      element: el("chart"),
      html: `
        <p>All time series are drawn here on the X and Y axes.</p>
        <p><strong>Grey</strong> lines are unselected series. Once you create a selection,
        matching series are painted in their <strong>group color</strong>, and a dashed
        line shows the group median.</p>`,
    },
    {
      title: "TimeBoxes: select by drawing",
      element: el("chart"),
      html: `
        <p><strong>Click and drag</strong> on the chart to create a <em>TimeBox</em>:
        a rectangle that selects all series passing through it.</p>
        <p>You can <strong>move</strong> it by dragging its interior and
        <strong>resize</strong> it from the edges. <strong>Right-click</strong> opens a
        menu to choose the mode (<em>Intersect</em>: the series touches the box /
        <em>Contains</em>: the series is fully inside), negate the condition
        (<em>Not</em>), and combine multiple boxes (<em>And</em> / <em>Or</em>).</p>`,
    },
    {
      title: "Selection groups",
      element: el("groups"),
      html: `
        <p>Each group holds several TimeBoxes and has its own color.</p>
        <ul>
          <li>The <strong>checkbox</strong> enables or disables the group.</li>
          <li>Click the <strong>color square</strong> to make it the active group
            (new boxes are added to it).</li>
          <li><strong>(n)</strong> shows how many series match its query and
            <strong>✕</strong> removes it.</li>
          <li><em>«Non selected»</em> shows or hides unselected series.</li>
        </ul>`,
    },
    {
      title: "TimeBox coordinates",
      element: el("coordinates"),
      html: `
        <p>These fields show the bounds (X and Y) of the selected box and let you
        edit them numerically for precise placement.</p>
        <p>You can also move the selected box with the
        <strong>arrow keys</strong>.</p>`,
    },
    {
      title: "Reference curves",
      element: el("referenceCurves"),
      html: `
        <p>Reference curves are drawn on the chart and let you query series relative to them.</p>
        <ul>
          <li>For <strong>polylines</strong>, <em>«Add Slider»</em> adds a slider that
            selects series above or below a segment of the curve
            (double-click the slider to toggle side).</li>
          <li>For <strong>point curves</strong>, <em>«Add Association»</em> selects
            series that pass near the points, within the <em>«Collision Tolerance»</em>.</li>
        </ul>`,
    },
    {
      title: "Data groups",
      element: el("dataGroups"),
      html: `
        <p>Series are colored by category. Each button enables or disables
        the series of a category so you can focus on what matters.</p>`,
    },
    {
      title: "Details view",
      element: el("details"),
      html: `
        <p>An individual chart is shown here for each selected series in the active
        group, so you can examine them one by one.</p>`,
    },
    {
      title: "Keyboard shortcuts",
      element: null,
      html: `
        <p>With the chart focused (click on it first):</p>
        <ul>
          <li>${kbd("R")} / ${kbd("Del")}: delete the selected box.</li>
          <li>${kbd("+")}: add a new group.</li>
          <li>${kbd("\u2190")} ${kbd("\u2192")} ${kbd("\u2191")} ${kbd("\u2193")}: move the selected box.</li>
          <li>${kbd("I")}: invert the group's query (NOT).</li>
        </ul>`,
    },
    {
      title: "All done!",
      element: null,
      html: `
        <p>You now know the main parts of TimeWidget.</p>
        <p>You can consult the full documentation at any time by clicking the
        <strong>«?»</strong> button in the top-right corner of the widget.</p>`,
    },
  ];
}

function isVisible(el) {
  if (!el || !el.getBoundingClientRect || !document.body.contains(el))
    return false;
  const r = el.getBoundingClientRect();
  if (r.width <= 0 || r.height <= 0) return false;
  const style = window.getComputedStyle(el);
  return style.display !== "none" && style.visibility !== "hidden";
}

function HelpSystem({
  container,
  elements = {},
  docSections = null,
  tourSteps = null,
  showButton = true,
  lang = "es",
} = {}) {
  injectStyles();

  const isEN = lang === "en";
  const i18n = {
    helpTitle:     isEN ? "TimeWidget Help"          : "Ayuda de TimeWidget",
    close:         isEN ? "Close"                    : "Cerrar",
    tourCta:       isEN ? "\u25B6 Start guided tour"      : "\u25B6 Iniciar demo guiada",
    prev:          isEN ? "\u2190 Previous"               : "\u2190 Anterior",
    next:          isEN ? "Next \u2192"                   : "Siguiente \u2192",
    finish:        isEN ? "Finish \u2713"                 : "Finalizar \u2713",
    exit:          isEN ? "Exit"                     : "Salir",
    btnTitle:      isEN ? "Help & guided tour"       : "Ayuda y demo guiada",
    btnAriaLabel:  isEN ? "TimeWidget help"          : "Ayuda de TimeWidget",
    notActiveNote: isEN
      ? "\u26A0 This feature is not active in the current widget instance. You can enable it via the corresponding configuration parameters."
      : "\u26A0 Esta funcionalidad no est\xE1 activa en la instancia actual del widget. Puedes habilitarla con los par\xE1metros de configuraci\xF3n correspondientes.",
  };

  docSections = docSections || (isEN ? buildDocSectionsEN() : buildDocSections());
  tourSteps   = tourSteps   || (isEN ? buildTourStepsEN(elements) : buildTourSteps(elements));

  // ── Botón "?" ─────────────────────────────────────────────────────────────
  let helpBtn = null;
  if (showButton && container) {
    helpBtn = document.createElement("button");
    helpBtn.className = "__tw-help-btn";
    helpBtn.textContent = "?";
    helpBtn.title = i18n.btnTitle;
    helpBtn.setAttribute("aria-label", i18n.btnAriaLabel);
    helpBtn.addEventListener("click", showHelp);
    container.appendChild(helpBtn);
  }

  // ── Popup de documentación ────────────────────────────────────────────────
  let overlay = null;

  // Cambia el idioma activo y reconstruye modal + pasos del tour
  function switchLang(newLang) {
    if (newLang === activeLang) return;
    activeLang = newLang;
    const en = activeLang === "en";
    Object.assign(i18n, {
      helpTitle:     en ? "TimeWidget Help"          : "Ayuda de TimeWidget",
      close:         en ? "Close"                    : "Cerrar",
      tourCta:       en ? "\u25B6 Start guided tour"      : "\u25B6 Iniciar demo guiada",
      prev:          en ? "\u2190 Previous"               : "\u2190 Anterior",
      next:          en ? "Next \u2192"                   : "Siguiente \u2192",
      finish:        en ? "Finish \u2713"                 : "Finalizar \u2713",
      exit:          en ? "Exit"                     : "Salir",
      btnTitle:      en ? "Help & guided tour"       : "Ayuda y demo guiada",
      btnAriaLabel:  en ? "TimeWidget help"          : "Ayuda de TimeWidget",
      notActiveNote: en
        ? "\u26A0 This feature is not active in the current widget instance. You can enable it via the corresponding configuration parameters."
        : "\u26A0 Esta funcionalidad no est\xE1 activa en la instancia actual del widget. Puedes habilitarla con los par\xE1metros de configuraci\xF3n correspondientes.",
    });
    docSections = en ? buildDocSectionsEN() : buildDocSections();
    tourSteps   = en ? buildTourStepsEN(elements) : buildTourSteps(elements);
    // Fuerza reconstrucción del modal y actualiza el botón
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
      overlay = null;
      showHelp();
    } else {
      overlay = null;
    }
    if (helpBtn) {
      helpBtn.title = i18n.btnTitle;
      helpBtn.setAttribute("aria-label", i18n.btnAriaLabel);
    }
    // Actualiza estado visual de los botones de idioma
    if (langBtnES) langBtnES.classList.toggle("__tw-lang-active", activeLang === "es");
    if (langBtnEN) langBtnEN.classList.toggle("__tw-lang-active", activeLang === "en");
  }

  let activeLang = lang;
  let langBtnES = null, langBtnEN = null;

  function buildModal() {
    overlay = document.createElement("div");
    overlay.className = "__tw-help-overlay";
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) hideHelp();
    });

    const modal = document.createElement("div");
    modal.className = "__tw-help-modal";

    const header = document.createElement("div");
    header.className = "__tw-help-modal-header";
    header.innerHTML = `<h2>${i18n.helpTitle}</h2>`;

    // Selector de idioma ES / EN
    const langSwitcher = document.createElement("div");
    langSwitcher.className = "__tw-lang-switcher";
    langBtnES = document.createElement("button");
    langBtnES.className = "__tw-lang-btn" + (activeLang === "es" ? " __tw-lang-active" : "");
    langBtnES.textContent = "ES";
    langBtnES.title = "Espa\xF1ol";
    langBtnES.addEventListener("click", () => switchLang("es"));
    langBtnEN = document.createElement("button");
    langBtnEN.className = "__tw-lang-btn" + (activeLang === "en" ? " __tw-lang-active" : "");
    langBtnEN.textContent = "EN";
    langBtnEN.title = "English";
    langBtnEN.addEventListener("click", () => switchLang("en"));
    langSwitcher.appendChild(langBtnES);
    langSwitcher.appendChild(langBtnEN);

    const closeBtn = document.createElement("button");
    closeBtn.className = "__tw-help-x";
    closeBtn.innerHTML = "&times;";
    closeBtn.title = i18n.close;
    closeBtn.addEventListener("click", hideHelp);

    header.appendChild(langSwitcher);
    header.appendChild(closeBtn);

    const body = document.createElement("div");
    body.className = "__tw-help-modal-body";

    const tourCta = document.createElement("button");
    tourCta.className = "__tw-help-tour-cta";
    tourCta.textContent = i18n.tourCta;
    tourCta.addEventListener("click", () => {
      hideHelp();
      startTour();
    });
    body.appendChild(tourCta);

    docSections.forEach((section) => {
      const details = document.createElement("details");
      details.className = "__tw-help-section";
      if (section.open) details.open = true;
      const summary = document.createElement("summary");
      summary.textContent = section.title;
      const sectionBody = document.createElement("div");
      sectionBody.className = "__tw-help-section-body";
      sectionBody.innerHTML = section.html;
      details.appendChild(summary);
      details.appendChild(sectionBody);
      body.appendChild(details);
    });

    modal.appendChild(header);
    modal.appendChild(body);
    overlay.appendChild(modal);
  }

  function onModalKeydown(e) {
    if (e.key === "Escape") hideHelp();
  }

  function showHelp() {
    if (tourActive) endTour();
    if (!overlay) buildModal();
    if (!overlay.parentNode) document.body.appendChild(overlay);
    document.addEventListener("keydown", onModalKeydown, true);
  }

  function hideHelp() {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    document.removeEventListener("keydown", onModalKeydown, true);
  }

  // ── Demo guiada (tour) ────────────────────────────────────────────────────
  let tourActive = false;
  let activeSteps = [];
  let stepIndex = 0;
  let dimEl = null,
    highlightEl = null,
    cardEl = null,
    cardTitle = null,
    cardCounter = null,
    cardBody = null,
    btnPrev = null,
    btnNext = null;

  function buildTourDom() {
    dimEl = document.createElement("div");
    dimEl.className = "__tw-tour-dim";

    highlightEl = document.createElement("div");
    highlightEl.className = "__tw-tour-highlight";

    cardEl = document.createElement("div");
    cardEl.className = "__tw-tour-card";

    const header = document.createElement("div");
    header.className = "__tw-tour-card-header";
    cardTitle = document.createElement("h3");
    cardCounter = document.createElement("span");
    cardCounter.className = "__tw-tour-step-counter";
    header.appendChild(cardTitle);
    header.appendChild(cardCounter);

    cardBody = document.createElement("div");
    cardBody.className = "__tw-tour-card-body";

    const footer = document.createElement("div");
    footer.className = "__tw-tour-card-footer";
    const exitBtn = document.createElement("button");
    exitBtn.className = "__tw-tour-exit";
    exitBtn.textContent = i18n.exit;
    exitBtn.addEventListener("click", endTour);
    const navDiv = document.createElement("div");
    btnPrev = document.createElement("button");
    btnPrev.className = "__tw-tour-btn";
    btnPrev.textContent = i18n.prev;
    btnPrev.style.marginRight = "6px";
    btnPrev.addEventListener("click", () => showStep(stepIndex - 1));
    btnNext = document.createElement("button");
    btnNext.className = "__tw-tour-btn __tw-primary";
    btnNext.addEventListener("click", () => {
      if (stepIndex >= activeSteps.length - 1) endTour();
      else showStep(stepIndex + 1);
    });
    navDiv.appendChild(btnPrev);
    navDiv.appendChild(btnNext);
    footer.appendChild(exitBtn);
    footer.appendChild(navDiv);

    cardEl.appendChild(header);
    cardEl.appendChild(cardBody);
    cardEl.appendChild(footer);
  }

  function onTourKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      endTour();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      if (stepIndex >= activeSteps.length - 1) endTour();
      else showStep(stepIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (stepIndex > 0) showStep(stepIndex - 1);
    }
  }

  function onTourReposition() {
    if (tourActive) positionStep(activeSteps[stepIndex]);
  }

  function startTour() {
    if (tourActive) return;
    hideHelp();

    // Se muestran todos los pasos siempre. Si el elemento de un paso no existe
    // o no es visible en esta instancia, la tarjeta aparece centrada sin resaltar
    // nada, informando al usuario de que esa funcionalidad existe pero no está activa.
    activeSteps = tourSteps;
    if (activeSteps.length === 0) return;

    if (!cardEl) buildTourDom();
    document.body.appendChild(dimEl);
    document.body.appendChild(highlightEl);
    document.body.appendChild(cardEl);
    document.addEventListener("keydown", onTourKeydown, true);
    window.addEventListener("resize", onTourReposition);
    window.addEventListener("scroll", onTourReposition, true);

    tourActive = true;
    showStep(0);
  }

  function endTour() {
    if (!tourActive) return;
    tourActive = false;
    [dimEl, highlightEl, cardEl].forEach((el) => {
      if (el && el.parentNode) el.parentNode.removeChild(el);
    });
    document.removeEventListener("keydown", onTourKeydown, true);
    window.removeEventListener("resize", onTourReposition);
    window.removeEventListener("scroll", onTourReposition, true);
  }

  function showStep(i) {
    stepIndex = Math.max(0, Math.min(i, activeSteps.length - 1));
    const step = activeSteps[stepIndex];

    cardTitle.textContent = step.title;
    cardCounter.textContent = `${stepIndex + 1} / ${activeSteps.length}`;

    const targetEl = step.element ? step.element() : null;
    const elementPresent = targetEl && isVisible(targetEl);
    const notActiveNote =
      step.element && !elementPresent
        ? `<p style="margin-top:8px;padding:5px 8px;background:#fff8e1;border-left:3px solid #f0c040;font-size:.8rem;color:#7a5c00;">
            ${i18n.notActiveNote}
           </p>`
        : "";
    cardBody.innerHTML = step.html + notActiveNote;

    btnPrev.disabled = stepIndex === 0;
    btnNext.textContent =
      stepIndex >= activeSteps.length - 1 ? i18n.finish : i18n.next;

    if (elementPresent) {
      targetEl.scrollIntoView({ block: "nearest", inline: "nearest" });
    }
    positionStep(step);
  }

  function positionStep(step) {
    const targetEl = step && step.element ? step.element() : null;
    const pad = 6;

    if (targetEl && isVisible(targetEl)) {
      const r = targetEl.getBoundingClientRect();
      dimEl.style.background = "transparent"; // el sombreado lo aporta el box-shadow del resaltado
      highlightEl.style.display = "block";
      highlightEl.style.left = r.left - pad + "px";
      highlightEl.style.top = r.top - pad + "px";
      highlightEl.style.width = r.width + pad * 2 + "px";
      highlightEl.style.height = r.height + pad * 2 + "px";
      positionCardNear(r);
    } else {
      dimEl.style.background = "rgba(0,0,0,.5)";
      highlightEl.style.display = "none";
      centerCard();
    }
  }

  function centerCard() {
    const w = cardEl.offsetWidth;
    const h = cardEl.offsetHeight;
    cardEl.style.left = Math.max(8, (window.innerWidth - w) / 2) + "px";
    cardEl.style.top = Math.max(8, (window.innerHeight - h) / 2) + "px";
  }

  function positionCardNear(rect) {
    const gap = 14;
    const w = cardEl.offsetWidth;
    const h = cardEl.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let left, top;
    if (rect.right + gap + w <= vw) {
      // a la derecha del elemento
      left = rect.right + gap;
      top = rect.top;
    } else if (rect.bottom + gap + h <= vh) {
      // debajo
      left = rect.left;
      top = rect.bottom + gap;
    } else if (rect.top - gap - h >= 0) {
      // encima
      left = rect.left;
      top = rect.top - gap - h;
    } else if (rect.left - gap - w >= 0) {
      // a la izquierda
      left = rect.left - gap - w;
      top = rect.top;
    } else {
      centerCard();
      return;
    }

    cardEl.style.left = Math.max(8, Math.min(left, vw - w - 8)) + "px";
    cardEl.style.top = Math.max(8, Math.min(top, vh - h - 8)) + "px";
  }

  function destroy() {
    endTour();
    hideHelp();
    if (helpBtn && helpBtn.parentNode) helpBtn.parentNode.removeChild(helpBtn);
  }

  return { showHelp, hideHelp, startTour, endTour, destroy, button: helpBtn };
}

function TimeWidget(
  data,
  {
    /* Elements */
    target = document.createElement("div"), // pass a html element where you want to render
    showBrushesControls = true, // If false you can still use brushesControlsElement to show the control on a different element on your app. For this use the exported value "groups"
    showBrushTooltip = true, // Allows to display a tooltip on the brushes containing its coordinates.
    showBrushesCoordinates = true, // If false you can still use brushesCoordinatesElement to show the control on a different element on your app. For this use the exported value "brushesCoordinates"
    showDetails = true, // If false and with hasDetails = true, you can still use detailsElement to show the control on a different element on your app. For this use the exported value "details"
    showHelp = true, // Shows the "?" help button with the built-in documentation popup and the step-by-step guided tour.
    helpLang = "es", // Language for the built-in help system: 'es' (Spanish, default) or 'en' (English).
    /* Data */
    x = (d) => d.x, // Attribute to show in the X axis (Note that it also supports functions)
    y = (d) => d.y, // Attribute to show in the Y axis (Note that it also supports functions)
    id = (d) => d.id, // Attribute to group the input data (Note that it also supports functions)
    color = null, //Specifies the attribute to be used to discriminate the groups (Note that it also supports functions).
    referenceCurves = null, // Specifies a Json object with the information of the reference lines.
    fmtX, // Function, how to format x points in the tooltip. If not provided will try to guess if it is a date or a number
    fmtY = d3__namespace.format(".1f"), // Function, how to format x points in the tooltip
    stepX = { days: 10 }, // Defines the step used, both in the spinboxes and with the arrows on the X axis.
    stepY = 1, // // Defines the step used, both in the spinboxes and with the arrows on the Y axis.
    xScale, //It allows to pass a scale of d3 with its parameters, except for the domain which is defined by the xDomain parameter.
    yScale = d3__namespace.scaleLinear(), //It allows to pass a scale of d3 with its parameters, except for the domain which is defined by the yDomain parameter.
    xDomain, // Defines the domain to be used in the x scale.
    yDomain, // Defines the domain to be used in the y scale.
    yLabel = "",
    xLabel = "",
    xTicks, //Allows to use custom strings as ticks on the X-axis independently of the X-scale. A vector of [xValue,Label] pairs is expected. Note that only the defined elements are displayed.
    yTicks, //Allows to use custom strings as ticks on the y-axis independently of the y-scale. A vector of [yValue,Label] pairs is expected. Note that only the defined elements are displayed.
    filters = [], // Array of filters to use, format [[x1, y1], [x2, y2], ...]
    /* Color Configuration */
    defaultAlpha = 0.7, // Default transparency (when no selection is active) of drawn lines
    selectedAlpha = 1.0, // Transparency of selected lines
    noSelectedAlpha = 0.1, // Transparency of unselected lines
    alphaScale = d3__namespace.scalePow().exponent(0.25).range([1, 1]), // A scale to adjust the alpha by the number of rendering elements
    backgroundColor = "#ffffff",
    defaultColor = "#aaa", // Default color (when no selection is active) of the drawn lines. It only has effect when "color" is not defined.
    selectedColor = "#aaa", // Color of selected lines. It only has effect when "color" is not defined.
    noSelectedColor = "#dce0e5", // Color of unselected lines. It only has effect when "color" is not defined.
    colorScale = d3__namespace.scaleOrdinal(d3__namespace.schemeAccent), // The color scale to be used to display the different groups defined by the "color" attribute.
    brushesColorScale = color
      ? d3__namespace.scaleOrdinal(d3__namespace.schemeGreys[3].toReversed())
      : d3__namespace.scaleOrdinal(d3__namespace.schemeTableau10), // The color scale to be used to display the brushes
    selectedColorTransform = (color, groupId) =>
      d3__namespace.color(color).darker(groupId), // Function to be applied to the color of the selected group. It only has effect when "color" is defined.
    /* Size Configuration */
    width = 800, // Set the desired width of the overview Widget
    detailsWidth = 400, // Set the desired width of the details Widget
    height = 600, // Set the desired height of the overview Widget
    detailsHeight = 300, // Set the desired height of the details Widget
    detailsContainerHeight = 400, // Set the desired height of the details Widget
    margin = { left: 50, top: 30, bottom: 50, right: 50 },
    detailsMargin = null, // Margin options for details view, d3 common format, leave null for using the overview margin
    /* CallBacks */
    updateCallback = () => {}, // (data) => doSomethingWithData
    statusCallback = () => {}, // (status) => doSomethingWithStatus
    /* Rendering */
    brushShadow = "drop-shadow( 2px 2px 2px rgba(0, 0, 0, .7))",
    showGroupMedian = true, // If active show a line with the median of the enabled groups.
    hasDetails = false, // Determines whether detail data will be displayed or not. Disabling it saves preprocessing time if detail data is not to be displayed.
    doubleYlegend = false, // Allows the y-axis legend to be displayed on both sides of the chart.
    showGrid = false, // If active, a reference grid is displayed.
    brushGroupSize = 15, //Controls the size of the colored rectangles used to select the different brushGroups.
    /* Performance */
    maxDetailsRecords = 10, // How many results to show in the detail view
    maxTimelines = null, // Set to a value to limit the number of distinct timelines to show
    xPartitions = 10, // Partitions performed on the X-axis for the collision acceleration algorithm.
    yPartitions = 10, // Partitions performed on the Y-axis for the collision acceleration algorithm.
    /* Options */
    medianNumBins = 10, // Number of bins used to compute the group median.
    medianLineDash = [7], // Selected group median line dash pattern canvas style
    medianLineAlpha = 1, // Selected group median line opacity
    medianLineWidth = 2, // Selected group median line width
    medianFn = d3__namespace.median, // Function to use when showing the median
    medianMinRecordsPerBin = 5, // Min number of records each bin must have to be considered
    autoUpdate = true, // Allows to decide whether changes in brushes are processed while moving, or only at the end of the movement.
    _this, // pass the object this in order to be able to maintain the state in case of changes in the input
    fixAxis, // When active, the axes will not change when modifying the data.
    /* Legacy or to be deleted */
    groupAttr = null, // DEPRECATED use color instead: Specifies the attribute to be used to discriminate the groups (Note that it also supports functions).
    overviewWidth, // Legacy, to be deleted
    overviewHeight, // Legacy, to be deleted
    highlightAlpha = 1, // Transparency oh the highlighted lines (lines selected in other TS)
    renderer = "webgpu", // Rendering backend: 'webgpu' (default, GPU-accelerated) | 'canvas' (legacy Canvas 2D + d3)
    enableLOD = false, // If false, disables WebGPU LOD (point & line subsampling). Useful when outliers must not be dropped.
  } = {}
) {
  width = overviewWidth || width;
  height = overviewHeight || height;
  detailsMargin = detailsMargin || margin;

  let ts = {},
    groupedData,
    fData,
    overviewX,
    overviewY,
    divOverview,
    divRender,
    divControls,
    divData,
    brushesCoordinates,
    detailsElement,
    groupsElement,
    svg,
    gGroupBrushes,
    gBrushes,
    gReferences,
    brushSpinBoxes = null,
    medianBrushGroups,
    dataSelected,
    dataNotSelected,
    renderSelected, // Selected data to render. Depends on selected DataGroup and the selection of other TS
    renderNotSelected, // Non Selected data to render. Depends on selected DataGroup and the selection of other TS
    showNonSelected, // Determines if unselected data is rendered
    selectedGroupData,
    hasScaleTime,
    timelineDetails, // Centralizes the details component
    timelineOverview,
    brushes; // Stores the reference lines
  let gProbes;
  let helpSystem = null; // Sistema de ayuda: popup de documentación + demo guiada
  // Cache de render(): evita recrear Maps por frame cuando el estado no cambia.
  // render() siempre creaba new Map()/Array.from() → el dirty-cache de estilos GPU nunca saltaba
  // → updateStyles() escribía 3.2MB a la GPU en cada frame incluso sin cambios de selección.
  const _renderEmptyArray = [];
  let _renderInputSelected = null, _renderInputNotSelected = null, _renderInputHasSelection = undefined;
  let _renderCachedMDataSelected = null, _renderCachedMDataNotSelected = null, _renderCachedMedians = null;
  let sliders = new Map();
  let sliderSeq = 0;
  function getRefCurveById(refId) {
    if (!Array.isArray(referenceCurves)) return null;
    return (
      referenceCurves.find((c) => c.id === refId && c.isVisible !== false) ||
      null
    );
  }

  // util: delta de dominio equivalente a N píxeles (para bloquear cruces)
  function domainDxFromPixels(px = 6) {
    // convierte 0px y px a dominio (soporta Date y número)
    const d0 = +overviewX.invert(0);
    const d1 = +overviewX.invert(px);
    return Math.abs(d1 - d0) || 0;
  }
  // Interpolación lineal y clamp a extremos
  function getYAtX(curve, x) {
    if (!curve || !Array.isArray(curve.data) || !curve.data.length) return null;
    const data = curve.data;
    let lo = 0,
      hi = data.length - 1;

    if (x <= data[0][0]) return data[0][1];
    if (x >= data[hi][0]) return data[hi][1];

    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (data[mid][0] <= x) lo = mid;
      else hi = mid;
    }
    const [x0, y0] = data[lo],
      [x1, y1] = data[hi];
    const t = (x - x0) / (x1 - x0);
    return y0 * (1 - t) + y1 * t;
  }
  // Exported Parameters
  ts.xPartitions = xPartitions;
  ts.yPartitions = yPartitions;
  ts.defaultAlpha = defaultAlpha;
  ts.selectedAlpha = selectedAlpha;
  ts.noSelectedAlpha = noSelectedAlpha;
  ts.backgroundColor = backgroundColor;
  ts.defaultColor = defaultColor;
  ts.selectedColor = selectedColor;
  ts.noSelectedColor = noSelectedColor;
  ts.hasDetails = hasDetails;
  ts.margin = margin;
  ts.colorScale = colorScale;
  ts.brushesColorScale = brushesColorScale;
  ts.color = color;
  ts.doubleYlegend = doubleYlegend;
  ts.showGrid = showGrid;
  ts.showBrushTooltip = showBrushTooltip;
  ts.autoUpdate = autoUpdate;
  ts.brushGroupSize = brushGroupSize;
  ts.stepX = stepX;
  ts.stepY = stepY;
  ts.medianLineAlpha = medianLineAlpha;
  ts.medianLineWidth = medianLineWidth;
  ts.medianLineDash = medianLineDash;
  ts.medianNumBins = medianNumBins;
  ts.medianFn = medianFn;
  ts.alphaScale = alphaScale;
  ts.medianMinRecordsPerBin = medianMinRecordsPerBin;
  ts.yScale = yScale;
  ts.xScale = xScale;
  ts.highlightAlpha = highlightAlpha;
  ts.selectedColorTransform = selectedColorTransform;
  ts.renderer = renderer;
  ts.enableLOD = enableLOD;
  //Backwards compatibility with groupAttr.
  if (groupAttr) {
    console.warn('The attribute "groupAttr" is deprecated use "color" instead');
    color = groupAttr;
  }

  // Convert attrStrings to functions
  if (typeof x === "string") {
    let _x = x;
    x = (d) => d[_x];
  }
  if (typeof y === "string") {
    let _y = y;
    y = (d) => d[_y];
  }
  if (typeof id === "string") {
    let _id = id;
    id = (d) => d[_id];
  }
  if (color && typeof color === "string") {
    let _color = color;
    color = (d) => d[_color];
  }

  divOverview = d3__namespace
    .select(target)
    .style("display", "flex")
    .style("flex-wrap", "wrap")
    .style("position", "relative")
    .style("top", "0px")
    .style("left", "0px")
    .style("background-color", ts.backgroundColor)
    .node();

  divControls =
    divControls ||
    d3__namespace.select(target).select("#control").node() ||
    d3__namespace.create("div").attr("id", "control").node();
  brushesCoordinates =
    brushesCoordinates ||
    d3__namespace.select(target).select("#brushesCoordinates").node() ||
    d3__namespace.create("div").attr("id", "brushesCoordinates").node();
  groupsElement =
    groupsElement ||
    d3__namespace.select(target).select("#brushesGroups").node() ||
    d3__namespace.create("div").attr("id", "brushesGroups").node();
  medianBrushGroups = new Map();
  dataSelected = new Map();
  dataNotSelected = [];
  selectedGroupData = new Set();
  showNonSelected = true;

  function computeBrushColor(groupId) {
    return ts.brushesColorScale(groupId);
  }

  function onAddBrushGroup() {
    brushes.addBrushGroup();
  }
  function onEpsilonChange(rcId, newValue) {
    const curve = referenceCurves.find((c) => c.id === rcId);
    if (curve) {
      curve.epsilon = newValue;

      const bvh = brushes.getBvh();
      if (bvh) {
        bvh.removeReferenceCurves([rcId]);
        ts.addReferenceCurve([curve]);
      }
    }
  }

  function onChangeBrushGroupState(id, newState) {
    brushes.changeBrushGroupState(id, newState);
    updateDependentStates(id, newState);
    brushes.recomputeSelection();
    ts.printSliders();
    renderBrushesControls();
  }
    function onRemoveBrushGroup(id) {
    const affectedCurves = [];
    if (Array.isArray(referenceCurves)) {
      referenceCurves.forEach(curve => {
        if (curve.isSimplePoints && Array.isArray(curve.associations)) {
          const originalCount = curve.associations.length;
          curve.associations = curve.associations.filter(assoc => assoc.id !== id);
          if (curve.associations.length < originalCount) {
            affectedCurves.push(curve);
          }
        }
      });
    }
    if (affectedCurves.length > 0) {
      ts.addReferenceCurve(affectedCurves);
    }
    brushes.removeBrushGroup(id);
  }

  function onSelectBrushGroup(id) {
    const oldSelectedId = brushes.getBrushGroupSelected();
    brushes.selectBrushGroup(id);
    if (oldSelectedId !== undefined && oldSelectedId !== id) {
      const oldGroup = brushes.getBrushesGroup().get(oldSelectedId);
      if (oldGroup) {
        updateDependentStates(oldSelectedId, oldGroup.isEnable);
      }
    }

    updateDependentStates(id, true);

    brushes.recomputeSelection();
  }

  function initBrushesControls() {
    groupsElement.innerHTML = `
        <h3>Groups</h3>
        <div id="brushesList" style="margin-bottom: 8px;"></div>
        <button id="btnAddBrushGroup">Add Group</button>
    `;
    groupsElement
      .querySelector("button#btnAddBrushGroup")
      .addEventListener("click", onAddBrushGroup);

    const rcWidgetElement = d3__namespace
      .select(target)
      .selectAll("#rcWidget")
      .data([1])
      .join("div")
      .attr("id", "rcWidget")
      .style("margin-top", "15px")
      .node();

    rcWidgetElement.innerHTML = `
        <h3>Reference Curves</h3>
        <div id="rcList"></div>
    `;

    if (showBrushesControls) {
      divControls.appendChild(groupsElement);
      divControls.appendChild(rcWidgetElement);
    }
  }

  function renderGroupsWidget() {
    const brushesList = d3__namespace.select(groupsElement).select("#brushesList");

    const brushGroups = Array.from(brushes.getBrushesGroup()).filter(
      ([id, group]) => !group.name.startsWith("RC ")
    );

    brushesList
      .selectAll(".brushControl")
      .data(brushGroups, (d) => d[0])
      .join("div")
      .attr("class", "brushControl")
      .each(function (d) {
        const div = d3__namespace.select(this);
        const groupName = d[1].name;
        const groupCount = renderSelected.has(d[0])
          ? renderSelected.get(d[0]).length
          : 0;

        div.node().innerHTML = `<div style="display: flex; align-items: center; flex-wrap: nowrap; margin-bottom: 2px;">
            <input type="checkbox" id="checkBoxShowBrushGroup" ${
              d[1].isEnable ? "checked" : ""
            }></input>
            <div id="groupColor" style="
              min-width: ${ts.brushGroupSize}px; height: ${ts.brushGroupSize}px;
              background-color: ${computeBrushColor(d[0])};
              border: ${
                d[0] === brushes.getBrushGroupSelected()
                  ? "2px solid black"
                  : "1px solid #ccc"
              };
              margin: 0 5px; cursor: pointer;
            "></div>
            <input id="groupName" style="border: none; outline: none; width: ${
              groupName.length + 1
            }ch;" value="${groupName}"></input>
            <span id="groupSize" style="margin-right: 5px; cursor: pointer;">(${groupCount})</span>
            <button style="color: red; font-weight: bold; border:none; background:none; display:${
              brushes.getBrushesGroupSize() > 1 ? "block" : "none"
            }" id="btnRemoveBrushGroup">&cross;</button>
          </div>
        `;

        div.select("input#groupName").on("input", function () {
          this.style.width = this.value.length + 1 + "ch";
        });
        div.select("input#groupName").on("change", (evt) => {
          brushes.updateBrushGroupName(d[0], evt.target.value);
        });
        div.select("#btnRemoveBrushGroup").on("click", (e) => {
          e.stopPropagation();
          onRemoveBrushGroup(d[0]);
        });
        div.select("#checkBoxShowBrushGroup").on("change", (e) => {
          onChangeBrushGroupState(d[0], e.target.checked);
        });
        div
          .select("div#groupColor, span#groupSize")
          .on("click", () => onSelectBrushGroup(d[0]));
      });

    const nonSelectedContainer = d3__namespace
      .select(groupsElement)
      .selectAll(".nonSelectedControl")
      .data([1]);
    nonSelectedContainer
      .enter()
      .append("div")
      .attr("class", "nonSelectedControl")
      .merge(nonSelectedContainer)
      .each(function () {
        this.innerHTML = `<div style="display: flex; align-items: center; margin-top: 5px;">
                <input type="checkbox" id="checkBoxShowNonSelected" ${
                  showNonSelected ? "checked" : ""
                }></input>
                <span>Non selected (<span id="nonSelectedCount">${
                  renderNotSelected.length
                }</span>)</span>
            </div>`;
        d3__namespace.select(this)
          .select("#checkBoxShowNonSelected")
          .on("change", (e) => {
            showNonSelected = e.target.checked;
            onSelectionChange();
          });
      });
    d3__namespace.select(groupsElement)
      .select("#nonSelectedCount")
      .text(renderNotSelected.length);
  }
function renderReferenceCurvesWidget() {
    const rcWidget = d3__namespace.select(target).select("#rcWidget");
    const rcList = rcWidget.select("#rcList");
    if (!referenceCurves || referenceCurves.length === 0) {
      rcWidget.style("display", "none");
      return;
    }
    rcWidget.style("display", "block");

    rcList
      .selectAll(".rcControl")
      .data(referenceCurves, (d) => d.id)
      .join("div")
      .attr("class", "rcControl")
      .style("margin-bottom", "10px")
      .each(function (rc) {
        const div = d3__namespace.select(this);

        const actionButtonHTML = rc.isSimplePoints
          ? `<button class="add-association-btn" style="margin-left: 8px; font-size: 0.8em; cursor: pointer;">Add Association</button>`
          : `<button class="add-slider-btn" style="margin-left: 8px; font-size: 0.8em; cursor: pointer;">Add Slider</button>`;

        const hexColor = d3__namespace.color(rc.color || "#000000").formatHex();
        div.node().innerHTML = `
            <div style="display: flex; align-items: center; font-weight: bold;">
                <input type="checkbox" class="rc-visible-toggle" ${
                  rc.isVisible !== false ? "checked" : ""
                }></input>
                
                <input type="color" class="rc-color-picker" value="${hexColor}" title="Change Curve Color" style="
                  width: 20px; height: 20px; 
                  border: none; padding: 0; background: none;
                  margin: 0 5px; cursor: pointer;
                  flex-shrink: 0;">
                </input>

                <input class="rc-name" style="border: none; outline: none; font-weight: bold; width: ${String(
                  rc.name || rc.id
                ).length + 1}ch;" value="${rc.name || rc.id}"></input>
                ${actionButtonHTML} 
            </div>
            <div class="associations-list" style="margin-left: 20px; margin-top: 4px;"></div>
            <div class="sliders-list" style="margin-left: 20px; margin-top: 4px;"></div>
          `;

        div.select(".rc-color-picker").on("input", (e) => {
             rc.color = e.target.value;
             ts.printReferenceCurves(referenceCurves); 
             ts.printSliders(); 
        });

        div
          .select("input.rc-name")
          .on("input", function () {
            this.style.width = this.value.length + 1 + "ch";
          })
          .on("change", (evt) => {
            rc.name = evt.target.value;
          });

        div.select(".rc-visible-toggle").on("change", (e) => {
          rc.isVisible = e.target.checked;
          ts.printReferenceCurves(referenceCurves);
          ts.printSliders();
          brushes.recomputeSelection();
          renderBrushesControls();
        });

        div.select(".add-slider-btn").on("click", () => onAddSlider(rc.id));
        div
          .select(".add-association-btn")
          .on("click", () => onUpdatePointCurveAssociation(rc.id, null, "add"));

        // Render Sliders
        const associatedSliders = Array.from(sliders.values()).filter(
          (s) => s.rcId === rc.id
        );
        const slidersList = div.select(".sliders-list");
        slidersList
          .selectAll(".slider-control")
          .data(associatedSliders, (d) => d.id)
          .join("div")
          .attr("class", "slider-control")
          .each(function (slider) {
            const group = brushes.getBrushesGroup().get(slider.groupId);
            const groupName = group ? group.name : "...";

            d3__namespace.select(this).node().innerHTML = `
                  <div style="display: flex; align-items: center; margin-bottom: 2px; font-size: 0.9em;">
                      <input type="checkbox" class="slider-enabled-toggle" title="Enable/Disable Slider" ${
                        slider.userEnabled ? "checked" : ""
                      } style="margin-right: 5px;"></input>
                      
                      <input class="slider-name" style="border: none; outline: none; width: ${String(
                        slider.name
                      ).length + 1}ch;" value="${slider.name}"></input>
                      <span style="margin-left: 2px;">(${groupName})</span>
                      <div title="Associated Group Color" style="width: 12px; height: 12px; background-color: ${
                        computeBrushColor(
                          slider.groupId
                        )
                      }; margin: 0 5px; border: 1px solid #ccc;"></div>
                      <button class="toggle-side-btn" title="Toggle position (above/below)" style="border: none; background: none; cursor: pointer; font-size: 1.1em; padding: 0 5px;">
                          ${slider.side === "above" ? "\u2193" : "\u2191"}
                      </button>
                      
                      <button class="remove-slider-btn" title="Remove Slider" style="color: red; border:none; background:none; font-weight: bold; cursor: pointer;">&cross;</button>
                  </div>
                `;

            d3__namespace.select(this)
              .select("input.slider-name")
              .on("input", function () {
                this.style.width = this.value.length + 1 + "ch";
              })
              .on("change", (evt) => {
                slider.name = evt.target.value;
              });

            d3__namespace.select(this)
              .select(".toggle-side-btn")
              .on("click", () => {
                slider.side = slider.side === "above" ? "below" : "above";
                ts.printSliders();
                brushes.recomputeSelection();
                renderReferenceCurvesWidget();
              });
            d3__namespace.select(this)
              .select(".slider-enabled-toggle")
              .on("change", (e) => onToggleSlider(slider.id, e.target.checked));
            d3__namespace.select(this)
              .select(".remove-slider-btn")
              .on("click", () => onRemoveSlider(slider.id));
          });

        // Render Point Associations
        const pointAssociations =
          rc.isSimplePoints && Array.isArray(rc.associations)
            ? rc.associations
            : [];
        const associationsList = div.select(".associations-list");
        associationsList
          .selectAll(".association-control")
          .data(pointAssociations, (d) => d.id)
          .join("div")
          .attr("class", "association-control")
          .style("display", rc.isVisible !== false ? "block" : "none")
          .each(function (assoc) {
            if (assoc.userEnabled === undefined) {
              assoc.userEnabled = assoc.enabled;
            }
            if (assoc.aggregation === undefined) {
              assoc.aggregation = BrushAggregation.And;
            }
            if (assoc.negate === undefined) {
              assoc.negate = false; 
            }

            const group = brushes.getBrushesGroup().get(assoc.id);
            const groupName = group ? group.name : "...";
            const uniqueId = `rc-${rc.id}-assoc-${assoc.id}`;

            d3__namespace.select(this).node().innerHTML = `
                  <div style="display: flex; align-items: center; margin-bottom: 2px; font-size: 0.9em;">
                      <input type="checkbox" class="assoc-enabled-toggle" title="Enable/Disable Association" ${
                        assoc.userEnabled ? "checked" : ""
                      } style="margin-right: 5px;"></input>

                      <span>(${groupName})</span>
                      <div title="Associated Group Color" style="width: 12px; height: 12px; background-color: ${computeBrushColor(
                        assoc.id
                      )}; margin: 0 5px; border: 1px solid #ccc;"></div>
                      
                      <div style="font-size: 0.9em; margin-right: 5px;">
                        <input type="radio" id="${uniqueId}-and" name="${uniqueId}-agg" value="and" 
                          ${
                            assoc.aggregation === BrushAggregation.And
                              ? "checked"
                              : ""
                          }>
                        <label for="${uniqueId}-and" style="cursor: pointer;">AND</label>
                        
                        <input type="radio" id="${uniqueId}-or" name="${uniqueId}-agg" value="or" 
                          ${
                            assoc.aggregation === BrushAggregation.Or
                              ? "checked"
                              : ""
                          }>
                        <label for="${uniqueId}-or" style="cursor: pointer;">OR</label>
                      </div>

                      <div style="font-size: 0.9em; margin-right: 5px; padding-left: 5px; border-left: 1px solid #ccc;">
                        <input type="checkbox" id="${uniqueId}-not" name="${uniqueId}-not" 
                          ${assoc.negate ? "checked" : ""}>
                        <label for="${uniqueId}-not" style="cursor: pointer;">NOT</label>
                      </div>
                      
                      <button class="remove-assoc-btn" title="Remove Association" style="color: red; border:none; background:none; font-weight: bold; cursor: pointer;">&cross;</button>
                  </div>
                `;

            d3__namespace.select(this)
              .select(`#${uniqueId}-and`)
              .on("change", () => {
                assoc.aggregation = BrushAggregation.And;
                brushes.recomputeSelection();
              });
            d3__namespace.select(this)
              .select(`#${uniqueId}-or`)
              .on("change", () => {
                assoc.aggregation = BrushAggregation.Or;
                brushes.recomputeSelection();
              });
            
            d3__namespace.select(this)
              .select(`#${uniqueId}-not`)
              .on("change", (e) => {
                assoc.negate = e.target.checked;
                brushes.recomputeSelection();
              });

            d3__namespace.select(this)
              .select(".assoc-enabled-toggle")
              .on("change", (e) => {
                onUpdatePointCurveAssociation(
                  rc.id,
                  assoc.id,
                  "toggle",
                  e.target.checked
                );
              });
            d3__namespace.select(this)
              .select(".remove-assoc-btn")
              .on("click", () => {
                onUpdatePointCurveAssociation(rc.id, assoc.id, "remove");
              });
          });

        if (rc.isSimplePoints) {
          const epsilonControl = div
            .selectAll(".epsilon-control")
            .data([rc])
            .join("div")
            .attr("class", "epsilon-control")
            .style("margin-left", "20px")
            .style("font-size", "0.9em")
            .style("margin-bottom", "5px")
            .style("display", rc.isVisible !== false ? "flex" : "none")
            .style("align-items", "center").html(`
            <label style="margin-right: 5px;">Collision Tolerance:</label>
            <input type="number" class="epsilon-input"
                   value="${rc.epsilon}" min="0" step="0.1"
                   style="width: 5ch;">
        `);

          const epsilonInput = epsilonControl.select(".epsilon-input");

          epsilonInput.on("change", (event) => {
            const newValue = +event.target.value;
            if (!isNaN(newValue) && newValue >= 0) {
              onEpsilonChange(rc.id, newValue);
            }
          });

          epsilonInput.on("input", function () {
            this.style.width = Math.max(5, this.value.length + 2) + "ch";
          });
          epsilonInput.dispatch("input");
        }
      });
  }

  function onUpdatePointCurveAssociation(rcId, groupId, action, newState) {
    const ref = referenceCurves.find((c) => c.id === rcId);
    if (!ref) return;

    if (!Array.isArray(ref.associations)) {
      ref.associations = [];
    }

    if (action === "add") {
      const selectedGroupId = brushes.getBrushGroupSelected();
      if (selectedGroupId === undefined || selectedGroupId === null) {
        alert("Please select a Group before adding an association.");
        return;
      }
      if (!ref.associations.some((a) => a.id === selectedGroupId)) {
        ref.associations.push({
          id: selectedGroupId,
          enabled: true,
          userEnabled: true,
        });
      }
    } else if (action === "remove" && groupId !== null) {
      ref.associations = ref.associations.filter((a) => a.id !== groupId);
    } else if (action === "toggle" && groupId !== null) {
      const assoc = ref.associations.find((a) => a.id === groupId);
      if (assoc) {
        assoc.userEnabled = newState;
        const group = brushes.getBrushesGroup().get(assoc.id);
        const groupIsEnabled = group ? group.isEnable : false;
        assoc.enabled = groupIsEnabled && assoc.userEnabled;
      }
    }
       ts.addReferenceCurve([ref]);
    renderReferenceCurvesWidget();
  }
  function renderBrushesControls() {
    renderGroupsWidget();
    renderReferenceCurvesWidget();
  }
  function updateDependentStates(groupId, groupIsEnabled) {
    for (const slider of sliders.values()) {
      if (slider.groupId === groupId) {
        slider.enabled = groupIsEnabled && slider.userEnabled;
      }
    }

    (referenceCurves || []).forEach((curve) => {
      if (curve.isSimplePoints && Array.isArray(curve.associations)) {
        const assoc = curve.associations.find((a) => a.id === groupId);
        if (assoc) {
          assoc.enabled = groupIsEnabled && assoc.userEnabled;
        }
      }
    });

    brushes.updateReferenceCurves(referenceCurves);
  }
 function onAddSlider(rcId) {
    // Primero, encontramos la curva por su ID, sin importar si está visible o no.
    const ref = Array.isArray(referenceCurves)
      ? referenceCurves.find((c) => c.id === rcId)
      : null;

    if (!ref) {
      // Este es un caso de seguridad, es poco probable que ocurra.
      alert(`Error: No se encontró la curva de referencia con ID "${rcId}".`);
      return;
    }

    if (ref.isVisible === false) {
      alert("You can't add a slider to a reference curve that isn't visible. Please activate it first.");
      return; // Detenemos la ejecución aquí.
    }
    
    if (!ref.data || ref.data.length < 2 || ref.isSimplePoints) {
      console.warn(
        "Cannot add slider to this reference curve (no data, not a polyline, or not found)."
      );
      alert(
        "You can't add a slider to this reference curve. It may not be a polyline or may not have enough data."
      );
      return;
    }

    const groupId = brushes.getBrushGroupSelected();
    if (groupId === undefined || groupId === null) {
      alert("Please select a Group before adding a slider.");
      return;
    }

    const curveDomain = d3__namespace.extent(ref.data, (d) => d[0]);
    const domainStart =
      curveDomain[0] instanceof Date
        ? curveDomain[0].getTime()
        : curveDomain[0];
    const domainEnd =
      curveDomain[1] instanceof Date
        ? curveDomain[1].getTime()
        : curveDomain[1];
    const domainWidth = domainEnd - domainStart;

    let leftX = domainStart + domainWidth * 0.25;
    let rightX = domainStart + domainWidth * 0.75;

    if (curveDomain[0] instanceof Date) {
      leftX = new Date(leftX);
      rightX = new Date(rightX);
    }

    const sliderId = ++sliderSeq;
    sliders.set(sliderId, {
      id: sliderId,
      name: `Slider ${sliderId}`,
      rcId: rcId,
      groupId: groupId,
      side: "above",
      enabled: true,
      userEnabled: true,
      leftX: leftX,
      rightX: rightX,
      mode: BrushModes.Intersect,
      aggregation: BrushAggregation.And,
      negate: false,
    });

    brushes.recomputeSelection();
    ts.printSliders();
    renderReferenceCurvesWidget();
  }

  function onRemoveSlider(sliderId) {
    sliders.delete(sliderId);
    brushes.recomputeSelection();
    ts.printSliders();
    renderReferenceCurvesWidget();
  }

  function onToggleSlider(sliderId, isEnabled) {
    if (sliders.has(sliderId)) {
      const slider = sliders.get(sliderId);
      slider.userEnabled = isEnabled;
      const group = brushes.getBrushesGroup().get(slider.groupId);
      const groupIsEnabled = group ? group.isEnable : false;
      slider.enabled = groupIsEnabled && slider.userEnabled;
      brushes.recomputeSelection();
      ts.printSliders();
    }
  }
  function initDomains({ xDataType, fData }) {
    if (!xDomain) {
      xDomain = fixAxis && _this ? _this.extent.x : d3__namespace.extent(fData, x);
    }

    overviewX = xScale ? xScale.copy() : undefined;

    if (xDataType === "object" && x(fData[0]) instanceof Date) {
      hasScaleTime = true;
      if (!overviewX) overviewX = d3__namespace.scaleTime();
      overviewX.domain(xDomain);
      if (!fmtX) {
        // It is a function of type d3.timeFormat. I don't like the way to check that it is a function of that type, but I don't know a better one.
        fmtX = d3__namespace.timeFormat("%Y-%m-%d");
      } else if (fmtX.name === "M") {
        console.log(
          "\uD83D\uDC41\uFE0Ft has been detected that the parameter fmtX formats numerical data, while the data selected for " +
            'the X-axis is a date. The function d3.timeFormat("%Y-%m-%d") will be used as fmtX; '
        );
        fmtX = d3__namespace.timeFormat("%Y-%m-%d");
      }
    } else {
      // We if x is something else overviewX won't be assigned
      // if (xDataType === "number") {
      // X is number
      if (!overviewX) overviewX = d3__namespace.scaleLinear();
      overviewX.domain(xDomain);
      if (!fmtX) {
        fmtX = d3__namespace.format(".1f");
      }
    }

    overviewX.range([0, width - ts.margin.right - ts.margin.left]).nice();

    if (!yDomain) {
      yDomain = fixAxis && _this ? _this.extent.y : d3__namespace.extent(fData, y); // Keep same axes as in the first rendering
    }

    overviewY = yScale.copy();

    overviewY.domain(yDomain);

    overviewY
      .range([height - ts.margin.top - ts.margin.bottom, 0])
      .nice()
      .clamp(true);
  }

  function init() {
    //CreateOverView
    referenceCurves = referenceCurves || [];
    divData = d3__namespace
      .select(divControls)
      .selectAll("div#divData")
      .data([1])
      .join("div")
      .attr("id", "divData");

    divRender = d3__namespace
      .select(divOverview)
      .selectAll("div#render")
      .data([1])
      .join("div")
      .attr("id", "render")
      .style("position", "relative")
      .style("z-index", 1);

    timelineOverview = TimeLineOverview({
      ts,
      element: divRender.node(),
      width: width,
      height: height,
      x,
      y,
      groupAttr: color,
      overviewX,
      overviewY,
      renderer, 
    });

    svg = divRender
      .selectAll("svg")
      .data([1])
      .join("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("height", height)
      .attr("width", width);

    const g = svg
      .selectAll("g.gDrawing")
      .data([1])
      .join("g")
      .attr("class", "gDrawing")
      .attr("transform", `translate(${ts.margin.left}, ${ts.margin.top})`)
      .attr("tabindex", 0)
      .style("pointer-events", "all")
      .style("outline", "-webkit-focus-ring-color solid 0px")
      .on("keydown", (e) => {
        e.preventDefault();
        switch (e.key) {
          case "r":
          case "Backspace":
          case "Delete":
            brushes.removeSelectedBrush();
            break;
          case "+":
            onAddBrushGroup();
            break;
          case "ArrowRight":
            onArrowRigth();
            break;
          case "ArrowLeft":
            onArrowLeft();
            break;
          case "ArrowUp":
            onArrowUp();
            break;
          case "ArrowDown":
            onArrowDown();
            break;
          case "i":
            brushes.invertQuerySelectedGroup();
            break;
        }
      });

    let yAxis = d3__namespace.axisLeft(overviewY);
    if (yTicks) {
      yAxis
        .tickValues(yTicks.map((d) => d[0]))
        .tickFormat((d, i) => (yTicks[i][1] ? yTicks[i][1] : yTicks[i][0]));
    }

    let gmainY = g
      .selectAll("g.mainYAxis")
      .data([1])
      .join("g")
      .attr("class", "mainYAxis")
      .call(yAxis)
      .call((axis) =>
        axis
          .selectAll("text.label")
          .data([1])
          .join("text")
          .text(yLabel)
          .attr("dy", -15)
          .attr("class", "label")
          .style("fill", "black")
          .style("text-anchor", "end")
          .style("pointer-events", "none")
      )
      .style("pointer-events", "none");

    if (ts.doubleYlegend) {
      g.selectAll("g.secondYaxis")
        .data([1])
        .join("g")
        .attr("class", "secondYaxis")
        .call(d3__namespace.axisRight(overviewY))
        .attr(
          "transform",
          `translate(${width - ts.margin.left - ts.margin.right},0)`
        )
        .style("pointer-events", "none");
    }

    let xAxis = d3__namespace.axisBottom(overviewX ? overviewX : g);
    if (xTicks) {
      xAxis
        .tickValues(xTicks.map((d) => d[0]))
        .tickFormat((d, i) => (xTicks[i][1] ? xTicks[i][1] : xTicks[i][0]));
    }

    let gmainx = g
      .selectAll("g.mainXAxis")
      .data([1])
      .join("g")
      .attr("class", "mainXAxis")
      .call(xAxis)
      .attr(
        "transform",
        `translate(0, ${height - ts.margin.top - ts.margin.bottom})`
      )
      .call((axis) =>
        axis
          .selectAll("text.label")
          .data([1])
          .join("text")
          .attr("class", "label")
          .text(xLabel)
          .attr(
            "transform",
            `translate(${width - ts.margin.right - ts.margin.left - 5}, -10 )`
          )
          .style("fill", "black")
          .style("text-anchor", "end")
          .style("pointer-events", "none")
      )
      .style("pointer-events", "none");

    gReferences = g
      .selectAll("g.gReferences")
      .data([1])
      .join("g")
      .attr("class", "gReferences")
      .style("pointer-events", "none");

    gmainY
      .selectAll("g.tick")
      .selectAll(".gridline")
      .data(ts.showGrid ? [1] : [])
      .join("line")
      .attr("class", "gridline")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width - ts.margin.right - ts.margin.left)
      .attr("y2", 0)
      .attr("stroke", "#9ca5aecf") // line color
      .attr("stroke-dasharray", "4"); // make it dashed;;

    gmainx
      .selectAll("g.tick")
      .selectAll(".gridline")
      .data(ts.showGrid ? [1] : [])
      .join("line")
      .attr("class", "gridline")
      .attr("x1", 0)
      .attr("y1", -height + ts.margin.top + ts.margin.bottom)
      .attr("x2", 0)
      .attr("y2", 0)
      .attr("stroke", "#9ca5aecf") // line color
      .attr("stroke-dasharray", "4"); // make it dashed;

    if (color) {
      fData.forEach((d) => selectedGroupData.add(color(d)));
      selectedGroupData.size;
    }

    gGroupBrushes = svg
      .selectAll("g.colorBrushes")
      .data([1])
      .join("g")
      .attr("class", "colorBrushes")
      .attr(
        "transform",
        `translate(${ts.margin.left + 10},${
          ts.margin.top - ts.brushGroupSize - 5
        } )`
      );

    // TODO John: We might want to move this into brushInteraction
    gBrushes = g
      .selectAll("g#brushes")
      .data([1])
      .join("g")
      .attr("id", "brushes");

    gProbes = g
      .selectAll("g.gProbes")
      .data([1])
      .join("g")
      .attr("class", "gProbes");

    //Before create the brushes structure, we generete the reerence lines points.
    //THIS IS ONLY TO GENERATE POINTS FOR THE FUNCTIONS
    if (referenceCurves) {
      referenceCurves = generateCurvePoints(
        referenceCurves,
        overviewX.domain(),
        overviewY.domain()
      );
    }

    brushes = brushInteraction({
      ts,
      element: gBrushes.node(),
      data: groupedData,
      tooltipTarget: divRender.node(),
      contextMenuTarget: divRender.node(),
      width,
      height,
      xPartitions,
      yPartitions,
      x,
      y,
      brushShadow,
      fmtY,
      fmtX: fmtX,
      scaleX: overviewX,
      scaleY: overviewY,
      updateTime: 150,
      extent: [
        [0, 0],
        [
          width - margin.left - margin.right,
          height - margin.top - margin.bottom,
        ],
      ],
      selectionCallback: onSelectionChange,
      groupsCallback: onBrushGroupsChange,
      changeSelectedCoordinatesCallback: onBrushCoordinatesChange,
      referenceCurves: referenceCurves,
      getProbePairBoxes: () => ts.getActiveSliderBoxes(),
      getSliders: () => sliders,
      getYAtX: getYAtX,
      printSlidersCallback: () => ts.printSliders(),
    });

    gGroupBrushes
      .selectAll("text")
      .data([1])
      .join("text")
      .attr("x", 0)
      .attr("y", ts.brushGroupSize / 2 + 2)
      .text("Groups + : ")
      .style("cursor", "pointer")
      .on("click", onAddBrushGroup);

    divOverview.appendChild(divControls);
    initBrushCoordinates();
    initBrushesControls();

    // init() puede ejecutarse varias veces (ts.data); el sistema de ayuda solo se crea una vez.
    if (showHelp && !helpSystem) {
      helpSystem = HelpSystem({
        container: divOverview,
        lang: helpLang,
        elements: {
          chart: () => divRender.node(),
          groups: () => (showBrushesControls ? groupsElement : null),
          referenceCurves: () =>
            referenceCurves && referenceCurves.length
              ? d3__namespace.select(target).select("#rcWidget").node()
              : null,
          coordinates: () =>
            showBrushesCoordinates ? brushesCoordinates : null,
          dataGroups: () => (color && divData ? divData.node() : null),
          details: () =>
            ts.hasDetails && showDetails ? detailsElement : null,
        },
      });
    }

    return g;
  }

  // Callback that is called every time the coordinates of the selected brush are modified.
  function onBrushCoordinatesChange(selection) {
    _setCoordsMode("timebox");
    updateBrushSpinBox(selection);
    updateStatus();
  }

  function updateBrushSpinBox(selection) {
    if (selection) {
      let [[x0, y0], [x1, y1]] = selection;

      // When initializing the brushes the spinbox is not ready
      if (brushSpinBoxes) {
        let [[sx0, sy0], [sx1, sy1]] = brushSpinBoxes;

        sx0.node().value = fmtX(x0);
        sx1.node().value = fmtX(x1);
        sy0.node().value = fmtY(y1).replace("\u2212", "-"); // Change D3 minus sign to parseable minus
        sy1.node().value = fmtY(y0).replace("\u2212", "-");
      } else {
        log();
      }
    } else {
      emptyBrushSpinBox();
    }
  }

  function emptyBrushSpinBox() {
    let [[sx0, sy0], [sx1, sy1]] = brushSpinBoxes;

    sx0.node().value = "";
    sx1.node().value = "";
    sy0.node().value = "";
    sy1.node().value = "";
  }

  function initBrushCoordinates() {
    brushesCoordinates.innerHTML = "";
    let selection = d3__namespace.select(brushesCoordinates);
    let divX = selection.append("div");

    divX.append("span").text(xLabel ? xLabel : "X Axis:");

    let divInputX = divX.append("div");

    let domainX = overviewX.domain();
    let x0 = divInputX
      .append("div")
      .append("input")
      .attr("type", hasScaleTime ? "Date" : "number")
      .attr("min", hasScaleTime ? fmtX(domainX[0]) : domainX[0])
      .attr("max", hasScaleTime ? fmtX(domainX[1]) : domainX[1])
      .attr("step", ts.stepX)
      .attr("width", "50%")
      // .style("background-color", ts.backgroundColor)
      .on("change", onSpinboxChange);

    let x1 = divInputX
      .append("div")
      .append("input")
      .attr("type", hasScaleTime ? "Date" : "number")
      .attr("min", hasScaleTime ? fmtX(domainX[0]) : domainX[0])
      .attr("max", hasScaleTime ? fmtX(domainX[1]) : domainX[1])
      .attr("width", "50%")
      .attr("step", ts.stepX)
      // .style("background-color", ts.backgroundColor)
      .on("change", onSpinboxChange);

    let divY = selection.append("div").attr("id", "coordsYRow");

    divY.append("span").text(yLabel ? yLabel : "Y Axis:");

    let divInputY = divY.append("div");

    let domainY = overviewY.domain();

    let y0 = divInputY
      .append("div")
      .append("input")
      .attr("type", "number")
      .attr("min", domainY[0])
      .attr("max", domainY[1])
      .attr("width", "50%")
      .attr("step", ts.stepY)
      // .style("background-color", ts.backgroundColor)
      .on("change", onSpinboxChange);

    let y1 = divInputY
      .append("div")
      .append("input")
      .attr("type", "number")
      .attr("min", domainY[0])
      .attr("max", domainY[1])
      .attr("width", "50%")
      .attr("step", ts.stepY)
      // .style("background-color", ts.backgroundColor)
      .on("change", onSpinboxChange);

    brushSpinBoxes = [
      [x0, y0],
      [x1, y1],
    ];

    if (showBrushesCoordinates) {
      selection
        .insert("h3", ":first-child")
        .attr("id", "coordsTitle")
        .text("Current TimeBox Coordinates:");
      divControls.appendChild(brushesCoordinates);
    }
  }

  let _coordsActiveSlider = null;

  function _setCoordsMode(mode) {
    const titleEl = brushesCoordinates
      ? brushesCoordinates.querySelector("#coordsTitle")
      : null;
    const yRow = brushesCoordinates
      ? brushesCoordinates.querySelector("#coordsYRow")
      : null;
    if (mode === "slider") {
      if (titleEl) titleEl.textContent = "Current Slider Coordinates:";
      if (yRow) yRow.style.display = "none";
    } else {
      _coordsActiveSlider = null;
      if (titleEl) titleEl.textContent = "Current TimeBox Coordinates:";
      if (yRow) yRow.style.display = "";
    }
  }

  function updateSliderSpinBox(slider) {
    if (!brushSpinBoxes) return;
    let [[sx0, ], [sx1, ]] = brushSpinBoxes;
    _coordsActiveSlider = slider;
    _setCoordsMode("slider");
    sx0.node().value = fmtX(slider.leftX);
    sx1.node().value = fmtX(slider.rightX);
  }

  function generateDataSelectionDiv() {
    if (color) {
      divData.node().innerHTML = "";
      divData.append("span").text("Data groups: ");

      let divButtons = divData
        .selectAll(".groupData")
        .data(selectedGroupData)
        .join("div")
        .attr("class", "groupData");
      divButtons
        .append("button")
        .style("font-size", `${ts.brushGroupSize}px`)
        .style("stroke", "black")
        .style("margin", "2px")
        .style("margin-right", "10px")
        .style("border-width", "3px")
        .style("border", "solid black")
        .style("width", `${ts.brushGroupSize}px`)
        .style("height", `${ts.brushGroupSize}px`)
        .style("background-color", (d) => ts.colorScale(d))
        .on("click", function (event, d) {
          if (selectedGroupData.has(d)) {
            selectedGroupData.delete(d);
            d3__namespace.select(this).style("border", "solid transparent");
          } else {
            selectedGroupData.add(d);
            d3__namespace.select(this).style("border", "solid black");
          }

          onGroupDataChange();
        });
      divButtons.append("span").text((d) => d);
    }
  }

  // Filter dataSelected and dataNotSelected by enable dataGroups
  function filterDatabyDataGroups(dataSelected, dataNotSelected) {
    let dataSelectedF = new Map(dataSelected);
    let dataNotSelectedF = dataNotSelected;
    for (let d of dataSelectedF) {
      let filtered = d[1].filter((d) => selectedGroupData.has(color(d[1][0])));
      dataSelectedF.set(d[0], filtered);
    }
    dataNotSelectedF = dataNotSelectedF.filter((d) =>
      selectedGroupData.has(color(d[1][0]))
    );

    return [dataSelectedF, dataNotSelectedF];
  }

  // Called when the active dataGroups are modified.
  function onGroupDataChange() {
    onSelectionChange();
  }

  function initDetails({ overviewX, overviewY }) {
    if (ts.hasDetails) {
      // see if already exists and element and reutilize it, if not create new div
      if (!detailsElement) {
        detailsElement =
          d3__namespace.select(target).select("#details").node() ||
          d3__namespace.create("div").attr("id", "#details").node();
      }

      // TimelineDetails object
      timelineDetails = TimelineDetails({
        ts,
        detailsElement,
        detailsContainerHeight,
        detailsWidth,
        maxDetailsRecords,
        detailsHeight,
        x,
        y,
        margin: detailsMargin,
      });

      timelineDetails.setScales({ overviewX, overviewY });
      if (showDetails) divOverview.appendChild(detailsElement);
    }
  }

  // Callback that is called when the value of the spinboxes is modified.
  function onSpinboxChange(sourceEvent) {
    // ── Modo Slider: actualizar leftX / rightX del slider activo ──
    if (_coordsActiveSlider) {
      const slider = _coordsActiveSlider;
      let [[sx0, ], [sx1, ]] = brushSpinBoxes;
      let newLeft, newRight;
      if (hasScaleTime) {
        newLeft  = new Date(sx0.node().value);
        newRight = new Date(sx1.node().value);
      } else {
        newLeft  = +sx0.node().value;
        newRight = +sx1.node().value;
      }
      // Garantizar orden y separación mínima
      if (newLeft >= newRight) {
        if (sourceEvent.target === sx0.node()) {
          newRight = newLeft + ts.stepX;
          sx1.node().value = fmtX(newRight);
        } else {
          newLeft = newRight - ts.stepX;
          sx0.node().value = fmtX(newLeft);
        }
      }
      slider.leftX  = newLeft;
      slider.rightX = newRight;
      ts.printSliders();
      brushes.recomputeSelection();
      return;
    }

    // ── Modo TimeBox (comportamiento original) ────────────────────
    let selectedBrush = brushes.getSelectedBrush();
    if (selectedBrush === null) return;

    let [[sx0, sy0], [sx1, sy1]] = brushSpinBoxes;

    let domainX = overviewX.domain();

    let x0;
    let x1;
    let y0 = +sy1.node().value;
    let y1 = +sy0.node().value;

    if (hasScaleTime) {
      x0 = new Date(sx0.node().value);
      x1 = new Date(sx1.node().value);
      if (x0 >= x1) {
        if (sourceEvent.target === sx0.node()) {
          x1 = add(x0, ts.stepX);
          x1 = Math.min(x1, domainX[1]);
          sx1.node().value = fmtX(x1);
        } else {
          x0 = sub(x1, ts.stepX);
          x0 = Math.max(x0, domainX[0]);
          sx0.node().value = fmtX(x0);
        }
      }
    } else {
      x0 = +sx0.node().value;
      x1 = +sx1.node().value;

      if (x0 >= x1) {
        if (sourceEvent.target === sx0.node()) {
          x1 = x0 + ts.stepX;
          sx1.node().value = x1;
        } else {
          x0 = x1 - ts.stepX;
          sx0.node().value = x0;
        }
      }
    }

    if (y1 >= y0) {
      if (sourceEvent.target === sy0.node()) {
        y0 = y1 + ts.stepY;
        sy1.node().value = y0;
      } else {
        y1 = y0 - ts.stepY;
        sy0.node().value = y1;
      }
    }

    brushes.moveSelectedBrush([
      [x0, y0],
      [x1, y1],
    ]);
  }

  function onArrowRigth() {
    let selectedBrush = brushes.getSelectedBrush();
    if (selectedBrush === null) return;

    let [[x0, y0], [x1, y1]] = selectedBrush[1].selectionDomain;

    let maxX = overviewX.domain()[1];

    if (hasScaleTime) {
      x1 = add(x1, ts.stepX);
      if (x1 > maxX) {
        x1 = sub(x1, ts.stepX);
        let dist = intervalToDuration({ start: x1, end: maxX });
        x1 = maxX;
        x0 = add(x0, dist);
      } else {
        x0 = add(x0, ts.stepX);
      }
    } else {
      x1 += ts.stepX;
      if (x1 > maxX) {
        let dist = maxX - x1 + ts.stepX;
        x1 = maxX;
        x0 -= dist;
      } else {
        x0 += ts.stepX;
      }
    }

    brushes.moveSelectedBrush(
      [
        [x0, y0],
        [x1, y1],
      ],
      true
    );
  }

  function onArrowLeft() {
    let selectedBrush = brushes.getSelectedBrush();
    if (selectedBrush === null) return;

    let [[x0, y0], [x1, y1]] = selectedBrush[1].selectionDomain;

    let minX = overviewX.domain()[0];

    if (hasScaleTime) {
      x0 = sub(x0, ts.stepX);
      if (x0 < minX) {
        x0 = add(x0, ts.stepX);
        let dist = intervalToDuration({ start: minX, end: x0 });
        x0 = minX;
        x1 = sub(x1, dist);
      } else {
        x1 = sub(x1, ts.stepX);
      }
    } else {
      x0 -= ts.stepX;
      if (x0 < minX) {
        let dist = x0 + ts.stepX - minX;
        x0 = minX;
        x1 -= dist;
      } else {
        x1 -= ts.stepX;
      }
    }

    brushes.moveSelectedBrush(
      [
        [x0, y0],
        [x1, y1],
      ],
      true
    );
  }

  function onArrowDown() {
    let selectedBrush = brushes.getSelectedBrush();
    if (selectedBrush === null) return;

    let [[x0, y0], [x1, y1]] = selectedBrush[1].selectionDomain;

    y1 -= ts.stepY;

    let minY = overviewY.domain()[0];

    if (y1 < minY) {
      let dist = y1 + ts.stepY - minY;
      y1 = minY;
      y0 -= dist;
    } else {
      y0 -= ts.stepY;
    }
    brushes.moveSelectedBrush(
      [
        [x0, y0],
        [x1, y1],
      ],
      true
    );
  }

  function onArrowUp() {
    let selectedBrush = brushes.getSelectedBrush();
    if (selectedBrush === null) return;

    let [[x0, y0], [x1, y1]] = selectedBrush[1].selectionDomain;

    y0 += ts.stepY;

    let maxY = overviewY.domain()[1];

    if (y0 > maxY) {
      let dist = maxY - y0 + ts.stepY;
      y0 = maxY;
      y1 += dist;
    } else {
      y1 += ts.stepY;
    }

    brushes.moveSelectedBrush(
      [
        [x0, y0],
        [x1, y1],
      ],
      true
    );
  }

  // To render the overview and detailed view based on the selectedData
  // En TimeWidget.js
  // En TimeWidget.js

  function render(dataSelected, dataNotSelected, hasSelection) {
    let medians, mDataSelected, mDataNotSelectedArr;

    if (
      dataSelected   === _renderInputSelected   &&
      dataNotSelected === _renderInputNotSelected &&
      hasSelection   === _renderInputHasSelection &&
      _renderCachedMDataSelected !== null
    ) {
      // Cache hit: mismos objetos de entrada → la selección no cambió entre frames.
      // Pasamos las mismas referencias a timelineOverview.render() para que su
      // dirty-check de estilos salte el writeBuffer de 3.2MB.
      mDataSelected    = _renderCachedMDataSelected;
      mDataNotSelectedArr = _renderCachedMDataNotSelected;
      medians          = _renderCachedMedians;
    } else {
      // Cache miss: recalcular Maps y medianas
      medians = [];
      let enableBrushGroups = brushes.getEnableGroups();
      enableBrushGroups.forEach((id) => {
        if (medianBrushGroups.has(id)) {
          medians.push([id, medianBrushGroups.get(id)]);
        }
      });

      const isGroupWithPointAssociation = (groupId) => {
        const hasPointAssoc = (referenceCurves || []).some(
          (rc) =>
            rc.isSimplePoints &&
            Array.isArray(rc.associations) &&
            rc.associations.some((assoc) => assoc.id === groupId && assoc.enabled)
        );
        const hasActiveSlider = Array.from(sliders.values()).some(
          (s) => s.groupId === groupId && s.enabled
        );
        return hasPointAssoc || hasActiveSlider;
      };

      mDataSelected = new Map();
      let mDataNotSelectedSet = new Set(dataNotSelected);

      dataSelected.forEach((groupData, groupId) => {
        const group = brushes.getBrushesGroup().get(groupId);
        if ((group && group.isEnable) || isGroupWithPointAssociation(groupId)) {
          mDataSelected.set(groupId, groupData);
        } else {
          groupData.forEach((d) => mDataNotSelectedSet.add(d));
        }
      });

      mDataSelected.forEach((arr) => {
        for (const item of arr) mDataNotSelectedSet.delete(item);
      });
      mDataNotSelectedArr = Array.from(mDataNotSelectedSet);

      _renderInputSelected      = dataSelected;
      _renderInputNotSelected   = dataNotSelected;
      _renderInputHasSelection  = hasSelection;
      _renderCachedMDataSelected    = mDataSelected;
      _renderCachedMDataNotSelected = mDataNotSelectedArr;
      _renderCachedMedians          = medians;
    }

    timelineOverview.render(
      mDataSelected,
      brushes.getBrushGroupSelected(),
      showNonSelected ? mDataNotSelectedArr : _renderEmptyArray,
      medians,
      hasSelection
    );

    if (ts.hasDetails) {
      let brushGroupSelected = brushes.getBrushGroupSelected();
      window.requestAnimationFrame(() =>
        timelineDetails.render({ data: dataSelected, brushGroupSelected })
      );
    }
  }

  function getBrushGroupsMedians(data) {
    if (!brushes.hasSelection()) return;
    let minX = +overviewX.domain()[0];
    let maxX = +overviewX.domain()[1];

    let binW = (maxX - minX) / ts.medianNumBins;

    // log(
    //   "getBrushGroupsMedians: number of bins",
    //   ts.medianNumBins,
    //   " binW ",
    //   binW,
    //   minX,
    //   maxX
    // );

    for (let g of data.entries()) {
      let id = g[0];

      let bins = [];
      let cx = minX;
      for (let i = 0; i < ts.medianNumBins; ++i) {
        bins.push({
          x0: cx,
          x1: cx + binW,
          data: [],
        });
        cx += binW;
      }
      for (let line of g[1]) {
        for (let point of line[1]) {
          let i = Math.floor((x(point) - minX) / binW);
          i = i > ts.medianNumBins - 1 ? i - 1 : i;
          bins[i].data.push(y(point));
        }
      }

      let median = [];
      for (let bin of bins) {
        if (bin.data.length >= ts.medianMinRecordsPerBin) {
          let x = bin.x0 + (bin.x1 - bin.x0) / 2;
          let y = ts.medianFn(bin.data);
          median.push([x, y]);
        }
      }
      medianBrushGroups.set(id, median);
    }

    // log(" Bins computed", medianBrushGroups);
  }
function updateSliderVisuals(gSlider, slider) {
    if (gSlider.empty()) return;

    const ref = getRefCurveById(slider.rcId);
    if (!ref) return;
    
    const groupColor = computeBrushColor(slider.groupId);
    const isOrAggregation = slider.aggregation === BrushAggregation.Or;

    const mainStrokeColor = groupColor; 
    const mainStrokeDash = slider.mode === BrushModes.Intersect ? "4" : null;

    const notShadowColor = slider.negate ? "red" : "#333";
    const notShadowWidth = slider.negate ? 8 : 4; // Exagerado si es NOT
    const notShadowOpacity = slider.negate ? 0.6 : 0.5; // Más opaco si es NOT


    const drawHandle = (which) => {
      const xDom = which === "left" ? slider.leftX : slider.rightX;
      const xPx = overviewX(xDom);
      const yCurve = getYAtX(ref, +xDom);
      if (yCurve === null) return;

      const yCurvePx = overviewY(yCurve);
      const [yMin, yMax] = overviewY.domain();
      const yEndPx =
        slider.side === "above" ? overviewY(yMax) : overviewY(yMin);

      const gHandle = gSlider.select(`.handle-${which}`);

      gHandle
        .select(".slider-line-main")
        .attr("x1", xPx)
        .attr("y1", yCurvePx)
        .attr("x2", xPx)
        .attr("y2", yEndPx)
        .attr("stroke", mainStrokeColor)
        .attr("stroke-width", 2) 
        .attr("stroke-dasharray", mainStrokeDash);
      gHandle
        .select(".slider-line-border")
        .attr("x1", xPx)
        .attr("y1", yCurvePx)
        .attr("x2", xPx)
        .attr("y2", yEndPx)
        .attr("stroke", isOrAggregation ? groupColor : "#333")
        .attr("stroke-width", isOrAggregation ? 8 : 4) 
        .attr("stroke-opacity", isOrAggregation ? 0.6 : 0.5);

      gHandle
        .select(".slider-hit-area")
        .attr("x1", xPx)
        .attr("y1", yCurvePx)
        .attr("x2", xPx)
        .attr("y2", yEndPx);
    };

    drawHandle("left");
    drawHandle("right");

    const xStart = +slider.leftX;
    const xEnd = +slider.rightX;

    const curveSegment = ref.data.filter(
      (d) => +d[0] >= xStart && +d[0] <= xEnd
    );

    const startPoint = [xStart, getYAtX(ref, xStart)];
    const endPoint = [xEnd, getYAtX(ref, xEnd)];
    if (curveSegment.length === 0 || +curveSegment[0][0] > xStart) {
      curveSegment.unshift(startPoint);
    }
    if (
      curveSegment.length === 0 ||
      +curveSegment[curveSegment.length - 1][0] < xEnd
    ) {
      curveSegment.push(endPoint);
    }

    const lineGenerator = d3__namespace
      .line()
      .x((d) => overviewX(d[0]))
      .y((d) => overviewY(d[1]));

    const curvePathData = lineGenerator(curveSegment);

    const [yMin, yMax] = overviewY.domain();
    const topPx = overviewY(yMax);
    const bottomPx = overviewY(yMin);
    const x0p = overviewX(slider.leftX);
    const x1p = overviewX(slider.rightX);
    const yHorizontal = (slider.side === "above") ? topPx : bottomPx;
    
    gSlider.select(".slider-horizontal-border")
        .attr("x1", x0p)
        .attr("y1", yHorizontal)
        .attr("x2", x1p)
        .attr("y2", yHorizontal)
        .attr("stroke", notShadowColor)
        .attr("stroke-width", notShadowWidth)
        .attr("stroke-opacity", notShadowOpacity);

    gSlider.select(".slider-horizontal-main")
        .attr("x1", x0p)
        .attr("y1", yHorizontal)
        .attr("x2", x1p)
        .attr("y2", yHorizontal)
        .attr("stroke", mainStrokeColor)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", mainStrokeDash);

    gSlider.select(".slider-curve-border")
        .attr("d", curvePathData)
        .attr("stroke", notShadowColor)
        .attr("stroke-width", notShadowWidth)
        .attr("stroke-opacity", notShadowOpacity);
        
    gSlider.select(".slider-curve-main")
        .attr("d", curvePathData)
        .attr("stroke", mainStrokeColor)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", mainStrokeDash);
    let pathString;
    if (slider.side === "above") {
      pathString = `M ${x0p},${topPx} L ${x0p},${overviewY(
        startPoint[1]
      )} ${curvePathData.slice(1)} L ${x1p},${topPx} Z`;
    } else {
      pathString = `M ${x0p},${overviewY(
        startPoint[1]
      )} ${curvePathData.slice(
        1
      )} L ${x1p},${bottomPx} L ${x0p},${bottomPx} Z`;
    }

    gSlider
      .select(".slider-background")
      .attr("d", pathString)
      .attr("fill", groupColor)
      .attr("opacity", slider.negate ? 0.25 : 0.15);
  }

ts.printSliders = function () {
    if (!overviewX || !overviewY || !gProbes) return;

    const sliderData = Array.from(sliders.values()).filter((s) => {
        if (!s.enabled) return false;
        const ref = getRefCurveById(s.rcId);
        return ref && ref.isVisible !== false && !ref.isSimplePoints;
    });

    const sel = gProbes
        .selectAll("g.slider-group")
        .data(sliderData, (d) => d.id);

    sel.exit().remove();

    const enter = sel.enter().append("g").attr("class", "slider-group");
    
    enter.append("path")
         .attr("class", "slider-background")
         .attr("opacity", 0.15)
         .style("cursor", "grab");

    enter.append("line") 
        .attr("class", "slider-horizontal-border")
        .attr("stroke", "#333") 
        .attr("stroke-width", "4px") 
        .attr("stroke-opacity", 0.5)
        .style("pointer-events", "none");
    enter.append("line") 
        .attr("class", "slider-horizontal-main")
        .attr("stroke-width", "2px") 
        .style("pointer-events", "none");

    enter.append("path")
        .attr("class", "slider-curve-border")
        .attr("stroke", "#333") 
        .attr("stroke-width", "4px") 
        .attr("stroke-opacity", 0.5)
        .style("fill", "none")
        .style("pointer-events", "none");
    enter.append("path")
        .attr("class", "slider-curve-main")
        .attr("stroke-width", "2px") 
        .style("fill", "none")
        .style("pointer-events", "none");
    ["left", "right"].forEach((which) => {
        const gSide = enter.append("g").attr("class", `handle-${which}`);
        gSide.append("line")
            .attr("class", "slider-line-border")
            .attr("stroke", "#333") 
            .attr("stroke-width", "4px") 
            .attr("stroke-opacity", 0.5)
            .style("pointer-events", "none"); 

        gSide.append("line")
            .attr("class", "slider-line-main")
            .attr("stroke-width", "2px"); 

        gSide
            .append("line")
            .attr("class", "slider-hit-area")
            .style("stroke", "transparent")
            .style("stroke-width", 12)
            .style("cursor", "ew-resize");
        gSide
            .append("title")
            .text("Drag to move edge. Double-click to toggle side (above/below).");
    });

    const all = enter.merge(sel);

    const totalLines = groupedData ? groupedData.length : 0;
    const calculatedDelay = Math.min(300, 30 + Math.floor(totalLines / 20));
  ts.moveSelectedBrush = (selection) => {
    brushes.moveSelectedBrush(selection);
  };

  ts.selectBrush = (groupId, brushId) => {
    brushes.selectBrush(groupId, brushId);
  };

  ts.getBrushesGroup = () => {
    return brushes.getBrushesGroup();
  };
  
  ts.getBrushesColorScale = () => {
    return brushes.colorScale;
  };

  ts.recomputeSelection = () => {
    brushes.recomputeSelection();
  };
    const throttledRecompute = throttle(calculatedDelay, () => {
        brushes.recomputeSelection();
    });

    const handleDragComputation = () => {
        if (ts.autoUpdate) {
            throttledRecompute();
        }
    };

    all.each(function (slider) {
        const gSlider = d3__namespace.select(this);
        const ref = getRefCurveById(slider.rcId);
        gSlider.select(".slider-background")
            .style("pointer-events", "all") 
            .on("contextmenu", (sourceEvent) => {
                sourceEvent.preventDefault();
                const contextMenu = brushes.contextMenu;
                if (!contextMenu) return;
                const [px, py] = d3__namespace.pointer(sourceEvent); 
                contextMenu.__show(
                  slider.mode, 
                  slider.aggregation, 
                  slider.negate, 
                  px,  
                  py,  
                  slider
                );
            })
            .on("dblclick", (e) => {
                e.preventDefault();
                e.stopPropagation();
                slider.side = slider.side === "above" ? "below" : "above";
                updateSliderVisuals(gSlider, slider); 
                brushes.recomputeSelection(); 
            })
            .call(d3__namespace.drag()
                .on("start", function() {
                    d3__namespace.select(this).style("cursor", "grabbing");
                })
                .on("drag", (e) => {
                    if (!ref) return;
                    const dx = e.dx;
                    const currentLeftPx = overviewX(slider.leftX);
                    const currentRightPx = overviewX(slider.rightX);
                    const newLeftDomain = overviewX.invert(currentLeftPx + dx);
                    const newRightDomain = overviewX.invert(currentRightPx + dx);

                    const [minRefX, maxRefX] = d3__namespace.extent(ref.data, (d) => +d[0]);
                    
                    if (+newLeftDomain >= minRefX && +newRightDomain <= maxRefX) {
                        slider.leftX = newLeftDomain;
                        slider.rightX = newRightDomain;
                        
                        updateSliderVisuals(gSlider, slider);
                        updateSliderSpinBox(slider);
                        handleDragComputation();
                    }
                })
                .on("end", function() {
                    d3__namespace.select(this).style("cursor", "grab");
                    brushes.recomputeSelection(); 
                })
            );

        const minGap = domainDxFromPixels(5);

        const updateSingleEdge = (which, newXPixel) => {
            const xDom = overviewX.invert(newXPixel);
            if (!ref) return;

            const [minRefX, maxRefX] = d3__namespace.extent(ref.data, (d) => +d[0]);
            let clampedX = Math.max(minRefX, Math.min(maxRefX, +xDom));
            const isDate = ref.data[0][0] instanceof Date;

            if (which === "left") {
                const newLeftX = Math.min(clampedX, +slider.rightX - minGap);
                slider.leftX = isDate ? new Date(newLeftX) : newLeftX;
            } else {
                const newRightX = Math.max(clampedX, +slider.leftX + minGap);
                slider.rightX = isDate ? new Date(newRightX) : newRightX;
            }
            updateSliderVisuals(gSlider, slider);
        };

        ["left", "right"].forEach(which => {
            gSlider.select(`.handle-${which} .slider-hit-area`)
                .call(d3__namespace.drag()
                    .on("drag", (e) => {
                        updateSingleEdge(which, e.x);
                        updateSliderSpinBox(slider);
                        handleDragComputation();
                    })
                    .on("end", (e) => {
                        updateSingleEdge(which, e.x);
                        updateSliderSpinBox(slider);
                        brushes.recomputeSelection();
                    })
                )
                .on("dblclick", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    slider.side = slider.side === "above" ? "below" : "above";
                    updateSliderVisuals(gSlider, slider);
                    brushes.recomputeSelection();
                })
                .on("contextmenu", (sourceEvent) => {
                    sourceEvent.preventDefault();
                    sourceEvent.stopPropagation();
                    const contextMenu = brushes.contextMenu;
                    if (!contextMenu) return;
                    const xDom = which === "left" ? slider.leftX : slider.rightX;
                    const px = overviewX(xDom);
                    const ref = getRefCurveById(slider.rcId);
                    const yCurve = getYAtX(ref, +xDom);
                    const py = (yCurve !== null) ? overviewY(yCurve) : sourceEvent.pageY;

                    contextMenu.__show(
                      slider.mode, 
                      slider.aggregation, 
                      slider.negate, 
                      px, 
                      py, 
                      slider 
                    );
                });
        });
        
        updateSliderVisuals(gSlider, slider);
    });
};
 
  ts.getActiveSliderBoxes = function () {
    if (!overviewX || !overviewY) return [];
    const out = [];

    const activeSliders = Array.from(sliders.values()).filter((s) => s.enabled);

    for (const slider of activeSliders) {
      const ref = getRefCurveById(slider.rcId);
      if (!ref || ref.isVisible === false) continue;

      const [yMin, yMax] = overviewY.domain();
      const topPx = overviewY(yMax);
      const bottomPx = overviewY(yMin);

      const x0p = overviewX(slider.leftX);
      const x1p = overviewX(slider.rightX);

      let y0p = topPx; // Desde la parte superior del gráfico
      let y1p = bottomPx; // Hasta la parte inferior del gráfico

      out.push({
        groupId: slider.groupId,
        box: [
          [Math.min(x0p, x1p), Math.min(y0p, y1p)],
          [Math.max(x0p, x1p), Math.max(y0p, y1p)],
        ],
        sliderId: slider.id,
      });
    }
    return out;
  };

  ts.addSlider = function (rcId, groupId, opts) {
    opts = opts || {};
    const ref = Array.isArray(referenceCurves)
      ? referenceCurves.find((c) => c.id === rcId)
      : null;
    if (!ref) return null;
    const curveDomain = d3__namespace.extent(ref.data, (d) => d[0]);
    const domainStart =
      curveDomain[0] instanceof Date ? curveDomain[0].getTime() : +curveDomain[0];
    const domainEnd =
      curveDomain[1] instanceof Date ? curveDomain[1].getTime() : +curveDomain[1];
    const domainWidth = domainEnd - domainStart;
    let leftX =
      opts.leftX !== undefined ? opts.leftX : domainStart + domainWidth * 0.25;
    let rightX =
      opts.rightX !== undefined ? opts.rightX : domainStart + domainWidth * 0.75;
    if (curveDomain[0] instanceof Date) {
      leftX = new Date(+leftX);
      rightX = new Date(+rightX);
    }
    const sliderId = ++sliderSeq;
    sliders.set(sliderId, {
      id: sliderId,
      name: opts.name || `Slider ${sliderId}`,
      rcId,
      groupId,
      side: opts.side || "above",
      enabled: true,
      userEnabled: true,
      leftX,
      rightX,
      mode: opts.mode || BrushModes.Intersect,
      aggregation: opts.aggregation || BrushAggregation.And,
      negate: opts.negate || false,
    });
    brushes.recomputeSelection();
    ts.printSliders();
    renderReferenceCurvesWidget();
    return sliderId;
  };

  ts.addEpsilonAssociation = function (rcId, groupId, opts) {
    opts = opts || {};
    const ref = Array.isArray(referenceCurves)
      ? referenceCurves.find((c) => c.id === rcId)
      : null;
    if (!ref || !ref.isSimplePoints) return;
    if (!Array.isArray(ref.associations)) ref.associations = [];
    ref.associations = ref.associations.filter((a) => a.id !== groupId);
    const assocEntry = {
      id: groupId,
      enabled: true,
      userEnabled: true,
      aggregation: opts.aggregation || BrushAggregation.Or,
      negate: opts.negate || false,
    };
    ref.associations.push(assocEntry);
    // Mirror into BVH flat referenceLines (what brushFilter() reads)
    const bvhWrapper = brushes.getBvh();
    if (bvhWrapper && typeof bvhWrapper.getBvh === "function") {
      const bvhInner = bvhWrapper.getBvh();
      if (bvhInner && Array.isArray(bvhInner.referenceLines)) {
        const bvhRef = bvhInner.referenceLines.find((r) => r.id === rcId);
        if (bvhRef) {
          if (!Array.isArray(bvhRef.associations)) bvhRef.associations = [];
          bvhRef.associations = bvhRef.associations.filter(
            (a) => a.id !== groupId
          );
          bvhRef.associations.push(assocEntry);
        }
      }
    }
    brushes.recomputeSelection();
  };

  function onSelectionChange(
    newDataSelected = dataSelected,
    newDataNotSelected = dataNotSelected,
    hasSelection = brushes.hasSelection()
  ) {
    dataSelected = newDataSelected;
    dataNotSelected = newDataNotSelected;

    // Filter data with active dataGroups
    if (color) {
      [renderSelected, renderNotSelected] = filterDatabyDataGroups(
        dataSelected,
        dataNotSelected
      );
    } else {
      renderSelected = dataSelected;
      renderNotSelected = dataNotSelected;
    }

    // Compute the medians if needed
    if (showGroupMedian) {
      getBrushGroupsMedians(renderSelected);
    }

    render(renderSelected, renderNotSelected, hasSelection); // Print the filtered data by active dataGroups

    renderBrushesControls();
    triggerValueUpdate(renderSelected);
  }

  // Called every time the brushGroups changes
  function onBrushGroupsChange() {
    render(renderSelected, renderNotSelected, brushes.hasSelection());

    const existingGroupIds = new Set(
      Array.from(brushes.getBrushesGroup().keys())
    );
    let slidersWereRemoved = false;
    for (const [sliderId, slider] of sliders.entries()) {
      if (!existingGroupIds.has(slider.groupId)) {
        sliders.delete(sliderId);
        slidersWereRemoved = true;
      }
    }

    let associationsWereRemoved = false;
    if (Array.isArray(referenceCurves)) {
        referenceCurves.forEach(curve => {
            if (curve.isSimplePoints && Array.isArray(curve.associations)) {
                const originalCount = curve.associations.length;
                curve.associations = curve.associations.filter(assoc => existingGroupIds.has(assoc.id));
                
                if (curve.associations.length < originalCount) {
                    associationsWereRemoved = true;
                }
            }
        });
    }
   

    renderBrushesControls();
    triggerValueUpdate();

    if (slidersWereRemoved || associationsWereRemoved) {
      ts.printSliders();
      if (associationsWereRemoved) {
          brushes.recomputeSelection();
      }
    }
  }

  function updateStatus() {
    let status = new Map();
    for (let [id, brushGroup] of brushes.getBrushesGroup()) {
      let Gstatus = {
        id: id,
        name: brushGroup.name,
        isActive: brushGroup.isActive,
        isEnable: brushGroup.isEnable,
        brushes: brushGroup.brushes,
      };
      status.set(brushGroup.name, Gstatus);
    }
    divOverview.value.status = status;
    divOverview.dispatchEvent(new Event("input", { bubbles: true }));
  }

  // Converts the brushes map into an array
  function convertBrushMapToArray(
    map,
    { getRepresentative = (v) => v[0], groupAttributeName = "tw_group" } = {}
  ) {
    return [...map.entries()]
      .map(([group, d]) => {
        const oneRepresentativePerObject = [...d.values()].map((v) => {
          const representative = getRepresentative(v);
          representative[groupAttributeName] = group;
          return representative;
        });
        return oneRepresentativePerObject;
      })
      .flat();
  }

  // Triggers the update of the selection calls callback and dispatches input event
  function triggerValueUpdate(sel = renderSelected) {
    let value = new Map();

    for (let [id, brushGroup] of brushes.getBrushesGroup()) {
      let groupMap = new Map();
      sel.get(id).forEach((d) => groupMap.set(d[0], d[1]));
      value.set(brushGroup.name, groupMap);
    }

    divOverview.value = value;
    divOverview.value.groupsColorScale = brushesColorScale;
    divOverview.value.nonSelectedIds = dataNotSelected.map((d) => d[0]);
    divOverview.value.selectedIds = dataSelected
      .get(brushes.getBrushGroupSelected())
      .map((d) => d[0]);
    divOverview.value.selectedGroup = brushes
      .getBrushesGroup()
      .get(brushes.getBrushGroupSelected()).name;
    divOverview.value.asArray = (params) =>
      convertBrushMapToArray(value, params);
    divOverview.extent = {
      x: overviewX.domain(),
      y: overviewY.domain(),
    };
    divOverview.brushGroups = brushes.getBrushesGroup();
    updateStatus();
  }

  /*function brushesToDomain(brushesGroup) {
      let selectedBrush = brushes.getSelectedBrush();
      let outMap = new Map();
      for (let brushGroup of brushesGroup.entries()) {
        let innerMap = new Map();
        for (let brush of brushGroup[1].entries()) {
          if (brush[1].selection !== null) {
            let nBrush = Object.assign({}, brush[1]);

            // pixels
            let [[x0, y0], [x1, y1]] = brush[1].selection;
            nBrush.selectionPixels = [
              [x0, y0],
              [x1, y1],
            ];

            // data domain
            let [[xi0, yi0], [xi1, yi1]] = brush[1].selection.map(([x, y]) => [
              overviewX.invert(x),
              overviewY.invert(y),
            ]);
            nBrush.selection = [
              [xi0, yi0],
              [xi1, yi1],
            ];

            nBrush.isActive = !!selectedBrush && selectedBrush[0] === brush[0];

            innerMap.set(brush[0], nBrush);
          }
        }
        outMap.set(brushGroup[0], innerMap);
      }
      return outMap;
    } */

  ts.addReferenceCurve = function (newCurves) {
    if (!newCurves || !Array.isArray(newCurves) || newCurves.length === 0)
      return;

    const processedNewCurves = generateCurvePoints(
      newCurves,
      overviewX.domain(),
      overviewY.domain()
    );

    const curvesForBVH = processedNewCurves.map((ref) => {
      const scaledData = ref.data.map((point) => [
        overviewX(point[0]),
        overviewY(point[1]),
      ]);
      return Object.assign({}, ref, { data: scaledData });
    });

    const bvh = brushes.getBvh();
    let collisionResults = [];
    if (bvh && typeof bvh.addReferenceCurves === "function") {
      collisionResults = bvh.addReferenceCurves(curvesForBVH) || [];
    } else {
      console.error(
        "BVH o la funci\xF3n addReferenceCurves no est\xE1n disponibles."
      );
      return;
    }

    processedNewCurves.forEach((newCurve) => {
      const existingIndex = referenceCurves.findIndex(
        (c) => c.id === newCurve.id
      );
      const collisionData = collisionResults.find(
        (res) => res.refId === newCurve.id
      );

      if (collisionData) {
        newCurve.collisions = collisionData.collisions;
      }

      if (existingIndex !== -1) {
        referenceCurves[existingIndex] = newCurve;
      } else {
        referenceCurves.push(newCurve);
      }
    });

    brushes.recomputeSelection();

    renderBrushesControls();
    ts.printReferenceCurves(referenceCurves);
    ts.printSliders();
  };

 function generateCurvePoints(curves, domainX, domainY) {
    if (!Array.isArray(curves)) {
      throw new Error("The reference curves must be an array of Objects");
    }

    let unnamedCount = 1;
    curves.forEach((curve) => {
      if (!curve.id) {
        curve.id = `Reference Curve ${unnamedCount++}`;
      }
    });

    if (curves.length === 0) return []; // Nothing to process

    const isValidNumber = (n) => isFinite(n) && !isNaN(n);

    const processors = {
      function: (curve, numPoints) => {
        const xMin =
          curve.domain && curve.domain[0] !== undefined
            ? curve.domain[0]
            : domainX[0];
        const xMax =
          curve.domain && curve.domain[1] !== undefined
            ? curve.domain[1]
            : domainX[1];
        const step = (xMax - xMin) / numPoints;

        const points = [];
        for (let x = xMin; x <= xMax; x += step) {
          try {
            const y = curve.func(x);
            if (isValidNumber(y)) {
              points.push([x, y]);
            }
          } catch (_e) { /* noop */ }
        }
        return points;
      },

      parametric: (curve, numPoints) => {
        const tMin =
          curve.tRange && curve.tRange[0] !== undefined ? curve.tRange[0] : 0;
        const tMax =
          curve.tRange && curve.tRange[1] !== undefined
            ? curve.tRange[1]
            : 2 * Math.PI;
        const step = (tMax - tMin) / numPoints;

        const points = [];
        for (let t = tMin; t <= tMax; t += step) {
          try {
            const x = curve.xFunc(t);
            const y = curve.yFunc(t);
            if (isValidNumber(x) && isValidNumber(y)) {
              points.push([x, y]);
            }
          } catch (_e) { /* noop */ }
        }
        return points;
      },

      polynomial: (curve, numPoints) => {
        const xMin =
          curve.domain && curve.domain[0] !== undefined
            ? curve.domain[0]
            : domainX[0];
        const xMax =
          curve.domain && curve.domain[1] !== undefined
            ? curve.domain[1]
            : domainX[1];
        const step = (xMax - xMin) / numPoints;
        const coefficients = curve.coefficients;

        const points = [];
        for (let x = xMin; x <= xMax; x += step) {
          let y = 0;
          for (let i = coefficients.length - 1; i >= 0; i--) {
            y = y * x + coefficients[i];
          }
          if (isValidNumber(y)) {
            points.push([x, y]);
          }
        }
        return points;
      },
    };

    const processedCurves = curves
      .map((curve) => {
        // Usa curve.numPoints si existe y es válido, si no usa 10000 por defecto
        let numPoints =
          curve.numPoints && isFinite(curve.numPoints)
            ? curve.numPoints
            : 10000;
        curve.isVisible = true; // Add isVisible property to each curve
        const processedCurve = Object.assign({}, curve);
        processedCurve.collisionActive =
          typeof curve.collisionActive !== "undefined"
            ? curve.collisionActive
            : false;
        processedCurve.isSimplePoints =
          typeof curve.isSimplePoints !== "undefined"
            ? curve.isSimplePoints
            : true;
        processedCurve.epsilon =
          typeof curve.epsilon !== "undefined" ? curve.epsilon : 0;
        if (
          (processedCurve.color == null || processedCurve.color === "") &&
          ts &&
          typeof ts.brushesColorScale === "function"
        ) {
          processedCurve.color = ts.brushesColorScale(processedCurve.id);
        }
        if (typeof curve.collisions === "undefined") {
          processedCurve.collisions = null;
        }

        // Prioriza data existente (puntos simples o polilíneas) sobre generación de funciones
        if (curve.data && Array.isArray(curve.data) && curve.data.length > 0) {
          // Usa data existente sin generar nuevos puntosç
          processedCurve.data = curve.data;
        } else if (curve.func && typeof curve.func === "function") {
          processedCurve.data = processors.function(curve, numPoints);
        } else if (
          curve.xFunc &&
          curve.yFunc &&
          typeof curve.xFunc === "function" &&
          typeof curve.yFunc === "function"
        ) {
          processedCurve.data = processors.parametric(curve, numPoints);
        } else if (curve.coefficients && Array.isArray(curve.coefficients)) {
          processedCurve.data = processors.polynomial(curve, numPoints);
        } else {
          console.warn(
            "Curve without data or valid functions. Skipping.",
            curve
          );
          return null;
        }
        
        if (processedCurve.data && processedCurve.data.length === 1) {
          processedCurve.isSimplePoints = true;
        }

        return processedCurve;
      })
      .filter(Boolean);

    // Filtrar puntos por dominio (aplica a todos, ya sean generados o existentes)
    processedCurves.forEach((curve) => {
      if (
        !curve.data ||
        !Array.isArray(curve.data) ||
        curve.data.length === 0
      ) {
        curve.data = [];
        return;
      }
      curve.data = curve.data.filter((point) => {
        const [xVal, yVal] = point;
        return (
          xVal >= domainX[0] &&
          xVal <= domainX[1] &&
          yVal >= domainY[0] &&
          yVal <= domainY[1] &&
          isValidNumber(xVal) &&
          isValidNumber(yVal)
        );
      });

      curve.data.sort((a, b) => a[0] - b[0]);
    });

    return processedCurves;
  }
ts.printReferenceCurves = function (curves) {
    if (!overviewX) return;
    if (!Array.isArray(curves))
      throw new Error("The reference curves must be an array of Objects");

    // --- INICIO CÓDIGO NUEVO (1/2) ---
    // Creamos una copia de la escala Y pero sin la propiedad clamp.
    const unclampedY = overviewY.copy().clamp(false);
    // --- FIN CÓDIGO NUEVO (1/2) ---

    const visible = curves.filter((c) => c.isVisible !== false);

    const domainX = overviewX.domain();
    const domainY = overviewY.domain();
    visible.forEach((c) => {
      c.data.sort((a, b) => d3__namespace.ascending(a[0], b[0]));
      c.data = c.data.filter(
        (p) =>
          p[0] >= domainX[0] &&
          p[0] <= domainX[1] &&
          p[1] >= domainY[0] &&
          p[1] <= domainY[1]
      );
    });

    const lineCurves = visible.filter((c) => !c.isSimplePoints);
    const pointCurves = visible.filter((c) => c.isSimplePoints);


    const line2 = d3__namespace
      .line()
      .defined((d) => d[1] !== undefined && d[1] !== null)
      .x((d) => overviewX(d[0]))
      .y((d) => overviewY(d[1]));

    const lineSel = gReferences
      .selectAll("path.referenceCurve")
      .data(lineCurves, (d) => d.id);

    lineSel.exit().remove();

    lineSel
      .enter()
      .append("path")
      .attr("class", "referenceCurve")
      .merge(lineSel)
      .attr("d", (c) => line2(c.data))
      .attr("stroke-width", (c) => c.strokeWidth || 2)
      .style("fill", "none")
      .style("stroke", (c) => c.color)
      .style("opacity", (c) =>
        c.opacity !== undefined && c.opacity !== null ? c.opacity : 1
      );

    // --- LÓGICA PARA DIBUJAR PUNTOS Y SUS RADIOS DE TOLERANCIA ---
    const allPoints = [];
    pointCurves.forEach((c) => {
      c.data.forEach((p) => {
        allPoints.push({
          curveId: c.id,
          x: p[0],
          y: p[1],
          color: c.color,
          radius: c.pointRadius || 4,
          opacity:
            c.opacity !== undefined && c.opacity !== null ? c.opacity : 1,
          strokeColor: c.strokeColor || "#ffffff",
          strokeWidth: c.strokeWidth || 1,
          epsilon: c.epsilon || 0,
        });
      });
    });

    // Dibuja los círculos de tolerancia (el área de influencia)
    const toleranceSel = gReferences
      .selectAll("circle.referenceTolerance")
      .data(allPoints.filter(d => d.epsilon > 0), (d) => `${d.curveId}:${d.x},${d.y}`);

    toleranceSel.exit().remove();

    toleranceSel.enter()
      .append("circle")
      .attr("class", "referenceTolerance")
      .merge(toleranceSel)
      .attr("cx", (d) => overviewX(d.x))
      .attr("cy", (d) => overviewY(d.y))
      // --- INICIO CÓDIGO MODIFICADO (2/2) ---
      // Usamos la nueva escala "unclampedY" para que el radio pueda crecer fuera de los límites.
      .attr("r", d => Math.abs(unclampedY(0) - unclampedY(d.epsilon))) 
      // --- FIN CÓDIGO MODIFICADO (2/2) ---
      .style("fill", d => d.color)
      .style("stroke", d => d3__namespace.color(d.color).darker(0.5))
      .style("stroke-width", 1)
      .style("opacity", 0.2)
      .style("pointer-events", "none"); 

    // Dibuja los puntos de referencia (código original)
    const ptSel = gReferences
      .selectAll("circle.referencePoint")
      .data(allPoints, (d) => `${d.curveId}:${d.x},${d.y}`);

    ptSel.exit().remove();

    ptSel
      .enter()
      .append("circle")
      .attr("class", "referencePoint")
      .merge(ptSel)
      .attr("cx", (d) => overviewX(d.x))
      .attr("cy", (d) => overviewY(d.y))
      .attr("r", (d) => d.radius)
      .style("fill", (d) => d.color)
      .style("opacity", (d) => d.opacity)
      .style("stroke", (d) => d.strokeColor)
      .style("stroke-width", (d) => d.strokeWidth)
      .select(function () {
        return this;
      })
      .append("title")
      .text((d) => `${d.curveId}: (${d.x}, ${d.y})`);
  };

  ts.updateCallback = function (_) {
    return arguments.length ? ((updateCallback = _), ts) : updateCallback;
  };

  ts.statusCallback = function (_) {
    return arguments.length ? ((statusCallback = _), ts) : statusCallback;
  };

  ts.data = function (_data) {
    data = _data;
    log(" Processing data: ... ", data.length);
    // Ignore null values. Shouldn't be y(d) && x(d) because y(d) can be 0
    fData = data.filter(
      (d) =>
        y(d) !== undefined &&
        y(d) !== null &&
        x(d) !== undefined &&
        x(d) !== null
    );

    if (!fData || fData.length === 0) {
      divOverview.innerHTML = ''; 
      alert("No data available to display. Please load data.");
      return; 
    }

    let xDataType = typeof x(fData[0]);

    initDomains({ xDataType, fData });

    fData = fData.filter(
      (d) => !isNaN(overviewX(x(d))) && !isNaN(overviewY(y(d)))
    );

    groupedData = d3__namespace.groups(fData, id);

    groupedData.map((d) => [
      d[0],
      d[1].sort((a, b) => d3__namespace.ascending(x(a), x(b))),
    ]);

    ts.alphaScale.domain([0, groupedData.length]);

    // Limit the number of timelines
    if (maxTimelines) groupedData = groupedData.slice(0, maxTimelines);
    init();

    timelineOverview.setScales({
      scaleX: overviewX,
      scaleY: overviewY,
    });
    timelineOverview.data(groupedData);

    generateDataSelectionDiv();

    initDetails({ overviewX, overviewY });

    dataSelected.set(0, []);
    renderSelected = dataSelected;
    dataNotSelected = groupedData;
    renderNotSelected = dataNotSelected;

    if (_this) brushes.addFilters(_this.value.status, true);
    else if (filters) brushes.addFilters(filters, true);

    onSelectionChange();
  };

  // If we receive the data on initialization call ts.Data
  if (data && x && y && id) {
    ts.data(data);
  } else {
    overviewX = d3__namespace
      .scaleLinear()
      .range([0, width - ts.margin.right - ts.margin.left]);

    overviewY = d3__namespace
      .scaleLinear()
      .range([height - ts.margin.top - ts.margin.bottom, 0])
      .nice()
      .clamp(true);
    init();
  }

  if (referenceCurves) {
    ts.printReferenceCurves(referenceCurves);
    ts.printSliders();
  }

  // To allow a message from the outside to rerender
  ts.render = () => {
    // render(dataSelected, dataNotSelected);
    onSelectionChange();
  };

  // Renderizado directo: llama a render() con el estado cacheado, sin recalcular
  // medianas, reconstruir Maps ni disparar eventos. Usar solo para benchmarking.
  ts.renderDirect = () => {
    render(renderSelected, renderNotSelected, brushes.hasSelection());
  };

  // Espera sincronización GPU (WebGPU async). Canvas resuelve inmediatamente.
  // Necesario para medir tiempos reales de GPU en benchmarks.
  ts.syncGPU = () => timelineOverview.syncGPU();

  // Sincronización equitativa para comparación canvas vs webgpu:
  //   WebGPU → onSubmittedWorkDone()
  //   Canvas 2D → getImageData(0,0,1,1) fuerza flush de rasterización Skia
  ts.syncRenderer = () => timelineOverview.syncRenderer();

  // Remove possible previous event listener
  //target.removeEventListener("TimeWidget", onTimeWidgetEvent);

  // Make the ts object accessible
  divOverview.ts = ts;
  divOverview.details = detailsElement;
  divOverview.brushesCoordinates = brushesCoordinates;
  divOverview.groups = groupsElement;

  // Sistema de ayuda: abrir la documentación o la demo guiada desde fuera
  ts.showHelpPopup = () => helpSystem && helpSystem.showHelp();
  ts.startTour = () => helpSystem && helpSystem.startTour();

  // Exponer funciones para automatización
  ts.selectBrush = (groupId, brushId) => {
    brushes.selectBrush(groupId, brushId);
  };
  ts.getBrushesGroup = () => {
    return brushes.getBrushesGroup();
  };

  return divOverview;
}

return TimeWidget;

}));
//# sourceMappingURL=TimeWidget.js.map
