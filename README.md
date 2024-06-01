# The Internet Folks Assignment

Assignment link: https://documenter.getpostman.com/view/14439156/2s93Jrx5Da#f8e0c11f-604f-4f1e-8dd3-98eaf6a40b84


## Important Points
1. `Remove member` request does not provide communityId in request body. So, Community Admin or moderator can't be check for a particular community. Assuming communityId is given in the body the endpoint has been made.
2. There are no many to many relation. There are only one to many relation. Database architecture is not suitable for two way query and creates data inconsistency.So, query like adding a members and admin to community is not properly working with this type of model.
