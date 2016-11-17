$(window).ready(function() {
  // code here
  $('.button-collapse').sideNav({
    menuWidth: 240, // Default is 240
    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true // Choose whether you can drag to open on touch screens
  });

  $('.dropdown-button').dropdown({
    inDuration: 300,
    outDuration: 225,
    constrain_width: true, // Does not change width of dropdown to that of the activator
    hover: false, // Activate on hover
    gutter: 0, // Spacing from edge
    belowOrigin: true, // Displays dropdown below the button
    alignment: 'left' // Displays dropdown with edge aligned to the left of button
  });

  $('.modal').modal();

  NavBar.init();
  HomePage.init();
  NoticesPage.init();
  SettingsPage.init();
  
//   console.log(isPush);
//   if($(window).isPush){
//     NavBar.handleNotification();
//     console.log("Push is handled!");
//     isPush = false;
//   }

//   var now = new Date();
//   console.log(now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
//   if (window.Worker) {
//     console.log("Worker thread is supported!");
//   }
  
//   function handlePush(){
//     NavBar.handleNotification();
//   }
});