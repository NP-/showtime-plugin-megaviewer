/**
 *  MegaViewer plugin for showtime version 0.26  by NP
 *
 *  Copyright (C) 2011 NP
 * 
 *  ChangeLog:
 *  0.26
 *  (lost track)
 * 	Added ezdownloadsite Series Link
 *  
 * 
 *  0.23 - 0.25 (dev)
 *  Added EZDownloadSite
 *  Added NewMuVideoLinks
 *  Added DivxZOO
 *  Added OneClickMovieZ
 *  IMDd trailer control quality option
 *  imdbGet supports episodes
 *  Fix MegaReleaseGetInfo
 *  Fix mega exclued bug
 *  Added IMDb Video gallery
 *  Added Imdb Trailer 
 *  Megaupload free user fix 
 *  New IMDb scrapper (wip)
 *  Added Support for siries.me (problem retrieving cookie 'remember_user_token=')
 *  NOTE: Possible problem in the httpclient with multiple Set-Cookie: 
 *        only the last one is present in the return headers
 *  Megaupload dynamic timer
 *  
 *  0.22
 *  Added Support for 2Shared
 *  Added MegaVideo time limit bypass
 *  Added Auto Login option for MegaUpload
 *  Clean up Settings page
 *  Megaupload to MegaVideo Support 
 *  MegaUpload Account page update
 *  
 *  0.21
 *  Fix for megaupload support
 *  Fix button name in oneddl
 *  Added Bookmark Support
 *  Added Mega MKV
 *  
 *  0.20
 *  Fix http headers problem
 *  Added Support for manual inserted links
 *  Added Support for Megaupload Premium accounts
 *  Added Support for episode7.com
 *  Added RapidShare Support
 * 
 *  0.13
 *  Updated OneDDL series link to include all episodes available
 *  Improved MegaRelease Link Parser
 *  Small Fix's
 *  
 *  0.12
 *  Support for the new OneDDL Layout (8/11/11)
 *  Added support for vvwtv
 *  
 *  0.11
 *  Added series link in OneDDL
 * 	Added OneDDL and MegaRelease description info
 *  Minor fix's
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */



