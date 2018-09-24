// Generated by CoffeeScript 1.8.0
(function() {
  var app, encounters, express, records, server;
  express = require("express");
  var path = require('path');
  var bodyParser = require('body-parser');
  var oAPI =require ("./lib/api");
  //var dao =require ("./lib/dao");
  var session = require('express-session');
  var rapidProDataSources=oAPI.getRapidProDataSources();
	function errorHandler(err, req, res, next) {
	  if (res.headersSent) {
		return next(err);
	  }
	  res.status(500);
	  res.render('error', { error: err });
	}
  app = express();
  app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
	});
  app.use(session({secret: '2C44774A-D649-4D44-9535-46E296EF984F'}));
// Authentication middleware
  app.use(function(req, res, next) {
	if (req.session && req.session.admin)
	res.locals.admin = true;
	next();
  });
// Authorization Middleware
  var authorize = function(req, res, next) {
	if (req.session && req.session.admin)
	return next();
	else
	{
		//console.log('return 401');
		//return res.send(401)
		res.render('login',{error:null});
	};
  };
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded());
  app.use(errorHandler);
  app.set('view engine', 'ejs');
  // use res.render to load up an ejs view file
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static(path.join(__dirname, 'public')));
  
  server = app.listen(process.env.PORT || 8084, function() {
    return console.log("Linkages-dashboard exchange is running on port:" + (server.address().port));
  });

	//template section
	app.get ("/", function (req,res,next)
	{
	res.render('login',{error:null});
	});
	app.get ("/login", function (req,res,next)
	{
	res.render('login',{error:null});
	});
	app.post ("/login", function (req,res,next)
	{
		var username=req.body.username;
		var password=req.body.password;
		console.log(oAPI.getAdministrator().username);
		if(password=="" || username=="")
		{
			res.render('login',{error:"Invalid credentials"});
		}
		else if(username==oAPI.getAdministrator().username && password==oAPI.getAdministrator().password)
		{
			req.session.user=req.body.username;
			req.session.admin=true;
			res.redirect('/index');
		}
		else
		{
			var find=false;
			var result= oAPI.checkUserExist(req.body.username,req.body.password,function(checkResult)
			{
				//console.log("res: "+checkResult);
				if(!checkResult)
				{
					return res.render('login', {
					error: 'Incorrect email&password combination.'
					});
				}
				req.session.user=req.body.username;
				req.session.admin=true;
				//console.log("Pass...");
				res.redirect('/index');
			});
			
		}
	});
	app.get ("/logout", function (req,res,next)
	{
	req.session.destroy();
	res.redirect('/');
	});
	app.get ("/logout", function (req,res,next)
	{
	req.session.destroy();
	res.redirect('/');
	});
	app.get('/index',authorize, function(req, res) {
		console.log(authorize);
		res.render('index_new',{rapidProDataSources:rapidProDataSources,menu:'main'});
		});
	app.get('/mapping',authorize, function(req, res) {
		res.render('mapping_new',{menu:'mapping'});
		});
	app.get('/view',authorize, function(req, res) {
		res.render('view_new',{menu:'view'});
		});
	app.get ('/listflows', function(req, res)
	{
		var token=req.query.token;
		console.log(req.query.token);
		oAPI.getListOfFlowsByToken(token,function(listFlows)
		{
			//console.log(listFlows);
			if(listFlows!=null)
			{
				//res.send(JSON.stringify(listFlows.results));
				//console.log(JSON.parse(listFlows));
				//var res=JSON.parse(listFlows);
				//console.log(listFlows.results);
				var listNonArchivedFlows=removeArchivedFlows(listFlows.results);
				var listWithRunsCompleted=removeNonRunningFlows(listNonArchivedFlows);
				//console.log(listWithRunsCompleted);
				res.send(listWithRunsCompleted);
			}
			else
			{
				//console.log("return empty object");
				res.send(JSON.stringify({}));
			}
		});
	});
	function removeArchivedFlows(listFlows)
	{
		var _listFlows=[];
		for (var indexFlow=0;indexFlow<listFlows.length;indexFlow++)
		{
			if(listFlows[indexFlow].archived==false)
			{
				_listFlows.push(listFlows[indexFlow]);
			}
			else
			{
				continue;
			}
			
		}
		return _listFlows;
		
	}
	function removeNonRunningFlows(listFlows)
	{
		var _listFlows=[];
		for (var indexFlow=0;indexFlow<listFlows.length;indexFlow++)
		{
			if(listFlows[indexFlow].runs.completed>0)
			{
				_listFlows.push(listFlows[indexFlow]);
			}
			else
			{
				continue;
			}
			
		}
		return _listFlows;
	}
	app.post('/flowValue',function(req,res)
	{
		console.log(req.body);
		res.send(null);
	});
	app.get('/flowbyid',function(req,res)
	{
		var uuidParam= req.query.uuid;
		//console.log(req.query);
		oAPI.getListOfFlows(function(listFlows)
		{
			//console.log();
			if(listFlows!=null)
			{
				var listFindedFlow=[];
				for(var indexFlow=0;indexFlow<listFlows.results.length;indexFlow++)
				{
					if(listFlows.results[indexFlow].uuid==uuidParam)
					{
						listFindedFlow.push(listFlows.results[indexFlow]);
					}
					else
					{
						continue;
					}
				}
				res.send(listFindedFlow);
			}
		});
	});
	//create the database,the question schema,Load standardized question
	app.get('/loadquestion',function(req,res)
	{
		oAPI.loadDataBaseData(function(resOP)
		{
			if(resOP==true)
			{
				console.log("Info: Question data loaded");
			}
			else
			{
				console.log("Error: Failed to load question data");
			}
			res.send(null);
		});
	});
	app.get('/getquestions',function(req,res)
	{
		/*var flowUUID="98bee14f-88d7-42fc-af39-693bcc82d382";
		var token="d3b0914fc43759e011ae6235262b668561e55a9a";
		* */
		//console.log(req.query);
		var token=req.query.token;
		var flowUUID=req.query.flowUUID;
		oAPI.getListOfFlowsQuestionByToken(token,flowUUID,function(listQuestions)
		{
			//console.log(listQuestions);
			//res.send(listQuestions);
			if(listQuestions!=null)
			{
				res.send(listQuestions);
			}
			else
			{
				res.send(JSON.stringify({}));
			}
		});
		
	});
	app.get('/getstdquestions',function(req,res)
	{
		
		oAPI.getListOfStandardizedQuestions(function(listStdQuestions)
		{
			//console.log(listStdQuestions);
			res.send(listStdQuestions);
		});
	});
	app.get('/savequestioncleaned',function(req,res)
	{
		var listQuestionDefinition=req.query.listQuestionDefinitions;
		var projectInformation=req.query.projectInformation;
		oAPI.saveFlowQuestionDefinition(listQuestionDefinition,function(resOP)
		{
			if(resOP==true)
			{
				console.log("Info: flowquestiondefinition created");
				oAPI.saveProjectInformation(projectInformation,function(resOp2)
				{
					res.send(resOp2);
				});
			}
			else
			{
				console.log("Error: Failed to create flowquestionDefinition");
				res.send(resOP);
			}
			
		});
	});
	app.get('/getmappingquestion',function(req,res)
	{
		//var token=req.query.token;
		var mappingQuestion=req.query;
		var flowUUID=mappingQuestion.flowUuid;
		console.log(req.query);
		oAPI.getListOfMappingQuestions(flowUUID,function(listMappingQuestions)
		{
			console.log("---Check if mapping exist--");
			//console.log(listMappingQuestions);
			if(listMappingQuestions.length>0)
			{
				console.log("mapping has been already done for"+mappingQuestion.country+"!!!!");
				console.log("could not create a new mapping for questions");
				res.send(false);
			}
			else
			{
				//create the questionMapping
				console.log("----Save if mapping not exist-----");
				console.log(mappingQuestion);
				oAPI.saveQuestionMapping(mappingQuestion,function(resOP)
				{
					
					if(resOP==true)
					{
						console.log("Info: QuestionMapping created");
					}
					else
					{
						console.log("Error: Failed to create question mapping");
					}
					res.send(resOP);
				});
			}
			//res.send(null);
		});
	});
	app.get('/getallmappingquestion',function(req,res)
	{
		oAPI.getListOfAllMappingQuestions(function(listMappingQuestions)
		{
			//console.log(listMappingQuestions);
			//console.log('-------------------------------');
			if(listMappingQuestions.length>0)
			{
				//console.log("mapping has been already done for"+mappingQuestion.country+"!!!!");
				//console.log("could not create a new mapping for questions");
				res.send(listMappingQuestions);
			}
			else
			{
				res.send([]);
				//create the questionMapping
				//console.log("----Save if mapping not exist-----");
				//console.log(mappingQuestion);
				
			}
			//res.send(null);
		});
	});
	app.get('/getallprojectinfo',function(req,res)
	{
		oAPI.getListProjectInformations(function(listProjectInformation)
		{
			if(listProjectInformation.length>0)
			{
				res.send(listProjectInformation);
			}
			else
			{
				res.send([]);
				
			}
			//res.send(null);
		});
	});
	app.get('/listcleanedquestion',function(req,res)
	{
		var flowUUID=req.query.flowUUID;
		oAPI.getListFlowQuestionDefinitions(flowUUID,function(listQuestionDefinition)
		{
			if(listQuestionDefinition.length>0)
			{
				res.send(listQuestionDefinition);
			}
			else
			{
				res.send([]);
				
			}
			//res.send(null);
		});
	});
	app.get('/getresponsesflowbycat',function(req,res)
	{
		/*
		var token="d3b0914fc43759e011ae6235262b668561e55a9a";
		var flowUUID="98bee14f-88d7-42fc-af39-693bcc82d382";
		* */
		var token=req.query.token;
		var flowUUID=req.query.flowUUID;
		//console.log(req.query);
		
		oAPI.getListFlowAnswers(token,flowUUID,null,[],function(listResponses)
		{
			//console.log(listResponses);
			if(listResponses!=null)
			{
				if(listResponses.length>0)
				{
					var listQuestionResponseCategory=getQuestionResponsesCategory(listResponses);
					res.send(listQuestionResponseCategory);
				}
				else
				{
					res.send([]);
				}
			}
			else
			{
				res.send([]);
			}
			
		});
	});
	app.get('/getresponsesflow',function(req,res)
	{
		var token=req.query.token;
		var flowUUID=req.query.flowUUID;
		//console.log(req.query);
		
		oAPI.getListFlowAnswers(token,flowUUID,null,[],function(listResponses)
		{
			//console.log(listResponses);
			if(listResponses.length>0)
			{
				res.send(listResponses);
			}
			else
			{
				res.send([]);
			}
		});
	});
	app.get('/saveresponsemapping',function(req,res)
	{
		//var 
		listResponseMapping=req.query.responsesMapping;
		//console.log(listResponseMapping);
		oAPI.saveResponseMapping(listResponseMapping,function(resOP)
		{
			if(resOP==true)
			{
				console.log("Info: ResponseMapping created");
			}
			else
			{
				console.log("Error: Failed to create response mapping");
			}
			res.send(resOP);
		});
		//res.send(null);
	});
	app.get('/getresponsesmapping',function(req,res)
	{
		var listFlowUUID=req.query.listFlowUUID;
		//console.log(req.query);
		
		oAPI.getListOfResponsesMapping(listFlowUUID,function(listMappedResponses)
		{
			//if()
			res.send(listMappedResponses);
		});
	});
	function getQuestionResponsesCategory(listResponses)
	{

		var listQuestionResponseCategory=[];
		for(var indexResponse=0;indexResponse<listResponses.length;indexResponse++)
		{
			var oResponse={ruleId:listResponses[indexResponse].ruleId,response:listResponses[indexResponse].response,responseCategory:listResponses[indexResponse].responseCategory};
			var inTheList=checkIfResponseInTheList(listQuestionResponseCategory,oResponse);
			if(!inTheList)
			{
				listQuestionResponseCategory.push(oResponse);
			}
			else
			{
				continue;
			}
			
		}
		//console.log('---------list categories-------------');
		//console.log(listQuestionResponseCategory);
		return listQuestionResponseCategory;
	};
	function checkIfResponseInTheList(listResponses,responseItem)
	{
		var itemFound=false;
		for(var index=0;index<listResponses.length;index++)
		{
			if(listResponses[index].ruleId==responseItem.ruleId && listResponses[index].response==responseItem.response)
			{
				itemFound=true;
				break;
			}
			else
			{
				continue;
			}
		}
		return itemFound;
	}
	
}).call(this);