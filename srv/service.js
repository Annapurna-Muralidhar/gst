
// const cds = require('@sap/cds');
// const { v4: uuidv4 } = require('uuid'); // Import UUID library

// module.exports = cds.service.impl(async function() {
//     const accountingapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');
//     const { accounting, accdoc,AccountingDocumentItems } = this.entities; // Only use local entities

//     this.on('READ', 'accounting', async (req) => {
//         const query1 = req.query1
//             .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
//             .and({ CompanyCodeCurrency: 'INR' });
        
//         const result = await accountingapi.run(query1);
        
//         return result;
//     });
    

//     this.before('READ', 'accdoc', async (req) => {
//         const query1 = SELECT.from(accounting)
//             .columns('CompanyCode', 'FiscalYear', 'FiscalPeriod', 'AccountingDocument', 'AccountingDocumentType','LastChangeDate')
//             .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
//             .and({ CompanyCodeCurrency: 'INR' });
    
//         const res = await accountingapi.run(query1);
//         //console.log('Fetched records:', res);
    
//         // Group records by CompanyCode, FiscalYear, and AccountingDocument
//         const groupMap = new Map();
//         res.forEach(item => {
//             const groupKey = `${item.CompanyCode}-${item.FiscalYear}-${item.AccountingDocument}`;
//             if (!groupMap.has(groupKey)) {
//                 item.ID = uuidv4();
//                 groupMap.set(groupKey, item);  // Store only one record per group
//             }
//         });
    
//         const groupedData = [];
//         groupMap.forEach(group => groupedData.push(group));
//         console.log('Grouped records:', groupedData);
    
//         // Perform a bulk UPSERT using a single operation
//         const existingRecords = await cds.run(
//             SELECT.from(accdoc)
//                 .columns('CompanyCode', 'FiscalYear', 'AccountingDocument')
//                 .where({
//                     CompanyCode: { in: groupedData.map(r => r.CompanyCode) },
//                     FiscalYear: { in: groupedData.map(r => r.FiscalYear) },
//                     AccountingDocument: { in: groupedData.map(r => r.AccountingDocument) }
//                 })
//         );
    
//         // Filter out the already existing records
//         const newRecords = groupedData.filter(groupedRecord => {
//             return !existingRecords.some(existingRecord =>
//                 existingRecord.CompanyCode === groupedRecord.CompanyCode &&
//                 existingRecord.FiscalYear === groupedRecord.FiscalYear &&
//                 existingRecord.AccountingDocument === groupedRecord.AccountingDocument
//             );
//         });
    
//         if (newRecords.length > 0) {
//             await cds.run(UPSERT.into(accdoc).entries(newRecords));
//             //console.log('Inserted new records:', newRecords);
//         } else {
//             //console.log('No new records to insert.');
//         }
//     });

       
    
       
  
//     const { v4: uuidv4 } = require('uuid'); // Import UUID library



// this.before('READ', 'AccountingDocumentItems', async (req) => {
//     // Fetch records from the source
//     const query1 = SELECT.from(accounting)
//         .columns('AccountingDocument', 'AccountingDocumentItem', 'TaxCode', 'GLAccount', 'TransactionTypeDetermination', 'CompanyCode', 'FiscalYear','AmountInCompanyCodeCurrency')
//         .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
//         .and({ CompanyCodeCurrency: 'INR' });

//     const sourceRecords = await accountingapi.run(query1);
//     console.log('Fetched records:', sourceRecords);

//     // Add UUID to each record
//     const recordsWithUUID = sourceRecords.map(record => ({
//         ...record,
//         ID: uuidv4() // Generate UUID for each record
//     }));

//     // Fetch existing records from the AccountingDocumentItems table
//     const existingRecords = await cds.run(
//         SELECT.from(AccountingDocumentItems)
//             .columns('AccountingDocument', 'AccountingDocumentItem', 'CompanyCode', 'FiscalYear')
//             .where({
//                 AccountingDocument: { in: recordsWithUUID.map(r => r.AccountingDocument) },
//                 AccountingDocumentItem: { in: recordsWithUUID.map(r => r.AccountingDocumentItem) },
//                 CompanyCode: { in: recordsWithUUID.map(r => r.CompanyCode) },
//                 FiscalYear: { in: recordsWithUUID.map(r => r.FiscalYear) }
//             })
//     );

//     // Convert existing records to a map for fast lookup
//     const existingMap = new Map();
//     existingRecords.forEach(record => {
//         const key = `${record.AccountingDocument}-${record.AccountingDocumentItem}-${record.CompanyCode}-${record.FiscalYear}`;
//         existingMap.set(key, record);
//     });

