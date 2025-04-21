sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
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
        }
    });
});