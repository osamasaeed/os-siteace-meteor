
	Meteor.subscribe("websites");
	
	Router.configure({
		layoutTemplate:'ApplicationLayout'
	});
	
	Router.route('/', function () {
	this.render('welcome',{
	  to:"main"
		});
	});
	
	Router.route('/dashboard', function () {
	this.render('navbar',{
	  to:"navbar"
		});
	this.render('website_form',{
	  to:"web_add_form"
		});
	this.render('website_list',{
	  to:"main"
		});
	});
	
	Router.route('dashboard/web/:id', function () {
	this.render('navbar',{
	  to:"navbar"
		});
	this.render('web_detail',{
	  to:"main",
	  data:function(){
		 return Websites.findOne({_id:this.params.id}); 
			}
		});
	this.render('commentbox',{
	  to:"commentbox",
	  data:function(){
		 return {_id:this.params.id}; 
			}
		}); 
	});
	
	
	
	
	Session.set('limit',8);
  WebIndex = new EasySearch.Index({
    collection: Websites,
    fields: ['title','description'],
	defaultSearchOptions: {
    limit:8
	},
    engine: new EasySearch.Minimongo({
	sort: function () {
      return { upvote: -1 };
    }
	})
  });
  //console.log(WebIndex.defaultSearchOptions.limit);
	
	
	// infinite scroll
	
	lastScrollTop = 0;
	$(window).scroll(function(event){
		// test if we are near of the bottom of window
		if($(window).scrollTop() + $(window).height() > $(document).height() - 100){
			// where we are in this page
			var scrollTop = $(this).scrollTop();
			
			if(scrollTop > lastScrollTop){
			Session.set("limit",Session.get("limit") + 4);
			}
			lastScrollTop = scrollTop;
		}
		
	});
	
	
	
	/////
	// template helpers 
	/////

	// helper function that returns all available websites
	
		
	Accounts.ui.config({
		passwordSignupFields: "USERNAME_AND_EMAIL"
	});
	
	
	// On the Client
	 Comments.ui.config({
   template: 'bootstrap' // or ionic, semantic-ui
	}); 
	
	/* $(window).load(function(){
  $('#loading').fadeOut(2000);
}); */
	
	Template.navbar.helpers({
	 inputAttributes: function () {
      return { 'class': 'btn btn-default' };
    }
	});
	
	Template.website_item.helpers({
		getUser:function(user_id){
		var user = Meteor.users.findOne({_id:user_id});
			if(user){
				return user.username;
			}else{
				return "anonymous";
			}	
		}
	});
	
	
	Template.web_detail.helpers({
		getUser:function(user_id){
		var user = Meteor.users.findOne({_id:user_id});
			if(user){
				return user.username;
			}else{
				return "anonymous";
			}	
		}
	});
	
	Template.website_list.helpers({
		
		
		webIndex: function(){
			WebIndex.defaultSearchOptions.limit = Session.get('limit');
			return WebIndex;
		},
		inputAttributes: function () {
			return { 'class': 'easy-search-input', 'placeholder': 'Start searching...' };
		}
	});
//instance_item

		Template.instance_item.helpers({
		title:function(){
			return Session.get("in_title");
		},
		description:function(){
			return Session.get("in_description");
		},
		image:function(){
			return Session.get("in_image");
		}
	});

	Template.website_form.helpers({
		alertMsg:function(){
			return Session.get("alertmsg");
		}
	});

	/////
	// template events 
	/////

	Template.website_item.events({
		"click .js-upvote":function(event){

			
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id
			
				//set up vote in website
			var getUpvote = Websites.findOne({_id:website_id});
			getUpvote = getUpvote.upvote;
			getUpvote++;
			
			Websites.update({_id:website_id},{
				$set:{upvote:getUpvote}
			});
			
		
		
			
			
			
			
			//console.log("Up voting website with id "+website_id);
			// put the code in here to add a vote to a website!

			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			var website_id = this._id;
			
			//set down vote in website
			var getDownvote = Websites.findOne({_id:website_id});
			getDownvote = getDownvote.downvote;
			getDownvote++;
			
			Websites.update({_id:website_id},{
				$set:{downvote:getDownvote}
			});
			
			
			//console.log("Down voting website with id "+website_id);

			// put the code in here to remove a vote from a website!

			return false;// prevent the button from reloading the page
		}
	});
	
