MAC/ LINUX OS Install
curl -o- -L https://slss.io/install | bash

# Deploy stack
npm i
serverless deploy -r <<REGION>> -s <<STAGE>>

# Delete stack
serverless remove -r <<REGION>>