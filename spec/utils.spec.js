const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
it('when passed an array returns a new array', () => {
  expect(formatDates([])).to.be.eql([]);
})
it('takes a array with a single object with timestamp and returns the whole object with a js data object', () => {
  const input = [
    {
    created_at: 1542284514171
  }];
  const actualValue = formatDates(input);
  const expectedValue = { created_at: new Date(1542284514171)}
  expect(actualValue).to.eql([expectedValue]);
})
it('takes a array with a multiple object with timestamp and returns the whole object with a js data object', () => {
  const input = [
    {
    created_at: 1542284514171
  }, 
  {
    created_at: 1543384514171
  }
];
  const actualValue = formatDates(input);
  const expectedValue = [{ created_at: new Date(1542284514171)}, { created_at: new Date(1543384514171)}]
  expect(actualValue).to.eql(expectedValue);
})
});

describe('makeRefObj', () => {
    it('Return a new object', () => {
      expect(makeRefObj([])).to.be.an('object'); 
  });
    it('takes in two arrays with single objects and returns desired object', () => {
      const list = [{ article_id: 1, title: 'A' }];
    
      expect(makeRefObj(list)).to.eql({ A: 1 });
    });
    it('takes array with multiple objects and retunr desired object', () => {
      const list = [
        { article_id: 1, title: 'A' },
        { article_id: 2, title: 'B' },
        { article_id: 3, title: 'C' }
      ];
     const expectedResult = { A: 1, B: 2, C: 3 };
      expect(makeRefObj(list)).to.eql(expectedResult);
  });
});


describe('formatComments', () => {
  it('Return a new array of objects', () => {
		expect(formatComments([], {})).to.eql([]);
  });
  it('Takes array with one Obj, returns updated array with new key in Obj', () => {
		const articleRef = {
			'icellusedkars': 1
		};
		const comments = [
			{
        body: 'I hate streaming noses',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1385210163389,
      }
    ];
    const actualValue = formatComments(comments, articleRef);
    const expectedResult = [
			{
        body: 'I hate streaming noses',
        article_id: 'Living in the shadow of a great man',
        author: 'icellusedkars',
        votes: 0,
        created_at: new Date(1385210163389),
      }
    ];
    expect(actualValue).to.eql(expectedResult);
  });
  it('Takes array with one Obj, returns updated array with new key in Obj', () => {
		const articleRef = {
			'icellusedkars': 1
		};
		const comments = [
			{
        body: 'I hate streaming noses',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: 0,
        created_at: 1385210163389,
      },
      {
        body: 'biscuits',
        belongs_to: 'Living biscuits',
        created_by: 'myBiscuits',
        votes: 1,
        created_at: 1385410163389,
      },
    ];
    const actualValue = formatComments(comments, articleRef);
    const expectedResult = [
			{
        body: 'I hate streaming noses',
        article_id: 'Living in the shadow of a great man',
        author: 'icellusedkars',
        votes: 0,
        created_at: new Date(1385210163389),
      },
      {
        body: 'biscuits',
        article_id: 'Living biscuits',
        author: 'myBiscuits',
        votes: 1,
        created_at: new Date(1385410163389),
      },
    ];
    expect(actualValue).to.eql(expectedResult);
  });
});
