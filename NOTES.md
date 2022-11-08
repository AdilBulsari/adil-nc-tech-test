Used additional package called http-status-code for more specific error description and did all coding using
modern javascript

endpoint GET /cards => returns all card
Did all major test passed. Return error if no card and returns all card if data is present with output as
asked in task.

endpoint GET /cards/:id => returns a card with all 6 props.
Cards and Sizes json files is same. So I did not inject title in available sizes I could have but
I think its inappropriate to do so. I guess it should have been available in sizes.json

"availableSizes": [
{
"id": "sm",
"title": "Small"
},
{
"id": "md",
"title": "Medium"
},
{
"id": "gt",
"title": "Giant"
}
],

endpoint POST /cards/:cardid =>response returns card by its id
All major error handling is done. i.e inappropriate data passed or missing fields in object

endpoint DELETE /cards/:cardid => response with simple delete message if successfull