//     // Filter out records that already exist in the table
//     const newRecords = recordsWithUUID.filter(record => {
//         const key = `${record.AccountingDocument}-${record.AccountingDocumentItem}-${record.CompanyCode}-${record.FiscalYear}`;
//         return !existingMap.has(key);
//     });

//     if (newRecords.length > 0) {
//         // Perform the UPSERT operation
//         await cds.run(UPSERT.into(AccountingDocumentItems).entries(newRecords));
//         console.log('Upserted records with UUIDs:', newRecords);
//     } else {
//         console.log('No new records to upsert.');
//     }
// });

//     this.on('buttonController',async ()=>{
//         await cds.tx (async () =>{
            
//             console.log("button clicked");
//             return true;
//         })
//     })
    
// });



/**let lastsyncdate1 = await cds.run(SELECT.one.columns('JournalEntryLastChangeDateTime').from(LGSTTaxItem).orderBy('JournalEntryLastChangeDateTime desc'));
        if(lastsyncdate1){
            let taxlastsyncdatetime=lastsyncdate1.JournalEntryLastChangeDateTime;
            counttaxdocs = await gsttaxapi.send({method:'GET', path: "YY1_GSTAcctgTaxItm/$count?$filter=JournalEntryLastChangeDateTime gt datetimeoffset'"+taxlastsyncdatetime+"'"})    
        }else{
            counttaxdocs = await gsttaxapi.send({method:'GET', path: "YY1_GSTAcctgTaxItm/$count"})    
            taxdocqry = SELECT.from(GSTTaxItem);
        
        }
            
taxdocitems = []
        for(i=0;i<counttaxdocs;i=i+5000){
            taxdocqry = taxdocqry.limit(5000,i);
            let results = await gsttaxapi.run(taxdocqry);
            console.log("In Batch ",i," of ",counttaxdocs, " records");
            await cds.run(UPSERT.into(LGSTTaxItem).entries(results));
            //taxdocitems.push(...results);
        }   
            
*/

// const cds = require('@sap/cds');
// const { v4: uuidv4 } = require('uuid');
// module.exports = cds.service.impl(async function() {
//     const accountingapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');
//     const { accounting, accdoc,AccountingDocumentItems } = this.entities;
//     this.on('buttonController', async (req) => {
//         console.log("button clicked");

//         //accdoc

//         const query=SELECT.from(accounting)
//         .columns('CompanyCode', 'FiscalYear', 'FiscalPeriod', 'AccountingDocument', 'AccountingDocumentType','LastChangeDate')
//         .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
//         .and({ CompanyCodeCurrency: 'INR' });
//         const res = await accountingapi.run(query);
//         const groupMap = new Map();
//         res.forEach(item => {
//             const groupKey = `${item.CompanyCode}-${item.FiscalYear}-${item.AccountingDocument}`;
//             if (!groupMap.has(groupKey)) {
//                 item.ID = uuidv4();
//                 groupMap.set(groupKey, item);  // Store only one record per group
//             }
//         });
//         const groupedData = [];
//         groupMap.forEach(group => groupedData.push(group));
//         console.log('Grouped records:', groupedData);
//         const existingRecords = await cds.run(
//             SELECT.from(accdoc)
//             .columns('CompanyCode', 'FiscalYear', 'AccountingDocument')
//             .where({
//                 CompanyCode: { in: groupedData.map(r => r.CompanyCode) },
//                 FiscalYear: { in: groupedData.map(r => r.FiscalYear) },
//                 AccountingDocument: { in: groupedData.map(r => r.AccountingDocument) }
//                 })
//         );
//         const newRecords = groupedData.filter(groupedRecord => {
//             return !existingRecords.some(existingRecord =>
//                 existingRecord.CompanyCode === groupedRecord.CompanyCode &&
//                 existingRecord.FiscalYear === groupedRecord.FiscalYear &&
//                 existingRecord.AccountingDocument === groupedRecord.AccountingDocument
//                 );
//         });
//         if (newRecords.length > 0) {
//                         await cds.run(UPSERT.into(accdoc).entries(newRecords));
                        
//                     } else {
//                         console.log('No new records to insert.');
//                     }
//         //return "result";

//         //accdoc items
    
//     });
// });

// const cds = require('@sap/cds');
// const { v4: uuidv4 } = require('uuid');

// module.exports = cds.service.impl(async function () {
//     const accountingapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');
//     const { accounting, accdoc } = this.entities;

