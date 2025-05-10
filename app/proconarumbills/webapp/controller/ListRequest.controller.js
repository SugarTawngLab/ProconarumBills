sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], (Controller, MessageToast, MessageBox) => {
    "use strict";

    return Controller.extend("ns.proconarumbills.controller.ListRequest", {
        onInit() {
            var oSuggestionModel = new sap.ui.model.json.JSONModel({
                descriptionSuggestions: [
                    { description: "Delay in approval" },
                    { description: "Missing data" },
                    { description: "Late submission" }
                ]
            });
            this.getView().setModel(oSuggestionModel, "viewModel");
        },

        onOpenVHDescription: function (oEvent) {
            var oSource = oEvent.getSource();
            var oInput = oSource; // The MultiInput field
        
            if (!this._oDescriptionVHDialog) {
                this._oDescriptionVHDialog = new sap.m.SelectDialog({
                    title: this.getModel("i18n").getProperty("valueHelpTitleDescription"),
                    search: function (oEvt) {
                        var sValue = oEvt.getParameter("value").toLowerCase();
                        var oFilter = new sap.ui.model.Filter("description", sap.ui.model.FilterOperator.Contains, sValue);
                        oEvt.getSource().getBinding("items").filter([oFilter]);
                    },
                    liveChange: function (oEvt) {
                        var sValue = oEvt.getParameter("value").toLowerCase();
                        var oFilter = new sap.ui.model.Filter("description", sap.ui.model.FilterOperator.Contains, sValue);
                        oEvt.getSource().getBinding("items").filter([oFilter]);
                    },
                    confirm: function (oEvt) {
                        var aSelectedItems = oEvt.getParameter("selectedItems");
                        aSelectedItems.forEach(function (oItem) {
                            oInput.addToken(new sap.m.Token({
                                key: oItem.getTitle(),
                                text: oItem.getTitle()
                            }));
                        });
                    },
                    cancel: function () { /* optional */ }
                });
        
                this._oDescriptionVHDialog.bindAggregation("items", {
                    path: "viewModel>/descriptionSuggestions",
                    template: new sap.m.StandardListItem({
                        title: "{viewModel>description}"
                    })
                });
        
                this.getView().addDependent(this._oDescriptionVHDialog);
            }
        
            this._oDescriptionVHDialog.open();
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
        },

        onItemPress: function (oEvent) {
            const oItem = oEvent.getSource();
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RequestDetail", {
				RequestId: window.encodeURIComponent(oItem.getBindingContext().getPath().substring(1))
			});
        }  
    });
});