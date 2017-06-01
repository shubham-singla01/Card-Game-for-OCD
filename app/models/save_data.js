module.exports=function(req,res){
	var User = require('./user.js');
	User.findOne({uname: req.user.uname}, function(err,obj) { 
	if(obj){
		if(req.body.Reset==0){
			if(obj.hearts=='[ "" ]')
				obj.hearts=[];
			if(obj.clubs=='[ "" ]')
				obj.clubs=[];
			if(obj.spades=='[ "" ]')
				obj.spades=[];
			if(obj.diamond=='[ "" ]')
				obj.diamond=[];
				//obj.hearts.pull();
				obj.no_of_cards=req.body.Cards;
				var h= req.body.Hearts.split(",");
				for (i = 0; i < h.length; i++)
				{
					if(h[i]!="")
						obj.hearts.push(h[i]);
				}			
				var c= req.body.Clubs.split(",");
				for (i = 0; i < c.length; i++)
				{
					if(c[i]!="")
						obj.clubs.push(c[i]);
				}			
				var d= req.body.Diamond.split(",");
				for (i = 0; i < d.length; i++)
				{
					if(d[i]!="")
						obj.diamond.push(d[i]);
				}			
				var s= req.body.Spades.split(",");
				for (i = 0; i < s.length; i++)
				{
					if(s[i]!="")
						obj.spades.push(s[i]);
				}			
			/*if(obj.clubs=="")
				obj.clubs=req.body.Clubs;
			else
				obj.clubs=obj.clubs+","+req.body.Clubs;
			if(obj.diamond=="")
				obj.diamond=req.body.Diamond;
			else
				obj.diamond=obj.diamond+","+req.body.Diamond;
			if(obj.spades=="")
				obj.spades=req.body.Spades;
			else
				obj.spades=obj.spades+","+req.body.Spades;
			obj.no_of_cards=req.body.Cards;*/
			
			obj.save(function (err) {
				if (err) {
				  console.log(err);
				} else {
				  console.log('Updated', obj);
				  res.status(200).send("OK");
				}
			});
	}else if(req.body.Reset==1){
		obj.hearts=[];
		obj.clubs=[];
		obj.diamond=[];
		obj.spades=[];
		obj.no_of_cards=0;
		console.log("reset");
		obj.save(function (err) {
				if (err) {
				  console.log(err);
				} else {
				  console.log('Updated', obj);
				  res.status(200).send("OK");
				}
			});
	}}else{
		res.send(500);
	}
	});
}