//     this.on('buttonController', async (req) => {
//         console.log("Button clicked");

//         // Query the latest LastChangeDate from the local database
//         const lastSyncRecord = await cds.run(
//             SELECT.one.columns('LastChangeDate')
//                 .from(accdoc)
//                 .orderBy('LastChangeDate desc')
//         );

    
//         let totalRecordsCount;
        
//         // Determine if this is an initial load or filtered load
//         if (lastSyncRecord && lastSyncRecord.LastChangeDate) {
//             let lastSyncDate = lastSyncRecord.LastChangeDate;
//             lastSyncDate=lastSyncDate.slice(0,-1);
           
//             totalRecordsCount = await accountingapi.send({ method: 'GET', path: "/A_OperationalAcctgDocItemCube/$count?$filter=LastChangeDate gt datetime'"+lastSyncDate+"'" });
//         } else {
           
//             totalRecordsCount = await accountingapi.send({ method: 'GET', path:  "A_OperationalAcctgDocItemCube/$count" });
//         }

//         // Now batch the requests and process in batches of 5000
//         const batchSize = 5000;
//         let startIndex = 0;

//         while (startIndex < totalRecordsCount) {
//             let batchQuery = SELECT.from(accounting)
//                 .columns('CompanyCode', 'FiscalYear', 'FiscalPeriod', 'AccountingDocument', 'AccountingDocumentType', 'LastChangeDate')
//                 .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
//                 .and({ CompanyCodeCurrency: 'INR' })
//                 .limit(batchSize, startIndex);

//             if (lastSyncRecord && lastSyncRecord.LastChangeDate) {
//                 batchQuery = batchQuery.and({ LastChangeDate: { '>': lastSyncRecord.LastChangeDate } });
//             }

//             // Fetch records from the external API in batches
//             const batchResults = await accountingapi.run(batchQuery);
//             console.log(`Processing batch starting at index ${startIndex} of ${totalRecordsCount} records`);

//             // Prepare grouped records
//             const groupMap = new Map();
//             batchResults.forEach(item => {
//                 const groupKey = `${item.CompanyCode}-${item.FiscalYear}-${item.AccountingDocument}`;
//                 if (!groupMap.has(groupKey)) {
//                     item.ID = uuidv4();  // Assign a unique ID
//                     groupMap.set(groupKey, item);  // Store one record per group
//                 }
//             });

//             // Convert grouped data to an array
//             const groupedData = [];
//             groupMap.forEach(group => groupedData.push(group));

//             // Insert records into the local database
//             if (groupedData.length > 0) {
//                 await cds.run(UPSERT.into(accdoc).entries(groupedData));
//             }

//             startIndex += batchSize;  // Move to the next batch
//         }

//         if (totalRecordsCount === 0) {
//             console.log('No new records to insert after the latest LastChangeDate.');
//         } else {
//             console.log('All batches processed successfully.');
//         }
//     });
// });


const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

