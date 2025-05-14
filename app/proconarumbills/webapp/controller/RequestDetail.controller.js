sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("ns.proconarumbills.controller.RequestDetail", {
		onInit() {
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("RequestDetail").attachPatternMatched(this.onObjectMatched, this);
		},

		onObjectMatched(oEvent) {
			let oArgs = oEvent.getParameter("arguments");
			let sRequestId = oArgs.RequestId;
			let sEndPoint = this.getView().getModel().sServiceUrl;
			let sPath = sEndPoint + `Requests(${sRequestId})` + `?$expand=expenseItems`;

			$.ajax({
				url: sPath,
				method: "GET",
				contentType: "application/json",
				headers: {
				  "Accept": "application/json"
				},
				success: (data) => {
				  const oModel = new sap.ui.model.json.JSONModel(data);
				  this.getView().setModel(oModel, "RequestDetails");
				},
				error: (xhr, status, error) => {
				  console.log("Failed: " + (xhr.responseText || error));
				}
			});
		},

		onNavBack: function () {
			const oHistory = sap.ui.core.routing.History.getInstance();
			const sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				const oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("ListRequest", {}, true);
			}
		}
	});
});
