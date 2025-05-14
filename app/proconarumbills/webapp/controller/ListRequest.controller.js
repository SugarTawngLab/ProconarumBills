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
            var oTable = this.byId("idExpenseRequestWorklist");
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

        onSearch: function (oEvent) {
            var oFilterBar = this.byId("filterbar");
            var oFilters = [];
        
            // === Get filter control values ===
            var sRequestId = this.byId("inputRequestId").getValue();
            var sCreatedBy = this.byId("inputCreatedBy").getValue();
            var sChangedBy = this.byId("inputChangedBy").getValue();
            var sApprovedBy = this.byId("inputApprovedBy").getValue();
        
            var aPriorities = this.byId("multiComboBoxPriority").getSelectedKeys();
            var aStatuses = this.byId("multiComboBoxStatus").getSelectedKeys();
        
            var dCreatedDate = this.byId("dateCreated").getDateValue();
            var dChangedDate = this.byId("dateChanged").getDateValue();
            var dDueDate = this.byId("dateDue").getDateValue();
            var dApprovalDate = this.byId("dateApproval").getDateValue();
        
            // === Build filters based on values ===
            if (sRequestId) {
                oFilters.push(new sap.ui.model.Filter("description", sap.ui.model.FilterOperator.Contains, sRequestId));
            }
        
            if (sCreatedBy) {
                oFilters.push(new sap.ui.model.Filter("createdBy", sap.ui.model.FilterOperator.Contains, sCreatedBy));
            }
        
            if (sChangedBy) {
                oFilters.push(new sap.ui.model.Filter("modifiedBy", sap.ui.model.FilterOperator.Contains, sChangedBy));
            }
        
            if (sApprovedBy) {
                oFilters.push(new sap.ui.model.Filter("approvedBy", sap.ui.model.FilterOperator.Contains, sApprovedBy));
            }
        
            if (aPriorities.length > 0) {
                oFilters.push(new sap.ui.model.Filter({
                    path: "priority",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: aPriorities.join(",")
                }));
            }
        
            if (aStatuses.length > 0) {
                oFilters.push(new sap.ui.model.Filter({
                    path: "status",
                    operator: sap.ui.model.FilterOperator.Contains,
                    value1: aStatuses.join(",")
                }));
            }
        
            if (dCreatedDate) {
                var oStartDate = new Date(dCreatedDate);
                oStartDate.setHours(0, 0, 0, 0);
            
                var oEndDate = new Date(dCreatedDate);
                oEndDate.setHours(23, 59, 59, 999);
            
                const sStartDate = oStartDate.toISOString();
                const sEndDate = oEndDate.toISOString();
            
                oFilters.push(new sap.ui.model.Filter({
                    path: "createdAt",
                    operator: sap.ui.model.FilterOperator.BT,
                    value1: sStartDate,
                    value2: sEndDate
                }));
            }            
        
            if (dChangedDate) {
                var oStartChanged = new Date(dChangedDate);
                oStartChanged.setHours(0, 0, 0, 0);
            
                var oEndChanged = new Date(dChangedDate);
                oEndChanged.setHours(23, 59, 59, 999);
            
                const sStartChanged = oStartChanged.toISOString();
                const sEndChanged = oEndChanged.toISOString();
            
                oFilters.push(new sap.ui.model.Filter({
                    path: "modifiedAt",
                    operator: sap.ui.model.FilterOperator.BT,
                    value1: sStartChanged,
                    value2: sEndChanged
                }));
            }

            if (dDueDate) {
                const sDueDate = [
                    dDueDate.getFullYear(),
                    String(dDueDate.getMonth() + 1).padStart(2, '0'),
                    String(dDueDate.getDate()).padStart(2, '0')
                ].join('-');
            
                oFilters.push(new sap.ui.model.Filter("dueDate", sap.ui.model.FilterOperator.EQ, sDueDate));
            }
            
            if (dApprovalDate) {
                const sApprovalDate = [
                    dApprovalDate.getFullYear(),
                    String(dApprovalDate.getMonth() + 1).padStart(2, '0'),
                    String(dApprovalDate.getDate()).padStart(2, '0')
                ].join('-');
            
                oFilters.push(new sap.ui.model.Filter("approvalDate", sap.ui.model.FilterOperator.EQ, sApprovalDate));
            }
        
            // === Bind filter to table ===
            var oTable = this.byId("idExpenseRequestWorklist");
            var oBinding = oTable.getBinding("items");
        
            if (oBinding) {
                oBinding.filter(oFilters);
            }
        },

        onItemPress: function (oEvent) {
            const oItem = oEvent.getSource();
            const oRouter = this.getOwnerComponent().getRouter();
            
            oRouter.navTo("RequestDetail", {
				RequestId: oEvent.getSource().getBindingContext().getObject().ID
			});
        },
        
        onCreate: function(){
            const oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("CreateRequest");
        }
    });
});