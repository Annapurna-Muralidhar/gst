sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator"
], function(MessageToast, BusyIndicator) {
    'use strict';

    return {
        loadData: function() {
        //     MessageToast.show("Custom handler invoked.");
        //     // let  model= this._view.getModel()
        //     // console.log(model instanceof sap.ui.model.odata.v2.ODataModel);
        //     // console.log(model.getServiceUrl()); 
        //     // console.log(model.getMetadata()); 
            
        //         this.editFlow.invokeAction('AccountingDocument/buttonController', {
        //             model: this._view.getModel(),
                    
        //         }).then(function(result) {
        //             console.log("Action executed successfully.");
                  
        //             console.log(result);
                      
        //         })

        $.ajax({
            url: "/odata/v4/accounting-document/buttonController", 
            type:'POST',
            contentType: "application/json",
            success: function (result) {
                console.log("Action executed successfully.");
                console.log(result); // This should contain the "YAYYYYYYYYYYYYYYYYY" string if your action is successful
            }
        });
        

                
            }
            
        }
    }
    
);

