// const cds = require('@sap/cds');
// const { v4: uuidv4 } = require('uuid');

// module.exports = cds.service.impl(async function () {
//     const accountingapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');
//     const { accounting, accdoc, AccountingDocumentItems } = this.entities;

//     this.on('buttonController', async (req) => {
//         console.log("Button clicked");

//         // Query the latest LastChangeDate from the local database for accdoc
//         const lastSyncRecordAccdoc = await cds.run(
//             SELECT.one.columns('LastChangeDate')
//                 .from(accdoc)
//                 .orderBy('LastChangeDate desc')
//         );

//         // Query the latest LastChangeDate from the local database for AccountingDocumentItems
//         const lastSyncRecordDocItems = await cds.run(
//             SELECT.one.columns('LastChangeDate')
//                 .from(AccountingDocumentItems)
//                 .orderBy('LastChangeDate desc')
//         );

//         let totalRecordsCountAccdoc;
//         let totalRecordsCountDocItems;

//         // Determine if this is an initial load or filtered load for accdoc
//         if (lastSyncRecordAccdoc && lastSyncRecordAccdoc.LastChangeDate) {
//             let lastSyncDate = lastSyncRecordAccdoc.LastChangeDate.slice(0, -1);  // Remove the 'Z'

//             totalRecordsCountAccdoc = await accountingapi.send({
//                 method: 'GET',
//                 path: `/A_OperationalAcctgDocItemCube/$count?$filter=LastChangeDate gt datetime'${lastSyncDate}'`
//             });
//         } else {
//             totalRecordsCountAccdoc = await accountingapi.send({
//                 method: 'GET',
//                 path: "/A_OperationalAcctgDocItemCube/$count"
//             });
//         }

//         const batchSize = 5000;
//         let startIndexAccdoc = 0;

//         // Process accdoc in batches
//         while (startIndexAccdoc < totalRecordsCountAccdoc) {
//             let batchQueryAccdoc = SELECT.from(accounting)
//                 .columns('CompanyCode', 'FiscalYear', 'FiscalPeriod', 'AccountingDocument', 'AccountingDocumentType', 'LastChangeDate')
//                 .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
//                 .and({ CompanyCodeCurrency: 'INR' })
//                 .limit(batchSize, startIndexAccdoc);

//             if (lastSyncRecordAccdoc && lastSyncRecordAccdoc.LastChangeDate) {
//                 batchQueryAccdoc = batchQueryAccdoc.and({ LastChangeDate: { '>': lastSyncRecordAccdoc.LastChangeDate } });
//             }

//             const batchResultsAccdoc = await accountingapi.run(batchQueryAccdoc);
//             console.log(`Processing batch starting at index ${startIndexAccdoc} of ${totalRecordsCountAccdoc} accdoc records`);

//             const groupMapAccdoc = new Map();
//             batchResultsAccdoc.forEach(item => {
//                 const groupKey = `${item.CompanyCode}-${item.FiscalYear}-${item.AccountingDocument}`;
//                 if (!groupMapAccdoc.has(groupKey)) {
//                     item.ID = uuidv4();  // Assign a unique ID
//                     groupMapAccdoc.set(groupKey, item);  // Store one record per group
//                 }
//             });

//             const groupedDataAccdoc = [];
//             groupMapAccdoc.forEach(group => groupedDataAccdoc.push(group));

//             // Insert records into the local database
//             if (groupedDataAccdoc.length > 0) {
//                 await cds.run(UPSERT.into(accdoc).entries(groupedDataAccdoc));
//             }

//             startIndexAccdoc += batchSize;  // Move to the next batch
//         }

//         console.log('All batches processed successfully for accdoc.');

//         // Now handle AccountingDocumentItems
//         let startIndexDocItems = 0;

//         // Determine if this is an initial load or filtered load for AccountingDocumentItems
//         if (lastSyncRecordDocItems && lastSyncRecordDocItems.LastChangeDate) {
//             let lastSyncDate = lastSyncRecordDocItems.LastChangeDate.slice(0, -1);  // Remove the 'Z'

//             totalRecordsCountDocItems = await accountingapi.send({
//                 method: 'GET',
//                 path: `/A_OperationalAcctgDocItemCube/$count?$filter=LastChangeDate gt datetime'${lastSyncDate}'`
//             });
//         } else {
//             totalRecordsCountDocItems = await accountingapi.send({
//                 method: 'GET',
//                 path: "/A_OperationalAcctgDocItemCube/$count"
//             });
//         }

