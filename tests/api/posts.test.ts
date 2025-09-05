import { assert } from 'chai';
import { describe, it } from 'mocha';

/* Test suite for GET /api/posts */
describe('GET /api/posts', () => {

  /* Test case 1: to check if all posts are returned */
  it('should return all posts', async () => {
    const res = await fetch(
      'http://localhost:3000/api/posts?page=1&limit=10&userId=68b7f9abebce6abb4bd187b4',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const data = await res.json();
    assert.equal(Number(data.data.length), 2);
  });

  /* Test case 1: to check if all posts are returned */
  it('it should create a new post', async () => {
    const res = await fetch('http://localhost:3000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Post',
        content: 'This is a test post.',
        createdBy: '68b7f9abebce6abb4bd187b4',
      }),
    });

    const data = await res.json();
    assert.equal(res.status, 201);
    assert.equal(data.success, true);
    assert.equal(data.data.title, 'Test Post');
    assert.equal(data.data.content, 'This is a test post.');
    })
 });