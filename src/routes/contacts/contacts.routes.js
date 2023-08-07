const express = require("express");
const contactController = require("../../controllers/contacts/contacts.controller");
const { upload } = require("../../helper/uploader");
const contactRouter = express.Router();

contactRouter.route("/contact/add").post(contactController.createContact);

contactRouter.route("/contact/bulkTag").patch(contactController.addTagBulk).delete(contactController.deleteTagBulk);

contactRouter.route("/contact/addAssignee").patch(contactController.addAssignee);

contactRouter.route("/contact/removeAssignee").patch(contactController.removeAssignee);

// These two routes have been replaced by getAllContactsWithNameSearch
contactRouter.route("/contact/all").get(contactController.getAllContactsWithNameSearch);
//
// contactRouter
//     .route("/contact/searchContact")
//     .get(contactController.searchContact)

contactRouter
    .route("/contact/getAllContactsWithNameSearch")
    .post(contactController.getAllContactsWithNameSearch)

contactRouter.route('/contact/importcsv').post(upload('attachments').single('csv'), contactController.importCSV);
contactRouter.route("/contact/:id").patch(contactController.updateContact).delete(contactController.deleteContact);

module.exports = contactRouter;
