// gCal Program Match Automation


const gCalPgmMatchversion = "22-05-03 v6";
const consoleDebug = true;      // If true the code will generate debugMsg messages to aid in troubleshooting.

var now = new Date();
const beginMilliseconds = now.getMilliseconds();
console.log("Begin match: "+ (now.toUTCString()));

let gcalTable = 'WFHB Program Schedule';
let gcalMatchField = 'Broadcast Program';
let gcalLinkField = "Program";
let coreProgramTable = "Core Program Data";
let coreProgramMatchField = 'Public Name';


let gcalView = base.getTable(gcalTable).getView('Script View');
let gcalQuery = await gcalView.selectRecordsAsync();
let gcalRecords = gcalQuery.records;
debugMsg('gcalRecords ',gcalRecords);


let coreProgramView = base.getTable(coreProgramTable).getView('Script View');
let coreProgramQuery = await coreProgramView.selectRecordsAsync();
let coreProgramRecords = coreProgramQuery.records;
debugMsg('coreProgramRecords ',coreProgramRecords);


let updateOperations = [];
let hit = false;

for (let aGcalRecord of gcalRecords) {
    hit = false;
    for (let aProgramRecord of coreProgramRecords) {
        if (aGcalRecord.getCellValue(gcalMatchField) === aProgramRecord.getCellValueAsString(coreProgramMatchField)) {
            hit = true;
            debugMsg("Hit ",aProgramRecord.getCellValue(coreProgramMatchField));
            updateOperations.push(
                {
                  "id": aGcalRecord.id,
                  "fields": {
                    "Program" :  [ aProgramRecord ],
                  }
                }
            );
            break;
        }
    }
    if (hit) {
        continue;
    }
    debugMsg("Failed to match ",aGcalRecord);
}
debugMsg('updateOperations ',updateOperations);

while (updateOperations.length > 0) {
    await base.getTable(gcalTable).updateRecordsAsync(updateOperations.slice(0, 50));
    updateOperations = updateOperations.slice(50);
}

now = new Date();
console.log("End match: " + (now.toUTCString()));
const endMilliseconds = now.getMilliseconds();
console.log("Elapsed time (MilliSeconds): " + String(endMilliseconds- beginMilliseconds));

// debugMsg - a conditional wrapper for console.debug messages as a debugging aid.

function debugMsg(a, b = null) {
    if (consoleDebug) {
        if (b==null) {
            console.debug (a);
        } else {
            console.debug (a, b);
        }
    }
  }
