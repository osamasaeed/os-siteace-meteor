	
		
	Meteor.publish("websites",function(){
		
		return Websites.find();
	}); 

	/* Meteor.methods({
	'getWebInfo':function(url){
		return Meteor.http.call( 'GET', url)
	} 
	
})*/
	
	// start up function that creates entries in the Websites databases.
  Meteor.startup(function () {
	 
    // code to run on server at startup
/* 	
	WebApp.connectHandlers.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return next();
}); */
	
    if (!Websites.findOne()){
    	console.log("No websites yet. Creating starter data.");
    	  Websites.insert({
    		title:"Goldsmiths Computing Department", 
    		url:"http://www.gold.ac.uk/computing/", 
    		description:"This is where this course was developed.", 
			createdBy:'OSama',
    		createdOn:new Date(),
			image:'icon.png',
			upvote:0,
			downvote:0
    	});
    	 Websites.insert({
    		title:"University of London", 
    		url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route", 
    		description:"University of London International Programme.", 
			createdBy:'OSama',
    		createdOn:new Date(),
			image:'icon.png',
			upvote:0,
			downvote:0
    	});
    	 Websites.insert({
    		title:"Coursera", 
    		url:"http://www.coursera.org", 
    		description:"Universal access to the world’s best education.", 
			createdBy:'OSama',
    		createdOn:new Date(),
			image:'icon.png',
			upvote:0,
			downvote:0
    	});
    	Websites.insert({
    		title:"Google", 
    		url:"http://www.google.com", 
    		description:"Popular search engine.", 
			createdBy:'OSama',
    		createdOn:new Date(),
			image:'icon.png',
			upvote:0,
			downvote:0
    	});
    }
  });
