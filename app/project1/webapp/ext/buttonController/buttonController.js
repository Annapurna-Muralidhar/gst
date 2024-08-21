sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator"
], function(MessageToast, BusyIndicator) {
    'use strict';

    return {
        loadData: function(oBindingContext, aSelectedContexts) {
            MessageToast.show("Custom handler invoked.");

            // Debugging: Log the binding context and selected contexts
            console.log("oBindingContext: ", oBindingContext);
            console.log("aSelectedContexts: ", aSelectedContexts);

            // Check if the selected contexts array is valid
            if (aSelectedContexts && aSelectedContexts.length > 0 && aSelectedContexts[0]) {
                const context = aSelectedContexts[0]; // First selected context
                
                // Log the context to ensure it's valid
                console.log("Selected context: ", context);

                // Invoke the bound action with the selected context
                this.editFlow.invokeAction('AccountingDocument/loaddata', {
                    contexts: [context] // Pass the context to the invokeAction
                }).then(function(result) {
                    console.log("Action executed successfully.");
                    BusyIndicator.show();
                    console.log(result.value);
                    context.getModel().refresh();
                }).catch(function(error) {
                    console.error("Error invoking action:", error);
                }).finally(function() {
                    BusyIndicator.hide();
                });

            } else {
                console.error("No context provided for the bound action.");
            }
        }
    };
});
