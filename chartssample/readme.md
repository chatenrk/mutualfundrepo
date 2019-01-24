# D3 Charts Sample application
This uses the [D3JS](https://d3js.org/) framework for rendering the charts as required.

## List of examples
### Simple line charts
For an explanation of simple line chart, refer to the example [SimpleLineChart](http://www.d3noob.org/2016/08/create-simple-line-graph-using-d3js-v4.html)

## Appendix
### Time formatters
Time formatters that can be used along with parseTime function are as below
- %b - abbreviated month name.
- %B - full month name.
- %c - date and time, as “%a %b %e %H:%M:%S %Y”.
- %d - zero-padded day of the month as a decimal number [01,31].
- %e - space-padded day of the month as a decimal number [ 1,31].
- %H - hour (24-hour clock) as a decimal number [00,23].
- %I - hour (12-hour clock) as a decimal number [01,12].
- %j - day of the year as a decimal number [001,366].
- %m - month as a decimal number [01,12].
- %M - minute as a decimal number [00,59].
- %p - either AM or PM.
- %S - second as a decimal number [00,61].
- %U - week number of the year (Sunday as the first day of the week) as a decimal number [00,53].
- %w - weekday as a decimal number [0(Sunday),6].
- %W - week number of the year (Monday as the first day of the week) as a decimal number [00,53].
- %x - date, as “%m/%d/%y”.
- %X - time, as “%H:%M:%S”.
- %y - year without century as a decimal number [00,99].
- %Y - year with century as a decimal number.
- %Z - time zone offset, such as “-0700”

### List of time intervals
List of time intervals that D3 considers for setting automatic ticks
- 1, 5, 15 and 30-second.
- 1, 5, 15 and 30-minute.
- 1, 3, 6 and 12-hour.
- 1 and 2-day.
- 1-week.
- 1 and 3-month.
- 1-year.

We can set our own time intervals using the [d3 time] (https://github.com/d3/d3-time#d3-time) component
