# kyontan/slack-notify-action

Action that notifies workflow status to Slack

Uses [slackapi/slack-github-action](https://github.com/slackapi/slack-github-action) internally and supports various ways to send.

Please refer above document for setup environment variables.

## Notification example

<img width="414" alt="screenshot of notification on success" src="https://user-images.githubusercontent.com/802339/158076042-00beaccd-db9c-4b6f-94dc-e5a039d0ffe3.png">

<img width="408" alt="screenshot of notification on failure" src="https://user-images.githubusercontent.com/802339/158076040-2bf3fa4d-0680-4006-867b-cb83f877a532.png">

<img width="409" alt="screenshot of notification on cancellation" src="https://user-images.githubusercontent.com/802339/158076129-e2a2cba3-39ba-4247-8a07-ce11a9811d53.png">

## Usage

Add step using this action **at the beginning of all steps**.

(This is because the action sends notification in `post` step, that will not be executed if the `main` step skipped by the preliminary step failure)

```yaml
name: build-something

on:
  push: {}

jobs:
  edit-status:
    runs-on: ubuntu-latest
    steps:
      - name: Send notification to Slack
        uses: kyontan/slack-notify-action@main
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
          JOB_STATUS: ${{ job.status }}
      - name: Build something
      - ...
```

You have to pass `JOB_STATUS` environment variable in addition to requirements by [slackapi/slack-github-action](https://github.com/slackapi/slack-github-action).
