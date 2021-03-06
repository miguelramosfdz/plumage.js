define([
  'jquery',
  'underscore',
  'backbone',
  'PlumageRoot',
  'view/ContainerView',
  'view/menu/DropdownMenu',
  'view/form/fields/SearchField',
  'model/SearchResults',
  'text!view/templates/NavView.html',
  'bootstrap'
], function($, _, Backbone, Plumage, ContainerView, DropdownMenu, SearchField, SearchResults, template) {

  return Plumage.view.NavView = ContainerView.extend(
  /** @lends Plumage.view.NavView.prototype */
  {

    template: template,

    /**
     *
     */
    title: undefined,

    subtitle: undefined,

    showSearch: true,

    navItems: [{
      className: 'home-menu',
      label: 'Home',
      url: '/home'
    }],

    userMenuItems: [
      {
        label: 'logout',
        value: 'logout'
      }
    ],

    logoutUrl: '/logout',

    aboutUrl: undefined,

    aboutLabel: 'About',

    helpUrl: undefined,

    helpLabel: 'Help',

    events: {
      'click .nav-menu a': 'onNavClick',
      'click a.brand': 'onLinkClick'
    },

    initialize: function () {
      this.subViews = [];

      if (this.userMenuItems) {
        this.subViews.push(this.userMenu = new DropdownMenu({
          selector: '.user-menu',
          iconCls: 'icon-user',
          label: window.currentUser,
          menuItems: this.userMenuItems,
          replaceEl: true
        }));
      }

      if (this.showSearch) {
        this.searchField = new SearchField({
          selector: '.nav-search',
          placeholder: 'Search'
        });
        this.subViews.push(this.searchField);
      }

      if (this.userMenu) {
        this.userMenu.on('itemClick', this.onUserMenuClick.bind(this));
      }

      ContainerView.prototype.initialize.apply(this, arguments);

      if (this.searchField) {
        this.searchField.on('change', this.onSearchValueChange.bind(this));
        this.searchField.on('blur', this.onSearchBlur.bind(this));
        this.searchField.on('submit', this.onSearchSubmit.bind(this));
      }
    },

    getUrl: function(navItem) {
      return navItem.url;
    },

    onRender: function () {
      var data = this.getTemplateData();
      $(this.el).html(this.template(data));
      this.$('.dropdown-toggle').dropdown();
      if (this.currentNav) {
        this.select(this.currentNav);
      }
    },

    getTemplateData: function() {
      var navItems = [];
      for (var i=0;i<this.navItems.length;i++) {
        var navItem =  _.clone(this.navItems[i]);
        navItem.url = this.getUrl(navItem);
        navItems.push(navItem);
      }
      return {
        title: this.title,
        subtitle: this.subtitle,
        navItems: navItems,
        showAbout: this.aboutTemplate !== undefined,
        showSearch: this.showSearch,
        aboutUrl: this.aboutUrl,
        aboutLabel: this.aboutLabel,
        helpUrl: this.helpUrl,
        helpLabel: this.helpLabel
      };
    },

    processUrl: function(url) {
      return url;
    },

    /**
     * Helpers
     */

    select: function(menuItem) {
      this.currentNav = menuItem;
      this.$('.nav li').removeClass('active');
      this.$('.' + menuItem).addClass('active');
    },

    expandSearchField: function() {
      var el = this.$('.right-nav');
      if (!el.hasClass('expand-search')) {
        el.addClass('expand-search');
        this.searchField.$el.attr('placeholder', '');
      }

    },

    contractSearchField: function() {
      var el = this.$('.right-nav');
      if (el.hasClass('expand-search')) {
        el.removeClass('expand-search');
        this.searchField.$el.attr('placeholder', this.searchField.noSelectionText);
      }
    },

    createSearchModel: function(query) {
      return new SearchResults({query: query, model: 'all'});
    },

    /**
     * Event Handlers
     */

    onNavClick: function(e) {
      var a = e.target;
      e.preventDefault();
    },

    onUserMenuClick: function(menu, value) {
      if (value === 'logout') {
        window.location = this.logoutUrl;
      }
    },

    onSearchValueChange: function(field, value) {
      this.expandSearchField();
    },

    onSearchBlur: function() {
      this.contractSearchField();
    },

    onSearchSubmit: function(field, value) {
      var searchModel = this.createSearchModel(value);
      searchModel.navigate();
      this.contractSearchField();
    }
  });
});
