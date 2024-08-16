// const cds = require('@sap/cds');


// module.exports = cds.service.impl(async function() {
//     const accountingapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');
//     const { accounting,accdoc,AccountinDocumentItems,AccountingDocument } = this.entities;  // Only use local entities
//     this.on('READ', 'accounting', async (req) => {

//             const query = req.query
//                 .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
//                 .and({ CompanyCodeCurrency: 'INR' });
//             const result = await accountingapi.run(query);
//             return result;
        
//     });

//     this.before('READ','accdoc',async (req) => {
//         // console.log("Accounting Document Selected");
//         //  console.log(this.entities)

//         const q=SELECT.from(accounting)
//         let res=await accountingapi.run(q)
//         let filteredData = res.filter(record => record.AccountingDocumentType == 'RV' | 'RE'|'DR'|'KR'|'DG'|'KG');
        
//         //console.log(filteredData)
//         const query = UPSERT.into(accdoc).entries(filteredData)
//         console.log(query);
        
//         await cds.run(query)
        
//     })

    
// });

const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    const accountingapi = await cds.connect.to('API_OPLACCTGDOCITEMCUBE_SRV');
    const { accounting, accdoc } = this.entities; // Only use local entities

    // Custom Read Handler for 'accounting' entity
    this.on('READ', 'accounting', async (req) => {
        const query = req.query
            .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
            .and({ CompanyCodeCurrency: 'INR' });
        
        const result = await accountingapi.run(query);
        
        return result;
    });
    
    // this.before('READ', 'accdoc', async (req) => {
    //     if (!req.data.ID) {
    //         req.data.ID = cds.utils.uuid();  // Generate UUID if ID is missing
    //     }
    //     const query = SELECT.from(accounting)
    //     .columns('CompanyCode', 'FiscalYear', 'FiscalPeriod', 'AccountingDocumentType','AccountingDocument')
       
    //         .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
    //         .and({ CompanyCodeCurrency: 'INR' });
    
    //     const res = await accountingapi.run(query);
    //     console.log(res);
    //     await cds.run(UPSERT.into(accdoc).entries(res));
            
        
    // });
    this.before('READ', 'accdoc', async (req) => {
        const query = SELECT.from(accounting)
            .columns('CompanyCode', 'FiscalYear', 'FiscalPeriod', 'AccountingDocument', 'AccountingDocumentType')
            .where({ AccountingDocumentType: { in: ['RV', 'RE', 'DR', 'KR', 'DG', 'KG'] } })
            .and({ CompanyCodeCurrency: 'INR' });
    
        const res = await accountingapi.run(query);
        console.log('Fetched records:', res);
    
        // Group records by CompanyCode, FiscalYear, and AccountingDocument
        const groupMap = new Map();
        res.forEach(item => {
            const groupKey = `${item.CompanyCode}-${item.FiscalYear}-${item.AccountingDocument}`;
            if (!groupMap.has(groupKey)) {
                groupMap.set(groupKey, item);  // Store only one record per group
            }
        });
    
        const groupedData = [];
        groupMap.forEach(group => groupedData.push(group));
        console.log('Grouped records:', groupedData);
    
        // Perform a bulk UPSERT using a single operation
        const existingRecords = await cds.run(
            SELECT.from(accdoc)
                .columns('CompanyCode', 'FiscalYear', 'AccountingDocument')
                .where({
                    CompanyCode: { in: groupedData.map(r => r.CompanyCode) },
                    FiscalYear: { in: groupedData.map(r => r.FiscalYear) },
                    AccountingDocument: { in: groupedData.map(r => r.AccountingDocument) }
                })
        );
    
        // Filter out the already existing records
        const newRecords = groupedData.filter(groupedRecord => {
            return !existingRecords.some(existingRecord =>
                existingRecord.CompanyCode === groupedRecord.CompanyCode &&
                existingRecord.FiscalYear === groupedRecord.FiscalYear &&
                existingRecord.AccountingDocument === groupedRecord.AccountingDocument
            );
        });
    
        if (newRecords.length > 0) {
            await cds.run(UPSERT.into(accdoc).entries(newRecords));
            console.log('Inserted new records:', newRecords);
        } else {
            console.log('No new records to insert.');
        }
    });
    
    
   
    
    
    
    
    
    
});
