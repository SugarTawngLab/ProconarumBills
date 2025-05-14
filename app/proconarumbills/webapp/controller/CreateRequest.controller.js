sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";

    return Controller.extend("ns.proconarumbills.controller.CreateRequest", {
        onInit: function () {
            var oData = {
                items: []
            };
        
            var oModel = new sap.ui.model.json.JSONModel(oData);
            this.getView().setModel(oModel, "ExpenseItems");
        },        

        onPressHello: function () {
            MessageToast.show("Hello from SAPUI5!");
        },

        onBackToExpenseRequestList: function () {
            const oHistory = sap.ui.core.routing.History.getInstance();
			const sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				const oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("ListRequest", {}, true);
			}
        },

        onAddRow: function () {
            var oModel = this.getView().getModel("ExpenseItems");
            var aItems = oModel.getProperty("/items") || [];
        
            var oNewItem = {
                description: "",
                category: "",
                billDate: null,
                paymentMethod: "",
                ammount: 0,
                remark: ""
            };
        
            aItems.push(oNewItem);  // Add to the beginning
            oModel.setProperty("/items", aItems);
            var a = 1;
        }        
    });
});
