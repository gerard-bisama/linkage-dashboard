var mongoose = require('mongoose');
 
mongoose.connect('mongodb://localhost:27017/lnkdashboard');
var Schema=mongoose.Schema;
//id_sparrow: smsid generate by sparrow
//direction: in from sparrow,out from rapidpro
//status: 0 if message not notify to rapidpro,1 if notify to rapidpro

/*
var flowSchema = Schema({
	name:String,
	uuid:String,
	questions:[
	{
		id:String,
		title:String,
		response:String,
		contact:String,
		contactId:String,
		stdQuestion:String,
		StdAnswer:String
	}],
	country:String
});*/
var questionMappingSchema = Schema({
	flowName:String,
	flowUuid:String,
	questions:[
	{
		id:String,
		title:String,
		idStdQuestion:String,
		stdQuestion:String,
		stdResponsesOption:[
		{
			option:String,
			description:String
		}
		]
	}],
	country:String,
	token:String
});
var projectSchema = Schema({
	flowName:String,
	flowUUID:String,
	country:String,
	token:String
});
var flowQuestionDefinitionSchema=Schema({
	flowUUID:String,
	questionId:String,
	question:String,
	responseHeader:String,
	ruleId:String,
	ruleLabel:String
});
var responseMappingSchema= Schema({
	contactId:String,
	contact:String,
	flowUuid:String,
	questionId:String,
	question:String,
	questionLabel:String,
	responseId:String,
	response:String,
	time:String
});
var StandardQuestionSchema=Schema({
	id:String,
	question:String,
	category:String,
	responsesOption:[{
		option:String,
		description:String
		}]
	});
var userSchema=Schema({
	username: String,
	password:String
	});
//Create Object instance
var User=mongoose.model('User',userSchema);
var Counters = new Schema({
  _id:String, // the schema name
  count: Number
});
Counters.statics.findAndModify = function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
};
var Counter = mongoose.model('Counter', Counters);
function incrementCounter(schemaName, callback){
  Counter.findAndModify({ _id: schemaName }, [], 
    { $inc: { count: 1 } }, {"new":true, upsert:true}, function (err, result) {
      if (err)
        callback(err);
      else
        callback(null,result.count);
  });
}
var  getQuestionCurrentCounter=function (callback)
{
	incrementCounter("Question",function(res)
	{
		//console.log(res);
		Counter.findOne({}).exec(function(error,msgs){
		if(error) return handleError(err);
		return callback(msgs.count);
		});
	});
}
//
var StandardizedQuestion=mongoose.model('StandardizedQuestion',StandardQuestionSchema);
var questionsMapping=mongoose.model('questionsMapping',questionMappingSchema);
var responsesMapping=mongoose.model('responsesMapping',responseMappingSchema);
var FlowQuestionDefinitions=mongoose.model('flowQuestionDefinition',flowQuestionDefinitionSchema);
var ProjectInformation=mongoose.model('ProjectInformation',projectSchema);

//Return true if the user exist and false if not
var checkUserExist= function(username,password,callback){
	//Check if admin user exist
	var requestResult=User.findOne({username:username,password:password},function(err,foundUser){
	if(err) return handleError(err);
	//console.log("------------------------------");
	//console.log(foundUser);
	if(foundUser!==null)
	{
		return callback(true);
	}
	else
	{
		return callback(false);
	}
	})	;
	return requestResult;
	console.log("result:"+requestResult);
	}