//         // Process AccountingDocumentItems in batches
//         while (startIndexDocItems < totalRecordsCountDocItems) {
//             let batchQueryDocItems = SELECT.from(accounting)
//                 .columns('AccountingDocument', 'AccountingDocumentItem', 'TaxCode', 'GLAccount', 'TransactionTypeDetermination', 'CompanyCode', 'FiscalYear', 'AmountInCompanyCodeCurrency', 'LastChangeDate')
//                 .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
//                 .and({ CompanyCodeCurrency: 'INR' })
//                 .limit(batchSize, startIndexDocItems);

//             if (lastSyncRecordDocItems && lastSyncRecordDocItems.LastChangeDate) {
//                 batchQueryDocItems = batchQueryDocItems.and({ LastChangeDate: { '>': lastSyncRecordDocItems.LastChangeDate } });
//             }

//             const batchResultsDocItems = await accountingapi.run(batchQueryDocItems);
//             console.log(`Processing batch starting at index ${startIndexDocItems} of ${totalRecordsCountDocItems} AccountingDocumentItems records`);

//             const groupMapDocItems = new Map();
//             batchResultsDocItems.forEach(item => {
//                 const groupKey = `${item.AccountingDocument}-${item.AccountingDocumentItem}-${item.CompanyCode}-${item.FiscalYear}`;
//                 if (!groupMapDocItems.has(groupKey)) {
//                     item.ID = uuidv4();  // Assign a unique ID
//                     groupMapDocItems.set(groupKey, item);  // Store one record per group
//                 }
//             });

//             const groupedDataDocItems = [];
//             groupMapDocItems.forEach(group => groupedDataDocItems.push(group));

//             // Insert records into the local database
//             if (groupedDataDocItems.length > 0) {
//                 await cds.run(UPSERT.into(AccountingDocumentItems).entries(groupedDataDocItems));
//             }

//             startIndexDocItems += batchSize;  // Move to the next batch
//         }

//         console.log('All batches processed successfully for AccountingDocumentItems.');
//         return true ;
//     });
// });




// const cds = require('@sap/cds');
// const { v4: uuidv4 } = require('uuid');

// module.exports = cds.service.impl(async function () {
//     const accountingapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');
//     const { accounting, accdoc, AccountingDocumentItems } = this.entities;

//     this.on('buttonController', async (req) => {
//         const logs = []; 

//         logs.push("Button clicked");
//         const lastSyncRecordAccdoc = await cds.run(
//             SELECT.one.columns('LastChangeDate')
//                 .from(accdoc)
//                 .orderBy('LastChangeDate desc')
//         );

//         const lastSyncRecordDocItems = await cds.run(
//             SELECT.one.columns('LastChangeDate')
//                 .from(AccountingDocumentItems)
//                 .orderBy('LastChangeDate desc')
//         );

//         let totalRecordsCountAccdoc;
//         let totalRecordsCountDocItems;
//         if (lastSyncRecordAccdoc && lastSyncRecordAccdoc.LastChangeDate) {
//             let lastSyncDate = lastSyncRecordAccdoc.LastChangeDate.slice(0, -1);

//             totalRecordsCountAccdoc = await accountingapi.send({
//                 method: 'GET',
//                 path: `/A_OperationalAcctgDocItemCube/$count?$filter=LastChangeDate gt datetime'${lastSyncDate}'`
//             });
//         } else {
//             totalRecordsCountAccdoc = await accountingapi.send({
//                 method: 'GET',
//                 path: "/A_OperationalAcctgDocItemCube/$count"
//             });
//         }

//         const batchSize = 5000;
//         let startIndexAccdoc = 0;
//         while (startIndexAccdoc < totalRecordsCountAccdoc) {
//             logs.push(`Processing batch starting at index ${startIndexAccdoc} of ${totalRecordsCountAccdoc} accdoc records`);

//             let batchQueryAccdoc = SELECT.from(accounting)
//                 .columns('CompanyCode', 'FiscalYear','FiscalPeriod', 'AccountingDocument','AccountingDocumentType' ,'LastChangeDate')
//                 .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
//                  .and({ CompanyCodeCurrency: 'INR' })
//                 .limit(batchSize, startIndexAccdoc);

