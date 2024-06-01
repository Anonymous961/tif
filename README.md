# The Internet Folks Assignment

Assignment link: https://documenter.getpostman.com/view/14439156/2s93Jrx5Da#f8e0c11f-604f-4f1e-8dd3-98eaf6a40b84

Postman test collection: [Postman](https://universal-eclipse-928872.postman.co/workspace/hackpack-Workspace~4d5bd22a-8ebc-412a-bc6a-5fcdc53c424c/collection/24302534-045bed50-10c6-4c8b-80b8-7bf5d4e71954?action=share&creator=24302534&active-environment=24302534-8b964ed8-1542-42a5-b48c-d67c921ac4b3) 

NeonDb link: [Link](postgresql://test_owner:7KJwApo9LmHE@ep-dawn-rain-a5ut276w.us-east-2.aws.neon.tech/prisma_migrate_shadow_db_77b90cda-53ed-473c-90a5-b7897bd93a1c?sslmode=require)

## Important Points
1. `Remove member` request does not provide communityId in request body. So, Community Admin or moderator can't be check for a particular community. Assuming communityId is given in the body the endpoint has been made.

