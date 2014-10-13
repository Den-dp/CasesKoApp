function SalesForceCasesViewModel(config) {
    // Data
    var self = this;
    self.folders = ['open', 'closed'];

    self.chosenCaseData = ko.observable();
    self.chosenCaseId = ko.observable();
    self.chosenCaseComments = ko.observable();
    self.chosenFolderId = ko.observable();
    self.chosenFolderData = ko.observableArray();

    // Behaviours
    self.goToFolder = function (folder) {
        location.hash = folder;
    };
    self.goToCase = function (caseObject) {
        location.hash = /*caseObject.folder*/  self.chosenFolderId() + '/' + caseObject.id
    };

    // Client-side routes    
    Sammy(function () {
        this.get('#:folder', function () {
            self.chosenFolderId(this.params.folder);

            $.get(config.getCasesUrl, { "closed": this.params.folder == 'closed' })
                .done(function (data) {
                    self.chosenFolderData(data);
                })
                //.always(function () {
                //    self.cases.isLoaded(true);
                //});
        });

        this.get('#:folder/:caseId', function () {

            self.chosenCaseId(this.params.caseId);
            self.chosenFolderData(this.params.folder);

            $.get(config.getCaseDetailsUrl.replace(/\{\{caseId\}\}/, this.params.caseId))
                .done(function(data){
                    self.chosenCaseData(data);
                })
                //.always(function () {
                //    self.chosenCaseData.isCaseCommentsLoaded(true);
                //});

            $.get(config.getCaseCommentsUrl.replace(/\{\{caseId\}\}/, this.params.caseId))
                .done(function (data) {
                    self.chosenCaseComments(data);
                })
                //.always(function () {
                //    self.chosenCaseData.isCaseCommentsLoaded(true);
                //});

        });

        this.get('', function () {
            this.app.runRoute('get', '#open');
        });

    }).run();

}