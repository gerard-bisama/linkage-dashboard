/**
 *  setup for test/development mode
 */
 //var btoa = require('btoa')
 var fs = require("fs");
 //var fs_extra = require("fs-extra");
 var path = require("path");
 var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
 var oDAO =require ("./dao");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var production = false;
var simulationMode=true;

/*
 * Setup for production mode
 */

const manifest = ReadJSONFile("manifest.webapp");
const administrator=manifest.administrator;
const rapidProDataSource=manifest.rapidProDataSource;
//const URLRAPIDROAPI="http://127.0.0.1:8000/api/v2";
const URLRAPIDROAPI=rapidProDataSource[0].apiurl;
const tokenRP=rapidProDataSource[0].token;
/**************************Data variables definition********************/ 
var listStandardizedQuestions=[
	{
		id:"1",
		question:"How satisfied are you with the services that you received in this facility?",
		category:"Customer satisfaction level",
		responsesOption:[{option:1,description:20},{option:2,description:40},{option:3,description:60},{option:4,description:80},{option:5,description:100}]
	},
	{
		id:"2",
		question:"Would you recommend this facility to your friends?",
		category:"KP friendly facility",
		responsesOption:[{option:1,description:20},{option:2,description:40},{option:3,description:60},{option:4,description:80},{option:5,description:100}]
	},
	{
		id:"3",
		question:"Did staff judge you because you are a KP member?",
		category:"KP friendly facility",
		responsesOption:[{option:1,description:20},{option:2,description:40},{option:3,description:60},{option:4,description:80},{option:5,description:100}]
	},
	{
		id:"4",
		question:"Did staff refuse to attend to you/issue care because you are a KP member?",
		category:"KP friendly facility",
		responsesOption:[{option:1,description:20},{option:2,description:40},{option:3,description:60},{option:4,description:80},{option:5,description:100}]
	},
	{
		id:"5",
		question:"Were staff welcoming and respectful towards you during your visit?",
		category:"KP friendly facility",
		responsesOption:[{option:1,description:20},{option:2,description:40},{option:3,description:60},{option:4,description:80},{option:5,description:100}]
	},
	{
		id:"6",
		question:"What is the KP category of this respondant?",
		category:"Survey participation",
		responsesOption:[{option:1,description:'MSM'},{option:2,description:'TRANSGENDER'},{option:3,description:'SEX WORKER'},{option:4,description:'OTHERS'}]
	},
	{
		id:"7",
		question:"What is the facility type?",
		category:"Survey participation",
		responsesOption:[{option:1,description:'PUBLIC'},{option:2,description:'PRIVATE'},{option:3,description:'COMMUNITY_NGO'},{option:4,description:'OTHERS'}]
	},
	{
		id:"8",
		question:"Have knowledge on KP definition?",
		category:"Survey participation",
		responsesOption:[{option:1,description:'YES'},{option:2,description:'NO'}]
	},
	{
		id:"9",
		question:"Is the facility visited by KPS?",
		category:"Survey participation",
		responsesOption:[{option:1,description:'YES'},{option:2,description:'NO'},{option:2,description:'DONT KNOW'}]
	},
	{
		id:"10",
		question:"Is stigma condamned in the facility?",
		category:"Survey participation",
		responsesOption:[{option:1,description:'YES'},{option:2,description:'NO'},{option:2,description:'DONT KNOW'}]
	},
	{
		id:"10",
		question:"Does facility have stigma policies against KPS?",
		category:"Survey participation",
		responsesOption:[{option:1,description:'YES'},{option:2,description:'NO'},{option:2,description:'DONT KNOW'}]
	}
];

//console.log("server sparrow:", URLSPARROW, "headers:", headersSPARROW);
//console.log("server sms2:", URLRP, "headers:", headersRP);

/***********************************************************/

/**
 * Default options object to send along with each request
 */