(function(plugin){


var PREFIX = 'megaviewer:';
var DAILY_DIVX = 'http://www.mrbrownee70.com/logo.png';
var DIVXZOO_IMG = 'http://image.torrent-invites.com/images/655renber2.png';
var EZDOWNLOAD_IMG = 'http://image.torrent-invites.com/images/387ezdownloadsite_252520l.png';
var MEGAEXCLUE = 'http://www.mega-exclue.com/';
var MEGAEXCLUE_IMG = 'http://image.torrent-invites.com/images/611xlz2gx.png';
var MEGAMKV_IMG = 'http://image.torrent-invites.com/images/193logo.png';
var MEGAMKV = 'http://mega-mkv.com/';
var MEGARELEASE = "http://www.megarelease.net";
var MEGARELEASE_IMG = "http://image.torrent-invites.com/images/785mrlogo1b.png";
var MEGAUPLOAD_IMG = 'http://image.torrent-invites.com/images/596Megaupload_Premium_Lin.png';
var NEWMULINKS_IMG = 'http://image.torrent-invites.com/images/450mvl.png';
var ONECLICK_IMG = 'http://image.torrent-invites.com/images/493logo.gif';
var ONEDDL_IMG = "http://image.torrent-invites.com/images/685oneddl_logo.png";
var ONELINKMOVIE = 'http://onelinkmovie.com/';
var SIRIES = 'http://siries.me/';
var SIRIES_IMG = 'http://image.torrent-invites.com/images/411276615_177378728963471.jpg';
var SERIADOSDETV_IMG = 'http://2.bp.blogspot.com/-13ny-uCr_Vg/TnfC33iVTXI/AAAAAAAAAmw/7RiulRtRzJk/s1600/Untitled-7.png';
var ICEFILMS ="http://www.icefilms.info";
var ICEFILMS_IMG ="http://image.torrent-invites.com/images/698icon_1.png";
var LOGO_IMG = plugin.path + "images/logo.png";
var TV_IMG = "http://image.torrent-invites.com/images/982tvshows.png";
var MOVIES_IMG = "http://image.torrent-invites.com/images/360movies.png";
var NO_POSTER = 'http://image.torrent-invites.com/images/683no_poster.jpg';
var EPISODE7_IMG = "http://image.torrent-invites.com/images/371e7.png";
var EPISODE7 = 'http://www.episode7.com/';
var USER_AGENT = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.202 Safari/535.1';
var b64s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var INPUT_IMG = plugin.path + "images/input.png";
var BOOKMARKS_IMG = "http://image.torrent-invites.com/images/902bookmarks.png";

var CHAR_LIST = [
//hex and others	
[/&#x27;/gi, "'"], 		[/&#038;/gi, "&"], 		[/&#x26;/gi, "&"], 		[/&amp;<br\/>/gi, "&"],				
[/&amp;/gi, '&'], 		[/&#xF4/gi, "o"], 		[/&#x22;/gi, ""], 		[/&#x2B;/gi, "e"],
[/&#xC6;/gi, "AE"], 	[/&#xC7;/gi, "C"], 		[/&#xB0;/gi, "º"], 		[/&#xED;/gi, "í"],
[/&#xEE;/gi, "î"],		[/&#xB3;/gi, "3"],	 	[/&nbsp;/gi, ""],		[/&#8211;/gi, "-"],
[/&frac12;/gi, "1/2"], 	[/&#xE9;/gi, "é"],		[/&#039;/gi, "'"],		[/&quot;/gi, ' '],
[/&#163;/gi , '£'],		[/&#8217;/gi, "'"],		[/&#xF1;/gi, "ñ"],		[/&#xF6;/gi , 'ö'],
[/&#xC1;/gi , 'Á '],	[/&#39;/gi, "'"], //list
[/&copy;/gi, '©'], 		[/&#33;/gi, '!'], 		[/&#95;/gi, '_'], 		[/&#157;/gi, ''], 	[/&#219;/gi, 'Û'],
[/&reg;/gi, '®'], 		[/&#34;/gi, '"'],		[/&#96;/gi, '`'], 		[/&#158;/gi, 'ž'], 		[/&#220;/gi, 'Ü'],
[/&nbsp;/gi, ' '],		[/&#35;/gi, '#'],		[/&#97;/gi, 'a'], 		[/&#159;/gi, 'Ÿ'], 		[/&#221;/gi, 'Ý'],	
[/&quot;/gi, '"'], 		[/&#36;/gi, '$'], 		[/&#98;/gi, 'b'], 		[/&#160;/gi, ' '], 		[/&#222;/gi, 'Þ'],	
[/&amp;/gi, '&'], 		[/&#37;/gi, '%'],		[/&#99;/gi, 'c'], 		[/&#161;/gi, '¡'], 		[/&#223;/gi, 'ß'],	
[/&lt;/gi, '<'],		[/&#38;/gi, '&'],		[/&#100;/gi, 'd'],		[/&#162;/gi, '¢'],		[/&#224;/gi, 'à'],	
[/&gt;/gi, '>'],		[/&#39;/gi, "'"],		[/&#101;/gi, 'e'],		[/&#163;/gi, '£'],		[/&#225;/gi, 'á'],	
[/&Agrave;/gi, 'À'],	[/&#40;/gi, '('],		[/&#102;/gi, 'f'],		[/&#164;/gi, '¤'],		[/&#226;/gi, 'â'],	
[/&Aacute;/gi, 'Á'],	[/&#41;/gi, ')'],		[/&#103;/gi, 'g'],		[/&#165;/gi, '¥'],		[/&#227;/gi, 'ã'],	
[/&Acirc;/gi, 'Â'],		[/&#42;/gi, '*'],		[/&#104;/gi, 'h'],		[/&#166;/gi, '¦'],		[/&#228;/gi, 'ä'],	
[/&Atilde;/gi, 'Ã'],	[/&#43;/gi, '+'],		[/&#105;/gi, 'i'],		[/&#167;/gi, '§'],		[/&#229;/gi, 'å'],	
[/&Auml;/gi, 'Ä'],		[/&#44;/gi, ','],		[/&#106;/gi, 'j'],		[/&#168;/gi, '¨'],		[/&#230;/gi, 'æ'],	
[/&Aring;/gi, 'Å'],		[/&#45;/gi, '-'],		[/&#107;/gi, 'k'],		[/&#169;/gi, '©'],		[/&#231;/gi, 'ç'],	
[/&AElig;/gi, 'Æ'],		[/&#46;/gi, '.'],		[/&#108;/gi, 'l'],		[/&#170;/gi, 'ª'],		[/&#232;/gi, 'è'],	
[/&Ccedil;/gi, 'Ç'],	[/&#47;/gi, '/'],		[/&#109;/gi, 'm'],		[/&#171;/gi, '«'],		[/&#233;/gi, 'é'],	
[/&Egrave;/gi, 'È'],	[/&#48;/gi, '0'],		[/&#110;/gi, 'n'],		[/&#172;/gi, '¬'],		[/&#234;/gi, 'ê'],	
[/&Eacute;/gi, 'É'],	[/&#49;/gi, '1'],		[/&#111;/gi, 'o'],		[/&#173;/gi, ' '],		[/&#235;/gi, 'ë'],	
[/&Ecirc;/gi, 'Ê'],		[/&#50;/gi, '2'],		[/&#112;/gi, 'p'],		[/&#174;/gi, '®'],		[/&#236;/gi, 'ì'],	
[/&Euml;/gi, 'Ë'],		[/&#51;/gi, '3'],		[/&#113;/gi, 'q'],		[/&#175;/gi, '¯'],		[/&#237;/gi, 'í'],	
[/&Igrave;/gi, 'Ì'],	[/&#52;/gi, '4'],		[/&#114;/gi, 'r'],		[/&#176;/gi, '°'],		[/&#238;/gi, 'î'],	
[/&Iacute;/gi, 'Í'],	[/&#53;/gi, '5'],		[/&#115;/gi, 's'],		[/&#177;/gi, '±'],		[/&#239;/gi, 'ï'],	
[/&Icirc;/gi, 'Î'],		[/&#54;/gi, '6'],		[/&#116;/gi, 't'],		[/&#178;/gi, '²'],		[/&#240;/gi, 'ð'],	
[/&Iuml;/gi, 'Ï'],		[/&#55;/gi, '7'],		[/&#117;/gi, 'u'],		[/&#179;/gi, '³'],		[/&#241;/gi, 'ñ'],	
[/&ETH;/gi, 'Ð'],		[/&#56;/gi, '8'],		[/&#118;/gi, 'v'],		[/&#180;/gi, '´'],		[/&#242;/gi, 'ò'],	
[/&Ntilde;/gi, 'Ñ'],	[/&#57;/gi, '9'],		[/&#119;/gi, 'w'],		[/&#181;/gi, 'µ'],		[/&#243;/gi, 'ó'],	
[/&Otilde;/gi, 'Õ'],	[/&#58;/gi, ':'],		[/&#120;/gi, 'x'],		[/&#182;/gi, '¶'],		[/&#244;/gi, 'ô'],	
[/&Ouml;/gi, 'Ö'],		[/&#59;/gi, ';'],		[/&#121;/gi, 'y'],		[/&#183;/gi, '·'],		[/&#245;/gi, 'õ'],	
[/&Oslash;/gi, 'Ø'],	[/&#60;/gi, '<'],		[/&#122;/gi, 'z'],		[/&#184;/gi, '¸'],		[/&#246;/gi, 'ö'],	
[/&Ugrave;/gi, 'Ù'],	[/&#61;/gi, '='],		[/&#123;/gi, '{'],		[/&#185;/gi, '¹'],		[/&#247;/gi, '÷'],	
[/&Uacute;/gi, 'Ú'],	[/&#62;/gi, '>'],		[/&#124;/gi, '|'],		[/&#186;/gi, 'º'],		[/&#248;/gi, 'ø'],	
[/&Ucirc;/gi, 'Û'],		[/&#63;/gi, '?'],		[/&#125;/gi, '}'],		[/&#187;/gi, '»'],		[/&#249;/gi, 'ù'],	
[/&Uuml;/gi, 'Ü'],		[/&#64;/gi, '@'],		[/&#126;/gi, '~'],		[/&#188;/gi, '¼'],		[/&#250;/gi, 'ú'],	
[/&Yacute;/gi, 'Ý'],	[/&#65;/gi, 'A'],		[/&#127;/gi, '?'],		[/&#189;/gi, '½'],		[/&#251;/gi, 'û'],	
[/&THORN;/gi, 'Þ'],		[/&#66;/gi, 'B'],		[/&#128;/gi, '€'],		[/&#190;/gi, '¾'],		[/&#252;/gi, 'ü'],
[/&szlig;/gi, 'ß'],		[/&#67;/gi, 'C'],		[/&#129;/gi, ''],		[/&#191;/gi, '¿'],		[/&#253;/gi, 'ý'],	
[/&agrave;/gi, 'à'],	[/&#68;/gi, 'D'],		[/&#130;/gi, '‚'],		[/&#192;/gi, 'À'],		[/&#254;/gi, 'þ'],	
[/&aacute;/gi, 'á'],	[/&#69;/gi, 'E'],		[/&#131;/gi, 'ƒ'],		[/&#193;/gi, 'Á'],		[/&#255;/gi, 'ÿ'],	
[/&aring;/gi, 'å'],		[/&#70;/gi, 'F'],		[/&#132;/gi, '„'],		[/&#194;/gi, 'Â'],		 	 
[/&aelig;/gi, 'æ'],		[/&#71;/gi, 'G'],		[/&#133;/gi, '…'],		[/&#195;/gi, 'Ã'],		 	 
[/&ccedil;/gi, 'ç'],	[/&#72;/gi, 'H'],		[/&#134;/gi, '†'],		[/&#196;/gi, 'Ä'],		 	 
[/&egrave;/gi, 'è'],	[/&#73;/gi, 'I'],		[/&#135;/gi, '‡'],		[/&#197;/gi, 'Å'],		 	 
[/&eacute;/gi, 'é'],	[/&#74;/gi, 'J'],		[/&#136;/gi, 'ˆ'],		[/&#198;/gi, 'Æ'],		 	 
[/&ecirc;/gi, 'ê'],		[/&#75;/gi, 'K'],		[/&#137;/gi, '‰'],		[/&#199;/gi, 'Ç'],		 	 
[/&euml;/gi, 'ë'],		[/&#76;/gi, 'L'],		[/&#138;/gi, 'Š'],		[/&#200;/gi, 'È'],		 	 
[/&igrave;/gi, 'ì'],	[/&#77;/gi, 'M'],		[/&#139;/gi, '‹'],		[/&#201;/gi, 'É'],		 	 
[/&iacute;/gi, 'í'],	[/&#78;/gi, 'N'],		[/&#140;/gi, 'Œ'],		[/&#202;/gi, '?'],		 	 
[/&icirc;/gi, 'î'],		[/&#79;/gi, 'O'],		[/&#141;/gi, ''],		[/&#203;/gi, 'Ë'],		 	 
[/&iuml;/gi, 'ï'],		[/&#80;/gi, 'P'],		[/&#142;/gi, 'Ž'],		[/&#204;/gi, 'Ì'],		 	 
[/&eth;/gi, 'ð'],		[/&#81;/gi, 'Q'],		[/&#143;/gi, ''],		[/&#205;/gi, 'Í'],		 	 
[/&ntilde;/gi, 'ñ'],	[/&#82;/gi, 'R'],		[/&#144;/gi, ''],		[/&#206;/gi, 'Î'],		 	 
[/&ograve;/gi, 'ò'],	[/&#83;/gi, 'S'],		[/&#145;/gi, '‘'],		[/&#207;/gi, 'Ï'],		 	 
[/&oacute;/gi, 'ó'],	[/&#84;/gi, 'T'],		[/&#146;/gi, '’'],		[/&#208;/gi, 'Ð'],		 	 
[/&ocirc;/gi, 'ô'],		[/&#85;/gi, 'U'],		[/&#147;/gi, '“'],		[/&#209;/gi, 'Ñ'],		 	 
[/&otilde;/gi, 'õ'],	[/&#86;/gi, 'V'],		[/&#148;/gi, '”'],		[/&#210;/gi, 'Ò'],		 	 
[/&ouml;/gi, 'ö'],		[/&#87;/gi, 'W'],		[/&#149;/gi, '•'],		[/&#211;/gi, 'Ó'],		 	 
[/&oslash;/gi, 'ø'],	[/&#88;/gi, 'X'],		[/&#150;/gi, '–'],		[/&#212;/gi, 'Ô'],		 	 
[/&ugrave;/gi, 'ù'],	[/&#89;/gi, 'Y'],		[/&#151;/gi, '—'],		[/&#213;/gi, 'Õ'],		 	 
[/&uacute;/gi, 'ú'],	[/&#90;/gi, 'Z'],		[/&#152;/gi, '˜'],		[/&#214;/gi, 'Ö'],		 	 
[/&ucirc;/gi, 'û'],		[/&#91;/gi, "["],		[/&#153;/gi, '™'],		[/&#215;/gi, '×'],		 	 
[/&yacute;/gi, 'ý'],	[/&#92;/gi, '\\'],		[/&#154;/gi, 'š'],		[/&#216;/gi, 'Ø'],		 	 
[/&thorn;/gi, 'þ'],		[/&#93;/gi, "]"],		[/&#155;/gi, '›'],		[/&#217;/gi, 'Ù'],		 	 
[/&yuml;/gi, 'ÿ'],		[/&#94;/gi, '^'],		[/&#156;/gi, 'œ'],		[/&#218;/gi, 'Ú'],
[/&#xE7;/gi, 'ç'], 		[/&#xE1;/gi, 'á'],		[/&#xE3;/gi, 'ã'],		[/&#xFA;/gi, 'ú'],
[/&#x27;/gi, "'"],		[/&#x26;/gi, '&'], 		[/&#xE5;/gi, 'å'],		[/&#xEB;/gi, 'ë'],
[/&#xE0;/gi, 'â'],		[/&#xFB;/gi, 'û'],		[/&#xE8;/gi, 'è'],
];



var FILE_TYPE = [ /.avi/i, /.mkv/i , /.mp4/i , /.mov/i , /.flv/i ];
var loggedIn = false;
var tos = 'MegaViewer\n\n'+
	'The developer has no affiliation with the sites what so ever.\n'+
	'Nor does he receive money or any other kind of benefits for them.\n\n' +
	'The software is intended solely for educational and testing purposes,\n'+
	'and while it may allow the user to create copies of legitimately acquired\n'+
	'and/or owned content, it is required that such user actions must comply\n'+ 
	'with local, federal and country legislation.\n\n'+
	'Furthermore, the author of this software, its partners and associates\n'+ 
	'shall assume NO responsibility, legal or otherwise implied, for any misuse\n'+
	'of, or for any loss that may occur while using MegaViewer.\n\n'+
	'You are solely responsible for complying with the applicable laws in your\n'+
	'country and you must cease using this software should your actions during\n'+
	'MegaViewer operation lead to or may lead to infringement or violation of the\n'+
	'rights of the respective content copyright holders.\n\n'+
	"MegaViewer is not licensed, approved or endorsed by any online resource\n "+
	"proprietary. Do you accept this terms?";
  

//theTVDb API Key 788B9D76EBBE42FB

//store	
	var bookmarks = plugin.createStore('bookmarks', true);
	
	if(!bookmarks.list)
		bookmarks.list = "[]";

//settings 
	
	var service = plugin.createService("MegaViewer", PREFIX + "start", "tv", true, LOGO_IMG);
	
	var settings = plugin.createSettings("MegaViewer", LOGO_IMG, "MegaViewer");
	
	settings.createInfo("info", LOGO_IMG, tos + "\nPlugin developed by NP \n");
	
	settings.createBool("tosaccepted", "Accepted TOS (available in opening the plugin):", false, function(v){
	    service.tosaccepted = v; });  

	settings.createDivider('Information');

	settings.createMultiOpt("movieInfo", "Movie Info", [['1', 'IMDb Scraper', true], ['2', 'TMDb'], ['3', 'IMDbApi.com']], function(v){ service.movieinfo = v; });
	
	settings.createBool("tvrage", "TVRage", false, function(v){ service.tvrage = v; });

	
	settings.createDivider('Trailers');
	settings.createBool("trailers", "Search for Trailers (can cause some delay)", false, function(v){ service.trailers = v; });

	settings.createBool("hd", "HD", false, function(v){ service.hd = v; });
	
	settings.createBool("fullhd", "Full HD", false, function(v){ service.fullhd = v; });

	settings.createMultiOpt("imdbtrailers", "IMDb Trailers Quality", [['2', 'Standard', true], ['3', 'High']], function(v){ service.imdbtrailers = v; });

	settings.createDivider('Debug');
	settings.createBool("debug", "Debug", false, function(v){ service.debug = v; });



	//http header fix
	plugin.addHTTPAuth("http:\/\/trailers\.apple\.com\/.*", function(authreq) {
	    authreq.setHeader("User-Agent", "QuickTime");
	  });

	plugin.addHTTPAuth("http:\/\/.*\.mirrors\.videostreamserver\.net\/.*", function(authreq) {
	    authreq.setHeader("User-Agent", "QuickTime/7.6.2 ");
	  });


/*
 * Navigation
 * First Level, Website Selection
 */
 
function startPage(page){


	page.appendItem( PREFIX + "category:dailydivx", "directory", {
		  title: "Daily Divx",
		      icon: DAILY_DIVX
		      });

	page.appendItem( PREFIX + "ezdownloadsite:/", "directory", {
		  title: "EZDownloadSite",
		      icon: EZDOWNLOAD_IMG
		      });

	page.appendItem( PREFIX + "episode7", "directory", {
		  title: "episode7",
		      icon: EPISODE7_IMG
		      });
	 
	page.appendItem( PREFIX + "icefilms:latest", "directory", {
		  title: "IceFilms",
		      icon: ICEFILMS_IMG
		      });
	
	page.appendItem( PREFIX + "newmuvideolinks:/", "directory", {
		  title: "NewMyVideoLinks",
		      icon: NEWMULINKS_IMG
		      });

	page.appendItem( PREFIX + "oneclick:/", "directory", {
		  title: "One Click MovieZ",
		      icon: ONECLICK_IMG
		      });

	page.appendItem( PREFIX + "onelinkmovie:/", "directory", {
		  title: "One Link Movie"
		      });
		      	
	page.appendItem( PREFIX + "category:oneddl", "directory", {
		  title: "OneDDL",
		      icon: ONEDDL_IMG
		      });
	
	page.appendItem( PREFIX + "seriadosdetv:search?&max-results=17", "directory", {
		  title: "Seriados de TV",
		      icon: SERIADOSDETV_IMG
		      });

	page.appendItem( PREFIX + "videos:input:ND:ND:ND", "directory", {
		  title: "Insert Link",
		      icon: INPUT_IMG
		      });
		      
	if(bookmarks.list.length>5)
		page.appendItem( PREFIX + "bookmarks", "directory", {
			  title: "Bookmarks",
			      icon: BOOKMARKS_IMG
			      });
		
	
	page.type = "directory";
	page.contents = "items";
	page.loading = false;
	page.metadata.logo = LOGO_IMG;
	page.metadata.title = "MegaViewer"; 
	
	//TOS Trigger	
	if (!service.tosaccepted)
		if (showtime.message(tos, true, true))
			service.tosaccepted = 1;
		else
			page.error("TOS not accepted. MegaViewer disabled");      	
}


/*
 * Second Level, Category
 */

plugin.addURI( PREFIX + "category:(.*)", function(page, site){
	   		
	page.type = "directory";
	page.contents = "items";
	page.metadata.logo = LOGO_IMG;
	page.metadata.title = site;
	
	if(site == 'megarelease' && loggedIn == true)
		page.appendItem( PREFIX + site + ":bluray:0", "directory", {
			  title: "BluRay Movies",
			      icon: MOVIES_IMG
			      });
	
	page.appendItem( PREFIX + site + ":movies:0", "directory", {
		  title: "Movies",
		      icon: MOVIES_IMG
		      });
	
	page.appendItem( PREFIX + site + ":television:0", "directory", {
		  title: "TV Shows",
		      icon: TV_IMG
		      });
	
	page.loading = false; 
});

/*
 * Video Presentation
 *  -Consider the origin
 *  -retrive information 
 *  -retrive links
 *  -display
*/ 

plugin.addURI( PREFIX + "present:(.*):(.*)", function(page, imdb, url){
	
	var url_org = url;

	var data = {};
	data.cookie = data.t = data.sec ='ND';
	
	if(url.indexOf('www')!=-1)
		var website = getValue(url, 'www.','.');
	else
		var website = url.slice(0, url.indexOf("."));
	
	if(imdb == 'icefilmGet'){
		var data = icefilmsGet(url);
		var movie = movieInfo(data.imdb);
		url = data.url;
		if(data.list != '')
			var list = 'icefilms:list:' + data.list;
	}else
		var content = cleanString(showtime.httpGet('http://'+url).toString());

	if(imdb.indexOf('tt') != -1)
		var movie = movieInfo(imdb);
	
	switch(website){

		case 'episode7':
			var movie = episodeSevenGetInfo(content);
			url = episodeSevenGetUrl(content);
			data.list = getValue(content, '<h1 class="cat"><a href="/', '"');
			if(data.list != '')
				var list = 'episode7:list:' + data.list;
			break;

		case 'ezdownloadsite':
			var movie = ezdownloadGetInfo(content);
			url = movreelLink(content);
			//add category series link using category
			if(getValue(content, '/category/tv-shows/','"').length > 2)
				var list = 'ezdownloadsite:' + getValue(content, '/category/tv-shows/','"','start','all');
			break;

		case 'oneddl':
			if(!movie)
				var movie = oneddlGetInfo(content);
			url = oneddlGetUrl(content);
			if(content.indexOf('Series Link') != -1)
				var list = 'oneddl:' + content.slice(content.lastIndexOf('<a href=',content.indexOf('Series Link'))+9, content.lastIndexOf('+',content.indexOf('Series Link'))).replace('http://','') + ':0';
			break;
		
		case 'megarelease':
			if(!movie)
				var movie = megareleaseGetInfo(content);
			url = megareleaseGetUrl(content);
			break;
		case 'newmyvideolinks':
			url = movreelLink(content);
			break;
		case 'oneclickmoviez':
			var temp = imdbLink(showtime.httpGet('http://'+imdb).toString());
			var movie = movieInfo(temp);//imdbGet('http://'+temp);
			url = oneclickmoviezLinks(content);
			break;
			
		case 'onelinkmovie':
			url = megauploadLink(content).toLowerCase();
			url += multiuploaddLink(content).toLowerCase();
			break;
			
		default:
			trace('Default: ' + website);
		break;
	}	
		
	page.metadata.title = new showtime.RichText(movie.Title);
	page.metadata.logo = MOVIES_IMG;
	
	if(movie.Year)
		page.metadata.title= new showtime.RichText(movie.Title + " " + movie.Year.toString());
	
	if(movie.icon == "N/A" || !movie.icon)
		page.metadata.icon = NO_POSTER;
	else
		page.metadata.icon =  movie.icon;
	
	var count = 0;
	if(movie.Genre){
		page.appendPassiveItem("label", movie.Genre);
		count++;
	}
	if(movie.rating)
		page.appendPassiveItem("rating", movie.rating);
	
	
	var args = ["divider", "Episode", "Number", "AKA", "TagLine", "Keywords", "Duration", "Actors", "Director", 
				"Writer", "Studios", "Country", "Location", 'Aired', "Released",'Language', "Budget", "Votes",
				'Format', 'Audio', 'Size', "Rated", "divider"];

			
	for each (var arg in args){
		try{
			var aux = eval('movie.'+arg);
			if(aux != "divider" && aux != "N/A" && aux != null && aux != ""){
				page.appendPassiveItem("label", aux, {
				title: arg});
				count++;
			}			
		}catch(np){ 
			if(arg == "divider" && count>0){
				page.appendPassiveItem("divider");
				count = 0;				
			}
			continue; 
		}	
	}
	if(movie.plot == '' || movie.plot == null)
		movie.plot = 'Description Not Found...';
	page.appendPassiveItem("bodytext", new showtime.RichText(movie.plot.toString()));
	
			
	if(url.indexOf('linksafe')!=-1 || url.indexOf('multiupload.com')!=-1){
		var data = {};
		data.cookie = data.t = data.sec ='ND';
	}
	  
	//imdb trailers  
	if(movie.Trailer)
		page.appendAction("navopen", PREFIX + 'videos:' +'www.imdb.com/video/' + movie.Trailer + ':ND:ND:ND', true, {
				title: "Watch Trailer"
		});

	if(movie.Trailer && parseInt(movie.trailers) > 1)
		page.appendAction("navopen", PREFIX + 'imdblist:'+imdb, true, {
				title: "IMDb Videos("+ movie.trailers +")"
		});
	  
	//trailers old
	
	if(imdb != 'tvshow' && imdb != 'icefilmGet' && imdb != 'ND' && service.trailers == "1")
	{
		var search = showtime.httpGet('http://pipes.yahoo.com/pipes/pipe.run?_id=941e84ac0bc3c2bfd03d189a9cecdb0a&_render=JSON&search='+imdb).toString();
		search = eval( '('+ search +')');
		
		if(search.count == 1)
			url += retriveTrailers(search.value.items[0].description);
		
		//Recent Movies, main files not yet updated 
		var search = showtime.httpGet('http://pipes.yahoo.com/pipes/pipe.run?_id=572d20849220c9c16ae649f820f88e77&_render=JSON&search='+imdb).toString();
		search = eval( '('+ search+')');
		if(search.count > 0){			
			for (var j=0;j<search.count;j++){
				url += retriveTrailers(search.value.items[j].description);
			}
		}
	}
	

	//Add links
	url = url.split('</b>');
	
	for each (var name in url){
		if(name.length >10)
			page.appendAction("navopen", PREFIX + 'videos:' +name.slice(0,name.indexOf('<')) + ':' +data.cookie + ':' + data.t + ':' + data.sec, true, {
					title: "Watch "+ name.slice(name.indexOf('<b>')+3)
			});
	}

	if(list){
		page.appendAction("navopen", PREFIX + list, true, {
			title: "List Episodes"
		});
	}
	
	//bookmarks
	if(!movie.Title)
		movie.Title = 'ND';
	var name = bookmark_title(movie.Title, url_org);		
	if(!bookmarked(name)){
		var bookmakrButton = page.appendAction("pageevent", "bookmark", true,{ title: "Bookmark" });
	}
	else{		
		var bookmakrButton = page.appendAction("pageevent", "bookmark_remove", true,{ title: "Remove Bookmark" });
	}
			
	page.loading = false;
	page.type = "item";	

	page.onEvent('bookmark', function(){				
							if(!bookmarked(name)){
								bookmark(url_org, imdb, name, movie.icon)
								showtime.message('Bookmarked: '+ name, true, false);
							}else
								showtime.message('Already Bookmarked: '+ name, true, false);
					});

	page.onEvent('bookmark_remove', function(){ 
							if(!bookmarked(name)){
								showtime.message(name +' Not bookmarked ', true, false);
							}else{
								bookmark_remove(name);
								showtime.message(name + ' bookmark removed' , true, false);
							}
					});

});


/*
 * Video Play
*/ 

plugin.addURI( PREFIX + "videos:(.*):(.*):(.*):(.*)", function(page, url, cookie, t, sec){
	
	if(url == 'input')
		url = showtime.textDialog('Link: ', true, false).input.toString().replace('http://','');
	//icefilms
	if(url.length<7 && cookie != 'ND'){
		var m ='-' + randomFromTo(100,250);
		var s = randomFromTo(5,250);
		var rpost={
			'User-Agent': USER_AGENT,
			'Cookie': cookie,
			'Host': 'www.icefilms.info',
			'Referer': 'http://www.icefilms.info', 
			'Content-type': 'application/x-www-form-urlencoded'			 
		}
	
		var arg ={ url: '', cap: '', m: m, iqs: '', s: s, sec: sec, t: t, id: url}
		var req=showtime.httpPost( ICEFILMS + '/membersonly/components/com_iceplayer/video.phpAjaxResp.php', arg, null, rpost).toString();		
		req = unescape(req).toString();
		url = req.slice(req.lastIndexOf('//')+2, req.length);
	}
	
	if(url.indexOf('mega-exclue') !=-1)	
		url = megaexclueGetUrl(url);
	
	var website = domain(url);
	
	//Redirect
	if(website == 'newmyvideolinks'){
		var temp = showtime.httpGet('http://'+url).toString();
		url = movreelLink(temp).replace('<b>MR</b>','');
		website = 'movreel';
	}	
	if(website ==  'linksafe'){
		var temp = showtime.httpGet('http://'+url).toString();
		if(getValue(temp, "'?c=","'") !=''){
			temp = showtime.httpGet('http://tools.half-moon.org/multiupload/?urltext=www.multiupload.com/' +getValue(temp, "'?c=","'")).toString();
			url = megauploadLink(temp).replace('<b>MU</b>','');
			website = 'megaupload';
		}
	}
	if(website ==  'multiupload'){
		url = 'multiupload.com'+ url.replace(/www\.multiupload\.com/gi,'').replace('www','').toUpperCase();
		var temp = showtime.httpGet('http://tools.half-moon.org/multiupload/?urltext=' +url).toString();
		url = megauploadLink(temp).replace('<b>MU</b>','');
		website = 'megaupload';
	}

	if(website ==  'mrbrownee70'){
		url = mrbrowneeUrl(url);
		website = domain(url);
	}

//true host		
	switch(website){
		
		case '2shared':
			var temp = showtime.httpGet('http://'+url).toString();
			url = getValue(temp, 'http://dc',"'",'start','all').replace('http://','');
			if(url.indexOf('<') != -1)
				url = url.slice(0, url.indexOf('<')-1);
			trace('URL: ' + url);
			break;
		
		case 'imdb':
			trace('IMDb Trailer Link ' + service.imdbtrailers + url);
			var aux = service.imdbtrailers;
			while(aux < 4){
				var temp = showtime.httpGet('http://'+ url + 'player?uff='+service.imdbtrailers).toString();
				url = getValue(temp, 'IMDbPlayer.playerKey = "', '"').replace('http://','');
				if(url == '' && getValue(temp, '"file", "','"') !='')
					url = unescape(getValue(temp, '"file", "','"')) + ' playpath=' + unescape(getValue(temp, '"id", "','"')) ;
				trace('Imdb final: ' + url);
				if(url != '')
					break;
				aux++;
			}
			break;
			
		case 'mega-mkv':
			var temp = showtime.httpGet('http://'+url).toString();
			url = getValue(temp, 'www.megaupload.com','"','start','all');
			if(!loggedIn){
				var mu = login('The file you are trying to download is larger than 1GB');
				if(mu != true){
					page.error(mu);
					return;
				}
			}			
			break;
		
		case 'megaupload':
			if(service.megavideo == "1"){
				var org_url = url;
				url = megavideoGetUrl(url);
				trace('megavideo final: '+ url.url);
				if(service.timelimit == "1"){
					url = 'www.i-megastreaming.com/video.php?id=' + url.id;
					break;
				}
				if(url.url.indexOf('/.flv')==-1){
					url = url.url;
					break;
				}else{
					url = org_url;
				}
			}
			if(!loggedIn){
				var temp_url = megauploadGetUrl(url);
				if(temp_url.link){
					trace('out in: ' + temp_url.link.toString());
					url = temp_url.link;
					trace('Sleep '+ temp_url.count +' Seg for url:' + url);
					wait(temp_url.count);
					trace('END Sleep '+ temp_url.count +' Seg');
				}
				if(temp_url == 'Premium'){
					var mu = login('The file you are trying to download is larger than 1GB');
					if(mu != true){
						page.error(mu);
						return;
					}
				}
			}
			break;
			
		case 'megavideo':
			url = megavideoGetUrl(url);
			break;

		case 'movreel':
			var head={
				'User-Agent': USER_AGENT,
				//'Cookie': cookie,
				'Host': 'movreel.com',
				'Origin': 'http://movreel.com',
				'Referer': 'http://'+url,
				'Content-type': 'application/x-www-form-urlencoded'			 
			}

			var content = showtime.httpGet('http://' +url, null , head).toString();
			var post = {};
			post.op = getValue(content, 'name="op" value="', '"');
			post.id = getValue(content, 'name="id" value="', '"');
			post.referer = getValue(content, 'name="referer" value="', '"');
			post.fname = getValue(content, 'name="fname" value="', '"');
			post.usr_login = getValue(content, 'name="usr_login" value="', '"');
			
			trace('post1: ' + post.op + post.id + post.referer + post.fname + post.usr_login);
			content = showtime.httpPost('http://'+url , "op=" + post.op +"&usr_login="+post.usr_login+"&id="+ post.id +"&fname=" + post.fname+"&referer="+ post.referer +"&method_free=+Free+Download",null, head).toString();

			post.op = getValue(content, 'name="op" value="', '"');
			post.id = getValue(content, 'name="id" value="', '"');
			post.rand = getValue(content, 'name="rand" value="', '"');
			post.referer = getValue(content, 'name="referer" value="', '"');
			post.method_free= getValue(content, 'name="method_free" value="', '"');
			post.method_premium = getValue(content, ' name="method_premium" value="', '"');
			
			trace('second link: ' + "op=download2&id="+ post.id +"&rand="+post.rand+"&referer="+post.referer+"&method_free=+Free+Download&method_premium=&down_direct=1&down_direct=1&x=37&y=");
			
			var content = showtime.httpPost('http://'+url , 
				"op="+post.op+"&id="+ post.id +"&rand="+post.rand+"&referer="+
				post.referer+"&method_free=+Free+Download&method_premium=&down_direct=1&down_direct=1&x=37&y=",
				null, head).toString();
				
			url = getValue(content, 'http://', '"><div class="t_download"' , 'endRef');
			break;
			
		case 'multiupload':
			var temp = showtime.httpGet('http://'+url).toString();
			url = temp.slice(temp.lastIndexOf('http://',temp.indexOf('multiupload.com:81'))+7,temp.indexOf('"',temp.indexOf('multiupload.com:81')));
			break;
		
		case 'rapidshare':
			url = rapidshareUrl(url);
			break;

		case 'uploadc':
			url = uploadcUrl(url);
		break;

		case 'vidbux':
			url = uploadcUrl(url);
		break;

		case 'vidxden':
			url = uploadcUrl(url);
		break;

		case 'vidhog':
			url = uploadcUrl(url);
		break;

		case 'zalaa':
			url = uploadcUrl(url);
		break;
		
		case 'linksafe':
			var temp = showtime.httpGet('http://'+url).toString();
			if(temp.indexOf('multiupload.com:81') == -1)
				url = rapidshareUrl(temp);
			else
				url = temp.slice(temp.lastIndexOf('http://',temp.indexOf('multiupload.com:81'))+7,temp.indexOf('"',temp.indexOf('multiupload.com:81')));
			break;

		default:
			trace('Default: ' + website);
			break;
	}
	
	var title = 'test';
	//play
	if(url.indexOf("filename=")!= -1)
		title = getValue(url, 'filename=','&');
	else
		title = url.slice(url.lastIndexOf('/')+1, url.lastIndexOf('.'));

	if(!loggedIn && !fileSupport(url.slice(url.lastIndexOf('.'), url.length)) && url.indexOf('php?id=') == -1){
		page.error("File type not supported.");
		return;
	}
	if(url.indexOf('rtmp://')==-1)
		url = 'http://' + url;
		
	showtime.print('Playing: ' + url);
	page.source = "videoparams:" + showtime.JSONEncode({      
		title: title,     
		sources: [
		{	
			url: url,
			mode: 'streaming'  
		}]    
	});    
	page.type = "video";
});


 // Bookmarks
 
 
plugin.addURI( PREFIX + "bookmarks", function(page){
	
	page.type = "directory";
	page.contents = "items";
	page.metadata.logo = BOOKMARKS_IMG;
	page.metadata.title = 'Bookmarks';
	
	var temp = eval( '('+ bookmarks.list +')');
	for each (var item in temp)
		page.appendItem(PREFIX +"present:" + item.imdb +":"+  item.url, "video", item); 
	
	page.loading = false; 
});

/*
 * WebSites
 */


/*
 * Daily Divx 
 * Host: Rapidshare, 2Shrared , Uploadc
*/ 
plugin.addURI( PREFIX + "dailydivx:(.*)", function(page, category){
	page.type = "directory";
	page.contents = "list";
	page.metadata.logo = DAILY_DIVX;
	if(category != 'movies:0')
		category = 'TV Shows';
	else
		category = ' Movies';
	page.metadata.title = 'Most Recent '+ category;
	

	var content = showtime.httpGet('http://www.mrbrownee70.com/').toString();
	content = getValue(content, category +'<b','</td>');
	content = content.split('</p><p>');
	var title = '';
	for each (var item in content){
		if(category == ' Movies')
			title = getValue(item, '<b>','</b>') + ' <font color="#00ff00">' +getValue(item, ';">','</b>', 'end') + '</font>';
		else
			title = getValue(item, '<b>','</b>') + ' ' + getValue(item, ')','</a>') + ' <font color="#00ff00">' +getValue(item, ';">','</b>', 'end') + '</font>';
		page.appendItem( PREFIX + 'videos:'+getValue(item, 'href="http://','"')+':ND:ND:ND', "video", 
					{ title: new showtime.RichText(title)});

	}
/*	Not maintained by the site 
	page.appendItem( PREFIX + 'dailydivx:a-z', "directory", 
				{ title: 'A-Z'});
*/	
	page.loading = false; 
});
//TODO
plugin.addURI( PREFIX + "dailydivx:a-z:(.*)", function(page, category){
	page.type = "directory";
	page.contents = "list";
	page.metadata.logo = DAILY_DIVX;

	page.loading = false; 
});


/*
 * EZDowloadSite 
 * Host: megaupload, Movreel
*/ 

plugin.addURI( PREFIX + "ezdownloadsite:(.*)", function(page, indice){
	page.type = "directory";
	
	if(indice.indexOf('/tv-shows/')!=-1)
		page.contents = "list";
	else
		page.contents = "items";
		
	page.metadata.logo = EZDOWNLOAD_IMG;
	
	var content =  showtime.httpGet('http://ezdownloadsite.com/'+ indice).toString();
	var next = getValue(content, 'http://ezdownloadsite.com/', "' class='nextpostslink'>", 'endRef');
	content = getValue(content, '<div class="listings">', '<div class="wp-pagenavi">');
	content = content.split('<div class="listings">');
	
	for each (var post in content){
		if(getValue(post, '>','</a></h2>', 'endRef') !='')
		page.appendItem( PREFIX + "present:imdb:" +  getValue(post,'http://', '"'), "video", 
						{ title: getValue(post, '>','</a></h2>', 'endRef').replace(/\W/gi, ''),
							icon: getValue(post, 'img src="', '"') });
	}
		
	if(next != '')
		page.appendItem( PREFIX + "ezdownloadsite:" +  next, "directory", { title: "Next" });
	page.loading = false; 
});



//Episode7
plugin.addURI( PREFIX + "episode7", function(page){
	
	page.type = "directory";
	page.contents = "videos";
	page.metadata.logo = EPISODE7_IMG;
	page.metadata.title = 'Latest';

	var content = showtime.httpGet(EPISODE7 + 'feed/').toString();
	content = content.split('entry');
	
	for each(var link in content)
		if(link.indexOf('<author>')!=-1)
			page.appendItem( PREFIX + "present:ND:"+ getValue(link, '<id>','</id>').replace('http://',''), "directory", {
			    title:  getValue(link, '<![CDATA[', ']]>') });	
			    
	page.loading = false; 
});

plugin.addURI( PREFIX + "episode7:list:(.*)", function(page, show){
	
	page.type = "directory";
	page.contents = "videos";
	page.metadata.logo = EPISODE7_IMG;

	var content = showtime.httpGet(EPISODE7 + show).toString();
	//getInfo
	page.metadata.title = getValue(content, '<h1 class="cat">', '<');
	var data ={};
	data.icon = EPISODE7 + getValue(content, "background-image:url('/", "'");
	data.description = getValue(content, '<div id="sdesc">', '<');

	content = content.split('<li><a');
	
	for each(var link in content)
		if(link.indexOf('class="etitle"')!=-1)
			page.appendItem( PREFIX + "present:ND:"+ EPISODE7.replace('http://','') + getValue(link, 'href="/', '"'), "video", {
			    title:  getValue(link, 'class="etitle">', '<'),
			    icon: data.icon,
			    description: data.description 
			    });	
			    
	page.loading = false; 
});


/*
 * IMDd Video Gallery
*/ 
plugin.addURI( PREFIX + "imdblist:(.*)", function(page, imdb){
	
	page.type = "directory";
	page.contents = "list";
	
	var content = showtime.httpGet('http://www.imdb.com/title/'+imdb+'videogallery').toString();
	content = getValue(content, '<div id="main">', '<!--');
	content = content.split('</li>');
	
	for each (var item in content)
		if(getValue(item, 'alt="', '"') != '' && item.indexOf('/imdblink/')==-1)
				page.appendItem(PREFIX + 'videos:' +'www.imdb.com/video/' + getValue(item, 'href="/video/', '"') + ':ND:ND:ND', "video", {
					title: getValue(item, 'alt="', '-'),
					description: getValue(item, 'title="', '"'),
					icon: getValue(item, 'src="', '"')
					});
		
	page.loading = false; 
});

/*
 * IceFilms:
 *  - Recently Added, Latest Releases, Being Watched Now, Statistics
 *  - SubCategory
 *  -
 */
 
plugin.addURI( PREFIX + "icefilms:(.*)", function(page, category){
	page.type = "directory";
	page.contents = "videos";
	page.metadata.logo = ICEFILMS_IMG;
	
	//First Page
	var section = ['Recently Added', 'Latest Releases', 'Being Watched Now', 'Statistics'];
	var index = 0;
	var content=showtime.httpGet( ICEFILMS ).toString();
	var content_org = content;
	
	if( category == 'latest' )
		index = 1;
	
	if( category == 'being' )
		index = 2;	
	 
	page.metadata.title = section[index];
	
	  
	//Main
	var content = content.slice(content.indexOf('<h1>' + section[index] + '</h1>'),content.indexOf('<h1>' + section[index+1] + '</h1>'));
	content = cleanString(content);
	content = content.match(/href=(.+?)>(.+?)<\/a>/gi);
	
	for each (var link in content){
		page.appendItem( PREFIX + "present:icefilmGet:"+link.slice(link.indexOf('<a href=')+6,link.indexOf('>')), "directory", {
		    title: link.slice(link.indexOf('>')+1,link.indexOf('</a>')) });
	}
	
	//remaining Folders
	for (var j=0;j<(section.length-1);j++){
		if ( j != index)
			page.appendItem( PREFIX + "icefilms:" + section[j].slice(0,section[j].indexOf(' ')).toLowerCase() , "directory", {
				title: section[j],
				icon: ICEFILMS_IMG
			});		
	}
	
	content = content_org;
	content = content.slice(content.indexOf("<div class='menu indent'>"), content.indexOf("<a href=http://forum.icefilms.info>"));
	content = content.match(/href=(.+?)>(.+?)<\/a>/gi);
	
	for each (var link in content){
		page.appendItem( PREFIX + "icefilms:subcategory:select:"+link.slice(link.indexOf('<a href=')+6,link.indexOf('popular/1')), "directory", {
		    title: link.slice(link.indexOf('>')+1,link.indexOf('</a>')),
		    icon: ICEFILMS_IMG });
	}
	
	page.loading = false; 
});


plugin.addURI( PREFIX + "icefilms:subcategory:select:(.*)", function(page, link){
	page.type = "directory";
	page.contents = "videos";
	page.metadata.logo = ICEFILMS_IMG;

	var submenu = ['A-Z','Popular', 'Rating', 'Release', 'Added', 'Genres'];
	var genres = ['Action','Animation', 'Comedy', 'Documentary', 'Drama', 'Family', 'Horror', 'Romance', 'Sci-fi', 'Thriller'];
	
	if(link.indexOf('movies') == -1 && link.indexOf('tv') == -1)
		submenu = submenu.slice(1);
	
	if(link.indexOf('genres') != -1){
		link = link.replace('genres/','') + 'popular/';  
		submenu = genres;
	}
		
	for each (var option in submenu){
		if(option == 'Genres')
			link = 'select:' +link;
		if(option == 'A-Z')
			page.appendItem( PREFIX + "icefilms:a-z:"+ link + option.toLowerCase() + '/', "directory", {
			    title: option,
			    icon: ICEFILMS_IMG });
		else
			page.appendItem( PREFIX + "icefilms:subcategory:"+ link + option.toLowerCase() + '/', "directory", {
			    title: option,
			    icon: ICEFILMS_IMG });	  
	}
	
	page.loading = false; 
});


plugin.addURI( PREFIX + "icefilms:subcategory:(.*)", function(page, link){
	
	page.type = "directory";
	page.contents = "videos";
	page.metadata.logo = ICEFILMS_IMG;
	
	if( link.indexOf('a-z') == -1)
	    link += '1';
	    
	if(link.split('/').length >4 && link.indexOf('a-z') == -1)
	    link = link.slice(0,link.lastIndexOf('/'));
	
	
	link = link.replace('#',1);
	
	var content=showtime.httpGet( ICEFILMS + link ).toString();
	content = content.slice( content.indexOf('class="list">'), content.indexOf("</span>",content.indexOf('class="list">')));
	content = cleanString(content);
	content = content.match(/href=(.+?)>(.+?)<\/a>/gi);
	
	for each (var url in content){
		if(url.indexOf('ip.php') == -1)
			page.appendItem( PREFIX + "icefilms:list:"+url.slice(url.indexOf('<a href=')+6,url.indexOf('>')), "directory", {
			    title: url.slice(url.indexOf('>')+1,url.indexOf('</a>')) });
		else
			page.appendItem( PREFIX + "present:icefilmGet:"+url.slice(url.indexOf('<a href=')+6,url.indexOf('>')), "directory", {
			    title: url.slice(url.indexOf('>')+1,url.indexOf('</a>')) });
	}
	
	page.loading = false;
});


plugin.addURI( PREFIX + "icefilms:a-z:(.*)", function(page, link){
	
	page.type = "directory";
	page.contents = "videos";
	page.metadata.logo = ICEFILMS_IMG;
	var letter = ['#','A', "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V",  "W", "X", "Y", "Z" ];
	
	for each (var url in letter){
		page.appendItem( PREFIX + "icefilms:subcategory:" + link + url, "directory", {
		    title: url });
	}
	
	page.loading = false; 
});



plugin.addURI( PREFIX + "icefilms:list:(.*)", function(page, link){
	page.type = "directory";
	page.contents = "videos";
	page.metadata.logo = ICEFILMS_IMG;
	
	var content = showtime.httpGet( ICEFILMS +link).toString();
	content = cleanString(content);
	if(content.indexOf('<h1>') !=-1)
		page.metadata.title = content.slice(content.indexOf('<h1>')+4,content.indexOf('<a',content.indexOf('<h1>')));
	
	//list of episodes..
	
	content = content.slice( content.indexOf('class=list>'), content.indexOf("</span>",content.indexOf('class=list>')));
	if(content.indexOf('<a href=#>Top ▲</a>'))
		content = content.replace(/<a href=#>Top ▲<\/a>/gi,'');
	   
	content = content.match(/href=(.+?)>(.+?)<\/a>/gi);
	   
	for each (var url in content){
		page.appendItem( PREFIX + "present:icefilmGet:"+url.slice(url.indexOf('<a href=')+6,url.indexOf('>')), "directory", {
		    title: url.slice(url.indexOf('>')+1,url.indexOf('</a>')) });
	}
	   	
	page.loading = false; 
});


/*
 * NewMuVideoLinks 
 * Host: megaupload,
 * info: IMDB
 * Next: Present
*/ 

plugin.addURI( PREFIX + "newmuvideolinks:(.*)", function(page, indice){
	page.type = "directory";
	page.contents = "items";
	page.metadata.logo = NEWMULINKS_IMG;
	
	var content =  showtime.httpGet('http://newmyvideolinks.com/'+ indice).toString();
	var next = getValue(content, 'http://newmyvideolinks.com/', "' class='nextpostslink'>", 'endRef');
	content = getValue(content, '<div class="listings">', '<div class="wp-pagenavi">');
	content = content.split('<div class="listings">');
	var uri = '';
	for each (var post in content){
		if(getValue(post, '>','</a></h2>', 'endRef') !='')
			uri = getValue(post, "imdb.com/title/",'"').replace(/\W/gi,'');
			if(uri=='')
				uri = 'videos:'+getValue(post,'http://', '"')+':ND:ND:ND';
			else
				uri = "present:"+uri+":" +  getValue(post,'http://', '"');
			page.appendItem( PREFIX + uri, "video", 
							{ title: getValue(post, '>','</a></h2>', 'endRef').replace(/\W/gi, ''),
								icon: getValue(post, 'img src="', '"') });
	}
		
	if(next != '')
		page.appendItem( PREFIX + "newmuvideolinks:" +  next, "directory", { title: "Next" });
	page.loading = false; 
});


/*
 * OneClickMovieZ 
 * Host: megaupload, multiupload, UPLOADHERE
 */

plugin.addURI( PREFIX + "oneclick:(.*)", function(page, indice){
	page.type = "directory";
	page.contents = "items";
	page.metadata.logo = ONECLICK_IMG;
	page.metadata.title = 'OneClickMovieZ';
	
	var content =  showtime.httpGet('http://oneclickmoviez.com/'+ indice).toString();
	var next = getValue(content, 'http://oneclickmoviez.com/', '" >&laquo; Previous', 'endRef');
	content = getValue(content, '<div class="post"', '<div class="sidebar">');
	content = content.split('<div class="postmetadata">');
	var uri = '';
	for each (var post in content){
		if(getValue(post, '>','</a></h2>', 'endRef') !=''){
			uri = getValue(post,'IMDB/','"');
			if(uri==''){
				var url_temp= showtime.httpGet('http://oneclickmoviez.com/dwnl/MEGAUPLOAD/'+getValue(content,'MEGAUPLOAD/','"')).toString();
				uri = 'videos:'+rapidshareLink(url_temp).replace('<b>RS</b>','')+':ND:ND:ND';
			}else{
				uri = "present:oneclickmoviez.com/dwnl/IMDB/" + getValue(post,'IMDB/','"') +
						':' + getValue(post,'<h2><a href="http://','"');
			}
			page.appendItem( PREFIX + uri, "video", 
							{ title: getValue(post, '>','</a></h2>', 'endRef'),
								icon: getValue(post, 'title="poster" src="', '"') });
			}
	}
		
	if(next != '')
		page.appendItem( PREFIX + "oneclick:" +  next, "directory", { title: "Next" });
	page.loading = false; 
});

/*
 * OneLinkMovie
 */

plugin.addURI( PREFIX + "onelinkmovie:(.*)", function(page, indice){
	page.type = "directory";
	page.contents = "items";
	page.metadata.title = 'One Link Movie';
	
	var content =  showtime.httpGet(ONELINKMOVIE+ indice).toString();
	var next = getValue(content, "href='http://onelinkmovie.com", "' class='nextpostslink'>", 'endRef');
	content = getValue(content, '<div class="post">', '<div id="sidebar">');
	content = content.split('<div class="post">');
	var uri = '';
	for each (var post in content){

		if(getValue(post, 'rel="bookmark">','<') !=''){
			uri = imdbLink(post);
			if(uri=='')
				uri = 'videos:'+movreelLink(post).replace('<b>MR</b>','')+':ND:ND:ND';
			else
				uri = "present:"+uri+":" +  getValue(post,'http://', '"');
			page.appendItem( PREFIX + uri, "video", 
							{ title: getValue(post, 'rel="bookmark">','</'),
								icon: getValue(post, 'src="', '"') });
			}
	}
		
	if(next != '')
		page.appendItem( PREFIX + "onelinkmovie:" +  next, "directory", { title: "Next" });
	page.loading = false; 
});


/*
 * OneDDL 
 */

plugin.addURI( PREFIX + "oneddl:(.*):(.*)", function(page, category, indice){
	page.type = "directory";
	page.contents = "videos";
	page.metadata.logo = ONEDDL_IMG;
	page.metadata.title = category;
	
	if(category == 'television')
		category = 'tv-shows';

	if(indice == 1)
		indice = 2;
	
	if(category.indexOf('www')!=-1)
		var content = showtime.httpGet("http://" + category + "/page/" + indice + "/").toString();	
	else		
		var content = showtime.httpGet("http://www.oneddl.com/category/" + category + "/page/" + indice + "/").toString();
	
	if(content.indexOf('>»<') != -1)
		var next = true;
		
	content = getValue(content, '<div class="article-inside">', '<!-- #nav-below -->');
	content = cleanString(content);
	var posts = content.split('<!-- .entry-content -->');
	
	var metadata = {};
	
	for each (var post in posts){
	
		if(post.indexOf('<h1 class="entry-title">') != -1){   
			metadata.link = getValue(post, '<h1 class="entry-title"><a href="http://', '"');
			metadata.title =  getValue(post, 'rel="bookmark">', '<');
			metadata.icon = getValue(post, '<p align="center"><img src="', '"');
			if(post.indexOf('<p><infoimg /></p>')!=-1)
				metadata.description = new showtime.RichText(getValue(post, '<p><infoimg /></p>', '<a href'));
				
			if(category == 'movies' && post.indexOf('imdb.com/title/') != -1)
				metadata.imdb = getValue(post, 'imdb.com/title/', '>').replace('>','').replace('"','').replace("'",'').replace("/",'');
			else
				metadata.imdb = 'ND';
		
			trace("present:" + metadata.imdb +":"+  metadata.link);
			page.appendItem( PREFIX + "present:" + metadata.imdb +":"+  metadata.link, "video", metadata);
			metadata = {};
			
		}
	}
	//older
	if(next)
		page.appendItem( PREFIX + "oneddl:" +  category + ":" + (parseFloat(indice)+1).toString(), "directory", { title: "Next" });
	
	page.loading = false; 
});


/*
 * Seriadosdetv 
 */
plugin.addURI( PREFIX + "seriadosdetv:(.*)", function(page, category){
	page.type = "directory";
	page.contents = "items";
	page.metadata.logo = SERIADOSDETV_IMG;
	
	var content = showtime.httpGet('http://www.seriadosdetv.net/'+ category).toString();
	var next = getValue(content, ".net/", "' id='Blog1_blog-pager-older-link", 'endRef');
	
	content = getValue(content, "<div class='post-labels'>", "' id='Blog1_blog-pager-older-link'");
	content = content.split("<div class='post-labels'>");
	
	for each (var item in content)
		page.appendItem( PREFIX + "seriadosdetv:links:" +  getValue(item, 'http://www.seriadosdetv.net/', '.html', 'endRef')+'.html', "video", 
		{ title: getValue(item, "title='","'").replace('Download',''), icon: getValue(item, 'src="', '"') });		

	if(next != '')
		page.appendItem( PREFIX + "seriadosdetv:" +  next, "directory", { title: "Next" });	
	page.loading = false; 
});


plugin.addURI( PREFIX + "seriadosdetv:links:(.*)", function(page, link){
	page.type = "directory";
	page.contents = "list";
	page.metadata.logo = SERIADOSDETV_IMG;
	
	var content = showtime.httpGet('http://www.seriadosdetv.net/'+link).toString();
	page.metadata.title = getValue(content, '<title>', '|').replace('Download', '');
	
	content = getValue(content, "<a name='more'></a><br />", "<div class='post-footer'>");
	content = content.split("<hr");
	for each (var item in content)
		if(item.indexOf('Parte') ==-1 && rapidshareLink(item) != '')
			page.appendItem( PREFIX + "videos:" + rapidshareLink(item).replace('<b>RS</b>','') +':ND:ND:ND',
			 "video",{ title: getValue(item, '"><b>Download',"<") });		
	
	
	page.loading = false; 
});


/*
 * Functions 
 * 	-episode7
 *  -iceFilms
 *  -information retrieval 
 *  -Misc
 * 
 */

//episode7
function episodeSevenGetInfo(content){
	var movie = {} ;
	var tmp = '';
	movie.title = getValue(content, '<strong>', '</strong>');	
	movie.plot = getValue(content, '<li><h2 id="s_e">', '</li></ul></div>').replace(/<\/li>/gi, '\n');
	tmp = getValue(content, "background-image:url('", ');">','start',0, -1);
	if(tmp != '')
		movie.icon = EPISODE7 +  tmp;
	return movie;
}


function episodeSevenGetUrl(content){
	var url='';
	content = content.slice('<div id="wnd">');
	content = content.split('href="http://');
	
	for each (var link in content){
		
		if(link.indexOf('megaupload.com/?')!=-1)
			url += getValue(link, 'megaupload.com/?d', '">','start','all')+ '<b>MU</b>';
		
		if(link.indexOf('rapidshare.com/')!=-1)
			url += getValue(link, 'rapidshare.com/', '">','start', 'all') + '<b>RS</b>';
	}
	return url;
}

/*
 * ezdownloadsite
 */
function ezdownloadGetInfo(content){
	var movie = {} ;
	content = cleanString(content);
	content = getValue(content, '<div class="listings">', 'DOWNLOAD:');
	movie.Title = getValue(content, '>', '</h1>', 'endRef').replace(/\W/gi,' ');	
	movie.plot = getValue(content, '<strong>', '<table').replace(/<\/li>/gi, '\n');
	movie.Episode = getValue(content, 'Episode number:', '<');
	movie.Aired = getValue(content, 'Airdate:', '<');
	movie.icon = getValue(content, 'img src="', '"');
	if(movie.icon == '')
		delete movie.icon;
	return movie;
}

function megauploadLink(content){
	var url = '';
	content = content.match(/www\.megaupload\.com\/\?d=[A-Za-z0-9\s]*\"/gi);
	for each (var link in content)
		if(url.indexOf(link.replace(/\"/gi,'')) ==-1)
			url += link.replace(/\"/gi,'') + '<b>MU</b>';
	return url;
}

function movreelLink(content){
	var url = '';
	content = content.match(/movreel\.com\/[A-Za-z0-9]*/gi);
	for each (var link in content)
		if(url.indexOf(link.replace(/\"/gi,'')) ==-1 && link.indexOf('movreel.com/free69') ==-1)
			url += link.replace(/\"/gi,'') + '<b>MR</b>';
	trace('Links: ' + url);
	return url;
}


function multiuploaddLink(content){
	var url = '';
	content = content.match(/wwww\.multiupload(.*?)\"/gi);
	for each (var link in content)
		if(url.indexOf(link.replace(/\"/gi,'')) ==-1)
			url += link.replace(/\"/gi,'') + '<b>MULTI</b>';
	return url;
}

function rapidshareLink(content){
	var url = '';
	content = content.match(/rapidshare\.com(.*?)\"/gi);
	for each (var link in content)
		if(url.indexOf(link.replace(/\"/gi,'')) ==-1)
			url += link.replace(/\"/gi,'') + '<b>RS</b>';
	return url;
}


function imdbLink(content){
	content = content.match(/imdb\.com\/title\/tt[A-Za-z0-9\s]*/gi);
	if(content != null)
		return content[0].toString();
	else
		return '';
}


function oneclickmoviezLinks(content){
	var url_temp =  getValue(content,'RAPIDSHARE/','"')
	var url= '';
	if(url_temp != ''){
		url_temp = showtime.httpGet('http://oneclickmoviez.com/dwnl/RAPIDSHARE/'+url_temp).toString();
		url += getValue(url_temp,'URL=http://','"')+'<b>RS</b>';
	}
	url_temp =  getValue(content,'2SHARED/','"')
	if(url_temp != ''){
		url_temp = showtime.httpGet('http://oneclickmoviez.com/dwnl/2SHARED/'+url_temp).toString();
		url += getValue(url_temp,'URL=http://','"')+'<b>2S</b>';
	}
	
	trace('oneclickmoviez URL: ' +url);
	return url;
}

//icefilms

function icefilmsGet(link){
	var data = {};
		
	var rdefaults={
		'Host': 'www.icefilms.info',
		'Referer': 'http://www.icefilms.info',
		'User-Agent': USER_AGENT
	}
	
	var content = showtime.httpGet( ICEFILMS +link).toString();
	if(content.indexOf('<h1>') !=-1)
		data.title = content.slice(content.indexOf('<h1>')+4,content.indexOf('<a',content.indexOf('<h1>')));
	
	if(content.indexOf('imdb.com') != -1)
		data.imdb = content.slice(content.indexOf('imdb.com/title/')+15,content.indexOf('imdb.com/title/')+24);
	
	if(content.indexOf('Episodes</a>') !=-1)
		data.list = content.slice(content.lastIndexOf('<a href=',content.indexOf('Episodes</a>'))+8,content.lastIndexOf('>',content.indexOf('Episodes</a>')));
	content = content.slice(content.indexOf('id="videoframe" src="')+21,content.indexOf('&img=" w')+5);   
	content = showtime.httpGet('http://www.icefilms.info'+content);//, null, rdefaults);
	var aux= 0;
	
	var cookie = getCookie(content.headers);
	
	aux= 0;
	content = content.toString();
	var t  = content.slice(content.indexOf("&t=")+3,content.indexOf('"',content.indexOf("&t=")));
	var sec = content.slice(content.indexOf('lastChild.value="')+17,content.indexOf('"',content.indexOf('lastChild.value="')+20));
	
	data.t =t;
	data.sec =sec;
	
	//quality
	var sources = [];
	if(content.indexOf('<b>DVDRip / Standard Def</b>') != -1)
		sources = sources.concat(icefilmsSources(content.slice(content.indexOf('<b>DVDRip / Standard Def</b>'),content.indexOf('<p></div>',content.indexOf('<b>DVDRip / Standard Def</b>'))), 'DVDRip'));
	
	if(content.indexOf('<b>HD 720p</b>') != -1)
		sources = sources.concat(icefilmsSources(content.slice(content.indexOf('<b>HD 720p</b>'),content.indexOf('<p></div>',content.indexOf('<b>HD 720p</b>'))), 'HD'));
	
	if(content.indexOf('<b>DVD Screener</b>') != -1)
		sources = sources.concat(icefilmsSources(content.slice(content.indexOf('<b>DVD Screener</b>'),content.indexOf('<p></div>',content.indexOf('<b>DVD Screener</b>'))), 'DVD Screener'));
	
	if(content.indexOf('<b>R5/R6 DVDRip</b>') != -1)
		sources = sources.concat(icefilmsSources(content.slice(content.indexOf('<b>R5/R6 DVDRip</b>'),content.indexOf('<p></div>',content.indexOf('<b>R5/R6 DVDRip</b>'))), 'R5/R6'));
	
	data.url = '';
	for each (var source in sources)
		data.url += source.id + '<b>' + source.title + '</b>';
	
	data.cookie = cookie;
	return data;
}

 
/*
 * newmyvideolinks:
 *  -GetURL
 * same as ez
 */



/*
 * OneDDL:
 *  -GetInfo
 *  -GetURL
 */

function oneddlGetInfo(link) {
	var title;
	var metadata= {};
	link = getValue(link, '<div class="article-inside">', '</div><!-- .entry-content -->');
	link = cleanString(link);
	title = getValue(link, '<h1 class="entry-title">', '<'); 
	var index = title.search(/[0-99]E[0-99]/i);
	if(service.tvrage == "1"){
		if(index !=-1){
			metadata = tvRagetInfo(title.slice(0,index-3), title.slice(index-1,index+4).replace(/E/i,'x'));
		}else{
			index = title.search(/[0-99]x[0-99]/i);
			metadata = tvRagetInfo(title.slice(0,index-1), title.slice(index,index+4));
		}
	}	
	metadata.Title = title; 	
	metadata.icon = getValue(link, '<p align="center"><img src="', '"');
	metadata.plot = getValue(link, '<p><strong>', '</p>'); 
	return metadata;
}

function oneddlGetUrl(content) {
	content = getValue(content, '<div class="entry-content">', '</div><!-- .entry-content -->');
	
	var hosts = [content.match(/<strong>MultiUpload<\/strong>/gi), content.match(/<strong>Rapidshare<\/strong>/gi)];
	if( hosts[0]== null && hosts[1] == null)
		return 'Multiple files, not supported at the moment.';
	var url = '';
	var url_tmp = '';
	var host_name ='';
	for each (var host in hosts){
		if(host != null){
			if(host[0].indexOf('share')!=-1)
				host_name ='(RS)';
			else
				host_name = '(MULTI)';
			trace('host: ' + host.toString());
			for(var j=0;j<host.length;j++){
				var temp = getValue(content, host[j], '<strong>');
				url_tmp = getValue(temp, '<a href="http://','"');
				var match = temp.match(/<a href=/gi);
				if(match != null)
					match = match.length;
				else
					match=0;
				if(url_tmp != '' &&  match>1){
					for(var h=1;h<match+1;h++){
						if(url_tmp != '')
							url += url_tmp + '<b>' + j + ' CD'+ h + host_name + '</b>';
						temp = temp.replace('<a href="http://','');
						url_tmp = getValue(temp, '<a href="http://','"');
					}
				}else{
					if(url_tmp != '')
						url += url_tmp + '<b>' + j + host_name + '</b>'; 						
				}
				content = content.replace(host[j],''); //+temp
			}
		}
	}
	if(url.indexOf('>0') !=-1 && url.indexOf('>1') !=-1)
		url = url.replace(/>0/gi,'>XviD ').replace(/>1/gi,'>x264 ');
	return url;
}


/*
 * Information:
 * 	-IMDb
 *  -TMDb
 *  -TVRage 
 */

//IMDb
function imdbInfo(id) {

	trace('TMDb: '+id);
		
	try{
		var info = eval(('(' + showtime.httpGet("http://www.imdbapi.com/?i=" + id + "&r=json&plot=full") + ')'));
	}catch(err){
		trace('IMDb info: '+err);
		if(service.tmdb == "0")
			return tmdbInfo(id);
		else
			return {plot: "Error obtaining information\nIMDb API error: " + err};
	}
	if(info.Response == "Parse Error")
		info = eval(('(' + showtime.httpGet("http://www.imdbapi.com/?i=" + id + "&r=json&t=") + ')'));
		
	if(info.Response == "Parse Error")
		return {plot: "Error obtaining information"}; 

		
	var metadata = {
	      Title: info.Title,
	      plot: info.Plot,
	      icon: info.Poster,
	      Duration: info.Runtime,
	      Year: info.Year,
	      Genre: info.Genre,
	      Actors: info.Actors,
	      Director: info.Director,
	      rating: parseFloat(info.Rating) / 10 ,
	      Released: info.Released,
	      Writer: info.Writer,
	      Rated: info.Rated
	     };
	return metadata;
}

function movieInfo(imdb){
	if(imdb.indexOf('.com') !=-1){
		var link = 'http://'+ imdb;
		var id = 'tt'+imdb.slice(imdb.indexOf('tt'), imdb.length).replace('/','');
	}else{
		var id = imdb;
		var link = 'http://www.imdb.com/title/'+imdb;
	}
	
	if(id == '')
		return {};
		
	trace('movieInfo imdb: ' + link );

	switch(service.movieinfo){
		case '1': 
			var movie = imdbGet(link);
		break;
		
		case '2': 
			var movie = tmdbInfo(id);
		break;
		
		case '3':
			var movie = imdbInfo(id);
		break;
		
		default:
			showtime.print('Error selecting movie info source!');
			var movie = {};
			break;
	}	
	return movie;
}
function imdbGet(id){
	var information = [	
		{'arg': 'Title', 'regexB': 'title" content="', 'regexE': '"'},
		{'arg': 'AKA', 'regexB': 'Also Known As:</h4>', 'regexE': '<'},
		{'arg': 'Budget', 'regexB': 'Budget:</h4>', 'regexE': '('},
		{'arg': 'Actors', 'regexB': '<h4 class="inline">Stars:</h4>', 'regexE': '</div>', 'regex': /.>(.*?)<\/a>/g},
		{'arg': 'ActorsAll', 'regexB': '<table class="cast_list">', 'regexE': '<div class="see-more">', 'regex': /<td class=\"name\">\s+<a\s+href=\"\/name\/nm\d+\/\">(.*?)<\/a>\s+<\/td/gi}, 
		{'arg': 'Color', 'regexB': '<a href="/search/title\?colors=', 'regexE': '</a', 'regex': /.*">(.*)/g},
		{'arg': 'Country', 'regexB': '<h4 class="inline">Country:</h4>', 'regexE': '</div>', 'regex': /\" \s*>(.*?)<\/a>/g},
		{'arg': 'Creator', 'regexB': 'Creator', 'regexE': '</div'},
		{'arg': 'Director', 'regexB': 'Director:', 'regexE': '</div>', 'regex': /\".*?>(.*?)<\/a>/g },
		{'arg': 'Genre', 'regexB': '<h4 class="inline">Genres:</h4>', 'regexE': '</div>', 'regex': /itemprop=\"genre\"\s*>(.*?)<\/a>/gi },	
		{'arg': 'Language', 'regexB': '<h4 class="inline">Language:</h4>', 'regexE': '</div>', 'regex': /"inLanguage".*?>(.*?)<\/a>/g},
		{'arg': 'Keywords', 'regexB': '<h4 class="inline">Plot Keywords:</h4>', 'regexE': '</div>', 'regex': /\".*?>(.*?)<\/a>/g},
		{'arg': 'Location', 'regexB': '<a href="/search/title?locations=', 'regexE': '<', 'regex': /.*">(.*)/g},
		{'arg': 'Rated', 'regexB': '<span itemprop="contentRating">', 'regexE': '<'},
		{'arg': 'plot', 'regexB': '<h2>Storyline</h2>', 'regexE': '<span'},
		{'arg': 'icon', 'regexB': 'href="/media/', 'regexE': 'style=', 'regex': /.*src="(.*)"/g},
		{'arg': 'rating', 'regexB': 'itemprop="ratingValue">', 'regexE': '<'},
		{'arg': 'Released', 'regexB': 'itemprop="datePublished" datetime="', 'regexE': '"'},
		{'arg': 'Duration', 'regexB': 'itemprop="duration" datetime="', 'regexE': '<','regex': /.*">(.*)/g},
		{'arg': 'Studios', 'regexB': '<h4 class="inline">Production Co:</h4>', 'regexE': '<span', 'regex': /href="\/company\/co.*?([\s\w]*)<\/a>/g},						
		{'arg': 'TagLine', 'regexB': '<h4 class="inline">Taglines:</h4>', 'regexE': '<'},
		{'arg': 'Trailer', 'regexB': 'href="/video/', 'regexE': '"'},
		{'arg': 'trailers', 'regexB': 'data-vc="', 'regexE': '"'},
		{'arg': 'Votes', 'regexB': '<span itemprop="ratingCount">', 'regexE': '<'},
		{'arg': 'Writer', 'regexB': 'Writer', 'regexE': '</div>', 'regex': /href=\"\/name\/nm.*?([\s\w]*)<\/a/g }, 				
		{'arg': 'Year', 'regexB': '<a href="/year/', 'regexE': '</a>', 'regex':  /.*">(.*)/g}
		];
						
	var content = cleanString(showtime.httpGet(id).toString()); 
	
	var movie = {};
	var aux = null;
	for each (var test in information){
		aux = getValue(content, test.regexB, test.regexE);
		if(aux != '')
			if(test.regex){
			    aux = aux.replace(/\n/g ,'').match(test.regex);
				movie[test.arg] = '';
				for each (var auxx in aux){
					if(movie[test.arg] != '')
						movie[test.arg]+=', ';
					movie[test.arg]+=auxx.toString().replace(test.regex, "$1");
				}
			}else{
				movie[test.arg]= aux.replace(/\n/g ,'');
			}
	}
	if(movie.rating)
		movie.rating = parseFloat(movie.rating) / 10
	if(service.debug == '1'){
		trace('IMDb Link: ' + id);
		for each (var element in information){
		try{
			trace(element.arg + ': ' + eval('movie.'+element.arg) );
		}catch(err){ continue;}
		}
	}
	return movie;
}

//TMDb
function tmdbInfo(id) {
	
	//showtime API key 
	var apikey = "d0fd11e3f0bf829c781c3c6c017e8662";
	var info = showtime.httpGet("http://api.themoviedb.org/2.1/Movie.imdbLookup/en/json/" + apikey + "/" + id).toString();
	
	if(info == '["Nothing found."]')
		if(service.tmdb == "1")
			return imdbInfo(id);
		else
			return {plot: "Error obtaining information"}; 

	info = eval( '(' + info.slice(1, info.length - 1) + ')' );	
	
	if(!info.id)
		if(service.tmdb == "1")
			return imdbInfo(id);
		else
			return {plot: "Error obtaining information"}; 
		
	info = showtime.httpGet("http://api.themoviedb.org/2.1/Movie.getInfo/en/json/" + apikey + "/" + info.id).toString();
	info = eval( '(' + info.slice(1, info.length - 1) + ')');

				
	var metadata = {
		Title: info.name,
		plot: info.overview,
	    rating: info.rating / 10,
	    Rated: info.certification,
	    Genre: mergeJSONS(info.genres, null, null),
	    Actors: mergeJSONS(info.cast, "job", "Actor"),
	    Director: mergeJSONS(info.cast, "job", "Director"),
	    Writer: mergeJSONS(info.cast, "job", "Writer"),
	    Studios: mergeJSONS(info.studios, null, null),
	    Country: mergeJSONS(info.countries, null, null),
	    Released: info.released
		};
		
	if(info.posters[0])
		metadata.icon = info.posters[0].image.url;
	if(info.runtime)
		metadata.Duration = info.runtime + " minutes";
	    
	return metadata;
}

//TVRage
function tvRagetInfo(show, episode) {
	
	var metadata= {};
	show = 'http://services.tvrage.com/feeds/episodeinfo.php?show=+'+ show.replace(/\./g,'%20')+'&exact=1&ep='+episode;
	
	try{
		show = showtime.httpGet(show).toString();
	}catch(err){
		showtime.print('TV Rage connection timeout');
		metadata.error = 1;
	}
	
	if(metadata.error)
		return {};
	if(show.search('No Show Results Were Found For')==-1)
		return metadata;
	
	show = new XML(show);
	metadata.Episode = show.episode.title;
	metadata.Number = show.episode.number;
	metadata.Aired = show.episode.airdate;
	metadata.Genre = merge(show.genres.genre);
	metadata.Country = show.country;
	metadata.Duration = show.runtime;	
	return metadata;
}

/*
 * File Hosters:
 *  -MegaUpload
 *  -RapidShare
 *  -MultiUpload
 * 
 */

function rapidshareUrl(url){
	trace('RapidShare: ' +url);
	if (url.indexOf("#!download")==-1){
		var fileId = url.slice(url.indexOf('files/')+6, url.indexOf('/',url.indexOf('files/')+10));
		var fileName =url.slice( url.indexOf('/',url.indexOf(fileId)+1)+1, url.lastIndexOf(".")+4);
	}else{
		url = url.slice("#!download");
		url = url.split('|');
		var fileId = url[2];
		var fileName = url[3];
	}
	url = showtime.httpGet('https://api.rapidshare.com/cgi-bin/rsapi.cgi?sub=download&fileid='+fileId+'&filename='+fileName, null,
		{"User-Agent": USER_AGENT,  "Accept": "text/xml"}).toString();
	trace('rapidshare: ' + url);
	url = url.split(",");
	if(url[2] != 0)
		wait(parseInt(url[2]));
		
	url = url[0].replace('DL:','')+"/cgi-bin/rsapi.cgi?sub=download&fileid="+fileId+"&filename="+fileName+"&dlauth="+url[1]	
	if(url.indexOf('This file is marked as illegal') ==-1 && url.indexOf('File not found') ==-1)
		return url;
	else
		return 'This file is marked as illegal or Deleted';
}

function uploadcUrl(url){
	var temp = '';
	url = showtime.httpGet('http://' + url).toString();
	
	temp = getValue(url, "<script type='text/javascript'>eval", ')))', 'end');
	if(temp == ''){
		temp = showtime.httpGet('http://www.uploadc.com/embed-'+getValue(url, 'name="id" value="', '"')+ '.html').toString();
		temp = getValue(url, "<script type='text/javascript'>eval", ')))', 'end');
	}
	temp = temp.replace('document', 'url').replace('write', 'concat') +')))';
	url = '';
	temp = eval(temp);
	temp = getValue(temp, 'src="http://', '"');
	trace(temp);
	return temp;
	
	trace('UploadC URL: ' +url);
	return url;
}

function mrbrowneeUrl(url){
	url = showtime.httpGet('http://'+url).toString();
	url = getValue(url, '<table ALIGN="CENTER"', '</iframe>');
	url = getValue(url,'src="http://','"').replace('www.mrbrownee70.com/pre.php?uri=','').replace('http://','').replace('https://','');

	trace('Daily Divx url: ' +url);
	return url;	
}


//MISC

function trace(msg){
	if(service.debug == '1')
		showtime.trace(PREFIX + msg );
}

function domain(url){
	if(url.indexOf('www')!=-1){
		var website = url.slice(url.indexOf("www.")+4, url.indexOf(".",url.indexOf("www.")+6));
	}else{
		var website = url.slice(0, url.indexOf("."));
		//url = 'www.' + url;
	}
	return website;
}

function cleanString(string) {
	for each(var charr in CHAR_LIST)
		string = string.replace(charr[0], charr[1]);

	return string;
}

function fileSupport(string) {
	if(string.indexOf('rtmp://'))
		return true;
	for (var i=0;i<FILE_TYPE.length;i++){
		if(string.search(FILE_TYPE[i]) !=-1){
			return true;
			}
		}
	showtime.print('File not Supported: ' +string);
	return false;
}

function getValue(text, start_string, end_string, start, start_offset , end_offset)
{

	if(start == null)
		start = 'start';
		
	if(start_offset == null)
		start_offset = 0;		
	if(start_offset == 'all')
		start_offset = -start_string.length;
	
	if(end_offset == null)
		end_offset = 0;
	
	switch(start){
		case 'start':
			if (text.indexOf(start_string)!=-1 && 
				text.indexOf(end_string, text.indexOf(start_string) + start_string.length)!=-1) {
				var begin_temp = text.indexOf(start_string) + start_string.toString().length + start_offset;
				var end_temp = text.indexOf(end_string, begin_temp) + end_offset;				
				return text.slice(begin_temp, end_temp);
			}
			break;
		
		case 'end':
			if (text.indexOf(start_string)!=-1 && 
				text.indexOf(end_string, text.lastIndexOf(start_string) + start_string.length)!=-1) {
				var begin_temp = text.lastIndexOf(start_string) + start_string.length + start_offset;
				var end_temp = text.indexOf(end_string, begin_temp) + end_offset;				
				return text.slice(begin_temp, end_temp);
			}
			break;
			
		case 'endRef':
				if (text.indexOf(start_string)!=-1 && 
					text.indexOf(end_string)!=-1) {
					var end_temp = text.lastIndexOf(end_string) -1 + end_offset;				
					var begin_temp = text.lastIndexOf(start_string, end_temp) + start_string.length + start_offset;
					return text.slice(begin_temp, end_temp +1);
				}
				break;
		
		default:
			break;	
	}
	trace('Get Value error!');
	return '';
}

function merge(list) {
	var prefix = "";
	var r = "";
	for each (v in list) {
		r += prefix + v;
		prefix = ", ";
	}
	return r;
}

function mergeJSONS(list, condition, filter) {
	var prefix = "";
	var r = "";
	for each (v in list) {
		if(condition == null){
			r += prefix + v.name;
			prefix = ", ";
		}else{
			if(eval("v."+condition) == filter){
				r += prefix + v.name;
				prefix = ", ";
			}
		}
	}	
	return r;
}

function print(content){
	var nbr = 600;
	while(content.length> nbr){
		content = content.slice(nbr);
		showtime.trace(content);
	}
}

function randomFromTo(from, to){
	return Math.floor(Math.random() * (to - from + 1) + from);
}

function wait(time) {
	showtime.print('Loading video.');
	for (var j=0;j<time;j++){
		showtime.print('waiting '+(time-j)+' secs');
		showtime.sleep(1000);
	}
}
 

//BookMarks

function mark(url,  imdb, title, icon){
	this.url = url;
	this.imdb = imdb;
	this.title = title;
	this.icon = icon;
}

function bookmark(url,  imdb, title, icon){

	var temp = eval( '('+ bookmarks.list +')');
	temp.push(new mark(url,  imdb, title, icon));
	bookmarks.list = showtime.JSONEncode(temp);
}

function bookmark_remove(title){
	
	var start = bookmarks.list.lastIndexOf('{',bookmarks.list.indexOf(title));
	var offSet = 1;
	if(start<2)
		offSet=0;
	bookmarks.list = bookmarks.list.slice(0,start-offSet) + bookmarks.list.slice(bookmarks.list.indexOf('}',bookmarks.list.indexOf(title))+2-offSet,bookmarks.list.length);
	if(bookmarks.list.indexOf(']') ==-1)
		bookmarks.list= '[]';
}
function bookmarked(title){
	
	if(bookmarks.list.indexOf(title) !=-1)
		return true;
	else
		return false; 

}

function bookmark_title(title, url){
	//unique ID
	if(title == null || title == 'ND'){
		if(url.indexOf('episode7') != -1){
			title = url.replace('episode7.com/shows/','').replace('/',' ').replace(/_/gi,' ');
		}else{
			title = url.slice(0, url.length-1);
			title = title.slice(title.lastIndexOf('/')+1, title.length).replace(/-/gi,' ').replace(/_/gi,' ');
		}
	}
	return title;
}


function getCookie(headers){
/*	
   for (var item in headers)
		if(item == 'Set-Cookie')
			return headers[item];
*/
	if(headers['Set-Cookie'])
		return headers['Set-Cookie'].slice(0,headers['Set-Cookie'].indexOf(';'));
			
	return 'cookie not found';
}


function retriveTrailers(clips){
		
	//clean clips
	if(clips.indexOf('*') !=-1)
		clips = clips.replace(/<b>\*\*<\/b>/gi,'');
	
	var url = '';
	var quality = [/<\/a> SD/gi, />480P/gi, />720P/gi, />1080/gi, /<b>/gi];
	var count = [ 0 , 0 , 0 , 0 ];
 	
 	for (var j=0;j<5;j++){
		if(clips.match(quality[j]) != null)
		count[j]= clips.match(quality[j]).length;
	} 


	//New Style	
	if(service.fullhd == "1" && count [3] == count[4] )
		url = filterTrailers(clips, count[4], quality[3].toString().replace('/','"').replace('/gi',''));

	if(url == '' && service.hd == "1" && count [2] == count[4] )
		url = filterTrailers(clips, count[4], quality[2].toString().replace('/','"').replace('/gi',''));
	
	if(url == '' && count [1] == count[4])
		url = filterTrailers(clips, count[4], quality[1].toString().replace('/','"').replace('/gi',''));
	
	//SD FIX + Excepcoes
	if(url == '' && count [0] > 0)
		url = filterTrailers(clips, 0, quality[0].toString().replace('/','').replace('/gi','').replace('\\',''));
		
	//last try
	if(url == '')
		url = filterTrailers(clips, 0, 'old');
	
	if(url == '')
		trace('\nParsing error in: ' + clips+'\n')

	return url.replace('<b></b>','');
}

function filterTrailers(clips, nbr, quality){
	
	var url = '';
	for (var j=1;j<parseInt(nbr)+1;j++){
		url += clips.slice(clips.lastIndexOf('http://',clips.indexOf(quality))+7,clips.indexOf(quality)) + "<b>" + clips.slice(clips.lastIndexOf('<b>',clips.indexOf(quality))+3,clips.indexOf('</b>')) + "</b>";
		clips = clips.slice(clips.indexOf(quality)+3);
	}
	
	//old style

	var regexs = [/SD/g , /Low-Res/g , /Medium-Res/g, /Trailer/g, /Med-Res/g, /Teaser/g]
	for (var i=0;i<regexs.length;i++){
		nbr=clips.match(regexs[i]);
		if(nbr != null){
			regexs[i] = regexs[i].toString().replace(/\//g,'').replace('gi','').replace('g','');
			clips=clips.slice(clips.lastIndexOf('http://',clips.indexOf(regexs[i])));
			for (var j=0;j<nbr.length;j++){
				url += clips.slice(clips.indexOf('http://')+7,clips.indexOf('"',clips.indexOf('http://'))) + "<b>" + clips.slice(clips.indexOf('>',clips.indexOf('http://'))+1,clips.indexOf('</a>')) + "</b>";
				clips = clips.slice(clips.indexOf('</a>')+4);
			}
			if(url != '')
				i=regexs.length;
		}
	}
	return url;
}


function icefilmsSources(content,type){
	var sources = [];
	sources.source = [];
	content = content.match(/onclick=\'go\((\d+)\)\'>(.+?)</gi); 
	var aux = 0;
	for each (var source in content){
		sources[aux]={ 'title': source.slice(source.indexOf('>')+1, source.indexOf(':')) + ' ' + type  , 'id': source.slice(source.indexOf('(')+1, source.indexOf(')'))};
		aux++;
	}
	return sources;
}

  
plugin.addURI("megaviewer:start", startPage);
})(this);
