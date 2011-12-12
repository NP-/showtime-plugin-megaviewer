/**
 *  MegaViewer plugin for showtime version 0.21  by NP
 *
 *  Copyright (C) 2011 NP
 * 
 *  ChangeLog:
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
//TODO:	Bookmarks
//		Search
//		Code Clean up
//		http://www.onlinemoviesfreee.com/





(function(plugin){


var PREFIX = 'megaviewer:';
var MEGAMKV_IMG = 'http://mega-mkv.com/wp-content/themes/Mega-mkv/logo.png';
var MEGAMKV = 'http://mega-mkv.com/';
var MEGARELEASE = "http://www.megarelease.net";
var MEGARELEASE_IMG = "http://b.imagehost.org/0380/mrlogo1b.png";
var ONEDDL_IMG = "http://userlogos.org/files/logos/Deva/oneddl_logo.png";
var ICEFILMS ="http://www.icefilms.info";
var ICEFILMS_IMG ="http://i1224.photobucket.com/albums/ee364/froggermonster1/icon-1.png";
var LOGO_IMG = plugin.path + "images/logo.png";
var TV_IMG = plugin.path + "images/tvshows.png";
var MOVIES_IMG = plugin.path + "images/movies.png";
var EPISODE7_IMG = plugin.path + "images/e7.png";
var EPISODE7 = 'http://www.episode7.com/';
var USER_AGENT = 'Mozilla/5.0 (X11; Linux i686) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.202 Safari/535.1';
var b64s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var INPUT_IMG = plugin.path + "images/input.png";
var BOOKMARKS_IMG = plugin.path + "images/bookmarks.png";
var CHAR_LIST = [ [/&#x27;/gi, "'"],
				[/&#038;/gi, "&"],
				[/&#x26;/gi, "&"],
				[/&amp;<br\/>/gi, "&"],				
				[/&amp;/gi, '&'],
				[/&#xF4/gi, "o"],
				[/&#x22;/gi, ""],
				[/&#x2B;/gi, "e"],
				[/&#xC6;/gi, "AE"],
				[/&#xC7;/gi, "C"],
				[/&#xB0;/gi, "º"],
				[/&#xED;/gi, "í"],
				[/&#xE9;/gi, "é"],
				[/&#xEE;/gi, "î"],
				[/&#xB3;/gi, "3"],
				[/&nbsp;/gi, ""],
				[/&#8211;/gi, "-"],
				[/&frac12;/gi, "1/2"]
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
	var mu_login = plugin.createStore('mu_login', true);
	
	var bookmarks = plugin.createStore('bookmarks', true);
	if(!bookmarks.list)
		bookmarks.list = "[]";

//settings 
	
	var service = plugin.createService("MegaViewer", PREFIX + "start", "tv", true, LOGO_IMG);
	
	var settings = plugin.createSettings("MegaViewer", LOGO_IMG, "MegaViewer");
	
	settings.createInfo("info", LOGO_IMG, tos + "\nPlugin developed by NP \n");
	
	settings.createBool("imdb", "IMDb", false, function(v){ service.imdb = v; });
	
	settings.createBool("tmdb", "TMDb", false, function(v){ service.tmdb = v; });
	
	settings.createBool("tvrage", "TVRage", false, function(v){ service.tvrage = v; });
	
	settings.createBool("hd", "HD", false, function(v){ service.hd = v; });
	
	settings.createBool("fullhd", "Full HD", false, function(v){ service.fullhd = v; });

	settings.createBool("trailers", "Search for Trailers (can cause some delay)", false, function(v){ service.trailers = v; });
	
	settings.createBool("tosaccepted", "Accepted TOS (available in opening the plugin):", false, function(v){
	    service.tosaccepted = v;
	  });  

//http header fix
plugin.addHTTPAuth("http:\/\/trailers\.apple\.com\/.*", function(authreq) {
    authreq.setHeader("User-Agent", "QuickTime");
  });


/*
 * Navigation
 * First Level, Website Selection
 */
 
