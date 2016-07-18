///<reference path="./typings/index.d.ts" />

import * as $ from "jquery";

import {TreeState} from "./Application/TreeState";
import {clickMember,clickItem,clickValue,clickName} from "./Application/ElementClickEvents";
import {TabEngine} from "./Tabs/TabEngine";

import "helpers";
import "hbtpl";

$(function(){
	try {
		let tabEngine = TabEngine.init({
			rootElement: document.getElementById('tabWindow'),
			events: {
				onselect : function (tab: iTab) {
					tab.head.focus();
				},
				oncreate : function (tab: iTab) {
					tab.state = TreeState.init({
						root: tab.body[0],
						events: {
							clickMember,
							clickItem,
							clickValue,
							clickName
						}
					});
					//tab.body.text('some string for now');
				},
				onremove : function (tab: iTab) {

				}
			}
		});
		/*
		let state = TreeState.init({
			events: {
				clickMember,
				clickItem,
				clickValue,
				clickName
			}
		});
		(<any>window).t = state.rootValue;
		//*/
	} catch (e) {
		console.log(e);
	}
});
