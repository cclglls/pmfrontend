/*
var myArr = [{resourceType:"myRT",
            id: 1,
            value:"ha"},
            {resourceType:"myRT",
            id: 2,
            value:"he"},
            {resourceType:"myRT",
            id: 3,
            value:"Li"}];


{
 "1":{"resourceType":"myRT","id":"1","value":"ha"},
 "2":{"resourceType":"myRT","id":"2","value":"he"},
 "3":{"resourceType":"myRT","id":"3","value":"Li"}
}



var cart = {};
myArr.map(function(myObj){
                    cart[myObj.id]= myObj;
                    });
console.log(cart);
*/
/* Modèle */ 
var initialData = {
    tasks :{
    'tasks-1' : {id: 'tasks-1', content : "Create Login page"},
    'tasks-2' : {id: 'tasks-2', content : "Create Dashboard"},
    'tasks-3' : {id: 'tasks-3', content : "Project modal"},
    'tasks-4' : {id: 'tasks-4', content : "Find an internship"},
    'tasks-5' : {id: 'tasks-5', content : "Learn React native"},
    'tasks-6' : {id: 'tasks-6', content : "Graph & stats"},
    },
    columns : {
        'column-1': {
            id : 'column-1',
            title: 'To do',
            taskIds: ['tasks-1', 'tasks-2', 'tasks-3', 'tasks-4'],
        },
        'column-2': {
            id : 'column-2',
            title: 'In progress',
            taskIds: ['tasks-6'],
        },
        'column-3': {
            id : 'column-3',
            title: 'Done',
            taskIds: ['tasks-5'],
        },
    },
    
    columnOrder: ['column-1', 'column-2', 'column-3'],
};

//console.log(initialData.columns);
var sections = [];

for (const property in initialData.columns) {
	//console.log(property);
	
	var idsection=property.slice(7);
	//console.log('idsection',idsection);
	
	//console.log(initialData.columns[property].taskIds);
	var taskIds = initialData.columns[property].taskIds.map(function(task) {
		var idtask = { _id: task.slice(6) };
		//console.log(idtask);
		return idtask;
	});
	//console.log(taskIds);
	section = { _id: idsection , task: taskIds };
	sections.push(section);
}

console.log('sections',sections);

console.log('---------------------------------------------------------------------------');

var sections = [
	{
		_id: 1,
		name: 'section 1',
		task: [ {_id: 1, name: 'task 1'}, {_id: 2, name: 'task 2'}, {_id: 3, name: 'task 3'} ]
	},
	{
		_id: 2,
		name: 'section 2',
		task: [ {_id: 4, name: 'task 4'}, {_id: 5, name: 'task 5'}, {_id: 6, name: 'task 6'} ]
		
	},
	{
		_id: 3,
		name: 'section 3',
		task: [ {_id: 7, name: 'task 7'}, {_id: 8, name: 'task 8'}, {_id: 9, name: 'task 9'} ]
		
	}
]; 

var tasks = {};
var columns = {};
var columnOrder = [];

sections.map(function(section) {
	var taskIds = section.task.map(function(task) {
		var taskId = `tasks-${task._id}`;
		return  taskId;
	});
	//console.log(taskIds);
	columns[`column-${section._id}`] = {id: `column-${section._id}`, title: section.name, taskIds: taskIds};
	columnOrder.push(`column-${section._id}`);
});
//console.log('columns',columns);
//console.log('columnOrder',columnOrder);

for (var i = 0; i < sections.length; i++) {
	
	sections[i].task.map(function(task){
    tasks[`tasks-${task._id}`] = {id: `tasks-${task._id}`, content: task.name};
  });
  
}

//console.log('tasks',tasks);


initialData = {};
initialData.tasks = tasks;
initialData.columns = columns;

initialData.columnOrder = columnOrder;

//console.log('initialData',initialData);