var saveStandardizedQuestion=function (standardizedQuestion,callback)
{
	//var generatedId=getNextSequenceValue("Question");
	//console.log("Generated ID"+generatedId);
	var oStandardizedQuestionToAdd=new StandardizedQuestion({id:standardizedQuestion.id,question:standardizedQuestion.question,
		category:standardizedQuestion.category,responsesOption:standardizedQuestion.responsesOption});
	var requestResult=oStandardizedQuestionToAdd.save(function(err,result){
		if(err) return handleError(err);
		if(result!==null) 
		{
			return callback(true);
		}
		else
		{
			return callback(false);
		}
		});//end save
	/*
	getQuestionCurrentCounter(function(resdB)
	{
		var generatedId=resdB;
		var oStandardizedQuestionToAdd=new StandardizedQuestion({id:generatedId,question:standardizedQuestion.question,
			category:standardizedQuestion.category,responsesOption:standardizedQuestion.responsesOption});
		var requestResult=oStandardizedQuestionToAdd.save(function(err,result){
			if(err) return handleError(err);
			if(result!==null) 
			{
				return callback(true);
			}
			else
			{
				return callback(false);
			}
			});//end save
	});//end get*/
}
var saveResponseMapping=function (responseMapping,callback)
{
	
	var oResponseMappingToAdd=new responsesMapping({contactId:responseMapping.contactId,contact:responseMapping.contact,flowUuid:responseMapping.flowUuid,
		questionId:responseMapping.questionId,question:responseMapping.question,questionLabel:responseMapping.questionLabel,
		responseId:responseMapping.responseId,response:responseMapping.response,time:responseMapping.time});
	var requestResult=oResponseMappingToAdd.save(function(err,result){
		if(err) return handleError(err);
		if(result!==null) 
		{
			return callback(true);
		}
		else
		{
			return callback(false);
		}
		});//end save
}
var saveFlowQuestionDefinition=function (flowQuestionDefinition,callback)
{
	
	var oFlowQuestionDefinitionToAdd=new FlowQuestionDefinitions({flowUUID:flowQuestionDefinition.flowUUID,questionId:flowQuestionDefinition.questionId,
		question:flowQuestionDefinition.question,responseHeader:flowQuestionDefinition.responseHeader,ruleId:flowQuestionDefinition.ruleId,ruleLabel:flowQuestionDefinition.ruleLabel});
	var requestResult=oFlowQuestionDefinitionToAdd.save(function(err,result){
		if(err) return handleError(err);
		if(result!==null) 
		{
			return callback(true);
		}
		else
		{
			return callback(false);
		}
		});//end save
}
var upsertFlowQuestionDefinition=function (flowQuestionDefinition,callback)
{
	
	var oFlowQuestionDefinitionToAdd=new FlowQuestionDefinitions({flowUUID:flowQuestionDefinition.flowUUID,questionId:flowQuestionDefinition.questionId,
		question:flowQuestionDefinition.question,responseHeader:flowQuestionDefinition.responseHeader,ruleId:flowQuestionDefinition.ruleId,
		ruleLabel:flowQuestionDefinition.ruleLabel});
	FlowQuestionDefinitions.findOne({flowUUID:flowQuestionDefinition.flowUUID,questionId:flowQuestionDefinition.questionId}).exec(function(error,_flowQuestionDefinition){
		if(error) {return handleError(err);}
		else
		{
			//console.log(_flowQuestionDefinition);
			//console.log("-------------------------------------");
			if(!_flowQuestionDefinition)
			{
				
				_flowQuestionDefinition=new FlowQuestionDefinitions({flowUUID:flowQuestionDefinition.flowUUID,questionId:flowQuestionDefinition.questionId,
				question:flowQuestionDefinition.question,responseHeader:flowQuestionDefinition.responseHeader,ruleId:flowQuestionDefinition.ruleId,
				ruleLabel:flowQuestionDefinition.ruleLabel});
				var requestResult=_flowQuestionDefinition.save(function(err,result){
				if(err) return handleError(err);
				if(result!==null) 
				{
					return callback(true);
				}
				else
				{
					return callback(false);
				}
				});//end save
		
			}
			else
			{
				return callback(true);
			}
		}
		//return callback(mappingQuestions);
		});
}

var saveProjectInformation=function (projectInformation,callback)
{
	
	var oProjectInfoToAdd=new ProjectInformation({flowUUID:projectInformation.flowUUID,flowName:projectInformation.flowName,
		country:projectInformation.country,token:projectInformation.token});
	var requestResult=oProjectInfoToAdd.save(function(err,result){
		if(err) return handleError(err);
		if(result!==null) 
		{
			return callback(true);
		}
		else
		{
			return callback(false);
		}
		});//end save
}
var getListStandardizedQuestions= function(callback){
	var requestResult=StandardizedQuestion.find({}).exec(function(error,questions){
		if(error) return handleError(err);
		return callback(questions);
		});
}
var getQuestionMapping=function (_flowUUID,callback)
{
	var requestResult=questionsMapping.find({flowUuid:_flowUUID}).exec(function(error,mappingQuestions){
		if(error) return handleError(err);
		return callback(mappingQuestions);
		});
}
var getResponsesMappingByFlow=function (listFlowUUID,callback)
{
	var requestResult=responsesMapping.find({flowUuid:{$in:listFlowUUID}}).exec(function(error,mappedResponses){
		if(error) return handleError(err);
		return callback(mappedResponses);
		});
}
var getAllQuestionMapping=function (callback)
{
	var requestResult=questionsMapping.find({}).exec(function(error,mappingQuestions){
		if(error) return handleError(err);
		return callback(mappingQuestions);
		});
}
var getAllFlowQuestionDefinition=function (_flowUUID,callback)
{
	var requestResult=FlowQuestionDefinitions.find({flowUUID:_flowUUID}).exec(function(error,listFlowQuestionDefinitions){
		if(error) return handleError(err);
		return callback(listFlowQuestionDefinitions);
		});
}
var getListProjectInformation=function (callback)
{
	var requestResult=ProjectInformation.find({}).exec(function(error,projectinformations){
		if(error) return handleError(err);
		return callback(projectinformations);
		});
}
var saveQuestionMapping=function (questionMapping,callback)
{
	var oQuestionMappingToAdd=new questionsMapping({flowUuid:questionMapping.flowUuid,flowName:questionMapping.flowName,
		questions:questionMapping.questions,country:questionMapping.country,token:questionMapping.token});
	var requestResult=oQuestionMappingToAdd.save(function(err,result){
		if(err) return handleError(err);
		if(result!==null) 
		{
			return callback(true);
		}
		else
		{
			return callback(false);
		}
		});//end save
}

exports.checkUserExist=checkUserExist;
exports.saveStandardizedQuestion=saveStandardizedQuestion;
exports.getListStandardizedQuestions=getListStandardizedQuestions;
exports.getQuestionMapping=getQuestionMapping;
exports.saveQuestionMapping=saveQuestionMapping;
exports.getAllQuestionMapping=getAllQuestionMapping;
exports.saveResponseMapping=saveResponseMapping;
exports.getResponsesMappingByFlow=getResponsesMappingByFlow;
exports.saveFlowQuestionDefinition=saveFlowQuestionDefinition;
exports.upsertFlowQuestionDefinition=upsertFlowQuestionDefinition;
exports.saveProjectInformation=saveProjectInformation;
exports.getListProjectInformation=getListProjectInformation;
exports.getAllFlowQuestionDefinition=getAllFlowQuestionDefinition;

