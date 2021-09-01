# Simple code review bot

This bot helps teams keep track of PRs and takes quick surveys for reviewers to complete to provide consistent feedback to the PR opener.

This uses dynamoDB to keep track of the persistent data. For local development, `dynamodb-admin` is very useful.

Install `dynamodb-admin` and run `AWS_REGION=us-west-2 AWS_ACCESS_KEY_ID=local AWS_SECRET_ACCESS_KEY=local dynamodb-admin" to start a local web page to interact with dynamodb locally.
