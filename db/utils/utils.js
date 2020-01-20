exports.formatDates = list => {
  return list.map(singleObj => {
    const newObj = { ...singleObj };
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
    const newItem = { ...item };
    newItem.author = newItem.created_by;
    delete newItem.created_by;
    const newDate = new Date(newItem.created_at);
    newItem.created_at = newDate;

    const articleRefKeys = Object.keys(articleRef);
    const articleRefValues = Object.values(articleRef);

    for (let i = 0; i < articleRefKeys.length; i++) {
      if (newItem.belongs_to === articleRefKeys[i]) {
        newItem.article_id = articleRefValues[i];
      }
    }
    delete newItem.belongs_to;
    return newItem;
  });
};
