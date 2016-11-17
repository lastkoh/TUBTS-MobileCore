var SettingsPage = (function() {
  var UI = {
    notify: $('#notify'),
    btnClearCache: $('#btn_clear_cache')
  }

  function bindUIActions() {
    UI.notify.on('change', function() {
      Android.setSubscription(this.checked);
      if (this.checked) {
        localStorage.setItem("isMute", "true");
      } else {
        localStorage.setItem("isMute", "false");
      }
    });

    UI.btnClearCache.on('click', function() {
      localStorage.clear();
      Materialize.toast('Cache was cleared!', 4000);
    });
  }

  return {
    init: function() {
      if (localStorage.getItem("isMute") == null) {
        localStorage.setItem("isMute", "true");
      }

      if (localStorage.getItem("isMute") == "true") {
        UI.notify.prop('checked', true);
      } else {
        UI.notify.prop('checked', false);
      }
      bindUIActions();
    }
  }
})();