exports.formatDates = list => {
//console.log(list);
    return list.map( singleObj => {
        const newObj = {...singleObj};
        const newDate = new Date(newObj.created_at);
        newObj.created_at = newDate;
        return newObj;
       });
};

exports.makeRefObj = list => {
    const refObj = {};
	list.forEach(item => {
		refObj[item.title] = item.article_id;
	});
	return refObj;
};

exports.formatComments = (comments, articleRef) => {
    return comments.map(item => {
        const newItem = {...item};
        newItem.article_id = newItem.belongs_to;
        delete newItem.belongs_to;
        newItem.author = newItem.created_by;
        delete newItem.created_by;
        const newDate = new Date(newItem.created_at);
        newItem.created_at = newDate;
        const articleRefKeys = Object.keys(articleRef);
        const articleRefValues = Object.values(articleRef);
        for(let i = 0; i < articleRef.length; i++){
            if (newItem.author === articleRefKeys[i]){
                newItem.author = articleRefValues[i];
               
            }
            
        }
        
        
        
            
    
        console.log(newItem);
        console.log(Object.keys(newItem));
          return newItem;
        });
    };
