// sap.ui.define([
//     "sap/m/MessageToast",
//     "sap/ui/core/BusyIndicator"
// ], function(MessageToast, BusyIndicator) {
//     'use strict';



//     return {
//         loadData: function() {
       

//         $.ajax({
//             url: "/odata/v4/accounting-document/buttonController", 
//             type:'POST',
//             contentType: "application/json",
//             success: function (result) {
//                 //sap.ui.core.BusyIndicator.show(true);
//                 console.log("Action executed successfully.");
//                console.log(result);
//                if(result.value){
//                 //sap.ui.core.BusyIndicator.hide();
//                 //window.location.reload(true)
//                }
               
                
//             }
//         });
        

                
//             }
            
//         }
//     }
    
// );
// sap.ui.define([
//     "sap/m/Dialog",
//     "sap/m/Text",
//     "sap/m/Button",
//     "sap/m/VBox"
// ], function (Dialog, Text, Button, VBox) {
//     'use strict';

//     return {
//         loadData: function () {
//             // Create a dialog to display logs
//             const logDialog = new Dialog({
//                 title: "Processing Logs",
//                 contentWidth: "400px",
//                 contentHeight: "300px",
//                 verticalScrolling: true,
//                 content: new VBox({
//                     items: []
//                 }),
//                 beginButton: new Button({
//                     text: "Close",
//                     press: function () {
//                         logDialog.close();
//                     }
//                 })
//             });

//             logDialog.open();

//             // Trigger backend process and fetch logs
//             $.ajax({
//                 url: "/odata/v4/accounting-document/buttonController",
//                 type: 'POST',
//                 contentType: "application/json",
//                 success: function (result) {
//                     console.log(result.value.value);
                    
//                     if (result.value.value && result.value.value.logs) {
//                         // Add each log to the dialog
//                         result.value.value.logs.forEach(log => {
//                             logDialog.getContent()[0].addItem(new Text({ text: log }));
//                         });
//                     }
//                 },
//                 error: function () {
//                     logDialog.getContent()[0].addItem(new Text({ text: "Error fetching logs." }));
//                 }
//             });
//         }
//     };
// });

// sap.ui.define([
//     "sap/m/Dialog",
//     "sap/m/Text",
//     "sap/m/Button",
//     "sap/m/VBox"
// ], function (Dialog, Text, Button, VBox) {
//     'use strict';

//     return {
//         loadData: function () {
//             // Create a dialog to display logs
//             const logDialog = new Dialog({
//                 title: "Processing Logs",
//                 contentWidth: "400px",
//                 contentHeight: "300px",
//                 verticalScrolling: true,
//                 content: new VBox({
//                     items: []
//                 }),
//                 beginButton: new Button({
//                     text: "Close",
//                     press: function () {
//                         logDialog.close();
//                     }
//                 })
//             });

//             logDialog.open();

//             // Trigger backend process and fetch logs
//             $.ajax({
//                 url: "/odata/v4/accounting-document/buttonController",
//                 type: 'POST',
//                 contentType: "application/json",
//                 success: function (result) {
//                     console.log(result.value.value);

//                     if (result.value.value && result.value.value.logs) {
//                         const logs = result.value.value.logs;
//                         let logIndex = 0;

//                         // Function to display one log every second
//                         const displayLog = function() {
//                             if (logIndex < logs.length) {
//                                 logDialog.getContent()[0].addItem(new Text({ text: logs[logIndex] }));
//                                 logIndex++;
//                                 setTimeout(displayLog, 1000); // Call the function again after 1 second
//                             }
//                         };

//                         // Start displaying logs
//                         displayLog();
//                     }
//                     //window.location.reload(true)
//                 },
//                 error: function () {
//                     logDialog.getContent()[0].addItem(new Text({ text: "Error fetching logs." }));
//                 }
//             });
//         }
//     };
// });


// sap.ui.define([
//     "sap/m/Dialog",
//     "sap/m/Text",
//     "sap/m/Button",
//     "sap/m/VBox"
// ], function (Dialog, Text, Button, VBox) {
//     'use strict';

