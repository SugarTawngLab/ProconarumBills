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

            var oData2 = {
                attachments: [],
            }
        
            var oModel = new sap.ui.model.json.JSONModel(oData);
            var oModel2 = new sap.ui.model.json.JSONModel(oData2);
            this.getView().setModel(oModel, "ExpenseItems");
            this.getView().setModel(oModel2, "AttachmentItems");
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
        },

        onDelete: function () {
            const oTable = this.byId("idExpenseItemsTable");
            const aSelectedItems = oTable.getSelectedItems();
        
            if (!aSelectedItems.length) {
                sap.m.MessageToast.show("Please select at least one item to delete.");
                return;
            }
        
            const oModel = this.getView().getModel("ExpenseItems");
            const aItems = oModel.getProperty("/items");
        
            // Sort indexes descending so splicing doesn't shift indices
            const aIndexesToRemove = aSelectedItems
                .map(oItem => oItem.getBindingContext("ExpenseItems").getPath())
                .map(sPath => parseInt(sPath.split("/").pop(), 10))
                .sort((a, b) => b - a); // important: remove from last to first
        
            aIndexesToRemove.forEach(iIndex => {
                aItems.splice(iIndex, 1);
            });
        
            oModel.setProperty("/items", aItems); // update the model
        
            sap.m.MessageToast.show(`${aIndexesToRemove.length} item(s) deleted.`);
        },

        onUploadItemAttachments: function (oEvent) {
            const oUploadItem = oEvent.getParameter("item");
            const sFileName = oUploadItem.getFileName();
          
            const oModel = this.getView().getModel("AttachmentItems");
            const aAttachments = oModel.getProperty("/attachments") || [];
          
            const oNewAttachment = {
              fileName: sFileName,
              mimeType: oUploadItem.getMediaType(),
              createdBy: "AHuy@gmail.com", // Get from auth token or model
              createdAt: new Date().toISOString()
            };
          
            aAttachments.push(oNewAttachment);
            oModel.setProperty("/attachments", aAttachments);
        }  
    });
});
