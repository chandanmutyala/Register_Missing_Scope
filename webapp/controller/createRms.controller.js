sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
     "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller, JSONModel,Filter,FilterOperator) {
    "use strict";
 
    return Controller.extend("registermissingscope.controller.createRms", {
        onInit: function () {

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteCRMS").attachPatternMatched(this.onObjectMatched, this);

        
           var oModel=this.getOwnerComponent().getModel("countryModel");
            this.getView().setModel(oModel,"countryModel");
 
            var oModelTable = this.getOwnerComponent().getModel("tableModel") || new JSONModel({
                ProductCollection: []
            });
            this.getOwnerComponent().setModel(oModelTable, "tableModel");
        },
        onObjectMatched : function(){
            var oTable = this.getView().byId("Form1");
            var oBindings = oTable.getBinding("items");
            oBindings.refresh() ;       
        },
       
            onNavBack: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteRMS");
            },
        onComboBoxSelectionChange: function (oEvent) {
 
            var oMultiComboBox = this.byId("scopeIdComboBoxTable"); // Get the MultiComboBox instance
 
            var aSelectedItems = oMultiComboBox.getSelectedItems(); // Get selected items
 
            // Create an array to hold all the selected ScopeItemIDs
 
            var aFilters = [];
 
            // Iterate over the selected items
 
            aSelectedItems.forEach(function (oSelectedItem) {
 
                var sScopeItemID = oSelectedItem.getKey();
 
                // Create a filter for each selected ScopeItemID
 
                var oFilter = new Filter("ScopeItemID", FilterOperator.EQ, sScopeItemID);
 
                aFilters.push(oFilter);
 
            });
 
            // Combine the filters using OR condition
 
            var oCombinedFilter = new Filter({
 
                filters: aFilters,
 
                and: false // 'or' condition, meaning any selected ScopeItemID will match
 
            });
 
            // Apply the filter to the table's binding
 
            var oTable = this.byId("idProductsTaable");
 
            var oBinding = oTable.getBinding("items");
 
            // If there are selected items, apply the filter, otherwise, clear filters
 
            if (aFilters.length > 0) {
 
                oBinding.filter(oCombinedFilter);
 
            } else {
 
                oBinding.filter([]); // Clear filters when nothing is selected
 
            }
 
        },
 
 
//         onSavePress: function () {
//             // Get form data from the input fields
//             var oView = this.getView();
 
//             var sCustomer = oView.byId("customerId").getSelected() ? "Customer" : "";
//             var sProspect = oView.byId("prospectId").getSelected() ? "Prospect" : "";      
//             var sCustomerName = oView.byId("customerName").getValue();
//                     var sOpportunity = oView.byId("opportunityNumber").getValue();
//                     var sPriority = oView.byId("priorityComboBox").getSelectedKey();
 
           
         
//             var goLiveDate = oView.byId("goLiveDate").getValue(); // Assuming you add an ID for the go-live date input
//             var revenue = oView.byId("revenue").getValue();
 
//             // For MultiComboBox (Countries and Industries)
//             var selectedCountries = oView.byId("countryBox").getSelectedKeys();
//             var selectedIndustries = oView.byId("industrybox").getSelectedKeys();
//             // Initialize the variable to store the non-empty value
// var customerOrProspect = "";
 
// // Assign the non-empty value to customerOrProspect
// if (sCustomer) {
//     customerOrProspect = sCustomer;
// } else if (sProspect) {
//     customerOrProspect = sProspect;
// }
//             var countriesString = selectedCountries.join(", ");
//             var industriesString = selectedIndustries.join(", ");
 
//           // Get the table and selected items
// var oTable = oView.byId("idProductsTaable");
// var selectedItems = oTable.getSelectedItems();
 
// // Check if there is at least one selected item
// if (selectedItems.length > 0) {
//     var item = selectedItems[0];  // Get the first selected item
//     var context = item.getBindingContext();
 
//     // Assign values to variables
//     var scopeItemID = context.getProperty("ScopeItemID");
//     var description = context.getProperty("Description");
//     var lob = context.getProperty("LOB");
//     var businessArea = context.getProperty("BusinessArea");
 
// } else {
//     console.log("No items selected.");
// }
 
//             // Construct the payload
//             var payload = {
//                 customerOrProspect: customerOrProspect,
//                 customerName: sCustomerName,
//                 oppurtunityNumber: sOpportunity,
//                 priority: sPriority,
//                 goLiveDate: goLiveDate,
//                 revenue: revenue,
//                 country:countriesString, // Assuming multiple countries can be selected
//                 industry: industriesString,
//                 ScopeItemID: scopeItemID,
//                 Description: description,
//                 LOB:lob,
//                 BusinessArea:businessArea          
//             };
 
//             // Now you can send this payload to your backend or process it further
//             console.log(payload);
 
//             let oModel = this.getView().getModel();
//             let oBindList = oModel.bindList("/MissingScopeItems");
//             oBindList.create(payload);
 
//             var oRouter = this.getOwnerComponent().getRouter();
//             oRouter.navTo("RouteRMS",true);
 
 
//         }
 
 
onSavePress: function () {
    var oView = this.getView();
 
    // Get form data from the input fields
    var sCustomer = oView.byId("customerId").getSelected() ? "Customer" : "";
    var sProspect = oView.byId("prospectId").getSelected() ? "Prospect" : "";
    var sCustomerName = oView.byId("customerName").getValue();
    var sOpportunity = oView.byId("opportunityNumber").getValue();
    var sPriority = oView.byId("priorityComboBox").getSelectedKey();
    var goLiveDate = oView.byId("goLiveDate").getValue();
    var revenue = oView.byId("revenue").getValue();
 
    // For MultiComboBox (Countries and Industries)
    var selectedCountries = oView.byId("countryBox").getSelectedKeys();
    var selectedIndustries = oView.byId("industrybox").getSelectedKeys();
   
    var customerOrProspect = sCustomer || sProspect;
   
    var countriesString = selectedCountries.join(", ");
    var industriesString = selectedIndustries.join(", ");
 
    // Get the table and selected items
    var oTable = oView.byId("idProductsTaable");
    var selectedItems = oTable.getSelectedItems();
 
    if (selectedItems.length === 0) {
        // No items selected, show error message
        sap.m.MessageToast.show("Please select at least one Scope Item.");
        return;
    }
 
    // Prepare payloads for each selected item
    var payloadArray = selectedItems.map(function (item) {
        var context = item.getBindingContext();
       
       var scopeItemID=context.getProperty("ScopeItemID");
        var description=context.getProperty("Description");
        var lob =context.getProperty("LOB");
        var businessArea= context.getProperty("BusinessArea")
       
        return {
            customerOrProspect: customerOrProspect,
            customerName: sCustomerName,
            oppurtunityNumber: sOpportunity,
            priority: sPriority,
            goLiveDate: goLiveDate,
            revenue: revenue,
            country: countriesString,
            industry: industriesString,
            ScopeItemID:scopeItemID ,
            Description:description ,
            LOB: lob,
            BusinessArea:businessArea
        };
    });
    console.log(payloadArray);

   



    // Use OData V4's bindList().create() to send the payloads
    let oModel = this.getView().getModel();
                let oBindList = oModel.bindList("/MissingScopeItems");
                oBindList.create(payloadArray);


                




                
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteRMS",true);

                window.location.reload();



   
}
 
    });
 
})
 