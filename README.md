Install Serverless

MAC/ LINUX OS 
curl -o- -L https://slss.io/install | bash

# close terminal
# verify installation by "which sls"

# Deploy stack
cd serverless-todos
npm i
sls deploy -r <<REGION>> -s <<STAGE>>

# Delete stack
sls remove -r <<REGION>>