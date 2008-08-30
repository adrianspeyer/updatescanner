/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is mozilla.org code.
 *
 * The Initial Developer of the Original Code is
 * Pierre Chanial <chanial@noos.fr>.
 * Portions created by the Initial Developer are Copyright (C) 1998
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *     Pete Burgers (updatescanner@gmail.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
 
// This code is copied from the "AddToBookmarks" context menu item.



// See the end of the file for load/unload observers!




if (typeof(USc_overlay_exists) != 'boolean') {
var USc_overlay_exists = true;
var USc_overlay = {    

load : function() 
{
    var me = USc_overlay;
    // Eventlistener for the contextmenu
    try {
        var menu = document.getElementById("contentAreaContextMenu");
        menu.addEventListener("popupshowing", me._showMenu, false);
    } catch (e) {
        ;
    }
},

// Don't show context menu item when text is selected.
_showMenu : function() 
{
    if(gContextMenu.isTextSelected) {
        // selected text = don't show menu item
        document.getElementById("AddToUpdateScan").hidden = true;
    } else {
        document.getElementById("AddToUpdateScan").hidden = false;
    }
},

addToUpdateScan : function(aBrowser)
{
    var me = USc_overlay;

    var browsers = aBrowser.browsers;
    if (browsers && browsers.length > 1) {
        me._addToUpdateScanForTabBrowser(aBrowser);
    } else {
        me._addToUpdateScanForBrowser(aBrowser.webNavigation);
    }
},

_addToUpdateScanForTabBrowser : function(aTabBrowser)
{
    var tabsInfo = [];
    var currentTabInfo = { name: "", url: "", charset: null };

    var activeBrowser = aTabBrowser.selectedBrowser;
    var browsers = aTabBrowser.browsers;
    for (var i = 0; i < browsers.length; ++i) {
        var webNav = browsers[i].webNavigation;
        var url = webNav.currentURI.spec;
        var name = "";
        var charSet;
        try {
            var doc = webNav.document;
            name = doc.title || url;
            charSet = doc.characterSet;
        } catch (e) {
            name = url;
        }
        tabsInfo[i] = { name: name, url: url, charset: charSet };
        if (browsers[i] == activeBrowser) {
            currentTabInfo = tabsInfo[i];
        }
    }
    USc_updatescan.openNewDialogNoRefresh(currentTabInfo.name, currentTabInfo.url)
},

_addToUpdateScanForBrowser : function(aDocShell)
{
    // Bug 52536: We obtain the URL and title from the nsIWebNavigation
    // associated with a <browser/> rather than from a DOMWindow.
    // This is because when a full page plugin is loaded, there is
    // no DOMWindow (?) but information about the loaded document
    // may still be obtained from the webNavigation. 
    var url = aDocShell.currentURI.spec;
    var title, charSet = null;
    try {
        title = aDocShell.document.title || url;
        charSet = aDocShell.document.characterSet;
    } catch (e) {
        title = url;
    }
    USc_updatescan.openNewDialogNoRefresh(title, url);
}

}
}

window.addEventListener("load", USc_overlay.load, false);
