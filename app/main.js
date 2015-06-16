var App = require( 'app' );  // Module to control application life.
var BrowserWindow = require( 'browser-window' );  // Module to create native browser window.
var Menu     = require( 'menu' );
var MenuItem = require( 'menu-item' );
var Fs       = require( 'fs' );
var Ipc      = require( 'ipc' )

// Report crashes to our server.
require( 'crash-reporter' ).start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
App.on( 'window-all-closed', function() {
  // if ( process.platform != 'darwin' ) {
  quit();
  // } 
} );

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
var shortcutManager;
App.on( 'ready', function() {

  // Create the browser window.
  mainWindow = new BrowserWindow( { width: 1024, height: 768 } );

  // set Menu Bar
  Menu.setApplicationMenu( menuBar );

  // set Shortcut Manager
  //shortcutManager = new ShortcutManager( __dirname + '/shortcut.json' );
  shortcutManager = new ShortcutManager( App.getPath( 'appData' ) + '/Foul/shortcut.json' );

  //write shortcut file path info for webview.js
  Fs.writeFile( __dirname + '/path.txt', App.getPath( 'appData' ) + '/Foul/shortcut.json', function ( err ) {
    if (err) {
      console.log( err );
    }
    else {
      console.log( "write shortcut file path info" );
    }
  } );

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the devtools.
  // mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on( 'closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  } );

  // Ipc Listener
  Ipc.on( "isRegistered", function ( event, arg ) {
      event.returnValue = shortcutManager.isRegistered( arg.url );
  } );
  Ipc.on( "addShortcut", function ( event, arg ) {
      shortcutManager.add( arg );
      event.returnValue = "received";
  } );
  Ipc.on( "removeShortcut", function ( event, arg ) {
      shortcutManager.remove( arg.url );
      event.returnValue = "received";
  } );
  Ipc.on( "getShortcuts", function ( event, arg ) {
      event.returnValue = shortcutManager.shortcuts;
  } );
  Ipc.on( "updateShortcuts", function ( event, arg ) {
    if ( arg && arg.shortcuts ) {
      shortcutManager.shortcuts = arg.shortcuts;
      event.returnValue = "received";
    }
    else {
      event.returnValue = "error: invalid data";  
    }
  } );

} );

// Create Menu Bar
var menuBar = new Menu();
menuBar = Menu.buildFromTemplate( [
  { 
    label: "Menu",
    submenu: [
      {
        label: "Home",
        click: function () {
          var url = "file://" + __dirname + "/home.html";
          BrowserWindow.getFocusedWindow().webContents.executeJavaScript( "Gv.foul.loadUrl('" + url.replace( /\\/g, "\\\\" ) + "')" );
        },
        accelerator: "Shift+CommandOrControl+H"
      },
      {
        label: "Back",
        click: function () {
          BrowserWindow.getFocusedWindow().webContents.executeJavaScript( "Gv.foul.historyBack()" );
        },
        accelerator: "CommandOrControl+Left"
      },
      {
        label: "Forward",
        click: function () {
          BrowserWindow.getFocusedWindow().webContents.executeJavaScript( "Gv.foul.historyForward()" );
        },
        accelerator: "CommandOrControl+Right"
      },
      {
        label: "Reload",
        click: function () {
          BrowserWindow.getFocusedWindow().webContents.executeJavaScript( "Gv.foul.refresh()" );
        },
        accelerator: "CommandOrControl+R"
      },
      {
        type: "separator"
      },
      {
        label: "New Window",
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.executeJavaScript( "Gv.foul.newWindow()" );
        },
        accelerator: "CommandOrControl+N"
      },
      {
        type: "separator"
      },
      {
        label: "Developer Tools",
        click: function() {
          BrowserWindow.getFocusedWindow().webContents.executeJavaScript( "Gv.foul.openDevTools()" );
        },
        accelerator: "Alt+CommandOrControl+I"
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        click: function() {
          quit();
        },
        accelerator: "CommandOrControl+Q"
      }
    ]
  },
  {
    label: "Example",
    submenu: [
      {
        label: "window.fileSystem",
        click: function () {
          var url = "file://" + __dirname + "/fileSystem.html";
          BrowserWindow.getFocusedWindow().webContents.executeJavaScript( "Gv.foul.loadUrl('" + url.replace( /\\/g, "\\\\" ) + "')" );
        }
      },
      {
        label: "Cross-Origin XMLHttpRequest",
        click: function () {
          var url = "file://" + __dirname + "/crossDomain.html";
          BrowserWindow.getFocusedWindow().webContents.executeJavaScript( "Gv.foul.loadUrl('" + url.replace( /\\/g, "\\\\" ) + "')" );
        }
      },
    ]
  }
] );

// Quit
var quit = function () {
  if ( shortcutManager ) {
    shortcutManager.saveSync();
  }
  App.quit();
}

// Shortcut
var ShortcutManager = function ( path ) {
  this.path = path;
  this.shortcuts = new Object();
  this.initialize();
}
ShortcutManager.prototype = {

  path: null,
  shortcuts: null,

  initialize: function () {

    var manager = this;

    Fs.readFile( this.path, 'utf8', function ( err, data ) {
      if ( err ) {
        console.log( err );
      }
      else {
        if ( data ) {
          manager.shortcuts = JSON.parse( data );
        }
      }
    } );

  },

  add: function ( args ) {

    this.shortcuts[ args.url ] = {
      title: args.title,
      icon: args.icon,
      x: args.x,
      y: args.y
    };

    this.save();

  },

  remove: function ( url ) {

    if ( this.isRegistered[ url ] ) {
      delete this.shortcuts[ url ];
      this.save();
    }
    else {
      return false;
    }

  },

  save: function () {

    var manager = this;

    var data = JSON.stringify( this.shortcuts );

    Fs.writeFile( this.path, data, function ( err ) {
      if (err) {
        console.log( err );
      }
      else {
        console.log( "update: " + manager.path );
      }
    } );

  },

  saveSync: function () {

    var data = JSON.stringify( this.shortcuts );
    Fs.writeFileSync( this.path, data );

  },

  isRegistered: function ( url ) {

    if ( this.shortcuts && this.shortcuts[ url ] ) {
      return true;
    }
    
    return false;

  }

};