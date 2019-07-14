# Rosharan calendar tool
A client-side tool for navigating and viewing the history of Roshar.

A library `RosharanDate.js` is provided for maniupulating Rosharan dates in code. 

The calendar is generated with many navigation elements to change between neighbouring dates and dates of different kinds.
* Clicking on the day cells shows a view of all events on that day, plus options to add events to that day,
and to add events relative to that date.
* Clicking on the week cells shows a summary view of the five days in that week and the events on any of those days. It also lists any less-specific events for the week (or month/year?) itself.
* When viewing a month, a line for each of the ten weeks in that month will show as above, with additional buttons in the header to navigate between neighbouring months. It may filter out some of the smaller events, and will highlight month-long or underspecified events somehow too.
* The year view will show the same month view but for all ten months of that year.

Additionally, at each view there is an explicit set of buttons for navigating related to the current view in the top corner of the screen, with next and previous buttons for all levels that take you to the specified level's neighbour and also buttons to take you to the specified level directly. 

A button will allow you to import a `Rosharan-history.json` file and use the data provided to show the events in it.
Another button will allow you to export the data after editing it.
The imported data is persistent (in the browser local storage) but may disappear over time.
