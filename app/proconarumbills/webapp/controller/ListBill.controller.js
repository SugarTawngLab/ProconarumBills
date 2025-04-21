sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("ns.proconarumbills.controller.ListBill", {
        onInit() {
        },
        
        onSelectionChange: function (oEvent) {
            var oMultiComboBox = oEvent.getSource();
            var aSelectedItems = oMultiComboBox.getSelectedItems();
        
            // Extract selected keys (status values)
            var aFilters = [];
            if (aSelectedItems.length > 0) {
                var aSelectedKeys = aSelectedItems.map(function (oItem) {
                    return oItem.getKey();
                });
        
                // Create OR filters for the selected status values
                var oStatusFilter = new sap.ui.model.Filter({
                    filters: aSelectedKeys.map(function (sKey) {
                        return new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, sKey);
                    }),
                    and: false // OR condition
                });
        
                aFilters.push(oStatusFilter);
            }
        
            // Get the table and its binding
            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("items");
        
            // Apply the filters to the binding
            oBinding.filter(aFilters);
        },

        onDelete: function () {
            const oTable = this.byId("table");
            const oSelectedItem = oTable.getSelectedItem();
        
            if (!oSelectedItem) {
                MessageToast.show("Please select an item to delete.");
                return;
            }
        
            const oContext = oSelectedItem.getBindingContext();
        
            if (!oContext) {
                MessageToast.show("No valid context found for deletion.");
                return;
            }
        
            // Confirm delete dialog (optional)
            MessageBox.confirm("Are you sure you want to delete this item?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.OK) {
                        oContext.delete().then(function () {
                            MessageToast.show("Deleted successfully.");
                        }).catch(function (oError) {
                            MessageBox.error("Delete failed: " + oError.message);
                        });
                    }
                }
            });
        }
    });
});