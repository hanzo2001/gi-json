define(["require", "exports", "jquery", "handlebars", "./Utils/HistoryList", "./Utils/ElementRegistry", "./Utils/IdGenerator", "./Tabs/TabSpace", "./Tabs/TabFactory", "./Nodes/NodeFactory", "./Nodes/NodeEngine", "./Application/KbsRegistry", "./Application/TreeNavigator", "./Application/TreeState", "helpers", "hbtpl"], function (require, exports, $, Handlebars, HistoryList_1, ElementRegistry_1, IdGenerator_1, TabSpace_1, TabFactory_1, NodeFactory_1, NodeEngine_1, KbsRegistry_1, TreeNavigator_1, TreeState_1) {
    "use strict";
    $(function () {
        var wE = document.getElementById('WorkSpace');
        var hE = wE.appendChild(document.createElement('div'));
        var bE = hE.appendChild(document.createElement('button'));
        var cE = wE.appendChild(document.createElement('div'));
        var oE = wE.appendChild(document.createElement('pre'));
        hE.setAttribute('class', 'tabHeader');
        cE.setAttribute('class', 'tabContainer');
        bE.innerHTML = '+';
        var headScript = Handlebars.templates['tabHeadTpl'];
        var bodyScript = Handlebars.templates['tabContainerTpl'];
        var space = new TabSpace_1.TabSpace(hE, bE, cE);
        var tabFactory = new TabFactory_1.TabFactory(headScript, bodyScript);
        var tabHistory = new HistoryList_1.HistoryList();
        var idGenerator = new IdGenerator_1.IdGeneratorFactory();
        var nodeElementDataName = 'nid';
        var uuid = idGenerator.create();
        var utid = idGenerator.create();
        var nodeHash = new ElementRegistry_1.ElementRegistry(uuid, nodeElementDataName);
        var nodeFactory = new NodeFactory_1.NodeFactory();
        var serialize = function (json, title) {
            oE.innerHTML = '//' + title + '\n';
            oE.innerHTML += json;
        };
        var appConfig = {
            tabSpace: space,
            tabHistory: tabHistory,
            tabFactory: tabFactory,
            nodeHash: nodeHash,
            nodeFactory: nodeFactory,
            utid: utid,
            serialize: serialize
        };
        $(space.button).click(appConfig, StartState);
    });
    function StartState(e) {
        var o = e.data;
        var title = 'tab' + o.utid();
        if (!title) {
            return;
        }
        var tab = o.tabFactory.create(title);
        o.tabSpace.addTab(tab);
        var kbsRegister = new KbsRegistry_1.KbsRegistry();
        var engine = new NodeEngine_1.NodeEngine(o.nodeHash, o.nodeFactory);
        var switchCB = function (next, last, dir) {
            if (next !== last) {
                next.e.setAttribute('class', 'selectedNode');
                last && last.e.removeAttribute('class');
            }
            return next;
        };
        var navigator = new TreeNavigator_1.TreeNavigator(switchCB);
        var state = new TreeState_1.TreeState({
            history: o.tabHistory,
            serialize: o.serialize,
            tab: tab,
            engine: engine,
            kbsRegister: kbsRegister,
            navigator: navigator,
        });
    }
});
