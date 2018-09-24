var User={
	"id": "",
	"username": "",
	"firstname": "",
	"lastname": "",
	"fullname": "",
	"email": "",
	"department": "",
	"firstaccess":"",
	"lastaccess":"",
	"auth": "",
	"suspended":"",
	"confirmed":"",
	"lang": "",
	"theme": "",
	"timezone": "",
	"mailformat":"",
	"enrolledCourses":[] //Course, user could be enrolled to more than one course
};
var Course={
	"id":"",
	"categoryid":"",
	"shortname":"",
	"fullname":"",
	"enrolledusercount":"",
	"idnumber":"",
	"visible":"",
	"format":"",
	"showgrades":"",
	"lang":"",
	"enablecompletion":"",
	"category":"",//A course is just under 1 caterory:1 course 1 category
	"progress":"",
	"startdate":"",
	"enddate":""
};
var CourseCategory={
	"id":"",
	"name": "",
	"idnumber":"",
	"description": "",
	"descriptionformat":"",
	"parent":"",
	"sortorder":"",
	"coursecount":"",
	"visible": "",
	"visibleold": "",
	"timemodified": "",
	"depth": "",
	"path": "",
	"theme": ""
}
exports.User=User;
exports.Course=Course;
exports.CourseCategory=CourseCategory;