/* 	
	function getInformation(description,field){
		var items=[];
		items = description.split("<meta");
		
			for(var i=0;i<items.length;i++){
			
				var index = items[i].indexOf('property="og:'+field+'"')
					if(index != -1){
					var contentIndex = items[i].indexOf('content=');
					
				var	value = items[i].substring(contentIndex+8,items[i].indexOf(">")-1);

					return value;
					}	
		
			}
		
				 
	}
	 */
	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, // instant show detect
		"input #url":function(event){
			$('#web_submit').prop('disabled', true);
			$('#instance_item').fadeOut('fast');
			var url = $('#url').val();
			
			 if(url.indexOf("http") != -1){
			setTimeout(function(){ 
			
			$('#refresh_icon').fadeIn('fast');
			  
			
				  
			extractMeta(url, function (error, res) {

			if(!$.isEmptyObject(res)){
				$('#web_submit').prop('disabled', false);
				$('#refresh_icon').fadeOut('fast');
				
				
			var description = String(res.description);
			var title = String(res.title);
			var image = String(res.image);
					
					// getting pure title
				

				if (title.indexOf("&#") != -1){
					var i = title.indexOf(";");
					var j = title.lastIndexOf("&#");
					title = title.substring(i+1,j);
					}

					
					
				if (image.indexOf("http") == -1){
					image = "icon.png";
				}
				
				Session.set('in_title',title);
				Session.set('in_description',description);
				Session.set('in_image',image);
				$('#instance_item').fadeIn('fast');
				
				
			}else{
				$('#web_submit').prop('disabled', true);
				$('#refresh_icon').fadeOut('fast');
			}
			
			if(error){
				$('#web_submit').prop('disabled', true);
				$('#refresh_icon').fadeOut('fast');
			}


			});
				  
			  			
			 }, 2000);
			 
			 }else{
				$('#web_submit').prop('disabled', true);
				$('#refresh_icon').fadeOut('fast');				
			 }

			
		},
		"submit .js-save-website-form":function(event){
			$('#instance_item').fadeOut('fast');
		if(Meteor.user()){
			// here is an example of how to get the url out of the form:
			var url = event.target.url.value;
		if(url.indexOf('http://')!=-1 || url.indexOf('https://')!=-1){
			//pull information from a webpage 
			extractMeta(url, function (error, res) { 
			
			if(!$.isEmptyObject(res)){
			
			
			var description = String(res.description);
			var title = String(res.title);
			var image = String(res.image);
					
					// getting pure title
				

				if (title.indexOf("&#") != -1){
					var i = title.indexOf(";");
					var j = title.lastIndexOf("&#");
					title = title.substring(i+1,j);
					}

					
					
				if (image.indexOf("http") == -1){
					image = "icon.png";
				}
				

				Websites.insert({
					title:title, 
					url:url, 
					description:description, 
					createdBy:Meteor.user()._id,
					createdOn:new Date(),
					image:image,
					upvote:0,
					downvote:0
					});
					//console.log('web inserted');
					$('#alert').hide('fast');
					$('#alert-success').fadeIn('fast');
					$('#alert-success').fadeOut(10000);
					$('#web_submit').prop('disabled', false);
				
				
				} 
				if(error){
				Session.set('alertmsg',"invalid url...");
				$('#alert').show('fast');
			}
		
		}); //end extractor
		
		}else{
				Session.set('alertmsg',"your url must start with http:// or https://");
				$('#alert').show('fast');
				
		}// end if and else http or https test
			/* 
				if(url.indexOf('http://')!=-1 || url.indexOf('https://')!=-1){
					
			
				$('#alert').hide('fast');
				}else{
				Session.set('alertmsg',"your url must start with http:// or https://");
				$('#alert').show('fast');
				} */
				
		}else{
				Session.set('alertmsg',' You must login to post a website.');
			$('#alert').show('fast');
		}
			//  put your website saving code in here!	

			return false;// stop the form submit from reloading the page

		}
	});