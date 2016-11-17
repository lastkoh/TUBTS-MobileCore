var NoticesPage = (function() {
  var API_URL = "https://fyp-postgrest.herokuapp.com/";
  var ITEMS_PER_PAGE = 6;

  var UI = {
    noticeItems: $('#announcements_list'),
    pagination: $('#pages_list'),
    modal: $('#modal1'),
  }

  var noticesData = [];
  var currPgNum = 0;

  function initPagination(numItems) {
    UI.pagination.empty();
    UI.pagination.append('<li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>');
    var numPages = Math.ceil((numItems / ITEMS_PER_PAGE));
    for (var i = 0; i < numPages; i++) {
      if (i === 0) {
        UI.pagination.append('<li class="active"><a href="#!">' + (i + 1) + '</a></li>');
      } else {
        UI.pagination.append('<li class="waves-effect"><a href="#!">' + (i + 1) + '</a></li>');
      }
    }
    UI.pagination.append('<li class="disabled"><a href="#!"><i class="material-icons">chevron_right</i></a></li>');
  }

  function changePage(pageNum) {
    $("#pages_list li:nth-child(" + (currPgNum + 1) + ")").toggleClass('active');
    $("#pages_list li:nth-child(" + (pageNum + 1) + ")").toggleClass('active');
    UI.noticeItems.empty();
    var offset = (pageNum - 1) * ITEMS_PER_PAGE;
    //       console.log(offset);
    for (var i = offset; i < (ITEMS_PER_PAGE * pageNum) && i < noticesData.length; i++) {
      //         console.log(noticesData[i].title);
      var title = '<span class="title"><p class="flow-text"><b>' + noticesData[i].title + '</b></p></span>';
      var icon = '<i class="material-icons circle red">announcement</i>';
      var timeStr = noticesData[i].timestamp.toString();
      var date = '<p><b>Last Updated: ' + noticesData[i].lastModDate + '  ' + timeStr.substring(0, timeStr.length - 3) + '<b></p>';
      var popOutIcon = '<a href="#!" class="secondary-content"><i class="material-icons red-text text-darken-4">open_in_new</i></a>';
      UI.noticeItems.append('<li class="collection-item avatar">' + icon + title + date + popOutIcon + '</li>');
    }
    currPgNum = pageNum;
  }

  function bindUIActions() {
    UI.pagination.on('click', 'li', function() {
      if (currPgNum !== parseInt($(this).text())) {
        changePage(parseInt($(this).text()));
      }
    });

    UI.noticeItems.on('click', 'li', function() {
      console.log($(this).index());
      var itemDataIndex = parseInt($(this).index()) + (ITEMS_PER_PAGE * (currPgNum - 1));
      UI.modal.modal('open');
      $('#notice_modal_content').empty();
      $('#notice_modal_content').append('<h5>' + noticesData[itemDataIndex].title + '</h5>');
      $('#notice_modal_content').append(noticesData[itemDataIndex].content);
      $('#notice_modal_content img').css({
        'max-width': '100%'
      });
    });
  }

  return {
    init: function() {
      currPgNum = 1;
      var payload = {
        'order': 'lastModDate.desc,createDate.desc,timestamp.desc'
      };

      $.getJSON(API_URL + "announcements", payload, function(data) {
        noticesData = data;
        initPagination(noticesData.length);
        changePage(1);
      });

      bindUIActions();
    },
  }
})();