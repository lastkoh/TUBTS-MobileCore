var SettingsPage = (function() {
  var UI = {
    notify: $('#notify'),
    btnClearCache: $('#btn_clear_cache')
  }

  function bindUIActions() {
    UI.notify.on('change', function() {
      Android.setSubscription($(this).is(':checked'));
      localStorage.setItem("isMute", $(this).is(':checked'));
    })
    
     UI.btnClearCache.on('click', function() {
      localStorage.setItem("isMute",null);
      Materialize.toast('Cache was cleared!', 4000);
    })
  }

  return {
    init: function() {
      console.log("init:" + localStorage.getItem("isMute"));
      if (localStorage.getItem("isMute") == null) {
        localStorage.setItem("isMute", true);
      }
      
     UI.notify.prop(':checked',localStorage.getItem("isMute"));
      bindUIActions();
    }
  }
})();