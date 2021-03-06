define([
  'jquery',
  'underscore',
  'backbone',
  'PlumageRoot',
  'view/ModelView',
  'text!view/templates/ModalDialog.html'
], function($, _, Backbone, Plumage, ModelView, template) {

  return Plumage.view.ModalDialog = ModelView.extend({

    template: template,

    contentView: undefined,

    header: '',

    showCancel: false,

    showSubmit: false,

    modalOptions: {
      show:false
    },

    events: {
      'click .submit': 'onSubmitClick'
    },

    initialize: function(options) {
      options = options || {};
      options.modalOptions = _.extend(this.modalOptions, options.modalOptions || {});
      ModelView.prototype.initialize.apply(this, arguments);
    },

    onRender: function() {
      ModelView.prototype.onRender.apply(this, arguments);
      if (this.contentView) {
        this.$('.modal-content').html(this.contentView.render().el);
      }

      if (this.$el.closest('html').length === 0) {
        $('body').append(this.$el);
        this.$('.modal').modal(this.modalOptions);
      }
    },

    getTemplateData: function() {
      var data = ModelView.prototype.getTemplateData.apply(this, arguments);
      return _.extend(data,{
        header: this.header,
        showCancel: this.showCancel,
        showSubmit: this.showSubmit
      });
    },

    show: function() {
      this.render();
      this.$('.modal').modal('show');
      this.onShow();
      if (this.contentView) {
        this.contentView.onShow();
      }
    },

    hide: function() {
      this.$('.modal').modal('hide');
      if (this.contentView) {
        this.contentView.onHide();
      }
      this.onHide();
    },

    onSubmitClick: function() {
      this.trigger('submit', this);
    }
  });
});

