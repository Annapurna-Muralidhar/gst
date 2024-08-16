namespace com.satinfotech.gst;
using {managed,cuid} from '@sap/cds/common';

entity AccountingDocument :managed {
   
    CompanyCode : String(4);
    FiscalYear:String(4);
    FiscalPeriod:String(3);
    AccountingDocument:String(10);
   
    AccountingDocumentType:String(2); 
    AccountingDocumentItems :Composition of  many AccountingDocumentItems on AccountingDocumentItems.AccountingDocument=$self ;
}

entity AccountingDocumentItems : managed {
    
    AccountingDocument:Association to one AccountingDocument;
    AccountingDocumentItem : String(10);
   TaxCode:String(2);
   GLAccount:String(10);
   TransactionTypeDetermination:String(3);
   
}