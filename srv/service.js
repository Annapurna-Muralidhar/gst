
const cds = require('@sap/cds');
const { v4: uuidv4 } = require('uuid'); // Import UUID library

module.exports = cds.service.impl(async function() {
    const accountingapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');
    const { accounting, accdoc,AccountingDocumentItems } = this.entities; // Only use local entities

    // Custom Read Handler for 'accounting' entity
    // this.on('READ', 'accounting', async (req) => {
    //     const query = req.query
    //         .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
    //         .and({ CompanyCodeCurrency: 'INR' });
        
    //     const result = await accountingapi.run(query);
        
    //     return result;
    // });
    

    // this.before('READ', 'accdoc', async (req) => {
    //     const query = SELECT.from(accounting)
    //         .columns('CompanyCode', 'FiscalYear', 'FiscalPeriod', 'AccountingDocument', 'AccountingDocumentType','LastChangeDate')
    //         .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
    //         .and({ CompanyCodeCurrency: 'INR' });
    
    //     const res = await accountingapi.run(query);
    //     //console.log('Fetched records:', res);
    
    //     // Group records by CompanyCode, FiscalYear, and AccountingDocument
    //     const groupMap = new Map();
    //     res.forEach(item => {
    //         const groupKey = `${item.CompanyCode}-${item.FiscalYear}-${item.AccountingDocument}`;
    //         if (!groupMap.has(groupKey)) {
    //             item.ID = uuidv4();
    //             groupMap.set(groupKey, item);  // Store only one record per group
    //         }
    //     });
    
    //     const groupedData = [];
    //     groupMap.forEach(group => groupedData.push(group));
    //     console.log('Grouped records:', groupedData);
    
    //     // Perform a bulk UPSERT using a single operation
    //     const existingRecords = await cds.run(
    //         SELECT.from(accdoc)
    //             .columns('CompanyCode', 'FiscalYear', 'AccountingDocument')
    //             .where({
    //                 CompanyCode: { in: groupedData.map(r => r.CompanyCode) },
    //                 FiscalYear: { in: groupedData.map(r => r.FiscalYear) },
    //                 AccountingDocument: { in: groupedData.map(r => r.AccountingDocument) }
    //             })
    //     );
    
    //     // Filter out the already existing records
    //     const newRecords = groupedData.filter(groupedRecord => {
    //         return !existingRecords.some(existingRecord =>
    //             existingRecord.CompanyCode === groupedRecord.CompanyCode &&
    //             existingRecord.FiscalYear === groupedRecord.FiscalYear &&
    //             existingRecord.AccountingDocument === groupedRecord.AccountingDocument
    //         );
    //     });
    
    //     if (newRecords.length > 0) {
    //         await cds.run(UPSERT.into(accdoc).entries(newRecords));
    //         //console.log('Inserted new records:', newRecords);
    //     } else {
    //         //console.log('No new records to insert.');
    //     }
    // });

       
    
       
  
    //const { v4: uuidv4 } = require('uuid'); // Import UUID library



// this.before('READ', 'AccountingDocumentItems', async (req) => {
//     // Fetch records from the source
//     const query = SELECT.from(accounting)
//         .columns('AccountingDocument', 'AccountingDocumentItem', 'TaxCode', 'GLAccount', 'TransactionTypeDetermination', 'CompanyCode', 'FiscalYear','AmountInCompanyCodeCurrency')
//         .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
//         .and({ CompanyCodeCurrency: 'INR' });

//     const sourceRecords = await accountingapi.run(query);
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

    this.on('loaddata',async (req)=>{
        console.log("button clicked");
        return true;
        
    })
   
    
    
    
    
    
    
});



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

