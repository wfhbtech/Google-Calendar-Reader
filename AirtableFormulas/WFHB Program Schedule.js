// Google Calendar Reader Field and Formula Reference
// 2022-02-17 Began this file

// "WFHB Program Schedule" table

/* 
    The following fields determine if the schedule record
    needs to be associated with a record in the Core Program Data
    table.
*/

// Match Success=
{gCal Match Key}={Core Pgm Key}

// gCal Match Key=
Title&{gCal Duration}

// gCal Duration=
DATETIME_DIFF(End,Start,'seconds')

// Core Pgm Key=
Program&{Program Duration}

// (Lookup) {Program Duration}=
{Program Duration}

/* 
    These fields calculate the modification times of
    the sychronized table fields, as well as the fields
    defined in this table.
*/

// Specific fields in the Google Calendar Event: title, 
// location, start, end, AllDay, Creator, status, attendeds created, updated
//
// gCal Fields Last modified time=
gCal Fields Last modified time

// For now, only the Program link field is checked
// Program Fields Last modified time=


/*
    If the Script that matches up Google Events with Core Program data
    fails to find a match, we'll notify staff, but not immediately.
    We wait for 15 minutes, to give whoever made changes to the Google Calendar
    event to correct the problem.

    If the error isn't corrected in 15 minutes, we'll use an automation to
    notify staff of the issue. 

    The gCal Pgm Match Errors view uses the Age field determine how long it's
    been since the match error occured.

    The Age field is the time in seconds, since any of the Google Calendar
    calendar fields were modified. If no fields were modified it's the 
    time since the Google Calendar record was created.
*/

// Provides a modifiable source for date calculations. Currently it's just
// Airtable's NOW() function.
// Right Now=
NOW()

// Age=
DATETIME_DIFF({Right Now},
    IF({Last modified time},{Last modified time},{Created time}),
    'seconds')

/*
    These fields are calculated and included in sync tables as a convenience
    for the subscribing bases and to reduce code duplication 
*/    
// Local Start Time as Duration=    
    (DATETIME_FORMAT(SET_TIMEZONE(Start, 'America/Indiana/Indianapolis'), 'HH')+0)*3600+
    (DATETIME_FORMAT(SET_TIMEZONE(Start, 'America/Indiana/Indianapolis'), 'mm')+0)*60+
    (DATETIME_FORMAT(SET_TIMEZONE(Start, 'America/Indiana/Indianapolis'), 'ss')+0)

// Local Start Date String=
DATETIME_FORMAT(SET_TIMEZONE(Start, 'America/Indiana/Indianapolis'), 'M/D/YYYY')

// Local Start Time as Duration=
DATETIME_FORMAT(SET_TIMEZONE(Start, 'America/Indiana/Indianapolis'), 'HH:mm:ss')

/*
    These fields are in support of Event Options
*/

// Provide some error checking logic for Event Options
AND(
    LEN(Location) - LEN(SUBSTITUTE(Location,"(",""))=LEN(Location) - LEN(SUBSTITUTE(Location,")","")),
    OR(LEN(Location)=0,
       LEN(Location) - LEN(SUBSTITUTE(Location,"(",""))>0
      )
)

// Is Live=
FIND("LIVE",UPPER({Location}))>0

// Is Rerun=
FIND("RERUN==",UPPER({Location}))>0