var buttonEvents = {
  unlock:   function (event) { 
    $.mobile.changePage("#page_compose", "slide", true, false);
  },
  
  rememberPassword:   function (event) { 
    $.mobile.changePage("#page_setpassword", "slide", true, false);
  },
  
  saveNewPassword:   function (event) { 
    $.mobile.changePage("#page_login", "slide", true, false);
  },
  
  encrypt:   function (event) { 
    var encrypted = CryptoJS.AES.encrypt($("#msgtextarea").val(), $("#passphrase").val());
    $("#msgtextarea").val(encrypted);
    $("#encryptdiv").hide();	  
    $("#decryptdiv").show();
  },
  
  decrypt:   function (event) { 
    var decrypted = CryptoJS.AES.decrypt($("#msgtextarea").val(), $("#passphrase").val());	  
	var plainText = decrypted.toString(CryptoJS.enc.Utf8)
    $("#msgtextarea").val(plainText);
	
	$("#encryptdiv").show();
	
	  
	$("#senddiv").hide();
	  
	$("#decryptdiv").hide();
  }
}