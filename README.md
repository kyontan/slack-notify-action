# kyontan/slack-notify-action

Action that notifies workflow status to Slack

Uses [slackapi/slack-github-action](https://github.com/slackapi/slack-github-action) internally and supports various ways to send.

Please refer above document for setup environment variables.

## Usage

```yaml
name: build-something

on:
  push: {}

jobs:
  edit-status:
    runs-on: ubuntu-latest
    steps:
      - name: Build something
        ...

      - name: Send notification to Slack
        uses: kyontan/slack-notify-action@main
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
```

## Known limitation

This action currently does not support `cancelled` status notification.

Maybe rewriting this action with JavaScript will resolve this.

https://docs.github.com/ja/actions/creating-actions/metadata-syntax-for-github-actions#runspost