//             if (lastSyncRecordAccdoc && lastSyncRecordAccdoc.LastChangeDate) {
//                 batchQueryAccdoc = batchQueryAccdoc.and({ LastChangeDate: { '>': lastSyncRecordAccdoc.LastChangeDate } });
//             }

//             const batchResultsAccdoc = await accountingapi.run(batchQueryAccdoc);

//             const groupMapAccdoc = new Map();
//             batchResultsAccdoc.forEach(item => {
//                 const groupKey = `${item.CompanyCode}-${item.FiscalYear}-${item.AccountingDocument}`;
//                 if (!groupMapAccdoc.has(groupKey)) {
//                     item.ID = uuidv4();
//                     groupMapAccdoc.set(groupKey, item);
//                 }
//             });

//             const groupedDataAccdoc = [];
//             groupMapAccdoc.forEach(group => groupedDataAccdoc.push(group));

//             if (groupedDataAccdoc.length > 0) {
//                 await cds.run(UPSERT.into(accdoc).entries(groupedDataAccdoc));
//             }

//             startIndexAccdoc += batchSize;
//         }

//         logs.push('All batches processed successfully for accdoc.');

//         let startIndexDocItems = 0;
//         if (lastSyncRecordDocItems && lastSyncRecordDocItems.LastChangeDate) {
//             let lastSyncDate = lastSyncRecordDocItems.LastChangeDate.slice(0, -1);

//             totalRecordsCountDocItems = await accountingapi.send({
//                 method: 'GET',
//                 path: `/A_OperationalAcctgDocItemCube/$count?$filter=LastChangeDate gt datetime'${lastSyncDate}'`
//             });
//         } else {
//             totalRecordsCountDocItems = await accountingapi.send({
//                 method: 'GET',
//                 path: "/A_OperationalAcctgDocItemCube/$count"
//             });
//         }

//         while (startIndexDocItems < totalRecordsCountDocItems) {
//             logs.push(`Processing batch starting at index ${startIndexDocItems} of ${totalRecordsCountDocItems} AccountingDocumentItems records`);

//             let batchQueryDocItems = SELECT.from(accounting)
//                 .columns('AccountingDocument', 'AccountingDocumentItem', 'TaxCode','GLAccount','TransactionTypeDetermination','AmountInCompanyCodeCurrency', 'CompanyCode', 'FiscalYear', 'LastChangeDate')
//                 .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
//                  .and({ CompanyCodeCurrency: 'INR' })
//                 .limit(batchSize, startIndexDocItems);

//             if (lastSyncRecordDocItems && lastSyncRecordDocItems.LastChangeDate) {
//                 batchQueryDocItems = batchQueryDocItems.and({ LastChangeDate: { '>': lastSyncRecordDocItems.LastChangeDate } });
//             }

//             const batchResultsDocItems = await accountingapi.run(batchQueryDocItems);

//             const groupMapDocItems = new Map();
//             batchResultsDocItems.forEach(item => {
//                 const groupKey = `${item.AccountingDocument}-${item.AccountingDocumentItem}-${item.CompanyCode}-${item.FiscalYear}`;
//                 if (!groupMapDocItems.has(groupKey)) {
//                     item.ID = uuidv4();
//                     groupMapDocItems.set(groupKey, item);
//                 }
//             });

//             const groupedDataDocItems = [];
//             groupMapDocItems.forEach(group => groupedDataDocItems.push(group));

//             if (groupedDataDocItems.length > 0) {
//                 await cds.run(UPSERT.into(AccountingDocumentItems).entries(groupedDataDocItems));
//             }

//             startIndexDocItems += batchSize;
//         }

//         logs.push('All batches processed successfully for AccountingDocumentItems.');

//         return { value: { logs } };
//     });
// });


const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid');