module.exports = cds.service.impl(async function () {
    const accountingapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');
    const { accounting, accdoc, AccountingDocumentItems } = this.entities;

    this.on('buttonController', async (req) => {
        console.log("Button clicked");

        // Query the latest LastChangeDate from the local database for accdoc
        const lastSyncRecordAccdoc = await cds.run(
            SELECT.one.columns('LastChangeDate')
                .from(accdoc)
                .orderBy('LastChangeDate desc')
        );

        // Query the latest LastChangeDate from the local database for AccountingDocumentItems
        const lastSyncRecordDocItems = await cds.run(
            SELECT.one.columns('LastChangeDate')
                .from(AccountingDocumentItems)
                .orderBy('LastChangeDate desc')
        );

        let totalRecordsCountAccdoc;
        let totalRecordsCountDocItems;

        // Determine if this is an initial load or filtered load for accdoc
        if (lastSyncRecordAccdoc && lastSyncRecordAccdoc.LastChangeDate) {
            let lastSyncDate = lastSyncRecordAccdoc.LastChangeDate.slice(0, -1);  // Remove the 'Z'

            totalRecordsCountAccdoc = await accountingapi.send({
                method: 'GET',
                path: `/A_OperationalAcctgDocItemCube/$count?$filter=LastChangeDate gt datetime'${lastSyncDate}'`
            });
        } else {
            totalRecordsCountAccdoc = await accountingapi.send({
                method: 'GET',
                path: "/A_OperationalAcctgDocItemCube/$count"
            });
        }

        const batchSize = 5000;
        let startIndexAccdoc = 0;

        // Process accdoc in batches
        while (startIndexAccdoc < totalRecordsCountAccdoc) {
            let batchQueryAccdoc = SELECT.from(accounting)
                .columns('CompanyCode', 'FiscalYear', 'FiscalPeriod', 'AccountingDocument', 'AccountingDocumentType', 'LastChangeDate')
                .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
                .and({ CompanyCodeCurrency: 'INR' })
                .limit(batchSize, startIndexAccdoc);

            if (lastSyncRecordAccdoc && lastSyncRecordAccdoc.LastChangeDate) {
                batchQueryAccdoc = batchQueryAccdoc.and({ LastChangeDate: { '>': lastSyncRecordAccdoc.LastChangeDate } });
            }

            const batchResultsAccdoc = await accountingapi.run(batchQueryAccdoc);
            console.log(`Processing batch starting at index ${startIndexAccdoc} of ${totalRecordsCountAccdoc} accdoc records`);

            const groupMapAccdoc = new Map();
            batchResultsAccdoc.forEach(item => {
                const groupKey = `${item.CompanyCode}-${item.FiscalYear}-${item.AccountingDocument}`;
                if (!groupMapAccdoc.has(groupKey)) {
                    item.ID = uuidv4();  // Assign a unique ID
                    groupMapAccdoc.set(groupKey, item);  // Store one record per group
                }
            });

            const groupedDataAccdoc = [];
            groupMapAccdoc.forEach(group => groupedDataAccdoc.push(group));

            // Insert records into the local database
            if (groupedDataAccdoc.length > 0) {
                await cds.run(UPSERT.into(accdoc).entries(groupedDataAccdoc));
            }

            startIndexAccdoc += batchSize;  // Move to the next batch
        }

        console.log('All batches processed successfully for accdoc.');

        // Now handle AccountingDocumentItems
        let startIndexDocItems = 0;

        // Determine if this is an initial load or filtered load for AccountingDocumentItems
        if (lastSyncRecordDocItems && lastSyncRecordDocItems.LastChangeDate) {
            let lastSyncDate = lastSyncRecordDocItems.LastChangeDate.slice(0, -1);  // Remove the 'Z'

            totalRecordsCountDocItems = await accountingapi.send({
                method: 'GET',
                path: `/A_OperationalAcctgDocItemCube/$count?$filter=LastChangeDate gt datetime'${lastSyncDate}'`
            });
        } else {
            totalRecordsCountDocItems = await accountingapi.send({
                method: 'GET',
                path: "/A_OperationalAcctgDocItemCube/$count"
            });
        }

        // Process AccountingDocumentItems in batches
        while (startIndexDocItems < totalRecordsCountDocItems) {
            let batchQueryDocItems = SELECT.from(accounting)
                .columns('AccountingDocument', 'AccountingDocumentItem', 'TaxCode', 'GLAccount', 'TransactionTypeDetermination', 'CompanyCode', 'FiscalYear', 'AmountInCompanyCodeCurrency', 'LastChangeDate')
                .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
                .and({ CompanyCodeCurrency: 'INR' })
                .limit(batchSize, startIndexDocItems);

            if (lastSyncRecordDocItems && lastSyncRecordDocItems.LastChangeDate) {
                batchQueryDocItems = batchQueryDocItems.and({ LastChangeDate: { '>': lastSyncRecordDocItems.LastChangeDate } });
            }

            const batchResultsDocItems = await accountingapi.run(batchQueryDocItems);
            console.log(`Processing batch starting at index ${startIndexDocItems} of ${totalRecordsCountDocItems} AccountingDocumentItems records`);

            const groupMapDocItems = new Map();
            batchResultsDocItems.forEach(item => {
                const groupKey = `${item.AccountingDocument}-${item.AccountingDocumentItem}-${item.CompanyCode}-${item.FiscalYear}`;
                if (!groupMapDocItems.has(groupKey)) {
                    item.ID = uuidv4();  // Assign a unique ID
                    groupMapDocItems.set(groupKey, item);  // Store one record per group
                }
            });

            const groupedDataDocItems = [];
            groupMapDocItems.forEach(group => groupedDataDocItems.push(group));

            // Insert records into the local database
            if (groupedDataDocItems.length > 0) {
                await cds.run(UPSERT.into(AccountingDocumentItems).entries(groupedDataDocItems));
            }

            startIndexDocItems += batchSize;  // Move to the next batch
        }

        console.log('All batches processed successfully for AccountingDocumentItems.');
    });
});
