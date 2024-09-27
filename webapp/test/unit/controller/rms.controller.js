/*global QUnit*/

sap.ui.define([
	"register-missingscope/controller/rms.controller"
], function (Controller) {
	"use strict";

	QUnit.module("rms Controller");

	QUnit.test("I should test the rms controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
