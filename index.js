
const args = require("minimist")(process.argv.slice(2),{string:"link"});
const fs = require('fs');
const open = require('open');
let linksMap;

function printHelp(){
	console.log("cli-bookmarks (c) Bhupendra Parihar");
	console.log("");
	console.log("--help : print this help");
	console.log("--open : open the associated {{URL}} with the app in browser");
	console.log("--print : print the associated {{URL}} in the console");
	console.log("--add : add url to bookmark list");
	console.log("--delete : delete url from bookmark list");
	console.log("usage:");
	console.log("eg. $ bookmark --open jforjs");
	var data = fs.readFileSync('config.json','utf8');

	linksMap = JSON.parse(data);
	links = Object.keys(linksMap);
	if(links){
		console.log(links.join(', '));
	}else{
		console.log("No Links in config.json");
	}
}

function createFile(filename) {
	var data;

	try{
		data = fs.readFileSync('config.json','utf8');
	}catch(e){
		try{
      		fs.writeFileSync('config.json', '{"mdn":"https://developer.mozilla.org/en-US/","w3schools":"https://www.w3schools.com","jforjs":"http://jforjs.com"}','utf8');
      	}catch(e){
      		console.log(e);
      	}
	}
  
   /*if (err) {
    	try{
      		fs.writeFileSync(filename, '','utf8');
      	}catch(e){
      		console.log(e);
      	}
    } else {
      console.log("The file exists!");
    }*/
}

createFile('config.json');


if(args.add){
	if(!linksMap){
		let data = fs.readFileSync('config.json','utf8');
		linksMap = JSON.parse(data) || {};
	}

	if(linksMap[args.add]){
		console.log("URL already exist for '" + args.add + "'")
	}else{
		linksMap[args.add]  = args['_'][0];
		console.log(args.add + " : " +linksMap[args.add]);
		let json = JSON.stringify(linksMap);
		fs.writeFileSync('config.json', json, 'utf8');
	}
}

if(args.delete){
	if(!linksMap){
		let data = fs.readFileSync('config.json','utf8');
		linksMap = JSON.parse(data) || {};
	}
	
	if(linksMap[args.delete] && args.delete !== 'mdn' && args.delete !== 'jforjs'){
		delete linksMap[args.delete];
		let json = JSON.stringify(linksMap);
		fs.writeFileSync('config.json', json, 'utf8');
	}
}

if(args.open){
	fs.readFile('config.json','utf8', function readFileCallBack(err, data){
		if(err){
			console.log(err);
		} else {
			obj = JSON.parse(data);
			var urlToOpen = obj[args.open];
			if(urlToOpen){
				open(urlToOpen);
			}else{
				console.log("No URL associated for '"+ args.link + "'");
			}
		}
	});
}

if(args.print){
	fs.readFile('config.json','utf8', function readFileCallBack(err, data){
		if(err){
			console.log(err);
		} else {
			obj = JSON.parse(data);
			var urlToOpen = obj[args.print];
			if(urlToOpen){
				console.log(urlToOpen);
			}else{
				console.log("No URL associated for '"+ args.link + "'");
			}
		}
	});
}

if(args.help || (!args.open && !args.print && !args.add  && !args.delete)){
	printHelp(); 
	process.exit(1);
}