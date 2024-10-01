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
        
            var oModel = this.getOwnerComponent().getModel("countryModel");
            this.getView().setModel(oModel, "countryModel");
        
            var oModelTable = this.getOwnerComponent().getModel("tableModel") || new JSONModel({
                ProductCollection: []
            });
            this.getOwnerComponent().setModel(oModelTable, "tableModel");
            this.aSelectedScopeIds = [];
        
            // Listen to changes in the MultiInput tokens (added or removed)
            var oMultiInput = this.byId("scopeIdMultiInput");
            oMultiInput.attachTokenUpdate(this._onTokenUpdate, this);
        },
        
        onObjectMatched: function () {
            var oTable = this.getView().byId("Form1");
            var oBindings = oTable.getBinding("items");
            oBindings.refresh();
        },
        
        onNavBack: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteRMS");
        },
        
        _onTokenUpdate: function (oEvent) {
            var oMultiInput = oEvent.getSource();
            var aRemovedTokens = oEvent.getParameter("removedTokens");
            var aAddedTokens = oEvent.getParameter("addedTokens");
        
            // Check if the MultiInput source is valid
            if (!oMultiInput) {
                console.error("MultiInput source is not valid.");
                return;
            }
        
            // Handle removed tokens
            if (aRemovedTokens && aRemovedTokens.length > 0) {
                aRemovedTokens.forEach(function (oToken) {
                    var sRemovedKey = oToken.getKey();
                    var iIndex = this.aSelectedScopeIds.indexOf(sRemovedKey);
                    if (iIndex > -1) {
                        this.aSelectedScopeIds.splice(iIndex, 1);
                    }
                }, this);
            }
        
            // Handle added tokens
            if (aAddedTokens && aAddedTokens.length > 0) {
                aAddedTokens.forEach(function (oToken) {
                    var sAddedKey = oToken.getKey();
                    if (this.aSelectedScopeIds.indexOf(sAddedKey) === -1) {
                        this.aSelectedScopeIds.push(sAddedKey);
                    }
                }, this);
            }
        
            console.log("Updated Selected Scope IDs Array:", this.aSelectedScopeIds);  // Log for debugging
        
            // Immediately apply filters based on the updated aSelectedScopeIds
            this.onComboBoxSelectionChange();
        },
        
        onValueHelpRequest: function () {
            if (!this._oValueHelpDialog) {
                this._oValueHelpDialog = new sap.m.SelectDialog({
                    title: "Select Scope ID",
                    multiSelect: true,
                    items: {
                        path: '/ScopeItems',
                        template: new sap.m.StandardListItem({
                            title: "{ScopeItemID}",
                            description: "{ScopeItemDescription}"
                        })
                    },
                    confirm: this._handleValueHelpClose.bind(this),
                    cancel: this._handleValueHelpClose.bind(this)
                });
                this.getView().addDependent(this._oValueHelpDialog);
            }
        
            this._oValueHelpDialog.open();
        },
        
        _handleValueHelpClose: function (oEvent) {
            var aSelectedItems = oEvent.getParameter("selectedItems");
            var oMultiInput = this.byId("scopeIdMultiInput");
        
            // Clear the previous selections
            this.aSelectedScopeIds = [];
            oMultiInput.removeAllTokens();
        
            if (aSelectedItems && aSelectedItems.length > 0) {
                aSelectedItems.forEach(function (oItem) {
                    var sScopeItemID = oItem.getTitle();
        
                    oMultiInput.addToken(new sap.m.Token({
                        key: sScopeItemID,
                        text: sScopeItemID
                    }));
        
                    this.aSelectedScopeIds.push(sScopeItemID);
                }, this);
            }
        
            // Apply combined filters whenever the Scope ID is changed
            this.onComboBoxSelectionChange();
        },
        
        onComboBoxSelectionChange: function () {
            var aFilters = [];
        
            // Create filters based on selected scope IDs
            if (this.aSelectedScopeIds.length > 0) {
                var aScopeFilters = this.aSelectedScopeIds.map(function (sScopeItemID) {
                    return new sap.ui.model.Filter("ScopeItemID", sap.ui.model.FilterOperator.EQ, sScopeItemID);
                });
        
                // Combine scope filters with OR logic
                var oScopeIDFilter = new sap.ui.model.Filter({
                    filters: aScopeFilters,
                    and: false  // Use OR condition for Scope IDs
                });
        
                aFilters.push(oScopeIDFilter);
            }
        
            // Get the table binding and apply the combined filters
            var oTable = this.byId("idProductsTaable"); // Ensure this ID is correct
            var oBinding = oTable.getBinding("items");
        
            if (oBinding) {
                if (aFilters.length > 0) {
                    console.log("Applying Combined Filter:", aFilters);  // Log filter for debugging
                    oBinding.filter(aFilters, sap.ui.model.FilterType.Application);
                } else {
                    console.log("Clearing filters.");  // Log for debugging
                    oBinding.filter([]); // Clear filters when nothing is selected
                }
            } else {
                console.error("Table binding not found.");  // Debugging information
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
 