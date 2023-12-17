# eezze-generator-backend
Generator backend code without the Eezze framework plugin

# Git Eezze projects admin

1) Delete a Git repository:

Execute the following curl command with a valid Github personal token:

```bash
curl    -X DELETE -H "Accept: application/vnd.github.v3+json" \
        -H "Authorization: token <insert token here>" \
        https://api.github.com/repos/eezze-projects/21-backend-aws6
```