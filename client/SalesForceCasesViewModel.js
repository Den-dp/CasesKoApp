function SalesForceCasesViewModel(config) {
    // Data
    var self = this;
    self.chosenCaseData = ko.observable();
    self.chosenCaseId = ko.observable();
    self.chosenCaseComments = ko.observable();
    self.chosenCaseComments.isLoaded = ko.observable(false);

    self.folders = ['open', 'closed'];
    self.chosenFolderId = ko.observable();
    self.chosenFolderData = ko.observableArray();
    self.chosenFolderData.isLoaded = ko.observable(false);

    // Behaviours
    self.goToFolder = function (folder) {
        location.hash = folder;
    };
    self.goToCase = function (caseObject) {
        location.hash = self.chosenFolderId() + '/' + caseObject.id
    };

    // Client-side routes    
    Sammy(function () {
        this.disable_push_state = true;

        // routes definition
        this.get('#:folder', folderRoute);
        this.get('#:folder/:caseId', caseCommentsRoute);
        this.get('', function () {
            this.app.runRoute('get', '#open');
        });

        //routes implementation
        function folderRoute() {
            var routeParamFolderName = this.params.folder;

            self.chosenFolderData.isLoaded(false);
            self.chosenFolderId(routeParamFolderName);

            return $.get(config.getCasesUrl, { "closed": routeParamFolderName == 'closed' })
                .done(function (casesArray) {
                    self.chosenFolderData(casesArray);
                })
                .always(function () {
                    self.chosenFolderData.isLoaded(true);
                });
        }


        function caseCommentsRoute() {
            var routeParamCaseId = this.params.caseId;

            self.chosenCaseId(routeParamCaseId);
            self.chosenCaseComments.isLoaded(false);

            if (!self.chosenFolderData.isLoaded()) {
                // we need this step to resolve needed data from `folderRoute`
                // this happens when we load `caseCommentsRoute` omitting `folderRoute`
                // because SammyJS have no idea how routes can be related
                folderRoute.bind(this)()
                    .done(function () {

                        $.get(config.getCaseDetailsUrl.replace(/\{\{caseId\}\}/, routeParamCaseId ))
                            .done(function (caseDetails) {
                                self.chosenCaseData(caseDetails);
                            })
                    });
            } else {
                // case when `chosenFolderData` data was prepared in `folderRoute` before we load `caseCommentsRoute` route.
                $.get(config.getCaseDetailsUrl.replace(/\{\{caseId\}\}/, routeParamCaseId ))
                    .done(function (caseDetails) {
                        self.chosenCaseData(caseDetails);
                    })
            }

            $.get(config.getCaseCommentsUrl.replace(/\{\{caseId\}\}/, routeParamCaseId ))
                .done(function (commentsArray) {
                    self.chosenCaseComments(commentsArray);
                })
                .always(function () {
                    self.chosenCaseComments.isLoaded(true);
                });

        }

    }).run();

}