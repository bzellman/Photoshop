try
{
  // Prompt user to select iTunesArtwork file. Clicking "Cancel" returns null.
  var iTunesArtwork = File.openDialog("Select a sqaure PNG file that is at least 1024x1024.", "*.png", false);

  var build_phone = false
  var build_ipad = false
  var build_android = false

  var createTypeWindow = new Window("dialog");
    createTypeWindow.alignChildren = "left";
    var cb1 = createTypeWindow.add("checkbox",undefined, "iPhone Icons");
    var cb2 = createTypeWindow.add("checkbox",undefined, "iPad Icons");
    var cb3 = createTypeWindow.add("checkbox",undefined, "Android Icons");
    
    var build_icon_button = createTypeWindow.add("button", undefined, "Build Icons")
    createTypeWindow.add("button", undefined, "Cancel")


    build_icon_button.onClick = function(){
      if(cb1.value == true) {
        build_phone = true;
      }

      if (cb2.value == true) {
        build_ipad = true;
      }
      
      if (cb3.value == true) {
        build_android = true;
      } 

      if (cb1 == false && cb2 == false && cb3 == false){
        alert("No Icons Will be Created. Rerun the script to start again.")
      }

      createTypeWindow.close();
    }

    createTypeWindow.show();

  if (iTunesArtwork !== null) 
  { 
    var doc = open(iTunesArtwork, OpenDocumentType.PNG);
    
    if (doc == null)
    {
      throw "Something is wrong with the file.  Make sure it's a valid PNG file.";
    }

    var startState = doc.activeHistoryState;       // save for undo
    var initialPrefs = app.preferences.rulerUnits; // will restore at end
    app.preferences.rulerUnits = Units.PIXELS;     // use pixels

    if (doc.width != doc.height)
    {
        throw "Image is not square";
    }
    else if ((doc.width < 1024) && (doc.height < 1024))
    {
        throw "Image is too small!  Image must be at least 1024x1024 pixels.";
    }
    else if (doc.width < 1024)
    {
        throw "Image width is too small!  Image width must be at least 1024 pixels.";
    }
    else if (doc.height < 1024)
    {
        throw "Image height is too small!  Image height must be at least 1024 pixels.";
    }
    
    // Folder selection dialog
    var destFolder = Folder.selectDialog( "Choose an output folder");

    if (destFolder == null)
    {
      // User canceled, just exit
      throw "";
    }

    // Save icons in PNG using Save for Web.
    var sfw = new ExportOptionsSaveForWeb();
    sfw.format = SaveDocumentType.PNG;
    sfw.PNG8 = false; // use PNG-24
    sfw.transparency = true;
    doc.info = null;  // delete metadata
    
    // var icons = [
    //   {"name": "iTunesArtwork@2x", "size":1024},
    //   {"name": "iTunesArtwork",    "size":512},
    //   {"name": "Icon-60@2x",       "size":120},
    //   {"name": "Icon@2x",          "size":114},
    //   {"name": "Icon-Small-40@2x", "size":80},
    //   {"name": "Icon-60",          "size":60},
    //   {"name": "Icon",             "size":57},
    //   {"name": "Icon-Small@2x",    "size":58},
    //   {"name": "Icon-Small-40",    "size":40},
    //   {"name": "Icon-Small",       "size":29},
    //   {"name": "Icon-50",          "size":50},
    //   {"name": "Icon-50@2x",       "size":100},
    //   {"name": "Icon-72",          "size":72},
    //   {"name": "Icon-72@2x",       "size":144},
    //   {"name": "Icon-76",          "size":76},
    //   {"name": "Icon-76@2x",       "size":152},
    // ];

    var icons = [];

    var iPhone_icons = [
      {"name": "iTunesArtwork@2x", "size":1024},
      {"name": "iTunesArtwork",    "size":512},
      {"name": "Icon-60@2x",       "size":120},
      {"name": "Icon@2x",          "size":114},
      {"name": "Icon-Small-40@2x", "size":80},
      {"name": "Icon-60",          "size":60},
      {"name": "Icon",             "size":57},
      {"name": "Icon-Small@2x",    "size":58},
      {"name": "Icon-Small-40",    "size":40},
      {"name": "Icon-Small",       "size":29},
    ];

    var iPad_icons = [
      {"name": "Icon-50",          "size":50},
      {"name": "Icon-50@2x",       "size":100},
      {"name": "Icon-72",          "size":72},
      {"name": "Icon-72@2x",       "size":144},
      {"name": "Icon-76",          "size":76},
      {"name": "Icon-76@2x",       "size":152},
    ];

    var android_icons = [
      {"name": "hires",                   "size":512},
      {"name": "ic_launcher96by96.png",   "size":96},
      {"name": "ic_launcher72by72.png",   "size":72},
      {"name": "ic_launcher48by48.png",   "size":48},
      {"name": "ic_launcher36by36.png",   "size":36},
    ];

    if (build_phone == true){
      icons = icons.concat(iPhone_icons)
    }

    if (build_ipad == true){
      icons = icons.concat(iPad_icons)
    }

    if (build_android == true){
      icons = icons.concat(android_icons)
    }


    var icon;
    for (i = 0; i < icons.length; i++) 
    {
      icon = icons[i];
      doc.resizeImage(icon.size, icon.size, // width, height
                      null, ResampleMethod.BICUBICSHARPER);

      var destFileName = icon.name + ".png";

      if ((icon.name == "iTunesArtwork@2x") || (icon.name == "iTunesArtwork"))
      {
        // iTunesArtwork files don't have an extension
        destFileName = icon.name;
      }

      doc.exportDocument(new File(destFolder + "/" + destFileName), ExportType.SAVEFORWEB, sfw);
      doc.activeHistoryState = startState; // undo resize
    }

    alert("Your Icons have been created!");
  }
}
catch (exception)
{
  // Show degbug message and then quit
	if ((exception != null) && (exception != ""))
    alert(exception);
 }
finally
{
    if (doc != null)
        doc.close(SaveOptions.DONOTSAVECHANGES);
  
    app.preferences.rulerUnits = initialPrefs; // restore prefs
}