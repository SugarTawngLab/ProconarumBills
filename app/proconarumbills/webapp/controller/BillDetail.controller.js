sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
	"use strict";

	return Controller.extend("ns.proconarumbills.controller.BillDetail", {
		
		onInit: function () {
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("BillDetail").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			// const billId = oEvent.getParameter("arguments").billId;

			// // For JSONModel
			// const oView = this.getView();
			// const oModel = oView.getModel(); // assuming default model

			// // Optional: show busy indicator while loading
			// oView.setBusy(true);

			// // Check if the model is a JSONModel and filter data locally
			// if (oModel && oModel instanceof JSONModel) {
			// 	const aBills = oModel.getProperty("/Bills") || [];
			// 	const oSelectedBill = aBills.find(bill => bill.billId === billId);

			// 	if (oSelectedBill) {
			// 		const oDetailModel = new JSONModel(oSelectedBill);
			// 		oView.setModel(oDetailModel, "bill");
			// 	} else {
			// 		MessageBox.error("Bill not found.");
			// 	}
			// 	oView.setBusy(false);
			// }

			// For ODataModel: bind element directly
			// oView.bindElement({
			//     path: "/Bills('" + billId + "')"
			// });

		},

		onNavBack: function () {
			const oHistory = sap.ui.core.routing.History.getInstance();
			const sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				const oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo("ListBill", {}, true);
			}
		}
	});
});
