var start = {

  //Application Constructor 
  initialize: function () {

    $("a[data-action]").on("click", function (event) {
	  var link = $(this),
      action = link.data("action");
      event.preventDefault();
	  // If there's an action with the given name, call it
      if( typeof buttonEvents[action] === "function" ) {
        buttonEvents[action].call(this, event);
      }
    });
		
    $("#decryptdiv").hide();

  }    
}