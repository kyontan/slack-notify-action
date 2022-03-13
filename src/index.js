const github = require('@actions/github');
const core = require('@actions/core');
const slackSend = require('./slack-github-action/src/slack-send');

function generatePayload() {
  const repo_url = `${github.context.serverUrl}/${github.context.repo.owner}/${github.context.repo.repo}`;
  const shart_short = github.context.sha.substring(0,7);

  const job_status = process.env.JOB_STATUS;
  let status_readable = job_status;
  let emoji = ":cloud:"
  if (job_status == 'success') {
    status_readable = "succeeded";
    emoji = ":rainbow:";
  } else if (job_status == "failure") {
    status_readable = "failed";
    emoji = ":umbrella:";
  }

  const title = `${emoji} Workflow *${github.context.workflow}* ${status_readable}`;

  let detail = "";
  detail += `*Job*: ${github.context.job}\n`;
  detail += `*Ref*: ${github.context.ref} (<${repo_url}/commit/${shart_short}|${shart_short}>)\n`;
  detail += `*Actions URL*: ${repo_url}/actions/runs/${github.context.runId}\n`;

  return {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": title
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": detail
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "image",
            "image_url": "https://raw.githubusercontent.com/kyontan/slack-notify-action/main/assets/GitHub-Mark-32px.png",
            "alt_text": "github icon"
          },
          {
            "type": "image",
            "image_url": `https://raw.githubusercontent.com/kyontan/slack-notify-action/main/assets/${job_status}.png`,
            "alt_text": "status icon"
          },
          {
            "type": "mrkdwn",
            "text": `*Trigger event*: ${github.context.eventName}`
          }
        ]
      }
    ]
  }
}

let coreWrapper = {
  getInput: function(key) {
    if (key == "payload") {
      return JSON.stringify(generatePayload());
    }
    if (key == "payload-file-path") {
      return null;
    }
    if (key == "slack-message") {
      return null;
    }
    if (key == "channel-id") {
      return core.getInput(key);
    }
  },
  setOutput: core.setOutput,
  setFailed: core.setFailed,
}

const onceExecuted = core.getState("onceExecuted");

if (onceExecuted == "") {
  core.saveState("onceExecuted", "true");
  core.info('This is not post run, skip notification');
} else {
  core.info('This is post run, sending notification');
  slackSend(coreWrapper);
}