function ReadJSONFile(fileName)
{
	var arrayPath=__dirname.split('/');
	var parentDirectory="/";
	for(var i=0;i<(arrayPath.length)-1;i++)
	{
		parentDirectory+=arrayPath[i]+"/";
	}
	//console.log("-------------");
	var filePath=path.resolve(path.join(parentDirectory, "/", fileName));
	//console.log(filePath);
	
	var contents = fs.readFileSync(filePath);
	console.log(filePath);
	var jsonContent = JSON.parse(contents);
	return jsonContent;
}
exports.checkUserExist=function checkUserExist(username,password,callback)
{
	oDAO.checkUserExist(username,password,function(resOp)
	{
		callback(resOp);
	});
}
exports.getListOfFlows= function getListOfFlows(callback)
{
	var urlRequest=`${URLRAPIDROAPI}/flows.json`;
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');	
	//request.setRequestHeader(tokenRP);
	//request.setRequestHeader('Authorization','Token d3b0914fc43759e011ae6235262b668561e55a9a');
	request.setRequestHeader('Authorization','Token '+tokenRP);
	request.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			//console.log("res sms : "+this.responseText);
			var myArr=null;
			if(this.responseText!="")
			{
				var myArr = JSON.parse(this.responseText);
				//var myArr = this.responseText;
			}
			
			//var modifiedArray = [myArr];
			//console.log(myArr);
			return callback(myArr);
			}
			else if (this.readyState == 4 && this.status != 200)
			{
				console.log(this.responseText);
			}
		};
		request.send();
}
exports.getListOfFlowsByToken= function getListOfFlowsByToken(token,callback)
{
	var tokenServer=token;
	var urlRequest=`${URLRAPIDROAPI}/flows.json`;
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');	
	//request.setRequestHeader(tokenRP);
	//request.setRequestHeader('Authorization','Token d3b0914fc43759e011ae6235262b668561e55a9a');
	//request.setRequestHeader('Authorization','Token '+tokenRP);
	request.setRequestHeader('Authorization','Token '+tokenServer);
	request.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			//console.log("res sms : "+this.responseText);
			var myArr=null;
			if(this.responseText!="")
			{
				var myArr = JSON.parse(this.responseText);
				//var myArr = this.responseText;
			}
			
			//var modifiedArray = [myArr];
			//console.log(myArr);
			return callback(myArr);
			}
			else if (this.readyState == 4 && this.status != 200)
			{
				console.log(this.responseText);
				return callback(null);
			}
		};
		request.send();
}
exports.getListFlowAnswers= function getListFlowAnswers(token,flowUUID,nextLink,storedEntries,callback)
{
	const tokenServer=token;
	const _flowUUID=flowUUID;
	var urlRequest="";
	if(nextLink==null)
	{
		urlRequest=`${URLRAPIDROAPI}/runs.json?flow=${_flowUUID}`;
	}
	//var urlRequest=`${URLRAPIDROAPI}/runs.json?flow=${_flowUUID}`;
	else
	{
		urlRequest=nextLink;
	}
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');
	request.setRequestHeader('Authorization','Token '+tokenServer);
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myArr=null;
			var listAnswer=[];
			if(this.responseText!="")
			{
				var tempRuns = JSON.parse(this.responseText);
				//check if the flow has results after triggering
				for(var indexResults=0;indexResults<tempRuns.results.length;indexResults++)
				{
					var oRun=tempRuns.results[indexResults];
					//check if the flow is completed and then if there is responses
					var emptyJSON=JSON.stringify(new Object());
					if(oRun.exit_type=="completed" && JSON.stringify(oRun.values)!=emptyJSON)
					{
						//get values of each properties within values
						for(var key in oRun.values)
						{
							var oValue=oRun.values[key];
							var responseCategory="";
							if(oValue.category=="All Responses")
							{
								responseCategory=oValue.value;
							}
							else
							{
								responseCategory=oValue.category;
							}
						
							var oResponse={contactId:oRun.contact.uuid,contact:oRun.contact.name,flowUUID:oRun.flow.uuid,ruleId:oValue.node,response:oValue.value,responseCategory:responseCategory,time:oValue.time};
							storedEntries.push(oResponse);
						} 
						//var oResponse={contactId:,Contact:,flowUUID:,};
					}
					else
					{
						continue;
					}
				}
				if(tempRuns.next!=null)
				{
					getListFlowAnswers(token,flowUUID,tempRuns.next,storedEntries,callback);
				}
				else
				{
					return callback(storedEntries);
				}
				
			}
		}
		else if (this.readyState == 4 && this.status != 200)
		{
			console.log(this.responseText);
			return callback(null);
		}
	}
	request.send();
		
}
exports.getListOfFlowsQuestionByToken= function getListOfFlowsQuestionByToken(token,flowUUID,callback)
{
	const tokenServer=token;
	const _flowUUID=flowUUID;
	var urlRequest=`${URLRAPIDROAPI}/definitions.json?flow=${_flowUUID}`;
	//console.log(urlRequest);
	var request = new XMLHttpRequest();
	request.open('GET',urlRequest, true);
	request.setRequestHeader('Content-Type','application/json');	
	//request.setRequestHeader(tokenRP);
	//request.setRequestHeader('Authorization','Token d3b0914fc43759e011ae6235262b668561e55a9a');
	//request.setRequestHeader('Authorization','Token '+tokenRP);
	request.setRequestHeader('Authorization','Token '+tokenServer);
	request.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
			//console.log("res sms : "+this.responseText);
			var myArr=null;
			var listQuestions=[];
			if(this.responseText!="")
			{
				var tempObject = JSON.parse(this.responseText);
				//console.log(tempObject);
				if(tempObject.flows.length>0)//check if is the valid object
				{
					for (indexFlow=0;indexFlow<tempObject.flows.length;indexFlow++)
					{
						if(tempObject.flows[indexFlow].action_sets.length>0)//has questions
						{
							for(indexActionSet=0;indexActionSet<tempObject.flows[indexFlow].action_sets.length;indexActionSet++)
							{
								//console.log("-------------------------");
								//console.log(tempObject.flows[indexFlow].action_sets[indexActionSet]);
								
								var questionUUID=tempObject.flows[indexFlow].action_sets[indexActionSet].uuid;
								var listActions=tempObject.flows[indexFlow].action_sets[indexActionSet].actions;
								var correspondedRule=tempObject.flows[indexFlow].action_sets[indexActionSet].destination;
								//console.log(listActions);
								//if(oAction.)
								var questionString="";
								//Concat questions to one
								for(var indexAction=0;indexAction<listActions.length;indexAction++)
								{
									//console.log(listActions[indexAction].msg.base);
									if(listActions[indexAction].type=="reply")
									{
										//questionString+=listActions[indexAction].msg.base;
										questionString+=listActions[indexAction].msg.fre;
									}
								}
								//Now get rule information
								var listRules=tempObject.flows[indexFlow].rule_sets;
								var ruleLabel="";
								for(var indexRule=0;indexRule<listRules.length;indexRule++)
								{
									if(listRules[indexRule].uuid==correspondedRule)
									{
										ruleLabel=listRules[indexRule].label;
										break;
									}
									else
									{
										continue;
									}
								}
								//console.log("question uuid:"+questionUUID);
								//console.log("question:"+questionString);
								if(ruleLabel!="")
								{
									var oQuestion={id:questionUUID,msg:questionString,ruleId:correspondedRule,responseLabel:ruleLabel};
									var indexExistingQuestion=getIdOfSimilarResponseRule(listQuestions,ruleLabel);
									if(indexExistingQuestion>=0)
									{
										listQuestions[indexExistingQuestion].msg=listQuestions[indexExistingQuestion].msg+" ||Option:"+questionString;
									}
									else
									{
										listQuestions.push(oQuestion);
									}
									//console.log(oQuestion);
									
								}
								
							}//end action_sets
						}
						else
						{
							continue;
						}
						
					}
				}//end construct of responses list
				//var myArr = this.responseText;
			}
			
			//var modifiedArray = [myArr];
			//console.log(myArr);
			if(listQuestions.length>0)
			{
				return callback(listQuestions);
			}
			else
			{
				return callback(null);
			}
			
			}
			else if (this.readyState == 4 && this.status != 200)
			{
				console.log(this.responseText);
				return callback(null);
			}
		};
		request.send();
}
function getIdOfSimilarResponseRule(listQuestions,responseLabel)
{
	var foundIndex=-1;
	for(var indexQuestion=0;indexQuestion<listQuestions.length;indexQuestion++)
	{
		if(listQuestions[indexQuestion].responseLabel==responseLabel)
		{
			foundIndex=indexQuestion;
			break;
		}
	}
	return foundIndex;
}
exports.loadDataBaseData=function (callback)
{
	var async = require("async");
	async.each(listStandardizedQuestions,function(standardizedQuestion,callback)
	{
		oDAO.saveStandardizedQuestion(standardizedQuestion,function(resOp)
		{
			if(resOp==false)
			{
				console.log("Error:Failed to load standardized question on init!!!!!!!!");
			}
			else
			{
				console.log("Info:Question loaded!!!!!")
			}
			callback();
		});
	},function(err)
		{
			console.log("Info:Finished to load question on init");
			callback(true);
		}
	);
}
exports.saveResponseMapping=function (listResponseMapping,callback)
{
	var async = require("async");
	async.each(listResponseMapping,function(responseMapping,callback)
	{
		//console.log(responseMapping);
		console.log(responseMapping);
		console.log("-------------------------------------");
		oDAO.saveResponseMapping(responseMapping,function(resOp)
		{
			if(resOp==false)
			{
				console.log("Error:Failed to load standardized question on init!!!!!!!!");
			}
			else
			{
				console.log("Info:Question loaded!!!!!")
			}
			callback();
		});
	},function(err)
		{
			console.log("Info:Finished to load question on init");
			callback(true);
		}
	);
}
exports.saveFlowQuestionDefinition=function (listFlowQuestionDefinition,callback)
{
	var async = require("async");
	async.each(listFlowQuestionDefinition,function(flowQuestionDefinition,callback)
	{
		//console.log(responseMapping);
		oDAO.saveFlowQuestionDefinition(flowQuestionDefinition,function(resOp)
		{
			if(resOp==false)
			{
				console.log("Error:Failed to save question definition!!!!!!!!");
			}
			else
			{
				console.log("Info:Question saved!!!!!")
			}
			callback();
		});
	},function(err)
		{
			console.log("Info:Finished to save flowquestiondefinitions");
			callback(true);
		}
	);
}
exports.upsertFlowQuestionDefinition=function (listFlowQuestionDefinition,callback)
{
	var async = require("async");
	async.each(listFlowQuestionDefinition,function(flowQuestionDefinition,callback)
	{
		//console.log(responseMapping);
		oDAO.upsertFlowQuestionDefinition(flowQuestionDefinition,function(resOp)
		{
			if(resOp==false)
			{
				console.log("Error:Failed to save question definition!!!!!!!!");
			}
			else
			{
				console.log("Info:Question saved!!!!!")
			}
			callback();
		});
	},function(err)
		{
			console.log("Info:Finished to save flowquestiondefinitions");
			callback(true);
		}
	);
}
exports.getListOfStandardizedQuestions=function(callbackReturn)
{
	listStandardizedQuestions=[];
	oDAO.getListStandardizedQuestions(function(listQuestions)
	{
		//console.log(listQuestions);
		var async = require("async");
		async.each(listQuestions,function(standardizedQuestion,callback)
		{
			var oQuestion={id:standardizedQuestion.id,question:standardizedQuestion.question,category:standardizedQuestion.category,
				responsesOption:[]};
			for(var indexOption=0;indexOption<standardizedQuestion.responsesOption.length;indexOption++)
			{
				var oOption={option:standardizedQuestion.responsesOption[indexOption].option,
					description:standardizedQuestion.responsesOption[indexOption].description};
				oQuestion.responsesOption.push(oOption);
			}
			//console.log(oQuestion);
			//console.log("-----------------------");
			listStandardizedQuestions.push(oQuestion);
			//console.log(listStandardizedQuestions);
			callback();
		},function(err)
		{
			console.log("Info:Finished to build question list");
			//callback(true);
			callbackReturn(listStandardizedQuestions);
		});
	});
}
exports.getListOfMappingQuestions=function(flowUUID,callbackReturn)
{
	_listMappingQuestions=[];
	oDAO.getQuestionMapping(flowUUID,function(listMappingQuestions)
	{
		//console.log(listQuestions);
		var async = require("async");
		async.each(listMappingQuestions,function(mappingQuestion,callback)
		{
			var oMappingQuestion={flowUuid:mappingQuestion.flowUuid,flowName:mappingQuestion.flowName,questions:[],country:mappingQuestion.country};
			for(var indexQuestion=0;indexQuestion<mappingQuestion.questions.length;indexQuestion++)
			{
				var oQuestion=mappingQuestion.questions[indexQuestion];
				oMappingQuestion.questions.push({id:oQuestion.id,title:oQuestion.title,idStdQuestion:oQuestion.idStdQuestion,
					questions:oQuestion.questions});
			}
			_listMappingQuestions.push(oMappingQuestion);
			//console.log(listStandardizedQuestions);
			callback();
		},function(err)
		{
			console.log("------Info:Finished to build mapping question list-----------");
			//callback(true);
			callbackReturn(_listMappingQuestions);
		});
	});
}
exports.getListOfResponsesMapping=function(listFlowUUID,callbackReturn)
{
	_listMappingResponses=[];
	oDAO.getResponsesMappingByFlow(listFlowUUID,function(listMappingResponses)
	{
		//console.log(listQuestions);
		var async = require("async");
		async.each(listMappingResponses,function(mappingResponse,callback)
		{
			var oMappingResponse={contactId:mappingResponse.contactId,contact:mappingResponse.contact,flowUuid:mappingResponse.flowUuid,
				questionId:mappingResponse.questionId,question:mappingResponse.question,questionLabel:mappingResponse.questionLabel,
				responseId:mappingResponse.responseId,response:mappingResponse.response,time:mappingResponse.time};
			_listMappingResponses.push(oMappingResponse);
			//console.log(listStandardizedQuestions);
			callback();
		},function(err)
		{
			console.log("------Info:Finished to build mapping question list-----------");
			callbackReturn(_listMappingResponses);
		});
	});
}
exports.getListFlowQuestionDefinitions=function(flowUUID,callbackReturn)
{
	_listFlowQuestionDefinitions=[];
	oDAO.getAllFlowQuestionDefinition(flowUUID,function(listFlowQuestionDefinitions)
	{
		//console.log(listQuestions);
		var async = require("async");
		async.each(listFlowQuestionDefinitions,function(flowQuestionDefinition,callback)
		{
			var oFlowQuestionDefinition={flowUUID:flowQuestionDefinition.flowUUID,questionId:flowQuestionDefinition.questionId,
			question:flowQuestionDefinition.question,responseHeader:flowQuestionDefinition.responseHeader,
			ruleId:flowQuestionDefinition.ruleId,ruleLabel:flowQuestionDefinition.ruleLabel};
			_listFlowQuestionDefinitions.push(oFlowQuestionDefinition);
			callback();
		},function(err)
		{
			console.log("------Info:Finished to build flowQuestionDefinition list-----------");
			callbackReturn(_listFlowQuestionDefinitions);
		});
	});
}
exports.getListOfAllMappingQuestions=function(callbackReturn)
{
	listMappingQuestions=[];
	oDAO.getAllQuestionMapping(function(listMappingQuestions)
	{
		//console.log(listQuestions);
		var async = require("async");
		async.each(listMappingQuestions,function(mappingQuestion,callback)
		{
			var oMappingQuestion={flowUuid:mappingQuestion.flowUuid,flowName:mappingQuestion.flowName,questions:[],country:mappingQuestion.country};
			for(var indexQuestion=0;indexQuestion<mappingQuestion.questions.length;indexQuestion++)
			{
				var oQuestion=mappingQuestion.questions[indexQuestion];
				oMappingQuestion.questions.push({id:oQuestion.id,title:oQuestion.title,idStdQuestion:oQuestion.idStdQuestion,
					questions:oQuestion.questions});
			}
			listMappingQuestions.push(oMappingQuestion);
			//console.log(listStandardizedQuestions);
			callback();
		},function(err)
		{
			console.log("------Info:Finished to build mapping question list-----------");
			//console.log(listMappingQuestions);
			//callback(true);
			callbackReturn(listMappingQuestions);
		});
	});
}
exports.getListProjectInformations=function(callbackReturn)
{
	listProjectInformations=[];
	oDAO.getListProjectInformation(function(listProjectInformations)
	{
		//console.log(listQuestions);
		var async = require("async");
		async.each(listProjectInformations,function(projectInformation,callback)
		{
			var oProjectInformation=({flowUUID:projectInformation.flowUUID,flowName:projectInformation.flowName,
		country:projectInformation.country,token:projectInformation.token});
			listProjectInformations.push(oProjectInformation);
			//console.log(listStandardizedQuestions);
			callback();
		},function(err)
		{
			console.log("------Info:Finished to build mapping question list-----------");
			callbackReturn(listProjectInformations);
		});
	});
}
exports.saveQuestionMapping= function saveQuestionMapping(questionMapping,callback)
{
	oDAO.saveQuestionMapping(questionMapping,function(resOp)
	{
		if(resOp==false)
			{
				console.log("Error:Failed to save question mapping!!!!!!!!");
			}
			else
			{
				console.log("Info:QuestionMapping saved!!!!!")
			}
		callback(resOp);
	});
}
exports.saveProjectInformation= function saveProjectInformation(projectInformation,callback)
{
	oDAO.saveProjectInformation(projectInformation,function(resOp)
	{
		if(resOp==false)
			{
				console.log("Error:Failed to save project info!!!!!!!!");
			}
			else
			{
				console.log("Info:Project information saved!!!!!")
			}
		callback(resOp);
	});
}
exports.getAdministrator=function getAdministrator()
{
	return administrator;
}
exports.getRapidProDataSources=function getRapidProDataSources()
{
	return rapidProDataSource;
}