module.exports = cds.service.impl(async function () {
    const accountingapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');
    const { accounting, accdoc, AccountingDocumentItems } = this.entities;

    this.on('buttonController', async (req) => {
        const logs = [];
       

        logs.push("Button clicked");
        const lastSyncRecordAccdoc = await cds.run(
            SELECT.one.columns('LastChangeDate')
                .from(accdoc)
                .orderBy('LastChangeDate desc')
        );

        const lastSyncRecordDocItems = await cds.run(
            SELECT.one.columns('LastChangeDate')
                .from(AccountingDocumentItems)
                .orderBy('LastChangeDate desc')
        );

        let totalRecordsCountAccdoc;
        let totalRecordsCountDocItems;
        if (lastSyncRecordAccdoc && lastSyncRecordAccdoc.LastChangeDate) {
            let lastSyncDate = lastSyncRecordAccdoc.LastChangeDate.slice(0, -1);

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
        while (startIndexAccdoc < totalRecordsCountAccdoc) {
            logs.push(`Processing batch starting at index ${startIndexAccdoc} of ${totalRecordsCountAccdoc} accdoc records`);

            let batchQueryAccdoc = SELECT.from(accounting)
                .columns('CompanyCode', 'FiscalYear', 'FiscalPeriod', 'AccountingDocument', 'AccountingDocumentType', 'LastChangeDate')
                .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
                .and({ CompanyCodeCurrency: 'INR' })
                .limit(batchSize, startIndexAccdoc);

            if (lastSyncRecordAccdoc && lastSyncRecordAccdoc.LastChangeDate) {
                batchQueryAccdoc = batchQueryAccdoc.and({ LastChangeDate: { '>': lastSyncRecordAccdoc.LastChangeDate } });
            }

            const batchResultsAccdoc = await accountingapi.run(batchQueryAccdoc);

            const groupMapAccdoc = new Map();
            batchResultsAccdoc.forEach(item => {
                const groupKey = `${item.CompanyCode}-${item.FiscalYear}-${item.AccountingDocument}`;
                if (!groupMapAccdoc.has(groupKey)) {
                    item.ID = uuidv4();
                    groupMapAccdoc.set(groupKey, item);
                }
            });

            const groupedDataAccdoc = [];
            groupMapAccdoc.forEach(group => groupedDataAccdoc.push(group));

            if (groupedDataAccdoc.length > 0) {
                await cds.run(UPSERT.into(accdoc).entries(groupedDataAccdoc));
            //totalProcessedAccdoc     += groupedDataAccdoc.length;  // Update total processed accdoc records
            }

            startIndexAccdoc += batchSize;
        }

        logs.push('All batches processed successfully for accdoc.');

        let startIndexDocItems = 0;
        if (lastSyncRecordDocItems && lastSyncRecordDocItems.LastChangeDate) {
            let lastSyncDate = lastSyncRecordDocItems.LastChangeDate.slice(0, -1);

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

        while (startIndexDocItems < totalRecordsCountDocItems) {
            logs.push(`Processing batch starting at index ${startIndexDocItems} of ${totalRecordsCountDocItems} AccountingDocumentItems records`);

            let batchQueryDocItems = SELECT.from(accounting)
                .columns('AccountingDocument', 'AccountingDocumentItem', 'TaxCode', 'GLAccount', 'TransactionTypeDetermination', 'AmountInCompanyCodeCurrency', 'CompanyCode', 'FiscalYear', 'LastChangeDate')
                .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
                .and({ CompanyCodeCurrency: 'INR' })
                .limit(batchSize, startIndexDocItems);

            if (lastSyncRecordDocItems && lastSyncRecordDocItems.LastChangeDate) {
                batchQueryDocItems = batchQueryDocItems.and({ LastChangeDate: { '>': lastSyncRecordDocItems.LastChangeDate } });
            }

            const batchResultsDocItems = await accountingapi.run(batchQueryDocItems);

            const groupMapDocItems = new Map();
            batchResultsDocItems.forEach(item => {
                const groupKey = `${item.AccountingDocument}-${item.AccountingDocumentItem}-${item.CompanyCode}-${item.FiscalYear}`;
                if (!groupMapDocItems.has(groupKey)) {
                    item.ID = uuidv4();
                    groupMapDocItems.set(groupKey, item);
                }
            });

            const groupedDataDocItems = [];
            groupMapDocItems.forEach(group => groupedDataDocItems.push(group));

            if (groupedDataDocItems.length > 0) {
                await cds.run(UPSERT.into(AccountingDocumentItems).entries(groupedDataDocItems));
              //  totalProcessedDocItems += groupedDataDocItems.length;  // Update total processed doc items records
            }

            startIndexDocItems += batchSize;
        }

        logs.push('All batches processed successfully for AccountingDocumentItems.');

        return { value: { logs, totalRecordsCountAccdoc } };  
    });
});
