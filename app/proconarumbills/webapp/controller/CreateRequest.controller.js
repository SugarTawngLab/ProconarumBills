sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";

    return Controller.extend("ns.proconarumbills.controller.CreateRequest", {
        onInit: function () {
            var oData = {
                activities: [] // Must include this array!
            };
        
            var oModel = new sap.ui.model.json.JSONModel(oData);
            this.getView().setModel(oModel, "ExpenseItems");
        },        

        onPressHello: function () {
            MessageToast.show("Hello from SAPUI5!");
        },
        onAddRow: function () {
            var oModel = this.getView().getModel("ExpenseItems");
            var aItems = oModel.getProperty("/activities") || [];
        
            var oNewItem = {
                description: "",
                category: "",
                billDate: null,
                paymentMethod: "",
                ammount: "",
                remark: ""
            };
        
            aItems.unshift(oNewItem);  // Add to the beginning
            oModel.setProperty("/activities", aItems);
        }        
    });
});
