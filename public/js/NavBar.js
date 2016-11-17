var NavBar = (function() {
  var SESSION = {

  }

  var PAGENAME = {
    HOME: "Home",
    ANNOUNCEMENT: "Announcement",
    RESOURCES: "Resources",
    SETTINGS: "Settings"
  }

  var UI = {
    abTitle: $('#ab_title'),

    homePage: $('#home_page'),
    sideNavHomeLabel: $('#sidenav_label_home'),
    sideNavHomeIcon: $('#sidenav_icon_home'),

    announcementPage: $('#announcement_page'),
    sideNavAnnouncementLabel: $('#sidenav_label_announcement'),
    sideNavAnnouncementIcon: $('#sidenav_icon_announcement'),

    settingsPage: $('#settings_page'),
    sideNavSettingsLabel: $('#sidenav_label_settings'),
    sideNavSettingsIcon: $('#sidenav_icon_settings'),

    rsPage: $('#resources_page'),
    sideNavRsLabel: $('#sidenav_label_rs'),
    sideNavRsIcon: $('#sidenav_icon_rs'),

    btnRefresh: $('#btn_refresh')
  }

  var currPageName = PAGENAME.HOME;
  var currPage = UI.homePage;
  var currLabel = UI.sideNavHomeLabel;
  var currIcon = UI.sideNavHomeIcon;

  function changePage(pageName, page, label, icon) {
    currPage.toggleClass('hidden');
    currLabel.toggleClass('red-text text-darken-4');
    currIcon.toggleClass('red-text text-darken-4');

    page.toggleClass('hidden');
    label.toggleClass('red-text text-darken-4');
    icon.toggleClass('red-text text-darken-4');
    UI.abTitle.text(pageName);

    currPage = page;
    currLabel = label;
    currIcon = icon;
    currPageName = pageName;
  }

  function bindUIAction() {
    UI.sideNavHomeLabel.on('click', function() {
      if (currPageName !== PAGENAME.HOME) {
        changePage(PAGENAME.HOME, UI.homePage, UI.sideNavHomeLabel, UI.sideNavHomeIcon);
      }
    });

    UI.sideNavAnnouncementLabel.on('click', function() {
      if (currPageName !== PAGENAME.ANNOUNCEMENT) {
        changePage(PAGENAME.ANNOUNCEMENT, UI.announcementPage, UI.sideNavAnnouncementLabel, UI.sideNavAnnouncementIcon);
      }
    });

    UI.sideNavSettingsLabel.on('click', function() {
      if (currPageName !== PAGENAME.SETTINGS) {
        changePage(PAGENAME.SETTINGS, UI.settingsPage, UI.sideNavSettingsLabel, UI.sideNavSettingsIcon);
      }
    });

    UI.sideNavRsLabel.on('click', function() {
      if (currPageName !== PAGENAME.RESOURCES) {
        changePage(PAGENAME.RESOURCES, UI.rsPage, UI.sideNavRsLabel, UI.sideNavRsIcon);
      }
    });

    UI.btnRefresh.on('click', function() {
      switch (currPageName) {
        case PAGENAME.HOME:
          HomePage.init();
          Materialize.toast('Refresh Complete!', 3000);
          break;
        case PAGENAME.ANNOUNCEMENT:
          NoticesPage.init();
          Materialize.toast('Refresh Complete!', 3000);
          break;
      }
    });
  }

  return {
    init: function() {
      bindUIAction();
    },

    handlePush: function() {
      changePage(PAGENAME.ANNOUNCEMENT, UI.announcementPage, UI.sideNavAnnouncementLabel, UI.sideNavAnnouncementIcon);
      NoticesPage.init();
    }
  }
})();