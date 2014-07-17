define([
  'jquery',
  'underscore',
  'backbone',
  'handlebars',
  'PlumageRoot',
  'view/ModalDialog',
  'text!view/templates/ConfirmationDialog.html'
], function($, _, Backbone, Handlebars, Plumage, ModalDialog, template) {

  return Plumage.view.ConfirmationDialog = ModalDialog.extend({

    template: template,

    headerTemplate: 'Confirmation Dialog',

    bodyTemplate: 'Are you sure you want to do this?',

    buttonText: 'Confirm',

    buttonCls: 'btn-success',

    events: {
      'click .confirm': 'onConfirmClick'
    },

    initialize: function(options) {
      options = options || {};
      ModalDialog.prototype.initialize.apply(this, arguments);
      this.headerTemplate = this.initTemplate(this.headerTemplate);
      this.bodyTemplate = this.initTemplate(this.bodyTemplate);
    },

    getTemplateData: function() {
      var data = ModalDialog.prototype.getTemplateData.apply(this, arguments);
      return _.extend(data, {
        headerTemplate: this.headerTemplate(data),
        bodyTemplate: this.bodyTemplate(data),
        buttonText: this.buttonText,
        buttonCls: this.buttonCls
      });
    },

    onConfirmClick: function() {
      this.trigger('confirm');
      this.hide();
    }
  });
});
