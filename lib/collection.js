Websites = new Mongo.Collection("websites");



Websites.allow({
	insert:function(userId, doc){
	
		if (Meteor.user()){ // they logged in
		
			return true;
		}else{ // user not logged in
			return false;
		}
		
	},
	remove:function(userId, doc){
		if (Meteor.user()){ // they logged in
			return true;
		}else { // user not logged in
			return false;
		}
	},// end remove;
	// set update security for rating image
	update:function(userId , doc,field,modifier){
		if( field == 'upvote' || field == 'downvote'){
			 return true;
		 }else{
			 return false;
		 }
	}
	
});