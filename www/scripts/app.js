define(["require", "exports", "jquery", "./Application/TreeState", "./Application/ElementClickEvents", "./Tabs/TabEngine", "helpers", "hbtpl"], function (require, exports, $, TreeState_1, ElementClickEvents_1, TabEngine_1) {
    "use strict";
    $(function () {
        try {
            var tabEngine = TabEngine_1.TabEngine.init({
                rootElement: document.getElementById('tabWindow'),
                events: {
                    onselect: function (tab) {
                        tab.head.focus();
                    },
                    oncreate: function (tab) {
                        tab.state = TreeState_1.TreeState.init({
                            root: tab.body[0],
                            events: {
                                clickMember: ElementClickEvents_1.clickMember,
                                clickItem: ElementClickEvents_1.clickItem,
                                clickValue: ElementClickEvents_1.clickValue,
                                clickName: ElementClickEvents_1.clickName
                            }
                        });
                    },
                    onremove: function (tab) {
                    }
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    });
});