//     return {
//         loadData: function () {
//             // Create a dialog to display logs
//             const logDialog = new Dialog({
//                 title: "Processing Logs",
//                 contentWidth: "400px",
//                 contentHeight: "300px",
//                 verticalScrolling: true,
//                 content: new VBox({
//                     items: []
//                 }),
//                 beginButton: new Button({
//                     text: "Close",
//                     press: function () {
//                         logDialog.close();
//                     }
//                 })
//             });

//             logDialog.open();

//             // Trigger backend process and fetch logs
//             $.ajax({
//                 url: "/odata/v4/accounting-document/buttonController",
//                 type: 'POST',
//                 contentType: "application/json",
//                 success: function (result) {
//                     console.log(result.value.value);

//                     if (result.value.value && result.value.value.logs) {
//                         const logs = result.value.value.logs;
//                         let logIndex = 0;

//                         // Function to display one log every second
//                         const displayLog = function() {
//                             if (logIndex < logs.length) {
//                                 logDialog.getContent()[0].addItem(new Text({ text: logs[logIndex] }));
//                                 logIndex++;
//                                 setTimeout(displayLog, 1000); // Call the function again after 1 second
//                             } else {
//                                 // Reload the window after all logs are displayed
//                                 setTimeout(function() {
//                                     window.location.reload();
//                                 }, 1000); // Give a small delay before reload
//                             }
//                         };

//                         // Start displaying logs
//                         displayLog();
//                     }
//                 },
//                 error: function () {
//                     logDialog.getContent()[0].addItem(new Text({ text: "Error fetching logs." }));
//                 }
//             });
//         }
//     };
// });

sap.ui.define([
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/Button",
    "sap/m/VBox",
    "sap/m/ProgressIndicator"
], function (Dialog, Text, Button, VBox, ProgressIndicator) {
    'use strict';

    return {
        loadData: function () {
            const progressBar = new ProgressIndicator({
                percentValue: 0,
                displayValue: "0%",
                width: "100%",
                showValue: true
            });
            const logDialog = new Dialog({
                title: "Processing Batches",
                contentWidth: "900px",
                contentHeight: "500px",
                verticalScrolling: true,
                content: new VBox({
                    items: [progressBar]
                }),
                beginButton: new Button({
                    text: "Close",
                    press: function () {
                        logDialog.close();
                    }
                })
            });

            logDialog.open();
            $.ajax({
                url: "/odata/v4/accounting-document/buttonController",
                type: 'POST',
                contentType: "application/json",
                success: function (result) {
                    console.log(result.value.value);

                    if (result.value.value && result.value.value.logs) {
                        const logs = result.value.value.logs;
                        const totalRecords = result.value.value.totalRecordsCountAccdoc; // Set this value dynamically based on actual total records
                        let processedRecords = 0;
                        let logIndex = 0;
                        const displayLog = function() {
                            if (logIndex < logs.length) {
                                const log = logs[logIndex];
                                const recordsProcessed = log.match(/index (\d+) of (\d+) accdoc/); // Adjust this regex as per your logs

                                if (recordsProcessed) {
                                    processedRecords = parseInt(recordsProcessed[1], 10);
                                    const percentCompleted = (processedRecords / totalRecords) * 100;

                                    // Update progress bar
                                    progressBar.setPercentValue(percentCompleted);
                                    progressBar.setDisplayValue(Math.round(percentCompleted) + "%");
                                }
                                logDialog.getContent()[0].addItem(new Text({ text: log }));
                                logIndex++;
                                setTimeout(displayLog, 1000);
                            } else {
                               
                                progressBar.setPercentValue(100);
                                progressBar.setDisplayValue("100%");
                                setTimeout(function() {
                                    window.location.reload();
                                }, 3000); 
                            }
                        };

                        // Start displaying logs
                        displayLog();
                    }
                },
                error: function () {
                    logDialog.getContent()[0].addItem(new Text({ text: "Error fetching logs." }));
                }
            });
        }
    };
});


