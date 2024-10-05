
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/export/Spreadsheet"
],
    function (Controller,MessageBox,MessageToast,Filter,FilterOperator,Spreadsheet) {
        "use strict";
 
        return Controller.extend("registermissingscope.controller.rms", {

            
            onInit: function () {
                const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteRMS").attachPatternMatched(this.onObjectMatched, this);
 
 
            },
            onObjectMatched : function(){
                var oTable = this.getView().byId("idProductsTable");
                var oBindings = oTable.getBinding("items");
                oBindings.refresh() ;
            
            },
            
            onNewPress: function () {


                
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteCRMS");
            },
            onNavBack: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Routehomepage");
            },
 
          
 
 
         // on change combobox is working only for one combo box working
            onBrandComboBoxChange: function (oEvent) {
                // Get the ComboBox that triggered the event
                var oComboBox = oEvent.getSource();
 
                // Get the context of the row
                var oBindingContext = oComboBox.getBindingContext();
 
                if (oBindingContext) {
                    var sAutoId = oBindingContext.getProperty("autoId");
                    var sBrandGuardianStatus = oComboBox.getSelectedKey();
 
                    this._updateBackend(sAutoId, sBrandGuardianStatus, null);
                }
            },
 
            onGlobalComboBoxChange: function (oEvent) {
                // Get the ComboBox that triggered the event
                var oComboBox = oEvent.getSource();
 
                // Get the context of the row
                var oBindingContext = oComboBox.getBindingContext();
 
                if (oBindingContext) {
                    var sAutoId = oBindingContext.getProperty("autoId");
                    var sGlobalServicesStatus = oComboBox.getSelectedKey();
 
                    this._updateBackend(sAutoId, null, sGlobalServicesStatus);
                }
            },
 
            _updateBackend: function (sAutoId, sBrandGuardianStatus, sGlobalServicesStatus) {
                var oModel = this.getView().getModel(); // OData V4 Model
 
                // Create a filter based on autoId to identify the correct record
                let oBindList = oModel.bindList("/MissingScopeItems");
                let aFilter = new sap.ui.model.Filter("autoId", sap.ui.model.FilterOperator.EQ, sAutoId);
 
                // Apply the filter and request the context for the filtered item
                oBindList.filter([aFilter]).requestContexts().then(function (aContexts) {
                    if (aContexts && aContexts.length > 0) {
                        let oContext = aContexts[0];
 
                        // Update the properties on the matched context
                        if (sBrandGuardianStatus !== null) {
                            oContext.setProperty("brandGuardianStatus", sBrandGuardianStatus);
                        }
                        if (sGlobalServicesStatus !== null) {
                            oContext.setProperty("globalServicesStatus", sGlobalServicesStatus);
                        }
 
                        // Submit the changes to the backend
                        oModel.submitBatch("updateGroup").then(function () {
                            sap.m.MessageToast.show("Record updated successfully!");
                        }).catch(function (oError) {
                            sap.m.MessageToast.show("Failed to update record: " + oError.message);
                        });
                    }
                }).catch(function (oError) {
                    sap.m.MessageToast.show("Failed to retrieve context: " + oError.message);
                });
            },
 
           
           
            onDeleteChange: function (oEvent) {
                var oTable = this.byId("idProductsTable");
                var oItem = oEvent.getSource().getParent(); // Get the button's parent (ColumnListItem)
           
                // Get the binding context to fetch the data
                var oContext = oItem.getBindingContext(); // Get the binding context of the selected row
                var sPath = oContext.getPath(); // Get the entity path
               
                // Retrieve the autoId from the context
                var oData = oContext.getObject();
                var sAutoId = oData.autoId; // Assuming the field name is 'autoId'
           
                // Confirmation before deletion
                MessageBox.confirm("Are you sure you want to delete this item?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            // Call the delete function on the binding context for OData V4
                            oContext.delete().then(function () {
                                MessageToast.show("Item deleted successfully.");
                                // Refresh the table to reflect changes
                                oTable.getBinding("items").refresh();
                            }).catch(function (oError) {
                                MessageBox.error("Error deleting the item: " + oError.message);
                            });
                        }
                    }.bind(this) // Make sure the correct 'this' context is maintained
                });
            },
            onComboBoxSelectionChange: function () {
                // Get references to the comboboxes and table
                var oOpportunityComboBox = this.byId("opportunityComboBox");
                var oCustomerComboBox = this.byId("customerComboBox");
                var oScopeIDComboBox = this.byId("scopeIDComboBox");
                var oTable = this.byId("idProductsTable");
                var oBinding = oTable.getBinding("items");
    
                // Create an array to hold filters
                var aFilters = [];
    
                // Get selected values from the Opportunity combobox
                var aSelectedOpportunities = oOpportunityComboBox.getSelectedKeys();
                if (aSelectedOpportunities.length > 0) {
                    // Create filter for opportunityNumber
                    var oOpportunityFilter = new Filter({
                        path: "oppurtunityNumber",
                        operator: FilterOperator.EQ,
                        value1: aSelectedOpportunities
                    });
                    aFilters.push(oOpportunityFilter);
                }
    
                // Get selected values from the Customer combobox
                var aSelectedCustomers = oCustomerComboBox.getSelectedKeys();
                if (aSelectedCustomers.length > 0) {
                    // Create filter for customerName
                    var oCustomerFilter = new Filter({
                        path: "customerName",
                        operator: FilterOperator.EQ,
                        value1: aSelectedCustomers
                    });
                    aFilters.push(oCustomerFilter);
                }
    
                // Get selected values from the ScopeID combobox
                var aSelectedScopeIDs = oScopeIDComboBox.getSelectedKeys();
                if (aSelectedScopeIDs.length > 0) {
                    // Create filter for ScopeItemID
                    var oScopeIDFilter = new Filter({
                        path: "ScopeItemID",
                        operator: FilterOperator.EQ,
                        value1: aSelectedScopeIDs
                    });
                    aFilters.push(oScopeIDFilter);
                }
    
                // Apply the filters to the table binding
                oBinding.filter(aFilters);
            },
            onExportPress: function () {
                // Get reference to the table
                var oTable = this.byId("idProductsTable");
                var aSelectedItems = oTable.getSelectedItems();
    
                // Check if any rows are selected
                if (aSelectedItems.length === 0) {
                    sap.m.MessageToast.show("Please select at least one row to export.");
                    return;
                }
    
                // Prepare the export data
                var aExportData = [];
                aSelectedItems.forEach(function (oItem) {
                    var oContext = oItem.getBindingContext();
                    var oData = oContext.getObject(); // Get the row data
    
                    aExportData.push({
                        "Registered ID": oData.autoId,
                        "Opportunity": oData.oppurtunityNumber,
                        "Customer": oData.customerName,
                        "Brand Guardian Status": oData.brandGuardianStatus,
                        "Global Services Status": oData.globalServicesStatus,
                        "Scope ID": oData.ScopeItemID,
                        "Scope Description": oData.Description,
                        "Priority": oData.priority,
                        "Country": oData.country,
                        "Created By": oData.createdBy,
                        "Created On": oData.createdOn
                    });
                });
    
                // Define column structure for export
                var aCols = [
                    { label: "Registered ID", property: "Registered ID" },
                    { label: "Opportunity", property: "Opportunity" },
                    { label: "Customer", property: "Customer" },
                    { label: "Brand Guardian Status", property: "Brand Guardian Status" },
                    { label: "Global Services Status", property: "Global Services Status" },
                    { label: "Scope ID", property: "Scope ID" },
                    { label: "Scope Description", property: "Scope Description" },
                    { label: "Priority", property: "Priority" },
                    { label: "Country", property: "Country" },
                    { label: "Created By", property: "Created By" },
                    { label: "Created On", property: "Created On" }
                ];
    
                // Create export settings
                var oSettings = {
                    workbook: { columns: aCols },
                    dataSource: aExportData,
                    fileName: "ExportedData.xlsx",
                    worker: false // Disable worker due to CSP restrictions in some environments
                };
    
                // Create a new Spreadsheet and start the export
                var oSpreadsheet = new Spreadsheet(oSettings);
                oSpreadsheet.build().finally(function () {
                    oSpreadsheet.destroy();
                });
            }
           
        });
 
    });
 
 
 
 