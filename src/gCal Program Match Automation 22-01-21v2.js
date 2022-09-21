// gCal Program Match Automation

let manyKeysTable = 'WFHB Program Schedule';
let manyKeysMatchField = 'gCal Match Key';
let manyKeysLinkField = "'Program'";
let oneKeyTable = "Core Program Data";
let oneKeyMatchField = 'Core Match Key';


let manyKeysView = base.getTable(manyKeysTable).getView('Script View');
let manyKeysQuery = await manyKeysView.selectRecordsAsync();
let manyKeysRecords = manyKeysQuery.records;


let oneKeyView = base.getTable(oneKeyTable).getView('Script View');
let oneKeyQuery = await oneKeyView.selectRecordsAsync();
let oneKeyRecords = oneKeyQuery.records;

console.debug('manyKeysRecords');
console.debug(manyKeysRecords);

console.debug('oneKeyRecords');
console.debug(oneKeyRecords);

console.debug('manyKeysLinkField');
console.debug(manyKeysLinkField);

let updateOperations = [];

for (let aManyKeyRecord of manyKeysRecords) {
    for (let aOneKeyRecord of oneKeyRecords) {
        console.debug(aManyKeyRecord.getCellValue(manyKeysMatchField) == aOneKeyRecord.getCellValue(oneKeyMatchField));
        if (aManyKeyRecord.getCellValue(manyKeysMatchField) === aOneKeyRecord.getCellValue(oneKeyMatchField)) {
            console.debug("Hit");
            console.debug(aOneKeyRecord.getCellValue(oneKeyMatchField));
            updateOperations.push(
                {
                  "id": aManyKeyRecord.id,
                  "fields": {
                    "Program" :  [ aOneKeyRecord ],
                  }
                }
            );
            break;
        }
    }
    console.debug("Failed to match ");
    console.debug(aManyKeyRecord);
}
console.debug('updateOperations');
console.debug(updateOperations);

while (updateOperations.length > 0) {
    await base.getTable(manyKeysTable).updateRecordsAsync(updateOperations.slice(0, 50));
    updateOperations = updateOperations.slice(50);
}