function startPage(page){

	page.appendItem( PREFIX + "episode7", "directory", {
		  title: "episode7",
		      icon: EPISODE7_IMG
		      });
	 
	page.appendItem( PREFIX + "icefilms:recent", "directory", {
		  title: "IceFilms",
		      icon: ICEFILMS_IMG
		      });
	
	page.appendItem( PREFIX + "megamkv:1", "directory", {
		  title: "Mega MKV",
		      icon: MEGAMKV_IMG
		      });
	
	page.appendItem( PREFIX + "category:megarelease", "directory", {
		  title: "MegaRelease",
		      icon: MEGARELEASE_IMG
		      });
		      	
	page.appendItem( PREFIX + "category:oneddl", "directory", {
		  title: "OneDDL",
		      icon: ONEDDL_IMG
		      });
	
	page.appendItem( PREFIX + "vvwtv", "directory", {
		  title: "vvwtv",
		      icon: TV_IMG
		      });

	page.appendItem( PREFIX + "login", "directory", {
		  title: "Login",
		      icon: 'http://1.bp.blogspot.com/-V6zHQzhKnkk/TiyXYyYMYMI/AAAAAAAACb4/1wTuh_h2vDw/s1600/Megaupload+Premium+Link+Generator.png'
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
		if(service.tmdb == "1"){ var movie = tmdbInfo(data.imdb); }else{ var movie = imdbInfo(data.imdb); }
		url = data.url;
		if(data.list != '')
			var list = 'icefilms:list:' + data.list;
	}else
		var content = showtime.httpGet('http://'+url).toString();

	if(imdb.indexOf('tt') != -1)
		if(service.tmdb == "1"){ var movie = tmdbInfo(imdb); }else{ var movie = imdbInfo(imdb); }

	
	switch(website){
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
		
		case 'episode7':
			var movie = episodeSevenGetInfo(content);
			url = episodeSevenGetUrl(content);
			data.list = getValue(content, '<h1 class="cat"><a href="/', '"');
			if(data.list != '')
				var list = 'episode7:list:' + data.list;
			break;
			
		default:
		showtime.trace('Default: ' + website);
		break;
	}	
		
	page.metadata.title = movie.Title;
	page.metadata.logo = MOVIES_IMG;
	
	if(movie.Year)
		page.metadata.title= movie.Title + " " + movie.Year.toString();
	
	if(movie.icon == "N/A" || !movie.icon)
		page.metadata.icon = 'http://www.latinoreview.com/img/poster_not_available.jpg';
	else
		page.metadata.icon =  movie.icon;
	
	var count = 0;
	if(movie.Genre){
		page.appendPassiveItem("label", movie.Genre);
		count++;
	}
	if(movie.rating)
		page.appendPassiveItem("rating", movie.rating);
	
	
	var args = ["divider", "Episode", "Number", "Duration", "Actors", "Director", 
				"Writer", "Studios", "Country", 'Aired', "Released",'Language', 'Format', 'Audio', 'Size', "Rated", "divider"];
			
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
	  
	  
	//bookmarked  --  search
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
	showtime.trace('Video url: '+ url);
	//icefilms
	if(url.length<7 && cookie != 'ND'){
		showtime.trace('ice: ' + url);
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
		url = req.slice(req.indexOf('http://')+7, req.length);				
	}
	
	if(url.indexOf('www')!=-1)
		var website = url.slice(url.indexOf("www.")+4, url.indexOf(".",url.indexOf("www.")+6));
	else
		var website = url.slice(0, url.indexOf("."));
	
		
	switch(website){
		
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
			if(!loggedIn){
				var temp_url = megauploadGetUrl(url);
				if(temp_url.indexOf('megaupload.com') != -1){
					url = temp_url;
					showtime.trace('Sleep 60 Seg for url:' + url);
					wait(59);
					showtime.trace('END Sleep 60 Seg');
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

		case 'multiupload':
			var temp = showtime.httpGet('http://'+url).toString();
			url = temp.slice(temp.lastIndexOf('http://',temp.indexOf('multiupload.com:81'))+7,temp.indexOf('"',temp.indexOf('multiupload.com:81')));
			break;
		
		case 'rapidshare':
			url = rapidshareUrl(url);
			break;
		
		case 'linksafe':
			var temp = showtime.httpGet('http://'+url).toString();
			if(temp.indexOf('multiupload.com:81') == -1)
				url = rapidshareUrl(temp);
			else
				url = temp.slice(temp.lastIndexOf('http://',temp.indexOf('multiupload.com:81'))+7,temp.indexOf('"',temp.indexOf('multiupload.com:81')));
			break;

		default:
			showtime.trace('Default: ' + website);
			break;
	}
		
	var title = 'test';
	
	//play
	if(url.indexOf("filename=")!= -1)
		title = getValue(url, 'filename=','&');
	else
		title = url.slice(url.lastIndexOf('/')+1, url.lastIndexOf('.'));

	if(!loggedIn &&!fileSupport(url.slice(url.lastIndexOf('.'), url.length))){
		page.error("File type not supported.");
		return;
	}
	
	page.source = "videoparams:" + showtime.JSONEncode({      
		title: title,     
		sources: [
		{	
			url: 'http://' + url,
			mode: 'streaming'  
		}]    
	});    
	page.type = "video";
});

/*
 * Bookmarks
 */
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
	page.metadata.title = link.replace(/\W/gi,' ').toUpperCase();
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
	page.metadata.title = link.replace(/\W/gi,' ').toUpperCase();
	
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
	
	page.metadata.title = link.replace(/\W/gi,' ').toUpperCase();
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
 * MegaRelease
 */

plugin.addURI( PREFIX + "megarelease:(.*):(.*)", function(page, category, indice){
	
	page.type = "directory";
	page.contents = "videos";
	page.metadata.title = category;
	page.metadata.logo = MEGARELEASE_IMG;
	
	
	if(indice == 1)
		indice = 2;
	
	var content = showtime.httpGet( MEGARELEASE + "/category/" + category + "/page/" + indice + "/").toString();   
	content = getValue(content, 'archive-title', 'emm-paginate');
	content = cleanString(content).replace(/\n/gi, ' ');
	var posts = content.split('class="postItem">');
	
	var metadata = {};
	
	for each (var post in posts){
		if(post.indexOf('<h1><a href=') != -1){
		   
			metadata.link = getValue(post, '<h1><a href="http://', '"'); 
			metadata.title = post.slice(post.indexOf('>',post.indexOf('<h1><a href="')+16)+1,post.indexOf('<',post.indexOf('<h1><a href="')+16));
			metadata.icon = post.slice(post.indexOf('src=',post.indexOf('</h1>'))+5,post.indexOf(" ",post.indexOf('src=',post.indexOf('</h1>'))+6)-1);
			if(category == 'movies'){
				metadata.imdb = getValue(post, 'imdb.com/title/', '>').replace('/','').replace('"','').replace("'",'');
		   }else{
				metadata.imdb = 'tvshow';
		   }
			if(post.indexOf('Additional Info:')!=-1)
				metadata.description = new showtime.RichText(getValue(post, 'Additional Info:', '<a href='));

		page.appendItem("megaviewer:present:" + metadata.imdb +":"+  metadata.link, "video", metadata); 
		metadata = {};
		}
	}
	
	//older
	page.appendItem( PREFIX + "megarelease:" +  category + ":" + (parseFloat(indice)+1).toString(), "directory", { title: "Next" });
	page.loading = false; 
});

/*
 * Mega-MKV 
 */

plugin.addURI( PREFIX + "megamkv:(.*)", function(page, indice){
	
	page.type = "directory";
	page.contents = "items";
	page.metadata.logo = MEGAMKV_IMG;
	
	var content = showtime.httpGet( MEGAMKV + "/page/" + indice + "/").toString();
	content = getValue(content, '<div id="content">', "<div id='wp_page_numbers'>");
	content = content.split('<div class="title">');
	
	for each (var post in content)
		if(getValue(post, 'title="', '"') != '')
			page.appendItem( PREFIX + "videos:" + getValue(post, '<h2><a href="http://', '"')+':ND:ND:ND', "video",
			 { title: getValue(post, 'title="', '"').replace('Lien Permanent vers', ''),
			   icon: getValue(post, 'src="', '"') });
	
	//Next
	page.appendItem( PREFIX + "megamkv:" + (parseFloat(indice)+1).toString(), "directory", { title: "Next" });
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
		
			showtime.trace("present:" + metadata.imdb +":"+  metadata.link);
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
 * VVWTV 
 */

plugin.addURI( PREFIX + "vvwtv", function(page, category){
	page.type = "directory";
	page.contents = "videos";
	page.metadata.logo = TV_IMG;
	page.metadata.title = 'VVWTV';
	
	var content = showtime.httpGet('http://vvwtv.blogspot.com/').toString();
	var last = getValue(content, '<h3>Latest Updates:', "<div class='post-footer'>"); 
	last = last.split('</a><br />');
	
	for each ( var file in last){
		if(file.indexOf('http://www.megaupload.com/') != -1){		   
			if(file.match(/<br \/>/g).length >1)
				var title = file.slice(file.lastIndexOf('<br />',file.lastIndexOf('<br />')-8)+7,file.lastIndexOf('<br />'));
			else
				var title = file.slice(1,file.indexOf('<br />'));
		   
			page.appendItem( PREFIX + "videos:"+ getValue(file, 'www.megaupload.com/','>','start', 'all', -1)+':ND:ND:ND', "directory", {
				title: title });		   		   
		   }
	}
	
	content = getValue(content, '<table><tbody>','</tbody></table>'); 
	content = content.split('</a></td> </tr>');
	
	for each (var video in content){
		page.appendItem( PREFIX + "videos:"+getValue(file, 'www.megaupload.com/','>','start', 'all', -1)+':ND:ND:ND', "directory", {
		    title: getValue(video, '<tr><td>', '<') });
	}
	
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
//MEGAVIDEO	
//	if(content.indexOf('http://www.megavideo.com/?')!=-1)
//	    url += content.slice(content.indexOf('megavideo.com/'),content.indexOf('";',content.indexOf('www.megavideo.com/'))-1)
//		    + '<b>MV(flv)</b>';
	content = content.split('href="http://');
	
	for each (var link in content){
		
		if(link.indexOf('megaupload.com/?')!=-1)
			url += getValue(link, 'megaupload.com/?d', '">','start','all')+ '<b>MU</b>';
			//link.slice(link.indexOf('megaupload.com/?d'), link.indexOf('">',link.indexOf('megaupload.com/?d'))) + '<b>MU</b>';
		
		if(link.indexOf('rapidshare.com/')!=-1)
			url += getValue(link, 'rapidshare.com/', '">','start', 'all') + '<b>RS</b>';
			//link.slice(link.indexOf('rapidshare.com/'), link.indexOf('">',link.indexOf('rapidshare.com/'))) + '<b>RS</b>';
	}
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
 * MegaRelease:
 *  -GetInfo
 *  -GetURL
 */

function megareleaseGetInfo(link) {
	link = link.replace(/\n/gi, ' ', '<!-- You can start editing here. -->');
	link = getValue(link, '<div class="postItem">', '<!-- You can start editing here. -->');
	link = cleanString(link);
	var metadata = {};
	
	metadata.Title = link.slice(link.indexOf('>',link.indexOf('<h1><a href="')+16)+1,link.indexOf('<',link.indexOf('<h1><a href="')+16));
	metadata.icon = link.slice(link.indexOf('src=',link.indexOf('</h1>'))+5,link.indexOf(" ",link.indexOf('src=',link.indexOf('</h1>'))+6)-1); 
	metadata.Aired = megareleaseGetMetadata(link, 'Air Date:');
	metadata.Released = megareleaseGetMetadata(link, 'Release Date:');
	metadata.Language = megareleaseGetMetadata(link, 'Language:');
	metadata.Format = megareleaseGetMetadata(link, 'Video Format:');	
	metadata.Audio = megareleaseGetMetadata(link, 'Audio Format:');
	metadata.Size = megareleaseGetMetadata(link, 'Size:');
	metadata.plot = getValue(link,'Additional Info:', '<a href=');
	return metadata;
}

function megareleaseGetMetadata(content, parameter) {
	if(content.indexOf(parameter) ==-1)
		return 'N/A';
	return content.slice(content.indexOf('">',content.indexOf(parameter))+2,content.indexOf("</spa",content.indexOf('">',content.indexOf(parameter))+5));
}

function megareleaseGetUrl(content) {
	
	var url = content.match(/megaupload/i);
	
	if(content.indexOf(url != null) && content.indexOf('megaupload.com/?d=') != -1)
		content= content.slice(url.toString(), content.lastIndexOf('/?d=')+20);
	else
		return "Links not found!";
		
	url = '';
	var file = content.split("</p>");
	var found = 0;
	var mu = '';
	var mu_tmp = '';
	var title = '';
	for (var j=0;j<(file.length);j++){
		if(file[j].indexOf("/?d=") !=-1){
			mu_tmp += 'www.megaupload.com/' + file[j].match(/\?d=[A-Za-z0-9\s]*</i).toString();
			found++;	
		}
		else{
			if(found == 1)
				mu += mu_tmp + 'b>' + title +'</b>';
			title =file[j].slice(file[j].lastIndexOf('>')+1);
			mu_tmp='';
			found = 0;
		}
	}
	if(mu == '')
		mu = mu_tmp +'b>' + title +'</b>';
	
	if(mu.indexOf(mu_tmp) == -1 && found == 1)
				mu += mu_tmp + 'b>' + title +'</b>';

	url=mu.replace(' ','');
	return url;
}

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
			showtime.trace('host: ' + host.toString());
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
	
	try{
		var info = eval(('(' + showtime.httpGet("http://www.imdbapi.com/?i=" + id + "&r=json&plot=full") + ')'));
	}catch(err){
		showtime.trace('IMDb info: '+err);
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
		showtime.trace('TV Rage connection timeout');
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

function megauploadGetUrl(link) {
	var args={
		'Host': 'www.megaupload.com',
		'Connection': 'close',
		'User-Agent': USER_AGENT,
		'Accept-Encoding': 'identity'
    }
    
	link = showtime.httpGet('http://'+link,null,args).toString(); 

	if(link.indexOf('class="download_l_buy"') !=-1)
		return 'Premium'; 
	if(link.indexOf('id="dlbuttondisabled') ==-1)
		return 'Megaupload link Not Available';

	link = link.slice(link.indexOf('http://',link.indexOf('id="dlbuttondisabled'))+7,link.indexOf('"',link.indexOf('http://',link.indexOf('id="dlbuttondisabled'))));	
	return link;
}


//not used
function megavideoGetUrl(link){
	/*
	 * translate d= megavideo check http://videourls.com/
	 */
	
	
	if(link.indexOf('&v=')!=-1){
		link = link.slice(link.indexOf('&v=') + 3, link.toString().length);
	}else{
	    showtime.trace(link+'\nblack magic: http://videourls.com/'+link.replace('megavideo.com/',''));
	    link = showtime.httpGet('http://videourls.com/'+link.slice(url.lastIndexOf('/')+1)).toString();
        //print(link);
  	    //link.replace('flashvars.v','').replace('flashvars.v','');
	    //showtime.trace('Index: '+ link.indexOf('UGXGNF12'));//link.slice(link.lastIndexOf('flashvars.v'),link.lastIndexOf('flashvars.v')+25));//link.slice(link.lastIndexOf('flashvars.v')+16,link.indexOf(';',link.lastIndexOf('flashvars.v')+18))); 
	    //link = link.slice(link.indexOf('flashvars.v ="'),link.indexOf('flashvars.v ="')+25);
	}
	showtime.trace('LInk megavideo: ' +link);	
    link = showtime.httpGet('http://www.megavideo.com/xml/videolink.php?v=' + link, null, 
        {'Referer' : 'http://www.megavideo.com/',
         'User-Agent' : USER_AGENT }).toString();

    var s = getValue(link, 's= "', '"');
    var k1 = getValue(link, 'k1= "', '"');
    var k2 = getValue(link, 'k2= "', '"'); 
    var un = getValue(link, 'un= "', '"'); 
    var title = getValue(link, 'flashvars.title = "', '"'); 
    showtime.print("http://www" + s + ".megavideo.com/files/" + megavideoDecrypt(un, k1, k2) + "/" + title + ".flv");
    return "http://www" + s + ".megavideo.com/files/" + megavideoDecrypt(un, k1, k2) + "/" + title + ".flv";
}

function megavideoDecrypt(str, key1, key2) {
	var loc1 = [];
	for (var loc3 = 0; loc3 < str.length; ++loc3) {
		loc1.push(("000" + parseInt(str.charAt(loc3), 16).toString(2)).slice(-4));
	}
	loc1 = loc1.join("").split("");
	var loc6 = [];
	for (var loc3 = 0; loc3 < 384; ++loc3) {
		key1 = (key1 * 11 + 77213) % 81371;
		key2 = (key2 * 17 + 92717) % 192811;
		loc6[loc3] = (key1 + key2) % 128;
	}
	for (var loc3 = 256; loc3 >= 0; --loc3) {
		var loc5 = loc6[loc3];
		var loc4 = loc3 % 128;
		var loc8 = loc1[loc5];
		loc1[loc5] = loc1[loc4];
		loc1[loc4] = loc8;
	}
	for (var loc3 = 0; loc3 < 128; ++loc3) {
		loc1[loc3] = loc1[loc3] ^ loc6[loc3 + 256] & 1;
	}
	var loc12 = loc1.join("");
	var loc7 = [];
	for (var loc3 = 0; loc3 < loc12.length; loc3 = loc3 + 4) {
		var loc9 = loc12.substr(loc3, 4);
		loc7.push(loc9);
	}
	var loc2 = [];
	for (var loc3 = 0; loc3 < loc7.length; ++loc3) {
		loc2.push(parseInt(loc7[loc3], 2).toString(16));
	}
	return loc2.join("");
}

function rapidshareUrl(url){
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
	url = url.split(",");
	    
	return url[0].replace('DL:','')+"/cgi-bin/rsapi.cgi?sub=download&fileid="+fileId+"&filename="+fileName+"&dlauth="+url[1];
}



//MISC

function cleanString(string) {
	for each(var charr in CHAR_LIST)
		string = string.replace(charr[0], charr[1]);

	return string;
}

function fileSupport(string) {
	for (var i=0;i<FILE_TYPE.length;i++){
		if(string.search(FILE_TYPE[i]) !=-1){
			return true;
			}
		}
	showtime.trace('File not Supported: ' +string);
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
		
		default:
			break;	
	}
	showtime.trace('Get Value error!');
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
	showtime.trace('Loading video.');
	for (var j=0;j<time;j++){
		showtime.trace('waiting '+(time-j)+' secs');
		showtime.sleep(1000);
	}
}

/* OpenPGP string encoding/decoding
 * Copyright 2005 Herbert Hanewinkel, www.haneWIN.de
 * version 1.0, check www.haneWIN.de for the latest version
*/
function s2r(t) {
	var a, c, n;
	var r = '', l = 0, s = 0;
	var tl = t.length;

	for (n = 0; n < tl; n++) {
		c = t.charCodeAt(n);
		if (s == 0) {
			r += b64s.charAt((c >> 2) & 63);
			a = (c & 3) << 4;
		} else if (s == 1) {
			r += b64s.charAt((a | (c >> 4) & 15));
			a = (c & 15) << 2;
		} else if (s == 2) {
			r += b64s.charAt(a | ((c >> 6) & 3));
			l += 1;
			if ((l % 60) == 0)
				r += "\n";
			r += b64s.charAt(c & 63);
		}
		l += 1;
		if ((l % 60) == 0)
			r += "\n";

		s += 1;
		if (s == 3)
			s = 0;
	}
	if (s > 0) {
		r += b64s.charAt(a);
		l += 1;
		if ((l % 60) == 0)
			r += "\n";
		r += '=';
		l += 1;
	}
	if (s == 1) {
		if ((l % 60) == 0)
			r += "\n";
		r += '=';
	}

	return r;
}

function r2s(t) {
	var c, n;
	var r = '', s = 0, a = 0;
	var tl = t.length;

	for (n = 0; n < tl; n++) {
		c = b64s.indexOf(t.charAt(n));
		if (c >= 0) {
			if (s)
				r += String.fromCharCode(a | (c >> (6 - s)) & 255);
			s = (s + 2) & 7;
			a = (c << s) & 255;
		}
	}
	return r;
}


/*
 * Not in Production
 * 
 */ 

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
	//bookmarks.list = bookmarks.list.slice(0,start-offSet) + bookmarks.list.slice(bookmarks.list.indexOf('}',bookmarks.list.indexOf(title))+1,bookmarks.list.length);
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


function login(reason){
	if(loggedIn)
		return true;
	
	if(mu_login.user){
		showtime.trace('User name presente');
		var aux = login_megaupload(r2s(mu_login.user), r2s(mu_login.pass));
		if(aux == r2s(mu_login.user)){
			loggedIn = true;
			return true;
		}
		delete mu_login.user;
		delete mu_login.pass;		
	}

	if(reason.length < 10)
		reason = "Login to MegaUpload account";
					
	var credentials = plugin.getAuthCredentials("MegaUpload - The leading online storage and file delivery service",
		reason, true, 'MegaUpload', true);

	if(credentials.rejected)
		return "Rejected by user";
	
	var aux = login_megaupload(credentials.username, credentials.password);
		if(aux == credentials.username){
			loggedIn = true;
			return true;
		}
	return aux;
}

function login_megaupload(user, password){
	//keyring uses plain text to store the passwords, not a good ideia
	var aux = showtime.httpPost("http://www.megaupload.com/?c=login", {
	    login: '1',
		redir: '1',
		username: user,
		password: password
	}).toString();

	if(aux.indexOf('Welcome <a href="?c=account" class="member">') != -1){    
		showtime.trace('Logged in to MegaUpload as user: ' + getValue(aux, 'Welcome <a href="?c=account" class="member">', '<', 'start',0 , -1));
		mu_login.user = s2r(user);
		mu_login.pass = s2r(password);
		loggedIn = true;
		return user;
	}else{ 
		return 'Username and password do not match. Please try again!';
	}	
}



plugin.addURI( PREFIX + "login", function(page, site){   
	var aux = login('as');
	
	if(aux != true)
		page.error(aux);
	else
		showtime.message('MegaUpload Login Verified', true,false);
	page.loading = false;
	return;
});



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
		showtime.trace('\nParsing error in: ' + clips+'\n')

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
